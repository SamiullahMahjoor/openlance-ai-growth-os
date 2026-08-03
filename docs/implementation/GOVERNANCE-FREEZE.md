# Governance Namespace, Freeze Declaration

**Status:** FROZEN (all nine governance concerns implemented, validated, and independently audited).
**Package:** `@openlance/aios-governance` (`packages/namespaces/governance`).
**Scope:** the Governance namespace Pure Domain Model, the first namespace of Phase 2B, built one
constitutional concern per stage on top of the immutable Phase 2A substrate and the frozen `ai/` and
`knowledge/` constitution.

The Governance namespace is **immutable**. It is the truth layer every operational namespace and the
runtime consume; it states the rules and never enforces, checks, scores, validates, or executes them.

## What was built (the nine concerns)

Each concern is one source module, tracing verbatim to its frozen `ai/governance/<file>.md` document.

| # | Concern | Module | Shape |
|---|---------|--------|-------|
| 1 | Risk and Trust | `src/risk.ts` | Pure Domain Model with predicates |
| 2 | Autonomy Boundaries | `src/autonomy.ts` | Pure Domain Model with predicates |
| 3 | Permission Governance | `src/permission.ts` | Definitions only |
| 4 | Constitutional Validation | `src/validation.ts` | Definitions only |
| 5 | Escalation | `src/escalation.ts` | Definitions only |
| 6 | Policy Enforcement | `src/policy-enforcement.ts` | Definitions only |
| 7 | Human Oversight | `src/human-oversight.ts` | Definitions only |
| 8 | Decision-Making | `src/decision-making.ts` | Definitions only |
| 9 | Change Governance | `src/change-governance.ts` | Definitions only |

The nine match the nine concerns in the governance inventory `ai/governance/governance.md` exactly.

## Final surface and purity

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: 19 exported types and 39 exported
  runtime values (33 frozen catalogs + 6 predicates).
- The only executable logic is Risk's and Autonomy's six pure, total, deterministic predicates
  (`requiredOversight`, `requiresHumanApproval`, `trustAtLeast`, `higherTrust`, `autonomyAtLeast`,
  `higherAutonomy`). The other seven concerns are definitions only.
- No runtime, no mutable state, no lifecycle, no events, no IO, no DI, no services (ADR-0020,
  ADR-0024 category 1). Every exported catalog is `Object.freeze`-d. The namespace imports nothing:
  its dependency edges are `[]` (it depends only on the constitution).
- 100% coverage on all executable code; full validation green end to end.

## What "frozen" means

The namespace's concerns, identities, classifications, orderings, public API, ownership, and
constitutional traceability are settled. The two permanent implementation rules that governed the
build (the boundary rule and the referenced-model non-restatement rule, `docs/implementation/10-governance.md`
section 7a) are settled. Every runtime evaluation the concerns imply (`Authority`, `ValidationResult`,
the escalation evaluation, the policy-conflict evaluation, the human-approval workflow, the decision
evaluation, and the change-approval workflow) is deferred to the runtime and the operational
namespaces, which consume this model and do not modify it.

## Allowed changes (no architecture review required)

Only these categories may change a frozen governance file without an architecture change process,
each still running the full validation pipeline: **compiler compatibility**, **security
vulnerabilities**, **dependency updates**, and **critical bug fixes** (a genuine defect in existing
behavior, for example a description that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, ordering, or description; the introduction of a predicate or the reproduction of a
referenced model owned by another constitutional owner; the dependency graph; or the constitutional
traceability. Adding a governance predicate additionally requires that every input and output type be
governance-owned and that the logic express constitutional truth verbatim (the boundary rule).

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional
guard). This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The next namespaces (Providers, Memory, Retrieval, Safety, Reasoning, Prompts, Tools, Agents), the
Runtime, and the operational layers consume this model and do not modify it. They may not modify any
frozen governance file except under the allowed-changes policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
