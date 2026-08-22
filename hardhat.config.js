import "@nomicfoundation/hardhat-ethers";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./test_hardhat", // isolate from remix tests
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
