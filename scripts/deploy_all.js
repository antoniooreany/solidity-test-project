// SPDX-License-Identifier: MIT
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Deploying SimpleStorage...');
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

  // Deploy SimpleStorage
  const ssArtifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'SimpleStorage.sol', 'SimpleStorage.json');
  const ssArtifact = JSON.parse(fs.readFileSync(ssArtifactPath, 'utf8'));
  const ssFactory = new ethers.ContractFactory(ssArtifact.abi, ssArtifact.bytecode, wallet);
  const simple = await ssFactory.deploy();
  await simple.waitForDeployment();
  const ssAddress = await simple.getAddress();
  console.log(`SimpleStorage deployed to ${ssAddress}`);

  // Deploy MyToken
  console.log('Deploying MyToken...');
  const tokenArtifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'MyToken.sol', 'MyToken.json');
  const tokenArtifact = JSON.parse(fs.readFileSync(tokenArtifactPath, 'utf8'));
  const tokenFactory = new ethers.ContractFactory(tokenArtifact.abi, tokenArtifact.bytecode, wallet);
  const token = await tokenFactory.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`MyToken deployed to ${tokenAddress}`);

  // Update frontend .env
  const envPath = path.join(__dirname, '..', 'frontend', '.env');
  let envLines = [];
  if (fs.existsSync(envPath)) {
    envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines = envLines.map(line => {
      if (line.startsWith('VITE_SIMPLE_STORAGE_ADDRESS=')) {
        return `VITE_SIMPLE_STORAGE_ADDRESS=${ssAddress}`;
      }
      if (line.startsWith('VITE_MY_TOKEN_ADDRESS=')) {
        return `VITE_MY_TOKEN_ADDRESS=${tokenAddress}`;
      }
      return line;
    });
  } else {
    envLines = [
      `VITE_SIMPLE_STORAGE_ADDRESS=${ssAddress}`,
      `VITE_MY_TOKEN_ADDRESS=${tokenAddress}`,
    ];
  }
  fs.writeFileSync(envPath, envLines.join('\n'));
  console.log('✅ Updated frontend/.env with contract addresses');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
