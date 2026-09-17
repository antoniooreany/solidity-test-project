const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyToken ERC20', function () {
  let token;
  let owner, addr1, addr2;
  const INITIAL_SUPPLY = ethers.parseUnits('1000000', 18); // 1M tokens

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('MyToken');
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  it('should assign the total supply to the deployer', async function () {
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(INITIAL_SUPPLY);
  });

  it('should transfer tokens correctly and update balances', async function () {
    // Transfer 100 tokens (with 18 decimals) from owner to addr1
    const amount = ethers.parseUnits('100', 18);
    await expect(token.transfer(addr1.address, amount))
      .to.emit(token, 'Transfer')
      .withArgs(owner.address, addr1.address, amount);

    const ownerBal = await token.balanceOf(owner.address);
    const addr1Bal = await token.balanceOf(addr1.address);
    expect(ownerBal).to.equal(INITIAL_SUPPLY - amount);
    expect(addr1Bal).to.equal(amount);

    // Transfer 25.5 tokens from addr1 to addr2
    const amount2 = ethers.parseUnits('25.5', 18);
    await token.connect(addr1).transfer(addr2.address, amount2);

    const addr1BalAfter = await token.balanceOf(addr1.address);
    const addr2Bal = await token.balanceOf(addr2.address);
    expect(addr1BalAfter).to.equal(amount - amount2);
    expect(addr2Bal).to.equal(amount2);
  });

  it('should revert when trying to transfer more than balance', async function () {
    const overAmount = ethers.parseUnits('2000000', 18); // more than total supply
    await expect(token.transfer(addr1.address, overAmount)).to.be.reverted;
  });
});
