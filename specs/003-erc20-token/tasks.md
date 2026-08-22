# Tasks: ERC-20 Token Contract

**Input**: Design documents from `specs/003-erc20-token/`

## Phase 1: Setup

- [x] T001 Create spec.md
- [x] T002 Create plan.md
- [x] T003 Add OpenZeppelin dependency to package.json

## Phase 2: TDD — Tests First

- [x] T004 Create Spender helper contract in test file
- [x] T005 Add test `checkNameAndSymbol` for FR-002, FR-003
- [x] T006 Add test `checkDecimals` for FR-004
- [x] T007 Add test `checkTotalSupply` for FR-005
- [x] T008 Add test `checkDeployerBalance` for FR-006
- [x] T009 Add test `checkTransfer` for FR-007
- [x] T010 Add test `checkTransferFailsExceedingBalance` for FR-007 (negative)
- [x] T011 Add test `checkApproveAndTransferFrom` for FR-008
- [x] T012 Add test `checkTransferFromFailsExceedingAllowance` for FR-008 (negative)

## Phase 3: Implementation

- [x] T013 Create `contracts/MyToken.sol` inheriting OpenZeppelin ERC20
- [x] T014 Define `INITIAL_SUPPLY` constant
- [x] T015 Implement constructor with `_mint(msg.sender, INITIAL_SUPPLY)`
- [x] T016 Verify all tests pass

## Phase 4: Verification

- [ ] T017 Manual verification in Remix VM (deployment + all acceptance scenarios)
- [x] T018 CI pipeline validation

## Phase 5: TDD Hardening (Invariants and Edge Cases)

- [ ] T019 Add test `checkTransferToZeroAddressFails` (Negative edge case)
- [ ] T020 Add test `checkApproveToZeroAddressFails` (Negative edge case)
- [ ] T021 Add test `checkInvariantTotalSupplyConstant` for INV-001
- [ ] T022 Add test `checkInvariantBalancesSum` for INV-002

## Traceability Matrix

| Requirement | Task(s) | Test | Contract Line | Status |
|-------------|---------|------|---------------|--------|
| FR-001 | T013 | — | MyToken.sol:4,6 | ✅ |
| FR-002 | T005, T013 | `checkNameAndSymbol` | MyToken.sol:9 | ✅ |
| FR-003 | T005, T013 | `checkNameAndSymbol` | MyToken.sol:9 | ✅ |
| FR-004 | T006 | `checkDecimals` | (inherited) | ✅ |
| FR-005 | T007, T014 | `checkTotalSupply` | MyToken.sol:7 | ✅ |
| FR-006 | T008, T015 | `checkDeployerBalance` | MyToken.sol:10 | ✅ |
| FR-007 | T009, T010, T019 | `checkTransfer`, `checkTransferFails...` | (inherited) | ✅ |
| FR-008 | T011, T012, T020 | `checkApproveAndTransferFrom`, `check...` | (inherited) | ✅ |
| FR-009 | — | (no mint/burn functions exist) | — | ✅ By design |
| INV-001 | T021 | `checkInvariantTotalSupplyConstant` | (inherited) | ⏳ Pending |
| INV-002 | T022 | `checkInvariantBalancesSum` | (inherited) | ⏳ Pending |
