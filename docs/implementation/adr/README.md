# Architecture Decision Records (ADR)

This directory is the permanent, immutable record of **implementation-level** engineering decisions, as required by Rule 3 of [../ENGINEERING-RULES.md](../ENGINEERING-RULES.md).

An ADR records a decision the constitution does not fix (tooling, package management, testing framework, build, performance strategy, implementation strategy). An ADR **never** redefines constitutional ownership. If a decision appears to require an architectural concept the constitution does not define, work stops and architectural clarification is requested (the "never invent architecture" gate); it is not resolved by an ADR.

## Process

1. Copy [`0000-template.md`](0000-template.md) to `NNNN-kebab-title.md` (next free number).
2. Fill every field. Open it as `Proposed`.
3. On review it becomes `Accepted`. An Accepted ADR is immutable.
4. To reverse a decision, write a new ADR that supersedes the old one and set the old one's status to `Superseded by ADR-NNNN`. Never edit an Accepted ADR's decision in place.

## Statuses

`Proposed` -> `Accepted` -> (`Superseded by ADR-NNNN` | `Deprecated`).

## Enforcement

`docs-check` (CI) validates that every ADR has the required front-matter fields and a valid status, and that any ADR referenced by a package or by `.dependency-cruiser.cjs` exists.

## Index

| ID | Title | Status |
|---|---|---|
| [0001](0001-language-and-runtime.md) | Implementation language and runtime | Accepted |
| [0002](0002-framework-posture.md) | Framework posture: custom framework-neutral core | Accepted |
| [0003](0003-monorepo-and-tooling.md) | Monorepo, package manager, and build tooling | Accepted |
| [0004](0004-test-framework.md) | Test framework | Accepted |
| [0005](0005-dependency-injection.md) | Custom dependency-injection container | Accepted |
| [0006](0006-result-error-handling.md) | Result pattern for domain error handling | Accepted |
| [0007](0007-design-first-cadence.md) | Design-first delivery cadence | Accepted |
| [0008](0008-kernel-combinator-exports.md) | Kernel combinator export strategy | Accepted |
| [0009](0009-declaration-build-under-composite.md) | Declaration bundling under TypeScript project references | Accepted |
