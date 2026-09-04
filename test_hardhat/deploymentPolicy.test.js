import assert from 'node:assert';
import {
  validateDeploymentRequest,
  validateVerifiedNetwork,
} from '../scripts/config/deploymentPolicy.js';

describe('Deployment Safety Policy', function () {
  describe('validateDeploymentRequest (Preflight)', function () {
    describe('DRY_RUN mode', function () {
      it('should allow dryRun: true', function () {
        const result = validateDeploymentRequest({
          dryRun: true,
          deployNetwork: 'mainnet', // Should ignore this
          rpcUrl: 'invalid-url', // Should ignore this
          allowSepoliaDeploy: false,
          hasPrivateKey: false,
          isHardhatDefaultKey: false,
        });
        assert.deepEqual(result, {
          allowed: true,
          mode: 'dry-run',
          requiresProvider: false,
          reason: 'DRY_RUN enabled',
        });
      });
    });

    describe('Local Network', function () {
      const validLocalUrls = [
        'http://localhost:8545',
        'http://127.0.0.1:8545',
        'http://[::1]:8545',
      ];

      for (const url of validLocalUrls) {
        it(`should allow valid local URL: ${url}`, function () {
          const result = validateDeploymentRequest({
            dryRun: false,
            deployNetwork: 'local',
            rpcUrl: url,
            allowSepoliaDeploy: false,
            hasPrivateKey: false, // Key is optional for local
            isHardhatDefaultKey: true, // Default key is allowed for local
          });
          assert.deepEqual(result, {
            allowed: true,
            mode: 'local',
            expectedChainId: 31337,
            requiresProvider: true,
          });
        });
      }

      const invalidLocalUrls = [
        'https://localhost:8545', // HTTPS not allowed for local
        'http://localhost.evil.example:8545', // Spoofed hostname
        'http://0.0.0.0:8545', // Bind-all not allowed
        'http://192.168.1.10:8545', // Private LAN not allowed
        'http://user:password@localhost:8545', // Auth credentials not needed/allowed
        'invalid-url',
        '',
      ];

      for (const url of invalidLocalUrls) {
        it(`should reject invalid local URL: ${url}`, function () {
          const result = validateDeploymentRequest({
            dryRun: false,
            deployNetwork: 'local',
            rpcUrl: url,
            allowSepoliaDeploy: false,
            hasPrivateKey: false,
            isHardhatDefaultKey: false,
          });
          assert.equal(result.allowed, false);
        });
      }
    });

    describe('Sepolia Network', function () {
      it('should allow valid Sepolia configuration', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'sepolia',
          rpcUrl: 'https://rpc.sepolia.example.invalid/v3/placeholder',
          allowSepoliaDeploy: true,
          hasPrivateKey: true,
          isHardhatDefaultKey: false,
        });
        assert.deepEqual(result, {
          allowed: true,
          mode: 'sepolia',
          expectedChainId: 11155111,
          requiresProvider: true,
        });
      });

      it('should reject Sepolia without allowSepoliaDeploy: true', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'sepolia',
          rpcUrl: 'https://rpc.sepolia.example.invalid/v3/placeholder',
          allowSepoliaDeploy: false,
          hasPrivateKey: true,
          isHardhatDefaultKey: false,
        });
        assert.equal(result.allowed, false);
      });

      it('should reject Sepolia without private key', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'sepolia',
          rpcUrl: 'https://rpc.sepolia.example.invalid/v3/placeholder',
          allowSepoliaDeploy: true,
          hasPrivateKey: false,
          isHardhatDefaultKey: false,
        });
        assert.equal(result.allowed, false);
      });

      it('should reject Sepolia if using Hardhat default key', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'sepolia',
          rpcUrl: 'https://rpc.sepolia.example.invalid/v3/placeholder',
          allowSepoliaDeploy: true,
          hasPrivateKey: true,
          isHardhatDefaultKey: true, // Should block
        });
        assert.equal(result.allowed, false);
      });

      it('should reject Sepolia with HTTP protocol (requires HTTPS)', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'sepolia',
          rpcUrl: 'http://rpc.sepolia.example.invalid/v3/placeholder',
          allowSepoliaDeploy: true,
          hasPrivateKey: true,
          isHardhatDefaultKey: false,
        });
        assert.equal(result.allowed, false);
      });

      it('should reject Sepolia if URL contains credentials', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'sepolia',
          rpcUrl: 'https://user:pass@rpc.sepolia.example.invalid/v3/placeholder',
          allowSepoliaDeploy: true,
          hasPrivateKey: true,
          isHardhatDefaultKey: false,
        });
        assert.equal(result.allowed, false);
      });
    });

    describe('Mainnet and Unknown Networks', function () {
      it('should unconditionally reject mainnet', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'mainnet',
          rpcUrl: 'https://rpc.mainnet.example.invalid/v3/placeholder',
          allowSepoliaDeploy: true, // Irrelevant
          hasPrivateKey: true, // Irrelevant
          isHardhatDefaultKey: false,
        });
        assert.equal(result.allowed, false);
      });

      it('should reject unknown networks', function () {
        const result = validateDeploymentRequest({
          dryRun: false,
          deployNetwork: 'unknown-chain',
          rpcUrl: 'https://rpc.example.invalid',
          allowSepoliaDeploy: false,
          hasPrivateKey: false,
          isHardhatDefaultKey: false,
        });
        assert.equal(result.allowed, false);
      });
    });
  });

  describe('validateVerifiedNetwork (Verification Layer)', function () {
    it('should allow verified local with actual chain ID 31337', function () {
      const result = validateVerifiedNetwork({
        deployNetwork: 'local',
        rpcUrl: 'http://127.0.0.1:8545',
        actualChainId: 31337,
      });
      assert.deepEqual(result, { allowed: true });
    });

    const invalidLocalChainIds = [1, 11155111, 137];
    for (const actualChainId of invalidLocalChainIds) {
      it(`should reject local deployment when verified chain ID is ${actualChainId}`, function () {
        const result = validateVerifiedNetwork({
          deployNetwork: 'local',
          rpcUrl: 'http://127.0.0.1:8545',
          actualChainId,
        });
        assert.equal(result.allowed, false);
      });
    }

    it('should allow verified sepolia with actual chain ID 11155111', function () {
      const result = validateVerifiedNetwork({
        deployNetwork: 'sepolia',
        rpcUrl: 'https://rpc.sepolia.example.invalid/v3/placeholder',
        actualChainId: 11155111,
      });
      assert.deepEqual(result, { allowed: true });
    });

    const invalidSepoliaChainIds = [1, 31337, 137];
    for (const actualChainId of invalidSepoliaChainIds) {
      it(`should reject sepolia deployment when verified chain ID is ${actualChainId}`, function () {
        const result = validateVerifiedNetwork({
          deployNetwork: 'sepolia',
          rpcUrl: 'https://rpc.sepolia.example.invalid/v3/placeholder',
          actualChainId,
        });
        assert.equal(result.allowed, false);
      });
    }

    it('should reject mainnet deployment unconditionally at verification layer', function () {
      const result = validateVerifiedNetwork({
        deployNetwork: 'mainnet',
        rpcUrl: 'https://rpc.mainnet.example.invalid/v3/placeholder',
        actualChainId: 1,
      });
      assert.equal(result.allowed, false);
    });

    it('should reject unknown deployment unconditionally at verification layer', function () {
      const result = validateVerifiedNetwork({
        deployNetwork: 'unknown-chain',
        rpcUrl: 'https://rpc.example.invalid',
        actualChainId: 31337, // Disguise
      });
      assert.equal(result.allowed, false);
    });
  });
});
