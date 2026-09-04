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
    },
  });

  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const productionDeps = {
    executeDeploymentCommand,
    parseDeploymentEnvironment,
    runDeployment,
    defaults: {
      rpcUrl: config.endpoints.rpc,
      hardhatDefaultPrivateKey:
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    },
  };

  main(process.env, productionDeps)
    .then(({ exitCode }) => {
      process.exitCode = exitCode;
    })
    .catch(() => {
      process.exitCode = 1;
    });
}
