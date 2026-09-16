# Specification: Realtime Events & Network Switching for Frontend

## Executive Summary

This feature enhances the `SimpleStorage` React frontend by adding real-time contract event listeners (`ValueChanged`), automatic network detection/switching to the local Hardhat network (`chainId: 31337`), and user-friendly transaction feedback.

## User Stories

### US-001: Real-time Event Subscription

As a user, when another user or script updates the value in `SimpleStorage`, I want my UI to automatically update the displayed value in real-time without refreshing the page.

### US-002: One-Click Network Switching

As a user connected to an incorrect network in MetaMask, I want a single "Switch to Hardhat Network" button so I can easily switch to `chainId: 31337`.

### US-003: Enhanced Transaction Notifications

As a user submitting a transaction, I want visual toast/status feedback showing tx hash and mining confirmation.

## Functional Requirements

- **FR-001**: The UI MUST subscribe to the `ValueChanged(string,string)` event from `SimpleStorage` when connected.
- **FR-002**: Upon receiving a `ValueChanged` event, the UI MUST immediately update `Current Value` state.
- **FR-003**: When MetaMask is connected to a network other than `31337`, the UI MUST display a "Switch Network" button that invokes `wallet_switchEthereumChain` / `wallet_addEthereumChain`.
- **FR-004**: The UI MUST unsubscribe from contract events when unmounting or changing provider to prevent memory leaks.

## Non-Functional Requirements

- **NFR-001**: Event listener cleanup MUST execute on component unmount.
- **NFR-002**: Network switch request MUST gracefully handle user rejection (code 4001).

## Out-of-Scope

- Supporting non-EVM wallets or hardware wallets.
