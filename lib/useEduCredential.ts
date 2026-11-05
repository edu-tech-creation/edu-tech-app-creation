"use client"

/**
 * useEduCredential
 *
 * React hook for interacting with the deployed EduCredential smart contract
 * from the Next.js frontend using ethers v6 + MetaMask (window.ethereum).
 *
 * Prerequisites:
 *  1. Run `pnpm chain:compile && pnpm chain:export-abi` to generate the ABI.
 *  2. Deploy the contract and update lib/contracts/deployments.json.
 *  3. The user's browser must have MetaMask (or another EIP-1193 provider).
 */

import { useState, useCallback } from "react"
// ethers is a peer dependency — install it locally with: pnpm add ethers
// It is intentionally excluded from package.json to keep the Vercel build clean.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EthersModule = any
let ethersModule: EthersModule = null
if (typeof window !== "undefined") {
  try { ethersModule = require("ethers") } catch { /* not installed */ }
}
const BrowserProvider = ethersModule?.BrowserProvider
const Contract = ethersModule?.Contract

// ABI is imported from the exported artifact — regenerate with `pnpm chain:export-abi`
// Falls back to an empty array so the file compiles without the generated file.
let ABI: unknown[] = []
try {
  // Dynamic require so Next.js doesn't fail at build time if the file doesn't exist yet
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ABI = require("./contracts/EduCredential.abi.json")
} catch {
  /* ABI not yet exported — run pnpm chain:export-abi */
}

// Deployment addresses per chainId — populated by `pnpm chain:deploy:*`
let DEPLOYMENTS: Record<string, string> = {}
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DEPLOYMENTS = require("./contracts/deployments.json")
} catch {
  /* deployments.json not yet created — run pnpm chain:deploy:local */
}

export interface Credential {
  credentialId: bigint
  learner: string
  courseId: string
  score: number
  issuedAt: Date
  revoked: boolean
}

export function useEduCredential() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Connect MetaMask and return a signer-backed contract instance */
  const getContract = useCallback(async () => {
    if (typeof window === "undefined" || !("ethereum" in window)) {
      throw new Error("MetaMask is not installed.")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new BrowserProvider((window as any).ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()

    const network = await provider.getNetwork()
    const chainId = network.chainId.toString()
    const address = DEPLOYMENTS[chainId]

    if (!address) {
      throw new Error(
        `EduCredential is not deployed on chain ${chainId}. ` +
          "Run pnpm chain:deploy:local or chain:deploy:sepolia.",
      )
    }

    if (!ABI.length) {
      throw new Error(
        "ABI not found. Run `pnpm chain:compile && pnpm chain:export-abi`.",
      )
    }

    return new Contract(address, ABI as Interface[], signer)
  }, [])

  /**
   * Issue a credential on-chain.
   * Only the contract deployer (issuer) can call this.
   */
  const issueCredential = useCallback(
    async (learnerAddress: string, courseId: string, score: number) => {
      setLoading(true)
      setError(null)
      try {
        const contract = await getContract()
        // courseId is stored as bytes32 — encode as a zero-padded hex string
        const courseIdBytes = Buffer.alloc(32)
        courseIdBytes.write(courseId.slice(0, 32))
        const courseIdHex = "0x" + courseIdBytes.toString("hex")

        const tx = await contract.issueCredential(
          learnerAddress,
          courseIdHex,
          score,
        )
        const receipt = await tx.wait()

        // Extract credentialId from the CredentialIssued event
        const event = receipt.logs
          .map((log: { topics: string[]; data: string }) => {
            try {
              return contract.interface.parseLog(log)
            } catch {
              return null
            }
          })
          .find((e: { name: string } | null) => e?.name === "CredentialIssued")

        return {
          txHash: receipt.hash as string,
          credentialId: event?.args?.credentialId as bigint | undefined,
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getContract],
  )

  /** Fetch a single credential by ID */
  const getCredential = useCallback(
    async (credentialId: bigint): Promise<Credential> => {
      setLoading(true)
      setError(null)
      try {
        const contract = await getContract()
        const raw = await contract.getCredential(credentialId)
        return {
          credentialId,
          learner: raw.learner as string,
          courseId: Buffer.from((raw.courseId as string).slice(2), "hex")
            .toString("utf8")
            .replace(/\0+$/, ""),
          score: Number(raw.score),
          issuedAt: new Date(Number(raw.issuedAt) * 1000),
          revoked: raw.revoked as boolean,
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getContract],
  )

  /** Fetch all credential IDs for a learner address */
  const getLearnerCredentials = useCallback(
    async (learnerAddress: string): Promise<bigint[]> => {
      setLoading(true)
      setError(null)
      try {
        const contract = await getContract()
        return (await contract.getLearnerCredentials(learnerAddress)) as bigint[]
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getContract],
  )

  /** Revoke a credential (issuer only) */
  const revokeCredential = useCallback(
    async (credentialId: bigint) => {
      setLoading(true)
      setError(null)
      try {
        const contract = await getContract()
        const tx = await contract.revokeCredential(credentialId)
        const receipt = await tx.wait()
        return { txHash: receipt.hash as string }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [getContract],
  )

  return {
    loading,
    error,
    issueCredential,
    getCredential,
    getLearnerCredentials,
    revokeCredential,
  }
}
