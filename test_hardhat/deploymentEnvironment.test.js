import assert from 'node:assert';
import { parseDeploymentEnvironment } from '../scripts/config/deploymentEnvironment.js';

describe('Deployment Environment Parser', function () {
  const HARDHAT_DEFAULT_KEY = 'test-hardhat-default-key';
  const EXTERNAL_FIXTURE_KEY = 'test-private-key-not-a-real-secret';

  const defaults = {
    rpcUrl: 'http://127.0.0.1:8545',
    hardhatDefaultPrivateKey: HARDHAT_DEFAULT_KEY,
  };

  // Helper to ensure private keys never leak in the output
  function assertNoSecretLeak(result, env) {
    assert.equal(
      Object.hasOwn(result, 'privateKey'),
      false,
      'Result must not contain a privateKey property',
    );
    assert.equal(
      Object.hasOwn(result.credentials, 'privateKey'),
      false,
      'Credentials must not contain a privateKey property',
    );

    const stringified = JSON.stringify(result);
    if (env.PRIVATE_KEY) {
      assert.equal(
        stringified.includes(env.PRIVATE_KEY),
        false,
        'Raw private key must not appear anywhere in stringified output',
      );
    }
  }

  it('should parse empty env to local request with defaults and no key metadata', function () {
    const env = {};
    const result = parseDeploymentEnvironment(env, defaults);

    assert.deepEqual(result.request, {
      dryRun: false,
      deployNetwork: 'local',
      rpcUrl: 'http://127.0.0.1:8545',
      allowSepoliaDeploy: false,
    });
    assert.deepEqual(result.credentials, {
      hasPrivateKey: false,
      isHardhatDefaultKey: false,
    });
    assertNoSecretLeak(result, env);
  });

  describe('DRY_RUN parsing', function () {
    it('should set dryRun: true and rpcUrl: undefined for exact "true"', function () {
      const env = { DRY_RUN: 'true', RPC_URL: 'http://rpc.example.invalid' };
      const result = parseDeploymentEnvironment(env, defaults);

      assert.equal(result.request.dryRun, true);
      assert.equal(result.request.rpcUrl, undefined);
      assertNoSecretLeak(result, env);
    });

    it('should set dryRun: false for "false"', function () {
      const env = { DRY_RUN: 'false' };
      const result = parseDeploymentEnvironment(env, defaults);
      assert.equal(result.request.dryRun, false);
    });

    it('should set dryRun: false for non-exact values like "TRUE", "1", "yes"', function () {
      const cases = ['TRUE', '1', 'yes', 'True', ''];
      for (const val of cases) {
        const env = { DRY_RUN: val };
        const result = parseDeploymentEnvironment(env, defaults);
        assert.equal(
          result.request.dryRun,
          false,
          `Expected dryRun to be false for value "${val}"`,
        );
      }
    });
  });

  describe('DEPLOY_NETWORK parsing', function () {
    it('should capture deployNetwork intent even if not local', function () {
      const env = { DEPLOY_NETWORK: 'sepolia' };
      const result = parseDeploymentEnvironment(env, defaults);
      assert.equal(result.request.deployNetwork, 'sepolia');
    });

    it('should default to "local" when missing', function () {
      const env = {};
      const result = parseDeploymentEnvironment(env, defaults);
      assert.equal(result.request.deployNetwork, 'local');
    });
  });

  describe('ALLOW_SEPOLIA_DEPLOY parsing', function () {
    it('should set allowSepoliaDeploy to true only for exact "true"', function () {
      const env = { ALLOW_SEPOLIA_DEPLOY: 'true' };
      const result = parseDeploymentEnvironment(env, defaults);
      assert.equal(result.request.allowSepoliaDeploy, true);
    });

    it('should set allowSepoliaDeploy to false for non-exact values like "false", "1"', function () {
      const cases = ['false', '1', 'TRUE', 'yes', ''];
      for (const val of cases) {
        const env = { ALLOW_SEPOLIA_DEPLOY: val };
        const result = parseDeploymentEnvironment(env, defaults);
        assert.equal(result.request.allowSepoliaDeploy, false, `Expected false for value "${val}"`);
      }
    });
  });

  describe('Credentials parsing', function () {
    it('should handle external nonempty key securely', function () {
      const env = { PRIVATE_KEY: EXTERNAL_FIXTURE_KEY };
      const result = parseDeploymentEnvironment(env, defaults);

      assert.deepEqual(result.credentials, {
        hasPrivateKey: true,
        isHardhatDefaultKey: false,
      });
      assertNoSecretLeak(result, env);
    });

    it('should handle Hardhat default key securely', function () {
      const env = { PRIVATE_KEY: HARDHAT_DEFAULT_KEY };
      const result = parseDeploymentEnvironment(env, defaults);

      assert.deepEqual(result.credentials, {
        hasPrivateKey: true,
        isHardhatDefaultKey: true,
      });
      assertNoSecretLeak(result, env);
    });

    it('should treat empty or whitespace-only key as missing', function () {
      const cases = ['', '   ', '\t', '\n'];
      for (const val of cases) {
        const env = { PRIVATE_KEY: val };
        const result = parseDeploymentEnvironment(env, defaults);

        assert.deepEqual(
          result.credentials,
          {
            hasPrivateKey: false,
            isHardhatDefaultKey: false,
          },
          `Expected missing credentials for whitespace key: "${val}"`,
        );
        assertNoSecretLeak(result, env);
      }
    });
  });

  describe('RPC_URL parsing', function () {
    it('should use env.RPC_URL when provided and not dry-run', function () {
      const env = { RPC_URL: 'http://custom-rpc.example.invalid' };
      const result = parseDeploymentEnvironment(env, defaults);
      assert.equal(result.request.rpcUrl, 'http://custom-rpc.example.invalid');
    });

    it('should use defaults.rpcUrl when RPC_URL is missing and not dry-run', function () {
      const env = {};
      const result = parseDeploymentEnvironment(env, defaults);
      assert.equal(result.request.rpcUrl, 'http://127.0.0.1:8545');
    });

    it('should fall back to defaults.rpcUrl for empty or whitespace RPC_URL', function () {
      const cases = ['', '   ', '\t', '\n'];
      for (const value of cases) {
        const result = parseDeploymentEnvironment({ RPC_URL: value }, defaults);
        assert.equal(
          result.request.rpcUrl,
          defaults.rpcUrl,
          `Expected fallback to defaults.rpcUrl for whitespace value: "${value}"`,
        );
      }
    });
  });
});
