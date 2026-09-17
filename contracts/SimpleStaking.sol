// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleStaking
 * @dev A minimal staking contract allowing users to stake ETH and withdraw their stake.
 */
contract SimpleStaking {
    // Mapping of user address to their staked amount
    mapping(address => uint256) public stakes;

    // Total amount of ETH staked in the contract
    uint256 public totalStaked;

    // Events emitted on staking and withdrawal
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    /**
     * @dev Stake ETH into the contract.
     * The sent value is added to the caller's stake and to totalStaked.
     */
    function stake() external payable {
        require(msg.value > 0, "Stake amount must be > 0");
        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw a specific amount of ETH from the contract.
     * @param amount The amount to withdraw in wei.
     */
    function withdraw(uint256 amount) external {
        uint256 userStake = stakes[msg.sender];
        require(amount > 0, "Withdraw amount must be > 0");
        require(userStake >= amount, "Insufficient stake");
        stakes[msg.sender] = userStake - amount;
        totalStaked -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}(
            ""
        );
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Get the staked amount for a specific user.
     * @param user Address of the user.
     * @return The amount of ETH staked by the user.
     */
    function getStake(address user) external view returns (uint256) {
        return stakes[user];
    }
}
