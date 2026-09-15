import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Deploying SimpleStorage...');

  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  // Default Hardhat Account #0
  const wallet = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider,
  );

  const artifactPath = path.join(
    __dirname,
    '..',
    'artifacts',
    'contracts',
    'SimpleStorage.sol',
    'SimpleStorage.json',
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const simpleStorage = await factory.deploy();
  await simpleStorage.waitForDeployment();

  const address = await simpleStorage.getAddress();
  console.log(`SimpleStorage deployed to: ${address}`);

  const envPath = path.join(__dirname, '..', 'frontend', '.env');
  fs.writeFileSync(envPath, `VITE_SIMPLE_STORAGE_ADDRESS=${address}\n`);
  console.log(`✅ Address automatically saved to frontend/.env`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
