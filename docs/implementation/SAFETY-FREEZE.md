# Safety Namespace, Freeze Declaration

**Status:** FROZEN (all ten safety concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-safety` (`packages/namespaces/safety`).
**Scope:** the Safety namespace Pure Domain Model, the fifth namespace of Phase 2B, built on top of the
immutable Phase 2A substrate, the frozen Governance, Providers, Memory, and Retrieval namespaces, and the
frozen `ai/` and `knowledge/` constitution.

The Safety namespace is **immutable**. It states the protective architecture of the AI layer and owns none
of the rules, truth, execution, or behavior it protects; it never executes, reasons, retrieves, composes,
or persists, and never defines a mechanism, a framework, a provider, a model, or code. It applies the
rules owned by `ai/governance/` and references the truth owned by the knowledge repository, and owns
neither.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/safety/<file>.md` document. Each
models the two normative sections of the Safety Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed taxonomy, that classification.

| Module | Concern | Specification classification |
|---|---|---|
| `namespace.ts` | namespace-wide | `SAFETY_INVARIANTS` (8), `SAFETY_CONCERNS` (10) |
| `safety-principles.ts` | Safety Principles | `SAFETY_PRINCIPLES` (11 principles) |
| `risk-classification.ts` | Risk Classification | none (risk levels ordered but unnamed - see below) |
| `hazard-identification.ts` | Hazard Identification | `HAZARD_CATEGORIES` (8) |
| `boundary-enforcement.ts` | Boundary Enforcement | none (process facets) |
| `refusal-model.ts` | Refusal Model | `REFUSAL_CATEGORIES` (3) |
| `escalation-model.ts` | Escalation Model | none (process facets) |
| `impact-assessment.ts` | Impact Assessment | `IMPACT_DIMENSIONS` (8) |
| `uncertainty-management.ts` | Uncertainty Management | none (process facets) |
| `safe-degradation.ts` | Safe Degradation | none (process facets) |
| `safety-versioning.ts` | Safety Versioning | none (process facets) |

The ten concerns match the ten concerns in the inventory `ai/safety/safety.md` exactly.

## Category and purity

ADR-0024 does not enumerate Safety among its examples; per ADR-0024 §42 its category is declared here (no
new ADR). Safety owns protective rules and classifications (Governance-like) and adapts no external
system, so it is declared **category 1 (Pure Domain Model)**, the same shape as Governance, realized per
ADR-0020 as an immutable, stateless domain model with no IO. See `docs/implementation/14-safety.md` §2.

## The risk-levels non-invention (recorded for the freeze)

`risk-classification.md` declares risk is "classified into an ordered set of levels, from the lowest risk
to the highest" that "apply, and align with, the governed risk categories owned by
`ai/governance/risk-management.md`, and never redefine them", but does not enumerate the level names.
Naming them would invent a classification; reusing governance's `TrustLevel` would recreate a model owned
elsewhere (referenced-model non-restatement). So no `RiskLevel` enum or ordering predicate is created; the
ordered-levels rule is stated as prose in the risk-classification principles and invariants. Consequently
Safety exposes **no executable predicate and has no benchmark** (the `bench` script passes with no
benchmark files). This mirrors governance Stage 2 (deferred autonomy->trust mapping) and Stage 6
(referenced, not recreated, the authority ordering).

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **25 exported types** and **50
  exported runtime values** (50 frozen catalogs and description records + 0 predicates).
- There is no executable logic: Safety is immutable definitions and three unordered classifications
  (hazard categories, refusal categories, impact dimensions). The constitution defines no named ordered
  classification for safety, so no predicate is grounded.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). Every exported catalog is
  `Object.freeze`d. The namespace imports nothing: its dependency edges are `[]` (it references the
  constitution, the Governance mandates, and the knowledge repository but uses no governance-owned type
  and imports no package; ADR-0021).
- 100% coverage on all modules; full validation green end to end; two independent audits CLEAN.

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, public API, ownership, and
constitutional traceability are settled. Every runtime evaluation the concerns imply (identifying,
classifying, assessing, enforcing, refusing, escalating, or degrading over a concrete action) is deferred
to the runtime and the operational namespaces, which consume this model and do not modify it. Governance
rules, knowledge truth, and other namespaces' boundaries are referenced, never recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen safety file without an architecture change process, each still
running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**,
**dependency updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a
description that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, principle, or invariant; the introduction of a predicate or the enumeration of the risk
levels; the reproduction of a referenced model owned by another owner; a change of purity category
(ADR-0024); the dependency graph; or the constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional
guard). This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The next namespaces (Reasoning, Prompts, Tools, Agents), the Runtime, and the operational layers consume
this model and do not modify it. Tools is built on Safety; the runtime and agents are bounded by it. They
may not modify any frozen safety file except under the allowed-changes policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
