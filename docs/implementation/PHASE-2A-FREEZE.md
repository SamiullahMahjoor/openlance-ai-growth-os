# Phase 2A, Freeze Declaration

**Status:** FROZEN (Release Candidate accepted after H1 remediation, ADR-0019).
**Scope:** the Phase 2A substrate: the 8 runtime packages, the 13 reserved namespace packages, the 3 tooling packages, the constitutional governance (ENGINEERING-RULES, DEFINITION-OF-DONE, the ADR corpus), the dependency enforcement, the scaffold generator, CI, documentation, and testing infrastructure.

Phase 2A is **immutable**. It is the permanent foundation on which the AI Runtime (Phase 2B) and the 13 AI namespaces are built, and it has passed full validation with the constitutional dependency graph now hard-enforced against production import syntax (ADR-0019, verified by the architectural regression suite).

## What "frozen" means

The substrate's architecture, package boundaries, public APIs, ownership, dependency graph, engineering rules, and Definition of Done are settled. Runtime work (Phase 2B) builds **on top of** the substrate and does not modify it.

## Allowed changes (no architecture review required)

Only these categories may change a frozen Phase 2A file without an architecture change process:

- **Compiler compatibility** (for example, adjusting to a new TypeScript or Node version).
- **Security vulnerabilities** (patching a flaw in the substrate or a dependency).
- **Dependency updates** (routine version maintenance that changes no behavior or contract).
- **Critical bug fixes** (correcting a defect in the substrate's existing behavior).

Each such change still runs the full validation pipeline (below) and, where it touches an existing decision, is recorded.

## Any architectural modification requires all of

- a **new ADR** (Rule 3; an Accepted ADR is never edited in place, it is superseded),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a package boundary, a public API or export, the dependency graph or its enforcement, an engineering rule, the Definition of Done, package ownership, stability classification, or the constitutional traceability. Adding a new architectural rule additionally requires production-syntax regression scenarios (the Constitutional Rule, ENGINEERING-RULES.md).

## Constitutional layers remain immutable

`ai/` and `knowledge/` were immutable before this freeze and remain so; no implementation change may modify them (CI constitutional guard, DoD criterion 1).

## No Runtime work may modify Phase 2A

Phase 2B (Runtime) and every namespace implementation are additive. They may not modify any frozen Phase 2A file except under the allowed-changes policy above with full validation. The reserved namespace packages gain source in their own phases; their inter-namespace edges are already enforced by Rule 2 against production imports with no substrate change required.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
