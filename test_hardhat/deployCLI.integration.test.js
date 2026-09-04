import assert from 'node:assert';
import { executeDeploymentCommand } from '../scripts/deployCLI.js';

describe('Deploy CLI Integration', function () {
  const FIXTURE_KEY = 'test-private-key-not-a-real-secret';
  const FIXTURE_URL = 'http://rpc.example.invalid';

  it('should propagate runtimeDependencies exactly to runDeployment', async function () {
    let runtimeCalledWith = null;

    const runtimeDependenciesFixture = {
      policy: {
        validateDeploymentRequest: () => {},
        validateVerifiedNetwork: () => {},
      },
      createProvider: () => {},
      getNetwork: () => {},
      createSigner: () => {},
      loadArtifact: () => {},
      createContractFactory: () => {},
      waitForDeployment: () => {},
      getContractAddress: () => {},
    };

    const mockParser = (env, defaults) => {
      return {
        request: {
          dryRun: true,
          deployNetwork: 'local',
          rpcUrl: FIXTURE_URL,
          allowSepoliaDeploy: false,
        },
        credentials: { hasPrivateKey: true, isHardhatDefaultKey: false },
      };
    };

    const mockRuntime = async (args) => {
      runtimeCalledWith = args;
      return { success: true, phase: 'planned' };
    };

    const result = await executeDeploymentCommand({
      env: { PRIVATE_KEY: FIXTURE_KEY },
      defaults: { rpcUrl: 'http://default.rpc' },
      dependencies: {
        parseDeploymentEnvironment: mockParser,
        runDeployment: mockRuntime,
        runtimeDependencies: runtimeDependenciesFixture,
      },
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(result.result, { success: true, phase: 'planned' });

    assert.ok(runtimeCalledWith, 'runDeployment was not called');

    // Check strict reference equality for the dependencies object
    assert.equal(
      runtimeCalledWith.dependencies,
      runtimeDependenciesFixture,
      'runtimeDependencies was not propagated correctly to runDeployment',
    );

    assert.deepEqual(Object.keys(runtimeCalledWith).sort(), [
      'credentials',
      'dependencies',
      'request',
    ]);

    // Ensure no secrets leak into the result
    const str = JSON.stringify(result);
    assert.equal(str.includes(FIXTURE_KEY), false, 'Result leaked fixture key');
    assert.equal(str.includes(FIXTURE_URL), false, 'Result leaked fixture URL');
    assert.equal(str.includes('credentials'), false, 'Result leaked credentials');
  });
});
