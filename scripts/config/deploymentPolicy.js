export function validateDeploymentRequest({
  dryRun,
  deployNetwork,
  rpcUrl,
  allowSepoliaDeploy,
  hasPrivateKey,
  isHardhatDefaultKey,
}) {
  if (dryRun === true) {
    return {
      allowed: true,
      mode: 'dry-run',
      requiresProvider: false,
      reason: 'DRY_RUN enabled',
    };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rpcUrl);
  } catch {
    return { allowed: false, reason: 'Invalid RPC URL format' };
  }

  if (deployNetwork === 'local') {
    if (parsedUrl.protocol !== 'http:') {
      return { allowed: false, reason: 'Local network requires http protocol' };
    }

    const hostname = parsedUrl.hostname;
    // URL parser in Node may return '::1' or '[::1]' for IPv6 localhost
    const allowedLocalHosts = ['localhost', '127.0.0.1', '::1', '[::1]'];
    if (!allowedLocalHosts.includes(hostname)) {
      return { allowed: false, reason: 'Invalid local hostname' };
    }

    if (parsedUrl.username !== '' || parsedUrl.password !== '') {
      return {
        allowed: false,
        reason: 'Local network must not use credentials in URL',
      };
    }

    return {
      allowed: true,
      mode: 'local',
      expectedChainId: 31337,
      requiresProvider: true,
    };
  }

  if (deployNetwork === 'sepolia') {
    if (allowSepoliaDeploy !== true) {
      return {
        allowed: false,
        reason: 'Sepolia deployment requires explicit opt-in',
      };
    }
    if (hasPrivateKey !== true) {
      return {
        allowed: false,
        reason: 'Sepolia deployment requires an external private key',
      };
    }
    if (isHardhatDefaultKey === true) {
      return {
        allowed: false,
        reason: 'Sepolia deployment cannot use the Hardhat default key',
      };
    }
    if (parsedUrl.protocol !== 'https:') {
      return {
        allowed: false,
        reason: 'Sepolia RPC URL must use https protocol',
      };
    }
    if (parsedUrl.username !== '' || parsedUrl.password !== '') {
      return {
        allowed: false,
        reason: 'Sepolia RPC URL must not contain credentials',
      };
    }

    return {
      allowed: true,
      mode: 'sepolia',
      expectedChainId: 11155111,
      requiresProvider: true,
    };
  }

  return {
    allowed: false,
    reason: `Network '${deployNetwork}' is not allowed or unknown`,
  };
}

export function validateVerifiedNetwork({ deployNetwork, actualChainId }) {
  if (deployNetwork === 'local' && actualChainId === 31337) {
    return { allowed: true };
  }
  if (deployNetwork === 'sepolia' && actualChainId === 11155111) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Verified actual chain ID ${actualChainId} does not match expected for ${deployNetwork}`,
  };
}
