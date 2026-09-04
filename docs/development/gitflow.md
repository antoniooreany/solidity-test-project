# GitFlow Workflow

## Branch Model

| Branch      | Purpose                   | Base      | Merges Into        |
| ----------- | ------------------------- | --------- | ------------------ |
| `main`      | Production-ready releases | —         | —                  |
| `develop`   | Integration branch        | `main`    | `release/*`        |
| `feature/*` | New features/specs        | `develop` | `develop`          |
| `fix/*`     | Bug fixes                 | `develop` | `develop`          |
| `release/*` | Release stabilization     | `develop` | `main` + `develop` |
| `hotfix/*`  | Critical production fixes | `main`    | `main` + `develop` |

## Branch Naming

```
feature/<scope>-<short-description>
fix/<scope>-<short-description>
release/v<major>.<minor>.<patch>
hotfix/v<major>.<minor>.<patch+1>
```

Examples:

- `feature/speckit-sdd-improvement`
- `feature/erc721-nft-contract`
- `fix/counter-overflow-guard`
- `release/v1.1.0`
- `hotfix/v1.0.1`

## Conventional Commits

All commit messages MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types

| Type       | Description                                |
| ---------- | ------------------------------------------ |
| `feat`     | New feature or contract                    |
| `fix`      | Bug fix                                    |
| `test`     | Adding or updating tests                   |
| `docs`     | Documentation changes                      |
| `chore`    | Maintenance, CI, tooling                   |
| `refactor` | Code restructuring without behavior change |
| `ci`       | CI/CD configuration changes                |

### Scopes

Use the contract or feature name: `counter`, `storage`, `erc20`, `ci`, `sdd`.

### Examples

```
feat(counter): implement increment function
test(counter): add initial value and event tests
docs(sdd): migrate specs to SpecKit format
chore(ci): add spec traceability validation
fix(erc20): resolve OpenZeppelin import path
```

## PR Requirements

1. **Title**: Follows Conventional Commits format
2. **Description**: Links to spec, plan, and tasks documents
3. **CI**: All checks must pass (compilation + tests)
4. **Review**: At least one review (or documented self-review)
5. **Tasks**: No unresolved items in tasks.md
6. **Base branch**: PRs target `develop` (never `main` directly)

## Protected Branches

| Branch    | Rules                                      |
| --------- | ------------------------------------------ |
| `main`    | Require PR, require CI pass, no force push |
| `develop` | Require PR, require CI pass, no force push |
