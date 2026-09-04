import { fileURLToPath } from 'url';
import { config } from './config/constants.js';
import 'dotenv/config';

import { parseDeploymentEnvironment } from './config/deploymentEnvironment.js';
import { runDeployment } from './deployRuntime.js';
import { executeDeploymentCommand } from './deployCLI.js';

export async function main(env, deps) {
  const defaults = {
    rpcUrl: deps.defaults.rpcUrl,
    hardhatDefaultPrivateKey: deps.defaults.hardhatDefaultPrivateKey,
  };

  const result = await deps.executeDeploymentCommand({
    env,
    defaults,
    dependencies: {
      parseDeploymentEnvironment: deps.parseDeploymentEnvironment,
      runDeployment: deps.runDeployment,
      runtimeDependencies: deps.runtimeDependencies,
    },
  });

  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    const { ethers } = await import('ethers');
    const fs = await import('fs');
    const path = await import('path');
    const defaultPolicy = await import('./config/deploymentPolicy.js');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const HARDHAT_DEFAULT_KEY =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

    const productionDeps = {
      executeDeploymentCommand,
      parseDeploymentEnvironment,
      runDeployment,
      runtimeDependencies: {
        policy: defaultPolicy,
        createProvider: (rpcUrl) => new ethers.JsonRpcProvider(rpcUrl),
        getNetwork: async (provider) => provider.getNetwork(),
        createSigner: async ({ provider, deployNetwork }) => {
          const key =
            deployNetwork === 'local'
              ? process.env.PRIVATE_KEY || HARDHAT_DEFAULT_KEY
              : process.env.PRIVATE_KEY;
          return new ethers.Wallet(key, provider);
        },
        loadArtifact: async (name) => {
          const artifactPath = path.join(
            __dirname,
            '..',
            'artifacts',
            'contracts',
            `${name}.sol`,
            `${name}.json`,
          );
          return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        },
        createContractFactory: ({ abi, bytecode, signer }) =>
          new ethers.ContractFactory(abi, bytecode, signer),
        waitForDeployment: async (contract) => contract.waitForDeployment(),
        getContractAddress: async (contract) => contract.getAddress(),
      },
      defaults: {
        rpcUrl: config.endpoints.rpc,
        hardhatDefaultPrivateKey: HARDHAT_DEFAULT_KEY,
      },
    };

    try {
      const { exitCode } = await main(process.env, productionDeps);
      process.exitCode = exitCode;
    } catch {
      process.exitCode = 1;
    }
  })();
}
