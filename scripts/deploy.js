import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './utils/logger.js';
import { config, ENV } from './config/constants.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger('DeployScript');

// Enforce DRY_RUN flag from environment
const IS_DRY_RUN = process.env.DRY_RUN === 'true';

async function main() {
  logger.info(`Starting deployment process (Dry run: ${IS_DRY_RUN})`, {
    action: 'deployment_start',
    targetRpc: config.endpoints.rpc,
    environment: ENV,
    dryRun: IS_DRY_RUN,
  });

  try {
    let provider, deployer;

    if (!IS_DRY_RUN) {
      provider = new ethers.JsonRpcProvider(config.endpoints.rpc);
      const privateKey =
        process.env.PRIVATE_KEY ||
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      deployer = new ethers.Wallet(privateKey, provider);

      let balance;
      try {
        balance = await provider.getBalance(deployer.address);
      } catch (e) {
        logger.warn('Could not fetch balance. Is the RPC running?', { error: e.message });
        balance = 0n;
      }

      logger.info('Deployer account loaded', {
        action: 'deployer_info',
        address: deployer.address,
        balance: ethers.formatEther(balance),
      });
    } else {
      // Mock deployer for dry-run
      const privateKey =
        process.env.PRIVATE_KEY ||
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      deployer = new ethers.Wallet(privateKey); // No provider
      logger.info('Deployer account loaded (Dry Run)', {
        action: 'deployer_info',
        address: deployer.address,
        balance: '100.0',
      });
    }

    // Helper to load artifacts
    const loadArtifact = (name) => {
      const artifactPath = path.join(
        __dirname,
        '..',
        'artifacts',
        'contracts',
        `${name}.sol`,
        `${name}.json`,
      );
      if (!fs.existsSync(artifactPath)) {
        throw new Error(
          `Artifact for ${name} not found at ${artifactPath}. Did you run 'npx hardhat compile'?`,
        );
      }
      return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    };

    const deployContract = async (contractName) => {
      logger.info(`Deploying ${contractName}...`);
      const artifact = loadArtifact(contractName);
      const Factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);

      if (IS_DRY_RUN) {
        logger.info(`[DRY RUN] ${contractName} deployment simulated.`, {
          action: 'deployment_dry_run',
          contract: contractName,
        });
        return `0xMock${contractName}Address`;
      }

      // Actual Deployment
      const contract = await Factory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      const txHash = contract.deploymentTransaction().hash;

      logger.info(`${contractName} successfully deployed`, {
        action: 'deployment_success',
        contract: contractName,
        address: address,
        txHash: txHash,
      });

      return address;
    };

    const myTokenAddress = await deployContract('MyToken');
    const counterAddress = await deployContract('Counter');
    const simpleStorageAddress = await deployContract('SimpleStorage');

    logger.info('All contracts deployed successfully', {
      action: 'deployment_complete',
      contracts: {
        MyToken: myTokenAddress,
        Counter: counterAddress,
        SimpleStorage: simpleStorageAddress,
      },
    });
  } catch (error) {
    logger.error('Deployment failed', error, { action: 'deployment_error' });
    process.exitCode = 1;
  }
}

main();
