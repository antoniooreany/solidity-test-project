# Test-Driven Development (TDD) Guide

## Overview

This project follows strict TDD for all smart contract development. Tests are written in Solidity using the `remix_tests.sol` framework and executed via Remix IDE or the `EthereumRemix/sol-test` GitHub Action.

## TDD Cycle

### 1. Red — Write a Failing Test

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "remix_tests.sol";
import "../contracts/MyContract.sol";

contract MyContractTest {
    MyContract private myContract;

    function beforeEach() public {
        myContract = new MyContract();
    }

    /// @dev FR-001: Initial state must be zero
    function checkInitialState() public {
        Assert.equal(myContract.getValue(), 0, "Initial value should be 0");
    }
}
```

### 2. Green — Write Minimal Code to Pass

Implement only enough contract code to make the test pass.

### 3. Refactor — Improve Without Changing Behavior

Clean up code while keeping all tests green.

## Test Naming Convention

Remix test functions MUST start with `check` or `checkFail` prefix:

| Prefix | Purpose | Example |
|--------|---------|--------|
| `check` | Positive test | `checkInitialValueIsZero()` |
| `checkFail` | Negative/revert test | `checkFailUnauthorizedAccess()` |

## Requirement Traceability

Every test function MUST include a NatSpec comment referencing the requirement:

```solidity
/// @dev FR-001: Counter initial value must be zero after deployment
function checkInitialCountIsZero() public { ... }

/// @dev FR-002: Increment must increase counter by exactly 1
function checkIncrementByOne() public { ... }

/// @dev INV-001: Counter value must never be negative
function checkCounterNonNegative() public { ... }
```

## Test Structure

```
test/
├── Counter_test.sol          — Tests for Counter.sol
├── SimpleStorage_test.sol    — Tests for SimpleStorage.sol
└── MyToken_test.sol          — Tests for MyToken.sol
```

Each test file:
1. Imports `remix_tests.sol` and the contract under test
2. Uses `beforeEach()` to deploy a fresh contract instance
3. Groups tests logically: positive → edge cases → negative
4. References requirement IDs in NatSpec comments

## Running Tests

### Locally (Remix IDE)
1. Connect via `npx @remix-project/remixd -s . --remix-ide https://remix.ethereum.org`
2. Open test file in Remix
3. Run via Solidity Unit Testing plugin

### CI (GitHub Actions)
Tests run automatically on push/PR via `EthereumRemix/sol-test@v1.2`.
