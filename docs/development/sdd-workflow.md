# Spec-Driven Development (SDD) Workflow

## Overview

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) to enforce a structured, spec-first development workflow. Every feature follows a mandatory lifecycle before any code is written.

## SpecKit Workflow Phases

### Phase 0: Constitution (One-Time)

Establish project-wide principles in `.specify/memory/constitution.md`.
This is done once and amended as needed.

**Command**: `/speckit.constitution`

### Phase 1: Specify

Capture business requirements, user scenarios, acceptance criteria, and edge cases.

**Command**: `/speckit.specify`  
**Output**: `specs/<feature>/spec.md`

### Phase 2: Plan

Translate the spec into a technical implementation plan: contract API, storage layout, threat model, test strategy.

**Command**: `/speckit.plan`  
**Output**: `specs/<feature>/plan.md`

### Phase 3: Tasks

Decompose the plan into atomic, TDD-ordered tasks with requirement traceability.

**Command**: `/speckit.tasks`  
**Output**: `specs/<feature>/tasks.md`

### Phase 4: Implement

Execute tasks following strict TDD: write failing test → implement → refactor.

**Command**: `/speckit.implement`

### Phase 5: Converge

Verify implementation against acceptance criteria. Run all tests, check coverage, update documentation.

**Command**: `/speckit.converge`

> **Repeat Phases 4-5 until `/speckit.converge` reports Converged.**

## Directory Structure

```
.specify/
├── memory/
│   └── constitution.md          # Project principles (NON-NEGOTIABLE)
├── templates/
│   ├── spec-template.md         # Specification template
│   ├── plan-template.md         # Implementation plan template
│   ├── tasks-template.md        # Task list template
│   └── checklist-template.md    # Quality checklist template
├── scripts/
│   └── powershell/              # Helper scripts
└── workflows/
    └── speckit/workflow.yml     # SpecKit workflow definition

specs/
├── 001-counter/
│   ├── spec.md                  # Requirements & acceptance criteria
│   ├── plan.md                  # Technical design
│   └── tasks.md                 # TDD-ordered task list
├── 002-simple-storage/
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
└── 003-erc20-token/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

## Traceability Matrix

Every feature MUST maintain traceability:

| Requirement | Test Case                   | Contract         | Status      |
| ----------- | --------------------------- | ---------------- | ----------- |
| FR-001      | `checkInitialCountIsZero()` | `Counter.sol:10` | ✅ Verified |
| FR-002      | `checkIncrementByOne()`     | `Counter.sol:18` | ✅ Verified |

## Rules

1. **No code without spec**: Every contract change must trace back to a spec requirement
2. **Tests before code**: TDD is mandatory (see [TDD Guide](tdd.md))
3. **One feature per branch**: Each spec gets its own `feature/*` branch
4. **PR links spec**: Every PR description must link to the spec, plan, and tasks
5. **Converge before merge**: Implementation must pass convergence check
