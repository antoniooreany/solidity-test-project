# Implementation Plan: Counter Contract

**Branch**: `feature/counter-contract` | **Date**: 2026-08-22 | **Spec**: [spec.md](spec.md)

## Summary

Implement a minimal counter smart contract as a first Solidity learning exercise. The contract stores a single `uint256` state variable and exposes `increment()` and `getCount()` functions.

## Technical Context

**Language/Version**: Solidity ^0.8.20

**Primary Dependencies**: None (standalone contract)

**Storage**: Single `uint256 private count` state variable

**Testing**: remix_tests.sol (Solidity unit tests)

**Target Platform**: EVM (Remix VM)

**Project Type**: Smart contract (library/learning)

## Constitution Check

- [x] Spec created before implementation
- [x] TDD planned (tests before code)
- [x] GitFlow branch naming compliant
- [x] Events for state changes
- [x] SPDX license identifier
- [x] No access control needed (documented in spec as intentional)

## Contract API

### State Variables

| Name | Type | Visibility | Description |
|------|------|------------|-------------|
| `count` | `uint256` | `private` | Current counter value |

### Functions

| Function | Visibility | Mutability | Parameters | Returns | Description |
|----------|-----------|------------|------------|---------|-------------|
| `increment()` | `public` | state-changing | — | — | Increases count by 1, emits event |
| `getCount()` | `public` | `view` | — | `uint256` | Returns current count |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `CounterIncremented` | `uint256 newValue` | Emitted after each increment |

## Project Structure

```text
contracts/
└── Counter.sol              # Counter contract implementation

test/
└── Counter_test.sol         # Unit tests for Counter

specs/001-counter/
├── spec.md                  # This specification
├── plan.md                  # This plan
└── tasks.md                 # Implementation tasks
```

## Test Strategy

| Requirement | Test Function | Type |
|-------------|--------------|------|
| FR-001 | `checkInitialCountIsZero()` | Positive |
| FR-002 | `checkIncrementByOne()` | Positive |
| FR-002 | `checkMultipleIncrements()` | Positive |
| FR-003 | `checkGetCountReturnsValue()` | Positive |
| FR-004 | `checkIncrementEmitsEvent()` | Positive (event verification) |
| FR-005 | `checkAnyAddressCanIncrement()` | Positive |
| INV-001 | `checkCounterNeverDecreases()` | Invariant |
| INV-003 | `checkCountAfterNIncrements()` | Property |

## Threat Model

| Threat | Mitigation | Risk |
|--------|-----------|------|
| Integer overflow | Solidity ^0.8.20 has built-in overflow protection | None |
| Unauthorized access | Intentionally open — documented in spec | Accepted |
| Reentrancy | No external calls, no ETH transfers | None |
