// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract SimpleStorage {
    error Unauthorized();

    address public immutable owner;
    string private value;

    event ValueChanged(string oldValue, string newValue);

    constructor() {
        owner = msg.sender;
        // Explicitly set the initial value to an empty string
        value = "";
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    function setValue(string calldata newValue) external onlyOwner {
        string memory oldValue = value;
        value = newValue;

        emit ValueChanged(oldValue, newValue);
    }

    function getValue() external view returns (string memory) {
        return value;
    }
}
