# Implementation Plan: ERC-20 Token Contract

**Branch**: `feature/erc20-token` | **Date**: 2026-08-22 | **Spec**: [spec.md](spec.md)

## Summary

Implement a standard ERC-20 token using OpenZeppelin's ERC20 base contract. Fixed supply of 1M tokens minted to deployer.

## Technical Context

**Language/Version**: Solidity ^0.8.20

**Primary Dependencies**: @openzeppelin/contracts v5.0.1 (ERC20)

**Testing**: remix_tests.sol + Spender helper contract

## Contract API

### Constants

| Name             | Type      | Value                  | Description        |
| ---------------- | --------- | ---------------------- | ------------------ |
| `INITIAL_SUPPLY` | `uint256` | `1_000_000 * 10 ** 18` | Total token supply |

### Inherited Interface (from ERC20)

| Function                                  | Returns   | Description             |
| ----------------------------------------- | --------- | ----------------------- |
| `name()`                                  | `string`  | Returns "TestToken"     |
| `symbol()`                                | `string`  | Returns "TTK"           |
| `decimals()`                              | `uint8`   | Returns 18              |
| `totalSupply()`                           | `uint256` | Returns INITIAL_SUPPLY  |
| `balanceOf(address)`                      | `uint256` | Returns account balance |
| `transfer(address, uint256)`              | `bool`    | Transfers tokens        |
| `approve(address, uint256)`               | `bool`    | Sets allowance          |
| `allowance(address, address)`             | `uint256` | Returns allowance       |
| `transferFrom(address, address, uint256)` | `bool`    | Third-party transfer    |

## Test Strategy

| Requirement    | Test Function                              | Type     |
| -------------- | ------------------------------------------ | -------- |
| FR-002, FR-003 | `checkNameAndSymbol`                       | Positive |
| FR-004         | `checkDecimals`                            | Positive |
| FR-005         | `checkTotalSupply`                         | Positive |
| FR-006         | `checkDeployerBalance`                     | Positive |
| FR-007         | `checkTransfer`                            | Positive |
| FR-007         | `checkTransferFailsExceedingBalance`       | Negative |
| FR-008         | `checkApproveAndTransferFrom`              | Positive |
| FR-008         | `checkTransferFromFailsExceedingAllowance` | Negative |
