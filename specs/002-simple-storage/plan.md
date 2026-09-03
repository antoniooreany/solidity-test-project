# Implementation Plan: SimpleStorage Contract

**Branch**: `feature/simple-storage` | **Date**: 2026-08-22 | **Spec**: [spec.md](spec.md)

## Summary

Implement an owner-controlled string storage contract with access control via a custom `onlyOwner` modifier and `Unauthorized()` custom error.

## Technical Context

**Language/Version**: Solidity ^0.8.20

**Primary Dependencies**: None (standalone contract)

**Storage**: `address public immutable owner` + `string private value`

**Testing**: remix_tests.sol

## Contract API

### State Variables

| Name    | Type      | Visibility | Mutability  | Description         |
| ------- | --------- | ---------- | ----------- | ------------------- |
| `owner` | `address` | `public`   | `immutable` | Contract deployer   |
| `value` | `string`  | `private`  | mutable     | Stored string value |

### Custom Errors

| Error            | Description                                |
| ---------------- | ------------------------------------------ |
| `Unauthorized()` | Reverted when non-owner calls `setValue()` |

### Functions

| Function           | Visibility | Mutability     | Parameters            | Returns         | Access    |
| ------------------ | ---------- | -------------- | --------------------- | --------------- | --------- |
| `setValue(string)` | `external` | state-changing | `newValue` (calldata) | —               | onlyOwner |
| `getValue()`       | `external` | `view`         | —                     | `string memory` | anyone    |

### Events

| Event          | Parameters                         | Description             |
| -------------- | ---------------------------------- | ----------------------- |
| `ValueChanged` | `string oldValue, string newValue` | Emitted on value update |

## Test Strategy

| Requirement    | Test Function                        | Type     |
| -------------- | ------------------------------------ | -------- |
| FR-001, FR-002 | `checkInitialValueIsEmpty`           | Positive |
| FR-003         | `checkOwnerIsDeployer`               | Positive |
| FR-004         | `checkOwnerCanSetValue`              | Positive |
| FR-004         | `checkSubsequentUpdatesReplaceValue` | Positive |
| FR-007         | `checkNonOwnerCannotSetValue`        | Negative |
