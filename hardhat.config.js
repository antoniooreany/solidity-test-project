import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatMocha from '@nomicfoundation/hardhat-mocha';

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  plugins: [hardhatEthers, hardhatMocha],
  solidity: '0.8.24',
  paths: {
    sources: './contracts',
    tests: './test_hardhat', // isolate from remix tests
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
