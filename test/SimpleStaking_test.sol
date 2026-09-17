// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'remix_tests.sol';
import '../contracts/SimpleStaking.sol';

contract SimpleStakingTest {
  SimpleStaking private staking;

  function beforeEach() public {
    staking = new SimpleStaking();
  }

  function checkInitialTotalStakedZero() public {
    Assert.equal(staking.totalStaked(), 0, 'Initial totalStaked should be 0');
  }

  function checkInitialUserStakeZero() public {
    Assert.equal(staking.getStake(address(this)), 0, 'Initial user stake should be 0');
  }
    function testStakeAndWithdraw() public {
        // Stake 1 ether
        uint256 stakeAmount = 1 ether;
        staking.stake{value: stakeAmount}();
        Assert.equal(staking.totalStaked(), stakeAmount, 'Total staked after staking 1 ether');
        Assert.equal(staking.getStake(address(this)), stakeAmount, 'User stake after staking');

        // Withdraw half
        uint256 withdrawAmount = 0.5 ether;
        staking.withdraw(withdrawAmount);
        Assert.equal(staking.totalStaked(), stakeAmount - withdrawAmount, 'Total after withdrawal');
        Assert.equal(staking.getStake(address(this)), stakeAmount - withdrawAmount, 'User stake after withdrawal');
    }

}
