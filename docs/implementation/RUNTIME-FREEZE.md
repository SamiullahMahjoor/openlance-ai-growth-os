# Runtime Namespace, Freeze Declaration

**Status:** FROZEN (all ten execution-model concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-runtime` (`packages/namespaces/runtime`).
**Scope:** the Runtime namespace domain model, the tenth namespace of Phase 2B, built on top of the immutable
Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, Safety, Reasoning, Prompts, Tools,
and Agents namespaces, and the frozen `ai/` and `knowledge/` constitution. Runtime is the first Category 3
(Runtime Service) namespace.

The Runtime namespace is **immutable**. It states the execution model of the AI layer: how an AI task is
initialized, loaded, validated, run, monitored, recovered, and finalized. It defines the execution model and
never carries it out: it enforces the governance mandates in a defined order, orchestrates the loading of
knowledge and the results of the operational namespaces, and owns none of the rules, truth, or behavior it
sequences, and it never defines a provider, model, framework, language, runtime system, protocol, interface,
or code.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/runtime/<file>.md` document. Each models
the two normative sections of the Runtime Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `RUNTIME_INVARIANTS` (8), `RUNTIME_CONCERNS` (10) | none |
| `execution-lifecycle.ts` | Execution Lifecycle | `ExecutionLifecyclePhase` (5, ordered) | `executionPhaseAtOrAfter` |
| `session-lifecycle.ts` | Session Lifecycle | `SessionLifecyclePhase` (3, ordered) | `sessionPhaseAtOrAfter` |
| `execution-states.ts` | Execution States | `ExecutionState` (13) + `EXECUTION_STATE_TRANSITIONS` | `transitionAllowed` |
| `execution-workflow.ts` | Execution Workflow | `ExecutionWorkflowStep` (14, ordered) | `workflowStepAtOrAfter` |
| `context-loading.ts` | Context Loading | `ContextInput` (4) | none |
| `knowledge-resolution.ts` | Knowledge Resolution | none (orchestration facets) | none |
| `validation-pipeline.ts` | Validation Pipeline | `ValidationStage` (3, ordered) | `validationStageAtOrAfter` |
| `execution-boundaries.ts` | Execution Boundaries | `ExecutionBoundary` (5) | none |
| `failure-recovery.ts` | Failure and Recovery | none (failure facets) | none |
| `event-lifecycle.ts` | Event Lifecycle | `RuntimeEvent` (8) | none |

The ten concerns match the ten concerns in the inventory `ai/runtime/runtime.md` exactly.

## Category 3 and the purity reconciliation (recorded for the freeze)

ADR-0024 enumerates Runtime as **category 3 (Runtime Service)**: "coordinates execution, owns lifecycle and
orchestration, consumes other namespaces." That names Runtime's **constitutional role**. The package that
conforms to the frozen, technology-neutral `ai/runtime/` specification is realized per **ADR-0020** as an
immutable, stateless domain model, because ADR-0020's Decision applies to "Every technology-neutral
constitutional namespace" (it names `ai/runtime/README.md` in its Related constitutional references), ADR-0024
§42 says the category constrains the package "in addition to ADR-0020," and `ai/runtime/README.md` states
runtime "defines the execution model; it never carries it out" and "never... code." So Runtime owns the
execution model **as an immutable specification model**; the actual orchestration and execution over a
concrete task are the operational runtime's, built later, outside this constitutional-conformance package.
This is the same reconciliation the category-4 adapters (Providers, Memory, Tools) used. Both independent
audits confirmed the reconciliation sound and the package genuinely IO-free. See
`docs/implementation/19-runtime.md` section 2.

## The five algorithms and the state-machine sourcing (recorded for the freeze)

Each predicate expresses a constitutional relation or ordering over runtime-owned classifications, via a
private rank map (orderings) or the frozen adjacency map (state machine): `transitionAllowed` (execution
states), `executionPhaseAtOrAfter`, `sessionPhaseAtOrAfter`, `workflowStepAtOrAfter`,
`validationStageAtOrAfter`.

**The Recovering-transition sourcing.** `ai/runtime/execution-states.md` "Specification" enumerates every
state's outgoing edges except Recovering's, and defers "the failure handling behind Recovering" to
`ai/runtime/failure-recovery.md`. That document's "Recovery workflow" states the execution "enters the
Recovering state ... and either continues or, if recovery does not succeed, terminates," and "Termination"
states it "is terminated to the Failed state." So `recovering -> {executing (continues), failed (terminates)}`
is constitutionally determined across the two documents, and is required for the execution-states invariant
"Every path through the model reaches Closed" - without these edges Recovering would be a dead-end that
violates the model's own invariant. This cross-document reconstruction is not invention; both audits verified
it faithful. The invariant "Executing is entered only from Ready" is a gating property (Executing has
predecessors Ready, Waiting, Paused, and Recovering) and is represented as its verbatim description, not as a
false in-degree claim. The unordered classifications (`ContextInput`, `ExecutionBoundary`, `RuntimeEvent`)
carry no predicate; `RuntimeEvent` is not a total order because its three terminal events are mutually
exclusive.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **30 exported types** and **66 exported
  runtime values** (61 frozen catalogs and description records + the transition map + 5 predicate functions).
- The only executable logic is the five pure deterministic predicates; there is no IO. Every exported catalog
  is `Object.freeze`d, and the transition map is frozen along with every adjacency list. All descriptions are
  plain string literals.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports nothing:
  its dependency edge is `[]` (it references the constitution, the four permitted namespaces, the other
  operational namespaces, the Knowledge Hierarchy and tiers, and the knowledge repository but uses no foreign
  type and imports no package; ADR-0021, "import only what you use" - it imports none of the four it is
  allowed). `NAMESPACE_DEPS.runtime = ['governance', 'agents', 'reasoning', 'retrieval']` (permitted edges,
  unchanged).
- 100% coverage on all modules; full validation green end to end; two independent audits CLEAN (one correction
  cycle: a documentation claim about ADR-0020's structure was corrected to be accurate, re-audited CLEAN).

## A note on the arch-regression test harness

Implementing Runtime required updating `scripts/arch-regression.mjs`, the architectural-regression test
harness. That script previously used the (then-reserved) `runtime` namespace as a scratch fixture - it wrote a
temporary `packages/namespaces/runtime/src/index.ts` and deleted it, which would clobber Runtime's now-real
barrel. Two scenarios were changed to write scratch barrels only into still-reserved namespaces (evaluation,
operations, evolution) while a legal fixture references the real runtime by import. This changes no
constitution, no frozen namespace, no ADR, and no dependency rule; it adapts a test fixture to a namespace
becoming real, and it does not weaken enforcement (the per-namespace dep-rule mechanism is still exercised via
`namespace-operations` and `namespace-evaluation`, and the legal `operations -> runtime` edge still passes).
Both audits verified the change legitimate and non-weakening. Future namespace implementations
(Evaluation, Operations, Evolution) will require the same kind of fixture rotation.

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the state-transition relation,
the four orderings, public API, ownership, and constitutional traceability are settled. Every runtime
evaluation the concerns imply (initializing, loading, validating, running, monitoring, recovering, finalizing,
or moving a concrete execution between states) is deferred to the operational runtime, which consumes this
model and does not modify it. Governance rules, the Knowledge Hierarchy, business truth, and the operational
namespaces' behavior are referenced, never recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen runtime file without an architecture change process, each still
running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**, **dependency
updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a description,
ordering, or transition edge that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, principle, invariant, ordering, or transition edge; the introduction of a new predicate; the
reproduction of a referenced model owned by another owner; a change of purity category (ADR-0024); the
dependency graph; or the constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional guard).
This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The Evaluation, Operations, and Evolution namespaces, and the operational layers, consume this model and do
not modify it. The operational runtime orchestrates and executes; Operations builds the application. They may
not modify any frozen runtime file except under the allowed-changes policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
