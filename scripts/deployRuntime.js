export async function runDeployment({ request, credentials, dependencies }) {
  const preflight = dependencies.policy.validateDeploymentRequest({
    dryRun: request.dryRun,
    deployNetwork: request.deployNetwork,
    rpcUrl: request.rpcUrl,
    allowSepoliaDeploy: request.allowSepoliaDeploy,
    hasPrivateKey: credentials.hasPrivateKey,
    isHardhatDefaultKey: credentials.isHardhatDefaultKey,
  });

  if (!preflight.allowed) {
    return {
      success: false,
      phase: 'preflight',
      code: 'DEPLOYMENT_PREFLIGHT_REJECTED',
      message: 'Deployment request was rejected by safety policy.',
    };
  }

  if (preflight.mode === 'dry-run') {
    return {
      success: true,
      phase: 'planned',
      mode: 'dry-run',
      plan: {
        willCreateProvider: false,
        willCreateWallet: false,
        willBroadcastTransactions: false,
        contracts: ['Counter', 'SimpleStorage', 'MyToken'],
      },
    };
  }

  const provider = dependencies.createProvider(request.rpcUrl);
  const network = await dependencies.getNetwork(provider);

  const verification = dependencies.policy.validateVerifiedNetwork({
    deployNetwork: request.deployNetwork,
    actualChainId: network.chainId,
  });

  if (!verification.allowed) {
    return {
      success: false,
      phase: 'verification',
      code: 'DEPLOYMENT_NETWORK_REJECTED',
      message: 'Deployment network verification failed.',
    };
  }

  const deployedContracts = {};

  try {
    const signer = await dependencies.createSigner({
      provider,
      deployNetwork: request.deployNetwork,
    });

    const contractNames = ['Counter', 'SimpleStorage', 'MyToken'];

    for (const contractName of contractNames) {
      const artifact = await dependencies.loadArtifact(contractName);
      const factory = dependencies.createContractFactory({
        abi: artifact.abi,
        bytecode: artifact.bytecode,
        signer,
      });

      const contract = await factory.deploy();
      await dependencies.waitForDeployment(contract);
      const address = await dependencies.getContractAddress(contract);

      deployedContracts[contractName] = { address };
    }

    return {
      success: true,
      phase: 'deployed',
      mode: request.deployNetwork,
      chainId: Number(network.chainId),
      contracts: deployedContracts,
    };
  } catch {
    // Return a stable public error without exposing the original exception.
    return {
      success: false,
      phase: 'runtime',
      code: 'DEPLOYMENT_RUNTIME_FAILED',
      message: 'Deployment failed. Check local logs for details.',
      deployedContracts,
    };
  }
}
