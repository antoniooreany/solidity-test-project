# Tasks: SimpleStorage Contract

**Input**: Design documents from `specs/002-simple-storage/`

## Phase 1: Setup

- [x] T001 Create spec.md with requirements and acceptance criteria
- [x] T002 Create plan.md with contract API

## Phase 2: TDD — Tests First

- [x] T003 Create `test/SimpleStorage_test.sol`
- [x] T004 Add test `checkInitialValueIsEmpty` for FR-002
- [x] T005 Add test `checkOwnerIsDeployer` for FR-003
- [x] T006 Add test `checkOwnerCanSetValue` for FR-004
- [x] T009 Add test `checkNonOwnerCannotSetValue` for FR-007

## Phase 3: Implementation

- [x] T008 Create `contracts/SimpleStorage.sol` with state variables
- [x] T009 Implement `Unauthorized()` custom error and `onlyOwner` modifier
- [x] T010 Implement `setValue()` with access control and event emission
- [x] T011 Implement `getValue()` view function
- [x] T012 Verify all tests pass

## Traceability Matrix

| Requirement | Task(s)          | Test                                                          | Contract Line              | Status                                          |
| ----------- | ---------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------- |
| FR-001      | T008             | —                                                             | SimpleStorage.sol:8        | ✅                                              |
| FR-002      | T004, T008       | `checkInitialValueIsEmpty`                                    | SimpleStorage.sol:15       | ✅                                              |
| FR-003      | T005, T008       | `checkOwnerIsDeployer`                                        | SimpleStorage.sol:13       | ✅                                              |
| FR-004      | T006, T007, T010 | `checkOwnerCanSetValue`, `checkSubsequentUpdatesReplaceValue` | SimpleStorage.sol:23-28    | ✅                                              |
| FR-005      | T011             | (getValue is public view)                                     | SimpleStorage.sol:30-32    | ✅                                              |
| FR-006      | T010             | (event emitted in setValue)                                   | SimpleStorage.sol:10, 27   | ✅                                              |
| FR-007      | T009             | `checkNonOwnerCannotSetValue`                                 | SimpleStorage.sol:5, 18-21 | ⚠️ Test exists in spec but missing in test file |
