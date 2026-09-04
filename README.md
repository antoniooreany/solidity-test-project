# Solidity Test Project

This is a test project designed for learning Solidity, Web3, and blockchain development.
It follows **Spec-Driven Development (SDD)** with [GitHub Spec Kit](https://github.com/github/spec-kit), strict **GitFlow**, and **Test-Driven Development (TDD)**.

## Development Methodology

### SDD Workflow (SpecKit)

Every feature follows a mandatory lifecycle:

1. **Constitution** — Project principles (`.specify/memory/constitution.md`)
2. **Specify** — Requirements & acceptance criteria (`specs/<feature>/spec.md`)
3. **Plan** — Technical design (`specs/<feature>/plan.md`)
4. **Tasks** — TDD-ordered task list (`specs/<feature>/tasks.md`)
5. **Implement** — Code with TDD (Red → Green → Refactor)
6. **Converge** — Verify against acceptance criteria

See [SDD Workflow Guide](docs/development/sdd-workflow.md) for details.

### GitFlow

| Branch      | Purpose                   |
| ----------- | ------------------------- |
| `main`      | Production-ready releases |
| `develop`   | Integration branch        |
| `feature/*` | New features              |
| `fix/*`     | Bug fixes                 |
| `release/*` | Release preparation       |
| `hotfix/*`  | Critical fixes            |

See [GitFlow Guide](docs/development/gitflow.md) for branch naming, Conventional Commits, and PR rules.

### TDD

All smart contracts are developed using strict TDD with `remix_tests.sol`. Every test references a requirement ID from the spec.

See [TDD Guide](docs/development/tdd.md) for details.

## Project Structure

```
.specify/                        # SpecKit configuration
├── memory/constitution.md       # Project principles (NON-NEGOTIABLE)
├── templates/                   # Spec/plan/tasks templates
├── scripts/                     # Helper scripts
└── workflows/                   # SpecKit workflow definitions

specs/                           # Feature specifications
├── 001-counter/                 # Counter contract spec
├── 002-simple-storage/          # SimpleStorage contract spec
└── 003-erc20-token/             # ERC-20 token spec

contracts/                       # Solidity smart contracts
├── Counter.sol
├── SimpleStorage.sol
└── MyToken.sol

test/                            # Unit tests (remix_tests.sol)
├── Counter_test.sol
├── SimpleStorage_test.sol
└── MyToken_test.sol

docs/
├── development/                 # Development guides
│   ├── gitflow.md
│   ├── tdd.md
│   └── sdd-workflow.md
└── specs/                       # Legacy specs (migrated to specs/)
```

## Getting Started

### Prerequisites

- Solidity Compiler `0.8.24` (Pinned globally across the project)
- [Remix IDE](https://remix.ethereum.org) for smart contract development
- Node.js + npm for OpenZeppelin dependencies
- [SpecKit CLI](https://github.com/github/spec-kit) for SDD workflow

### Local Development

Connect to Remix IDE:

```bash
npx @remix-project/remixd -s . --remix-ide https://remix.ethereum.org
```

### CI/CD

Automated via GitHub Actions ([solidity-ci.yml](.github/workflows/solidity-ci.yml)):

- Solidity compilation and unit tests
- Spec traceability verification
- Conventional Commits validation on PRs

## Smart Contracts

| Contract          | Spec                                                   | Tests                                                 | Status                         |
| ----------------- | ------------------------------------------------------ | ----------------------------------------------------- | ------------------------------ |
| Counter.sol       | [001-counter](specs/001-counter/spec.md)               | [Counter_test.sol](test/Counter_test.sol)             | ✅ Verified                    |
| SimpleStorage.sol | [002-simple-storage](specs/002-simple-storage/spec.md) | [SimpleStorage_test.sol](test/SimpleStorage_test.sol) | ✅ Verified                    |
| MyToken.sol       | [003-erc20-token](specs/003-erc20-token/spec.md)       | [MyToken_test.sol](test/MyToken_test.sol)             | ⚠️ Pending Manual Verification |
