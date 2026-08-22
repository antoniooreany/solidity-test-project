# Contributing Guidelines

## Spec-Driven Development (SDD) & Verification Rules

1. All features must be fully specified before implementation.
2. A feature must not be marked verified or merged as complete unless verification evidence was produced by the stated test environment.
3. Synthetic addresses, inferred test outcomes, and unexecuted test results must not be recorded as verification evidence.

## Development Workflow

### Before You Code

1. **Check the Constitution**: Read `.specify/memory/constitution.md` for non-negotiable project principles.
2. **Create a Spec**: Every new feature or change needs a spec in `specs/<feature>/spec.md`.
3. **Write a Plan**: Technical design in `specs/<feature>/plan.md`.
4. **Define Tasks**: TDD-ordered task list in `specs/<feature>/tasks.md`.

### Branching

- Branch from `develop`: `git checkout -b feature/<scope>-<description> develop`
- Never push directly to `main` or `develop`.
- One feature per branch.

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

| Type | Use For |
|------|---------|
| `feat` | New feature or contract |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `docs` | Documentation |
| `chore` | Maintenance, CI, tooling |
| `refactor` | Restructuring without behavior change |
| `ci` | CI/CD changes |

### Testing

- **TDD is mandatory**: Write tests BEFORE implementation.
- Every test function must reference a requirement ID (e.g., `FR-001`).
- All tests must pass before creating a PR.

### Pull Requests

1. Title follows Conventional Commits format.
2. Description links to spec, plan, and tasks documents.
3. All CI checks must pass.
4. No unresolved tasks in tasks.md.
5. Target branch: `develop` (never `main` directly).

## SpecKit Commands

| Phase | Command | Output |
|-------|---------|--------|
| Constitution | `/speckit.constitution` | `.specify/memory/constitution.md` |
| Specify | `/speckit.specify` | `specs/<feature>/spec.md` |
| Plan | `/speckit.plan` | `specs/<feature>/plan.md` |
| Tasks | `/speckit.tasks` | `specs/<feature>/tasks.md` |
| Implement | `/speckit.implement` | Contract + test code |
| Converge | `/speckit.converge` | Verification report |
