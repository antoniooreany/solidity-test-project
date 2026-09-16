// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract SimpleStorage {
  error Unauthorized();

  address public immutable owner;
  string private value;
  string[] private _history;

  event ValueChanged(string oldValue, string newValue);

  constructor() {
    owner = msg.sender;
    // Explicitly set the initial value to an empty string
    value = '';
  }

  modifier onlyOwner() {
    if (msg.sender != owner) revert Unauthorized();
    _;
  }

  function setValue(string calldata newValue) external onlyOwner {
    string memory oldValue = value;
    value = newValue;
    _history.push(newValue);

    emit ValueChanged(oldValue, newValue);
  }

  function getValue() external view returns (string memory) {
    return value;
  }

  function getHistory() external view returns (string[] memory) {
    return _history;
  }

  function getHistoryCount() external view returns (uint256) {
    return _history.length;
  }
}
