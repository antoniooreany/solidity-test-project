# Specification: Multi-Contract UI (Counter & MyToken ERC-20)

## Executive Summary

Expand frontend UI to support `Counter` and `MyToken` contracts alongside `SimpleStorage` via tabbed navigation.

## Functional Requirements

- **FR-001**: UI MUST feature tabbed navigation between SimpleStorage, Counter, and MyToken.
- **FR-002**: Counter tab MUST allow reading count and invoking `increment()`.
- **FR-003**: MyToken tab MUST allow reading user token balance and sending `transfer(to, amount)` transactions.
