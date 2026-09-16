# Tasks: Realtime Events & Network Switching

## Phase 1: Specification & Planning

- [x] T001 Create `spec.md` with requirements FR-001 through FR-004
- [x] T002 Create `plan.md` with architecture and event listener cleanup design

## Phase 2: TDD — Unit & Component Tests

- [x] T003 Add unit test in `App.test.jsx` for network switch button rendering
- [x] T004 Add test for event listener cleanup on unmount

## Phase 3: Implementation

- [x] T005 Implement `switchNetwork()` helper in `App.jsx` handling `wallet_switchEthereumChain` & `wallet_addEthereumChain`
- [x] T006 Add "Switch Network" button in `WalletConnect.jsx` when connected to incorrect network
- [x] T007 Implement `contract.on('ValueChanged')` realtime subscription in `App.jsx` with cleanup

## Phase 4: Verification & CI

- [x] T008 Run frontend vitest suite and linters
- [x] T009 Build frontend and push feature PR to GitHub
