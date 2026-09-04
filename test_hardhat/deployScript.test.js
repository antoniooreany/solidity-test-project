import assert from 'node:assert';
import { main } from '../scripts/deploy.js';

describe('Deploy Script Entrypoint', function () {
  it('should call executeDeploymentCommand with env and defaults, and return { exitCode }', async function () {
    const mockEnv = { DRY_RUN: 'true' };
    let executeCalledWith = null;

    const mockExecute = async (args) => {
      executeCalledWith = args;
      return { exitCode: 0 };
    };

    const mockDeps = {
      executeDeploymentCommand: mockExecute,
      parseDeploymentEnvironment: () => {},
      runDeployment: () => {},
      defaults: {
        rpcUrl: 'http://mock-rpc',
        hardhatDefaultPrivateKey: '0xmock',
      },
    };

    const result = await main(mockEnv, mockDeps);

    assert.ok(executeCalledWith, 'executeDeploymentCommand was not called');
    assert.deepEqual(executeCalledWith.env, mockEnv);
    assert.equal(executeCalledWith.defaults.rpcUrl, 'http://mock-rpc');
    assert.equal(executeCalledWith.defaults.hardhatDefaultPrivateKey, '0xmock');
    assert.equal(
      executeCalledWith.dependencies.parseDeploymentEnvironment,
      mockDeps.parseDeploymentEnvironment,
    );
    assert.equal(executeCalledWith.dependencies.runDeployment, mockDeps.runDeployment);
    assert.deepEqual(result, { exitCode: 0 });
  });

  it('should not create provider or wallet or execute deploy if DRY_RUN is true (via mocks)', async function () {
    const mockEnv = { DRY_RUN: 'true' };

    const mockExecute = async () => {
      return { exitCode: 0 };
    };

    let ethersCalled = false;
    const mockEthers = {
      JsonRpcProvider: class {
        constructor() {
          ethersCalled = true;
          throw new Error('Should not create provider on dry run');
        }
      },
      Wallet: class {
        constructor() {
          ethersCalled = true;
          throw new Error('Should not create wallet on dry run');
        }
      },
      ContractFactory: class {
        constructor() {
          ethersCalled = true;
          throw new Error('Should not create contract factory on dry run');
        }
      },
    };

    const mockDeps = {
      executeDeploymentCommand: mockExecute,
      parseDeploymentEnvironment: () => {},
      runDeployment: () => {},
      defaults: {
        rpcUrl: 'http://mock-rpc',
        hardhatDefaultPrivateKey: '0xmock',
      },
      ethers: mockEthers,
    };

    const result = await main(mockEnv, mockDeps);

    assert.equal(ethersCalled, false, 'Ethers classes were instantiated during a dry run');
    assert.deepEqual(result, { exitCode: 0 });
  });
});
