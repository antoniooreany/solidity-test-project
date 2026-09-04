import assert from 'node:assert';
import { runDeployment } from '../scripts/deployRuntime.js';

describe('Deploy Runtime Orchestrator', function () {
  let calls;
  let loggerEvents;
  let receivedRpcUrl;
  let receivedProvider;

  const expectedProvider = { isProvider: true };

  function createMockDependencies(overrides = {}) {
    return {
      policy: {
        validateDeploymentRequest:
          overrides.validateDeploymentRequest ||
          (() => ({
            allowed: true,
            mode: 'local',
            expectedChainId: 31337,
            requiresProvider: true,
          })),
        validateVerifiedNetwork: overrides.validateVerifiedNetwork || (() => ({ allowed: true })),
      },
      createProvider: (rpcUrl) => {
        receivedRpcUrl = rpcUrl;
        calls.push('createProvider');
        return expectedProvider;
      },
      getNetwork: async () => {
        calls.push('getNetwork');
        return overrides.getNetworkResult || { chainId: 31337n };
      },
      createSigner: async ({ provider, deployNetwork }) => {
        receivedProvider = provider;
        calls.push(`createSigner:${deployNetwork}`);
        return { isSigner: true };
      },
      loadArtifact: async (contractName) => {
        calls.push(`loadArtifact:${contractName}`);
        return { abi: [], bytecode: contractName };
      },
      createContractFactory: ({ bytecode }) => {
        const contractName = bytecode;
        calls.push(`createContractFactory:${contractName}`);
        return {
          deploy: async () => {
            calls.push(`deploy:${contractName}`);
            if (overrides.deployThrows && overrides.deployThrows === contractName) {
              throw new Error('Mock deploy error');
            }
            return { isContract: true, name: contractName };
          },
        };
      },
      waitForDeployment: async (contract) => {
        calls.push(`waitForDeployment:${contract.name}`);
        return contract;
      },
      getContractAddress: async (contract) => {
        calls.push(`getContractAddress:${contract.name}`);
        return `0xmockAddressFor${contract.name}`;
      },
      logger: {
        info: (event) => {
          loggerEvents.push({ level: 'info', ...event });
        },
        error: (event) => {
          loggerEvents.push({ level: 'error', ...event });
        },
      },
    };
  }

  function verifyNoSecrets(result, loggerEventsArr) {
    const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);
    const jsonStr = JSON.stringify({ result, loggerEventsArr }, replacer);

    assert.ok(!jsonStr.includes('http://rpc.example.invalid'), 'Leak: RPC URL found');

    const forbiddenKeys = [
      'privateKey',
      'rpcUrl',
      'credentials',
      'hasPrivateKey',
      'isHardhatDefaultKey',
    ];

    const checkKeys = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        if (forbiddenKeys.includes(key)) {
          assert.fail(`Leak: found forbidden key '${key}' in output`);
        }
        checkKeys(obj[key]);
      }
    };
    checkKeys(result);
    loggerEventsArr.forEach(checkKeys);
  }

  beforeEach(() => {
    calls = [];
    loggerEvents = [];
    receivedRpcUrl = undefined;
    receivedProvider = undefined;
  });

  it('Dry-run: success/phase: "planned", plan without addresses, no side-effects', async function () {
    const deps = createMockDependencies({
      validateDeploymentRequest: () => ({
        allowed: true,
        mode: 'dry-run',
        requiresProvider: false,
        reason: 'DRY_RUN enabled',
      }),
    });

    const request = {
      dryRun: true,
      deployNetwork: 'mainnet',
      rpcUrl: 'http://rpc.example.invalid',
      allowSepoliaDeploy: false,
    };
    const credentials = { hasPrivateKey: true, isHardhatDefaultKey: false };

    const result = await runDeployment({
      request,
      credentials,
      dependencies: deps,
    });

    assert.equal(result.success, true);
    assert.equal(result.phase, 'planned');
    assert.equal(result.mode, 'dry-run');
    assert.deepEqual(result.plan, {
      willCreateProvider: false,
      willCreateWallet: false,
      willBroadcastTransactions: false,
      contracts: ['Counter', 'SimpleStorage', 'MyToken'],
    });

    assert.deepEqual(calls, []);
    verifyNoSecrets(result, loggerEvents);
  });

  it('Preflight rejection: phase: "preflight" and no side-effecting calls', async function () {
    const deps = createMockDependencies({
      validateDeploymentRequest: () => ({
        allowed: false,
        reason: 'Mock preflight failure',
      }),
    });

    const request = {
      dryRun: false,
      deployNetwork: 'local',
      rpcUrl: 'http://rpc.example.invalid',
      allowSepoliaDeploy: false,
    };
    const credentials = { hasPrivateKey: false, isHardhatDefaultKey: false };

    const result = await runDeployment({
      request,
      credentials,
      dependencies: deps,
    });

    assert.equal(result.success, false);
    assert.equal(result.phase, 'preflight');
    assert.equal(result.code, 'DEPLOYMENT_PREFLIGHT_REJECTED');
    assert.equal(result.message, 'Deployment request was rejected by safety policy.');
    assert.deepEqual(calls, []);
    verifyNoSecrets(result, loggerEvents);
  });

  it('Verified network rejection: calls provider/getNetwork but NEVER signer/factory', async function () {
    const deps = createMockDependencies({
      validateVerifiedNetwork: () => ({
        allowed: false,
        reason: 'Mock verification failure',
      }),
    });

    const request = {
      dryRun: false,
      deployNetwork: 'local',
      rpcUrl: 'http://rpc.example.invalid',
      allowSepoliaDeploy: false,
    };
    const credentials = { hasPrivateKey: false, isHardhatDefaultKey: true };

    const result = await runDeployment({
      request,
      credentials,
      dependencies: deps,
    });

    assert.equal(result.success, false);
    assert.equal(result.phase, 'verification');
    assert.equal(result.code, 'DEPLOYMENT_NETWORK_REJECTED');
    assert.equal(result.message, 'Deployment network verification failed.');
    assert.deepEqual(calls, ['createProvider', 'getNetwork']);
    assert.equal(receivedRpcUrl, 'http://rpc.example.invalid');
    verifyNoSecrets(result, loggerEvents);
  });

  it('Successful local deployment: all contracts in order Counter -> SimpleStorage -> MyToken', async function () {
    const deps = createMockDependencies();
    const request = {
      dryRun: false,
      deployNetwork: 'local',
      rpcUrl: 'http://127.0.0.1:8545',
      allowSepoliaDeploy: false,
    };
    const credentials = { hasPrivateKey: false, isHardhatDefaultKey: true };

    const result = await runDeployment({
      request,
      credentials,
      dependencies: deps,
    });

    assert.equal(result.success, true);
    assert.equal(result.phase, 'deployed');
    assert.equal(result.mode, 'local');
    assert.equal(result.chainId, 31337);
    assert.deepEqual(result.contracts, {
      Counter: { address: '0xmockAddressForCounter' },
      SimpleStorage: { address: '0xmockAddressForSimpleStorage' },
      MyToken: { address: '0xmockAddressForMyToken' },
    });

    assert.deepEqual(calls, [
      'createProvider',
      'getNetwork',
      'createSigner:local',
      'loadArtifact:Counter',
      'createContractFactory:Counter',
      'deploy:Counter',
      'waitForDeployment:Counter',
      'getContractAddress:Counter',
      'loadArtifact:SimpleStorage',
      'createContractFactory:SimpleStorage',
      'deploy:SimpleStorage',
      'waitForDeployment:SimpleStorage',
      'getContractAddress:SimpleStorage',
      'loadArtifact:MyToken',
      'createContractFactory:MyToken',
      'deploy:MyToken',
      'waitForDeployment:MyToken',
      'getContractAddress:MyToken',
    ]);
    assert.equal(receivedRpcUrl, 'http://127.0.0.1:8545');
    assert.equal(receivedProvider, expectedProvider);
    verifyNoSecrets(result, loggerEvents);
  });

  it('Runtime failure on MyToken: safe error code, deployedContracts contains earlier contracts', async function () {
    const deps = createMockDependencies({ deployThrows: 'MyToken' });
    const request = {
      dryRun: false,
      deployNetwork: 'local',
      rpcUrl: 'http://127.0.0.1:8545',
      allowSepoliaDeploy: false,
    };
    const credentials = { hasPrivateKey: false, isHardhatDefaultKey: true };

    const result = await runDeployment({
      request,
      credentials,
      dependencies: deps,
    });

    assert.equal(result.success, false);
    assert.equal(result.phase, 'runtime');
    assert.equal(result.code, 'DEPLOYMENT_RUNTIME_FAILED');
    assert.equal(result.message, 'Deployment failed. Check local logs for details.');

    assert.deepEqual(result.deployedContracts, {
      Counter: { address: '0xmockAddressForCounter' },
      SimpleStorage: { address: '0xmockAddressForSimpleStorage' },
    });

    assert.deepEqual(calls, [
      'createProvider',
      'getNetwork',
      'createSigner:local',
      'loadArtifact:Counter',
      'createContractFactory:Counter',
      'deploy:Counter',
      'waitForDeployment:Counter',
      'getContractAddress:Counter',
      'loadArtifact:SimpleStorage',
      'createContractFactory:SimpleStorage',
      'deploy:SimpleStorage',
      'waitForDeployment:SimpleStorage',
      'getContractAddress:SimpleStorage',
      'loadArtifact:MyToken',
      'createContractFactory:MyToken',
      'deploy:MyToken',
    ]);

    assert.equal(receivedRpcUrl, 'http://127.0.0.1:8545');
    verifyNoSecrets(result, loggerEvents);
  });
});
