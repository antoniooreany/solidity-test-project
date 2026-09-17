# Implementation Plan: SimpleStaking Contract

## Smart Contract Architecture
1. State variables:
   - `mapping(address => uint256) public stakes;`
   - `uint256 public totalStaked;`
2. Functions:
   - `stake() external payable`
   - `withdraw(uint256 amount) external`
   - `getStake(address user) external view returns (uint256)`
