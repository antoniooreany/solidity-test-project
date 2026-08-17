// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Counter
 * @dev A simple smart contract that maintains a non-negative integer counter.
 */
contract Counter {
    // Stores the current count
    uint256 private count;

    // Event emitted when the counter is incremented
    event CounterIncremented(uint256 newValue);

    /**
     * @dev Increments the counter by exactly 1.
     */
    function increment() public {
        count += 1;
        emit CounterIncremented(count);
    }

    /**
     * @dev Returns the current counter value.
     * @return The current count.
     */
    function getCount() public view returns (uint256) {
        return count;
    }
}
