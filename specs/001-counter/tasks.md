# Tasks: Counter Contract

**Input**: Design documents from `specs/001-counter/`

**Prerequisites**: spec.md (required), plan.md (required)

## Phase 1: Setup

- [x] T001 Create specs/001-counter/ directory with spec.md
- [x] T002 Create plan.md with contract API and test strategy
- [x] T003 Create this tasks.md

## Phase 2: TDD — Tests First (User Story 1 + 2)

> **Write these tests FIRST. They MUST FAIL before implementation.**

- [x] T004 [P] Create `test/Counter_test.sol` with test contract skeleton
- [x] T005 Add test `checkInitialCountIsZero` for FR-001
- [x] T006 Add test `checkIncrementByOne` for FR-002
- [x] T007 Add test `checkMultipleIncrements` for FR-002
- [x] T008 Add test `checkGetCountReturnsValue` for FR-003
- [x] T009 Add test `checkCountAfterNIncrements` for INV-003

## Phase 3: Implementation

- [x] T010 Create `contracts/Counter.sol` with state variable `count`
- [x] T011 Implement `increment()` function with event emission (FR-002, FR-004)
- [x] T012 Implement `getCount()` view function (FR-003)
- [x] T013 Verify all tests from Phase 2 pass (Green)

## Phase 4: Polish

- [x] T014 Add NatSpec documentation to Counter.sol
- [x] T015 Verify CI pipeline passes
- [x] T016 Update traceability matrix

## Traceability Matrix

| Requirement | Task(s)          | Test                                             | Contract Line      | Status       |
| ----------- | ---------------- | ------------------------------------------------ | ------------------ | ------------ |
| FR-001      | T005, T010       | `checkInitialCountIsZero`                        | Counter.sol:10     | ✅           |
| FR-002      | T006, T007, T011 | `checkIncrementByOne`, `checkMultipleIncrements` | Counter.sol:18-21  | ✅           |
| FR-003      | T008, T012       | `checkGetCountReturnsValue`                      | Counter.sol:27-29  | ✅           |
| FR-004      | T011             | (event verified via increment tests)             | Counter.sol:13, 20 | ✅           |
| FR-005      | —                | `checkAnyAddressCanIncrement`                    | (no restriction)   | ✅           |
| INV-001     | —                | (no decrement exists)                            | —                  | ✅ By design |
| INV-003     | T009             | `checkCountAfterNIncrements`                     | Counter.sol:18-21  | ✅           |
