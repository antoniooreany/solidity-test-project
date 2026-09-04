import assert from 'node:assert';
import { executeDeploymentCommand } from '../scripts/deployCLI.js';

describe('Deploy CLI Boundary', function () {
  const FIXTURE_KEY = 'test-private-key-not-a-real-secret';
  const FIXTURE_URL = 'http://rpc.example.invalid';

  const defaultEnv = {
    PRIVATE_KEY: FIXTURE_KEY,
    RPC_URL: FIXTURE_URL,
    DRY_RUN: 'false',
  };

  const defaultDefaults = {
    rpcUrl: 'http://127.0.0.1:8545',
    hardhatDefaultPrivateKey: 'test-hardhat-default-key',
  };

  function assertNoLeak(obj, message) {
    const str = JSON.stringify(obj) || '';
    assert.equal(str.includes(FIXTURE_KEY), false, `Leaked private key: ${message}`);
    assert.equal(str.includes(FIXTURE_URL), false, `Leaked RPC URL: ${message}`);
    assert.equal(str.includes('credentials'), false, `Leaked credentials object: ${message}`);
    assert.equal(str.includes('hasPrivateKey'), false, `Leaked hasPrivateKey: ${message}`);
    assert.equal(
      str.includes('isHardhatDefaultKey'),
      false,
      `Leaked isHardhatDefaultKey: ${message}`,
    );
    assert.equal(str.includes('PRIVATE_KEY'), false, `Leaked PRIVATE_KEY string: ${message}`);
    assert.equal(str.includes('RPC_URL'), false, `Leaked RPC_URL string: ${message}`);
  }

  it('should pass env and defaults exactly to parser, and exact strict payload to runDeployment', async function () {
    let parserCalledWith = null;
    let runtimeCalledWith = null;

    const mockParser = (env, defaults) => {
      parserCalledWith = { env, defaults };
      return {
        request: {
          dryRun: false,
          deployNetwork: 'local',
          rpcUrl: FIXTURE_URL,
          allowSepoliaDeploy: false,
        },
        credentials: { hasPrivateKey: true, isHardhatDefaultKey: false },
      };
    };

    const mockRuntime = async (args) => {
      runtimeCalledWith = args;
      return { success: true, phase: 'deployed' };
    };

    await executeDeploymentCommand({
      env: defaultEnv,
      defaults: defaultDefaults,
      dependencies: {
        parseDeploymentEnvironment: mockParser,
        runDeployment: mockRuntime,
      },
    });

    assert.deepEqual(parserCalledWith.env, defaultEnv);
    assert.deepEqual(parserCalledWith.defaults, defaultDefaults);

    // Ensure no extra top-level fields are passed to runDeployment
    assert.deepEqual(Object.keys(runtimeCalledWith).sort(), [
      'credentials',
      'dependencies',
      'request',
    ]);

    // Ensure no extra fields in request
    assert.deepEqual(Object.keys(runtimeCalledWith.request).sort(), [
      'allowSepoliaDeploy',
      'deployNetwork',
      'dryRun',
      'rpcUrl',
    ]);

    // Ensure no extra fields in credentials
    assert.deepEqual(Object.keys(runtimeCalledWith.credentials).sort(), [
      'hasPrivateKey',
      'isHardhatDefaultKey',
    ]);

    assert.deepEqual(runtimeCalledWith.request, {
      dryRun: false,
      deployNetwork: 'local',
      rpcUrl: FIXTURE_URL,
      allowSepoliaDeploy: false,
    });
    assert.deepEqual(runtimeCalledWith.credentials, {
      hasPrivateKey: true,
      isHardhatDefaultKey: false,
    });
  });

  it('should return exitCode 0 and safe public result on dry-run success', async function () {
    const result = await executeDeploymentCommand({
      env: { DRY_RUN: 'true' },
      defaults: defaultDefaults,
      dependencies: {
        parseDeploymentEnvironment: () => ({
          request: { dryRun: true },
          credentials: {},
        }),
        runDeployment: async () => ({ success: true, phase: 'planned' }),
      },
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(result.result, { success: true, phase: 'planned' });
    assertNoLeak(result, 'dry-run result');
  });

  it('should return exitCode 0 and safe public result on deployment success', async function () {
    const result = await executeDeploymentCommand({
      env: defaultEnv,
      defaults: defaultDefaults,
      dependencies: {
        parseDeploymentEnvironment: () => ({
          request: { dryRun: false, rpcUrl: FIXTURE_URL },
          credentials: { hasPrivateKey: true },
        }),
        runDeployment: async () => ({ success: true, phase: 'deployed' }),
      },
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(result.result, { success: true, phase: 'deployed' });
    assertNoLeak(result, 'deployment result');
  });

  it('should return exitCode 1 on preflight rejection', async function () {
    const result = await executeDeploymentCommand({
      env: defaultEnv,
      defaults: defaultDefaults,
      dependencies: {
        parseDeploymentEnvironment: () => ({
          request: { rpcUrl: FIXTURE_URL },
          credentials: { hasPrivateKey: true },
        }),
        runDeployment: async () => ({
          success: false,
          phase: 'preflight',
          code: 'DEPLOYMENT_PREFLIGHT_REJECTED',
        }),
      },
    });

    assert.equal(result.exitCode, 1);
    assert.deepEqual(result.result, {
      success: false,
      phase: 'preflight',
      code: 'DEPLOYMENT_PREFLIGHT_REJECTED',
    });
    assertNoLeak(result, 'preflight rejection result');
  });

  it('should return exitCode 1 on verification rejection', async function () {
    const result = await executeDeploymentCommand({
      env: defaultEnv,
      defaults: defaultDefaults,
      dependencies: {
        parseDeploymentEnvironment: () => ({ request: {}, credentials: {} }),
        runDeployment: async () => ({
          success: false,
          phase: 'verification',
          code: 'DEPLOYMENT_NETWORK_REJECTED',
        }),
      },
    });

    assert.equal(result.exitCode, 1);
    assert.equal(result.result.phase, 'verification');
    assert.equal(result.result.code, 'DEPLOYMENT_NETWORK_REJECTED');
  });

  it('should return exitCode 1 on runtime failure', async function () {
    const result = await executeDeploymentCommand({
      env: defaultEnv,
      defaults: defaultDefaults,
      dependencies: {
        parseDeploymentEnvironment: () => ({ request: {}, credentials: {} }),
        runDeployment: async () => ({
          success: false,
          phase: 'runtime',
          code: 'DEPLOYMENT_RUNTIME_FAILED',
        }),
      },
    });

    assert.equal(result.exitCode, 1);
    assert.equal(result.result.phase, 'runtime');
  });

  it('should return exitCode 1 and DEPLOYMENT_CLI_FAILED on unexpected runtime thrown error, hiding original text', async function () {
    const result = await executeDeploymentCommand({
      env: defaultEnv,
      defaults: defaultDefaults,
      dependencies: {
        parseDeploymentEnvironment: () => ({
          request: { rpcUrl: FIXTURE_URL },
          credentials: { hasPrivateKey: true },
        }),
        runDeployment: async () => {
          throw new Error(`Secret error with ${FIXTURE_KEY} and ${FIXTURE_URL}`);
        },
      },
    });

    assert.equal(result.exitCode, 1);
    assert.deepEqual(result.result, {
      success: false,
      phase: 'runtime',
      code: 'DEPLOYMENT_CLI_FAILED',
      message: 'Deployment command failed.',
    });

    assertNoLeak(result, 'unexpected thrown error result');
  });
});
