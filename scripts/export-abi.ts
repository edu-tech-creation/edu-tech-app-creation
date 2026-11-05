/**
 * Export the compiled EduCredential ABI to lib/contracts/EduCredential.abi.json
 * so the Next.js frontend can import it without bundling Hardhat.
 *
 * Run after `pnpm chain:compile`:
 *   pnpm chain:export-abi
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs"
import path from "path"

async function main() {
  const artifactPath = path.resolve(
    __dirname,
    "../artifacts/contracts/EduCredential.sol/EduCredential.json",
  )

  let artifact: { abi: unknown[] }
  try {
    artifact = JSON.parse(readFileSync(artifactPath, "utf8"))
  } catch {
    console.error(
      "❌  Artifact not found. Run `pnpm chain:compile` first.\n   Expected:",
      artifactPath,
    )
    process.exit(1)
  }

  const outDir = path.resolve(__dirname, "../lib/contracts")
  mkdirSync(outDir, { recursive: true })

  const outPath = path.join(outDir, "EduCredential.abi.json")
  writeFileSync(outPath, JSON.stringify(artifact.abi, null, 2) + "\n")
  console.log(`✅  ABI exported to lib/contracts/EduCredential.abi.json`)
  console.log(`    ${artifact.abi.length} entries`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
