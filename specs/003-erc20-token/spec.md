# Feature Specification: ERC-20 Token Contract

**Feature Branch**: `feature/erc20-token`

**Created**: 2026-08-22

**Status**: Implemented — Pending Manual Verification

## User Scenarios & Testing

### User Story 1 - Deploy Token (Priority: P1)

As a developer, I want to deploy an ERC-20 token with a fixed supply so that I have a standard-compliant token for testing.

**Acceptance Scenarios**:

1. **Given** a freshly deployed MyToken, **When** `name()` is called, **Then** it returns `"TestToken"`.
2. **Given** a freshly deployed MyToken, **When** `symbol()` is called, **Then** it returns `"TTK"`.
3. **Given** a freshly deployed MyToken, **When** `decimals()` is called, **Then** it returns 18.
4. **Given** a freshly deployed MyToken, **When** `totalSupply()` is called, **Then** it returns 1,000,000 × 10^18.
5. **Given** a freshly deployed MyToken, **When** `balanceOf(deployer)` is called, **Then** it equals `totalSupply()`.

---

### User Story 2 - Transfer Tokens (Priority: P1)

As a token holder, I want to transfer tokens to another address.

**Acceptance Scenarios**:

1. **Given** deployer holds all tokens, **When** `transfer(receiver, 100e18)` is called, **Then** receiver's balance is 100e18.
2. **Given** deployer balance is X, **When** `transfer(receiver, X+1)` is called, **Then** the transaction reverts.

---

### User Story 3 - Approve and TransferFrom (Priority: P2)

As a token holder, I want to approve a spender to transfer tokens on my behalf.

**Acceptance Scenarios**:

1. **Given** deployer approves spender for 50e18, **When** `allowance(deployer, spender)` is called, **Then** it returns 50e18.
2. **Given** deployer approves spender for 50e18, **When** spender calls `transferFrom(deployer, receiver, 50e18)`, **Then** receiver gets 50e18 and allowance drops to 0.
3. **Given** deployer approves spender for 50e18, **When** spender calls `transferFrom(deployer, receiver, 51e18)`, **Then** the transaction reverts.

## Requirements

### Functional Requirements

- **FR-001**: Contract MUST inherit from OpenZeppelin's `ERC20`.
- **FR-002**: Token name MUST be `"TestToken"`.
- **FR-003**: Token symbol MUST be `"TTK"`.
- **FR-004**: Decimals MUST be 18 (ERC-20 default).
- **FR-005**: Initial supply MUST be 1,000,000 tokens (1_000_000 × 10^18 wei).
- **FR-006**: All initial supply MUST be minted to deployer's address.
- **FR-007**: Standard ERC-20 `transfer` MUST work correctly.
- **FR-008**: Standard ERC-20 `approve` + `transferFrom` MUST work correctly.
- **FR-009**: Fixed supply — no external `mint()` or `burn()` functions.

### Invariants

- **INV-001**: `totalSupply()` MUST remain constant after deployment.
- **INV-002**: Sum of all balances MUST always equal `totalSupply()`.

## Success Criteria

- **SC-001**: Contract compiles without errors.
- **SC-002**: All automated unit tests pass.
- **SC-003**: Manual verification in Remix VM confirms all acceptance scenarios.

## Assumptions

- OpenZeppelin Contracts v5.0.1 via npm.
- No token governance or access control beyond standard ERC-20.

## Verification Status

> **Status: Verified in CI.**
>
> All functional and invariant requirements are automatically verified via `MyToken_test.sol` executed by GitHub Actions.
