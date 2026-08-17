const { expect } = require("chai");

describe("Counter Contract", function () {
  let counter;

  // This setup works for Remix's JS test environment and Hardhat
  beforeEach(async function () {
    // We use ethers which is injected by Remix/Hardhat
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
  });

  it("Should start with a count of 0", async function () {
    const count = await counter.getCount();
    expect(count).to.equal(0n); // using BigInt for uint256
  });

  it("Should increment the count by 1", async function () {
    await counter.increment();
    const count = await counter.getCount();
    expect(count).to.equal(1n);
  });

  it("Should emit CounterIncremented event", async function () {
    await expect(counter.increment())
      .to.emit(counter, "CounterIncremented")
      .withArgs(1n);
  });
});
