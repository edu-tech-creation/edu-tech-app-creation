/**
 * Deploy EduCredential to the configured network.
 *
 * Usage:
 *   pnpm chain:deploy:local   — deploy to local Hardhat node
 *   pnpm chain:deploy:sepolia — deploy to Sepolia testnet
 *
 * After deployment the contract address is saved to
 * lib/contracts/deployments.json so the frontend can pick it up.
 */

import { ethers } from "hardhat"
import { writeFileSync, mkdirSync } from "fs"
import path from "path"

async function main() {
  const [deployer] = await ethers.getSigners()
  const network = await ethers.provider.getNetwork()

  console.log(`\n🚀  Deploying EduCredential`)
  console.log(`    Network : ${network.name} (chainId ${network.chainId})`)
  console.log(`    Deployer: ${deployer.address}`)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(`    Balance : ${ethers.formatEther(balance)} ETH\n`)

  const factory = await ethers.getContractFactory("EduCredential")
  const contract = await factory.deploy()
  await contract.waitForDeployment()

  const address = await contract.getAddress()
  console.log(`✅  EduCredential deployed at: ${address}\n`)

  // Persist the deployment address for the frontend
  const deploymentsDir = path.resolve(__dirname, "../lib/contracts")
  mkdirSync(deploymentsDir, { recursive: true })

  const deploymentsPath = path.join(deploymentsDir, "deployments.json")
  let existing: Record<string, string> = {}
  try {
    existing = JSON.parse(
      require("fs").readFileSync(deploymentsPath, "utf8"),
    )
  } catch {
    // first deploy, file doesn't exist yet
  }

  existing[network.chainId.toString()] = address
  writeFileSync(deploymentsPath, JSON.stringify(existing, null, 2) + "\n")
  console.log(`📝  Saved deployment address to lib/contracts/deployments.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
