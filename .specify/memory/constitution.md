# Solidity Test Project Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

Every smart contract and feature MUST have a complete specification BEFORE any implementation begins. The SDD lifecycle is:

1. **Specify** — Define requirements, acceptance criteria, edge cases
2. **Plan** — Technical design, storage layout, API, threat model, test strategy
3. **Tasks** — Atomic TDD-ordered tasks with requirement traceability
4. **Implement** — Code only after spec/plan/tasks are approved
5. **Converge** — Verify implementation against acceptance criteria

No code change is permitted without a corresponding spec entry.

### II. Test-Driven Development (NON-NEGOTIABLE)

TDD is mandatory for all smart contract development:

- Tests MUST be written BEFORE implementation code
- Red-Green-Refactor cycle strictly enforced
- Every test case MUST reference a requirement ID (e.g., FR-001, INV-001)
- Testing framework: Remix `remix_tests.sol` (Solidity unit tests)
- All tests MUST pass before any merge to develop

### III. Strict GitFlow

- `main`: Production-ready releases only; merge via release/hotfix PR
- `develop`: Integration branch; base for all feature branches
- `feature/*`: One spec or logically complete change per branch
- `release/*`: Version stabilization and documentation only
- `hotfix/*`: Critical fixes from main, with back-merge to develop
- Direct pushes to `main` or `develop` are FORBIDDEN
- Conventional Commits required (e.g., `feat(counter): add increment tests`)

### IV. Safe-by-Default Security Baseline

- All state-mutating functions MUST have explicit access control review
- Custom errors preferred over require strings (gas efficiency)
- Immutable/constant for values that never change
- Events MUST be emitted for all state changes
- OpenZeppelin Contracts (v5.0.1) as the standard library for ERC implementations

### V. Solidity Standards

- **Compiler**: Solidity ^0.8.20
- **IDE**: Remix IDE as primary development environment
- **Testing**: `remix_tests.sol` with `EthereumRemix/sol-test` GitHub Action
- **Dependencies**: OpenZeppelin Contracts v5.0.1 via npm
- **License**: MIT (SPDX-License-Identifier in every file)

### VI. Traceability (NON-NEGOTIABLE)

Every requirement MUST be traceable through the full chain:

```
spec.md (FR-001) → plan.md → tasks.md (T001) → test file → contract
```

The traceability matrix MUST be maintained in each feature's spec directory.

## Quality Gates

### PR Requirements

- Link to spec, plan, and tasks documents
- All CI checks green (compile + unit tests)
- No unresolved tasks in tasks.md
- Code review by at least one reviewer (or self-review with documented rationale)
- Conventional Commit messages

### CI Pipeline

- Solidity compilation (solc 0.8.20)
- Unit tests via EthereumRemix/sol-test
- Spec traceability check (every contract has a spec)

## Governance

- This Constitution supersedes all other development practices
- Amendments require: documentation update, approval, migration plan
- All PRs and reviews MUST verify compliance with this Constitution

**Version**: 1.0.0 | **Ratified**: 2026-08-22 | **Last Amended**: 2026-08-22
