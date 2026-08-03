# Reasoning Namespace, Freeze Declaration

**Status:** FROZEN (all ten reasoning concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-reasoning` (`packages/namespaces/reasoning`).
**Scope:** the Reasoning namespace domain model, the sixth namespace of Phase 2B, built on top of the
immutable Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, and Safety namespaces,
and the frozen `ai/` and `knowledge/` constitution.

The Reasoning namespace is **immutable**. It states the cognitive model of the AI layer: how retrieved
knowledge is transformed, under governing rules, into governed conclusions. It owns none of the truth,
rules, retrieval, execution, or expression around it; it never executes reasoning, never determines the
knowledge it reasons over, never expresses itself as a prompt, and never becomes an algorithm, a chain of
thought, a hidden reasoning process, a provider, a model, a protocol, or code. It consumes retrieved
knowledge and governing rules and owns neither.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/reasoning/<file>.md` document. Each
models the two normative sections of the Reasoning Document Standard (Principles, Invariants) and, where
the Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `REASONING_INVARIANTS` (8), `REASONING_CONCERNS` (10) | none |
| `reasoning-lifecycle.ts` | Reasoning Lifecycle | `ReasoningLifecyclePhase` (4, ordered) | `reasoningPhaseAtOrAfter` |
| `reasoning-workflow.ts` | Reasoning Workflow | `ReasoningWorkflowStep` (9, ordered) | `reasoningStepAtOrAfter` |
| `reasoning-stages.ts` | Reasoning Stages | `ReasoningStage` (10) + `REASONING_STAGE_TRANSITIONS` | `transitionAllowed` |
| `reasoning-strategies.ts` | Reasoning Strategies | `ReasoningStrategy` (4) | none |
| `reasoning-validation.ts` | Reasoning Validation | `ReasoningValidationDimension` (4) | none |
| `reasoning-consistency.ts` | Reasoning Consistency | none (process facets) | none |
| `uncertainty-handling.ts` | Uncertainty Handling | `UncertaintyKind` (5) | none |
| `conclusion-formation.ts` | Conclusion Formation | none (a single procedure) | none |
| `reasoning-quality.ts` | Reasoning Quality | `ReasoningQualityProperty` (2) | none |
| `reasoning-boundaries.ts` | Reasoning Boundaries | `ReasoningBoundary` (5) | none |

The ten concerns match the ten concerns in the inventory `ai/reasoning/reasoning.md` exactly.

## Category and purity

ADR-0024 **enumerates Reasoning explicitly as category 2 (Pure Algorithms)**, so no §42 design-time
declaration is needed. Category 2 is realized per ADR-0020 as an immutable, stateless domain model with no
IO: Reasoning's algorithms are the constitution's own relations and orderings (the stage-transition
relation and the two orderings), not a reasoning engine or a chain of thought. See
`docs/implementation/15-reasoning.md` sections 2 and 3.

## The three algorithms (the category-2 core)

Every executable predicate expresses a constitutional relation or ordering verbatim, over inputs and
outputs that are entirely reasoning-owned:

- `transitionAllowed(from, to)` - the reasoning **state-transition relation**
  (`ai/reasoning/reasoning-stages.md`, "Specification"). The permitted transitions are the edges the
  constitution enumerates verbatim, realized as the frozen adjacency map `REASONING_STAGE_TRANSITIONS` and
  a pure total membership predicate. The map encodes every structural invariant the document states
  (Complete the sole terminal stage; Concluded/Inconclusive/Escalated the only predecessors of Complete;
  Concluded entered only from Validating, which is entered only from Concluding), each asserted in tests.
- `reasoningPhaseAtOrAfter(a, b)` - the lifecycle-phase ordering (framing < transformation < conclusion <
  validation), via a private rank map and `>=`.
- `reasoningStepAtOrAfter(a, b)` - the workflow-step ordering (the nine steps in order), same realization.

The unordered classifications (`ReasoningStrategy`, `ReasoningValidationDimension`, `UncertaintyKind`,
`ReasoningQualityProperty`, `ReasoningBoundary`) carry no predicate.

## The classification vs. definitions-only decision (recorded for the freeze)

The modeling rule is the one recorded in `docs/implementation/13-retrieval.md` section 4: a Specification
becomes a classification only where it enumerates a genuine closed domain set (a taxonomy of named
member-kinds, or a conjunctive homogeneous checklist restated in the invariants). Reasoning **validation**
is the direct analog of retrieval-validation (four conjunctive dimensions, each restated 1:1 in the
invariants), so it is modeled as `ReasoningValidationDimension`. Reasoning **consistency** narrates
heterogeneous process facets, and **conclusion formation** narrates a single procedure ("in the following
way"), so neither is modeled as a classification. This asymmetry follows the established rule, not
convenience, and both independent audits confirmed it defensible.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **30 exported types** and **64
  exported runtime values** (61 frozen catalogs, description records, and the transition map + 3 predicate
  functions).
- The only executable logic is the three pure deterministic predicates; there is no IO. Every exported
  catalog is `Object.freeze`d, and the transition map is frozen along with every adjacency list.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports
  nothing: its dependency edge is `[]` (it references the constitution, the Governance mandates, the
  Retrieval model, and the knowledge repository but uses no governance-owned or retrieval-owned type and
  imports no package; ADR-0021). `NAMESPACE_DEPS.reasoning = ['governance', 'retrieval']` (permitted
  edges, unchanged).
- 100% coverage on all modules; full validation green end to end; two independent audits CLEAN (one
  correction cycle applied: the lifecycle and workflow principle/invariant catalogs were corrected to trace
  1:1 verbatim to their documents, including each document's inert invariant and the workflow determinism
  invariant, and re-audited CLEAN).

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the state-transition
relation, the two orderings, public API, ownership, and constitutional traceability are settled. Every
runtime evaluation the concerns imply (framing, decomposing, analyzing, synthesizing, classifying
uncertainty, forming and validating a conclusion, or moving a concrete reasoning between stages) is
deferred to the runtime and the operational namespaces, which consume this model and do not modify it.
Governance rules, retrieval determination, knowledge truth, and other namespaces' boundaries are
referenced, never recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen reasoning file without an architecture change process, each still
running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**, **dependency
updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a description or
transition edge that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, principle, invariant, ordering, or transition edge; the introduction of a new predicate;
the reproduction of a referenced model owned by another owner; a change of purity category (ADR-0024); the
dependency graph; or the constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional
guard). This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The next namespaces (Prompts, Tools, Agents), the Runtime, and the operational layers consume this model
and do not modify it. They may not modify any frozen reasoning file except under the allowed-changes policy
above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
