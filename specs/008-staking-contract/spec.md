# Specification: SimpleStaking Contract

## Executive Summary
A staking contract allowing users to deposit ETH, track staked balances, calculate simple rewards, and withdraw staked ETH.

## Functional Requirements
- **FR-001**: Users MUST be able to deposit ETH via `stake()` payable function.
- **FR-002**: `stakes(address)` MUST track each user's staked ETH balance.
- **FR-003**: `withdraw(uint256 amount)` MUST allow users to withdraw their staked ETH.
- **FR-004**: Total staked balance MUST be tracked in `totalStaked`.
