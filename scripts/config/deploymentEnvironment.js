export function parseDeploymentEnvironment(env, defaults) {
  const dryRun = env.DRY_RUN === 'true';
  const allowSepoliaDeploy = env.ALLOW_SEPOLIA_DEPLOY === 'true';

  let deployNetwork = 'local';
  if (typeof env.DEPLOY_NETWORK === 'string' && env.DEPLOY_NETWORK.trim().length > 0) {
    deployNetwork = env.DEPLOY_NETWORK;
  }

  let rpcUrl;
  if (dryRun) {
    rpcUrl = undefined;
  } else {
    if (typeof env.RPC_URL === 'string' && env.RPC_URL.trim().length > 0) {
      rpcUrl = env.RPC_URL;
    } else {
      rpcUrl = defaults.rpcUrl;
    }
  }

  let hasPrivateKey = false;
  let privateKey = '';
  if (typeof env.PRIVATE_KEY === 'string' && env.PRIVATE_KEY.trim().length > 0) {
    hasPrivateKey = true;
    privateKey = env.PRIVATE_KEY;
  }

  const isHardhatDefaultKey = hasPrivateKey && privateKey === defaults.hardhatDefaultPrivateKey;

  return {
    request: {
      dryRun,
      deployNetwork,
      rpcUrl,
      allowSepoliaDeploy,
    },
    credentials: {
      hasPrivateKey,
      isHardhatDefaultKey,
    },
  };
}
