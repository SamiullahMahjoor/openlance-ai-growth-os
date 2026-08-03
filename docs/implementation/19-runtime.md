# 19. Runtime namespace implementation design

The implementation design for `@openlance/aios-runtime`, the package that conforms to the frozen `ai/runtime/`
constitutional namespace. It follows the namespace development lifecycle (ADR-0023): constitution read in
full, design recorded here, no architecture invented. Like the eight prior Phase 2B namespaces, Runtime was
implemented as one cohesive cycle at explicit request.

## 1. Ownership

Runtime owns the **execution model of the AI layer**: how an AI task is initialized, loaded, validated, run,
monitored, recovered, and finalized (`ai/runtime/README.md`, `ai/runtime/runtime.md`; it is the execution
kernel of the AI Operating System). It defines the execution model and never carries it out. It enforces the
governance mandates in a defined order, orchestrates the loading of knowledge and the results of the
operational namespaces, and owns none of the rules (`ai/governance/`), truth (the knowledge repository), or
behavior (`ai/reasoning/`, `ai/agents/`, `ai/memory/`, `ai/retrieval/`, `ai/prompts/`, `ai/providers/`,
`ai/tools/`) it sequences.

## 2. Category (ADR-0024) and the purity reconciliation

ADR-0024 enumerates Runtime as **category 3 (Runtime Service)**: "coordinates execution, owns lifecycle and
orchestration, consumes other namespaces." This names the runtime's **constitutional role**. The package that
conforms to the frozen `ai/runtime/` specification is nonetheless realized per **ADR-0020** as an immutable,
stateless domain model, because:

- **ADR-0020** is foundational to and cited by ADR-0024, and it names `ai/runtime/README.md` (runtime owns
  execution) in its Related constitutional references. Its Decision fixes how *every* technology-neutral
  constitutional namespace maps to code: "a set of types, frozen data, and pure predicates... no IO," and
  states that a namespace package "must never own: runtime, orchestration, execution... services, or mutable
  state." ADR-0024 §42 says the category
  constrains the package "in addition to ADR-0020," not instead of it.
- The frozen `ai/runtime/` documents are technology-neutral specifications: `ai/runtime/README.md` line 52
  ("It defines the execution model; it never carries it out") and line 70 ("never... code"). Runtime sits at
  the Specification authority level and "defines the technology-neutral execution model every runtime must
  satisfy" (line 46).
- So the conformance package owns the execution model **as an immutable specification model**; the actual
  orchestration and execution over a concrete task are the operational runtime's, built later, outside this
  package. This is the same reconciliation the category-4 adapters (Providers, Memory, Tools) used.

The package is thus **types, frozen data, and five pure deterministic algorithms**, with every runtime
evaluation deferred to the operational runtime. Because the category constrains what a package *contains*, not
whether it must contain IO, category 3 and ADR-0020 coexist without conflict.

## 3. The five algorithms (the category-3 core)

Every executable predicate expresses a constitutional relation or ordering over runtime-owned classifications
(the boundary rule inherited from Governance, `docs/implementation/10-governance.md` section 7a):

- `transitionAllowed(from, to)` - the **execution state-transition relation** (`execution-states.md`,
  "Specification"). The state model is a directed graph over the thirteen states; realized as the frozen
  adjacency map `EXECUTION_STATE_TRANSITIONS` and a pure membership predicate. **Recovering-transition
  sourcing:** `execution-states.md` enumerates every state's outgoing edges except Recovering's, and defers
  "the failure handling behind Recovering" to `failure-recovery.md` (its Boundaries). `failure-recovery.md`
  "Recovery workflow" states the execution "enters the Recovering state ... and either continues or, if
  recovery does not succeed, terminates," and "Termination" states it "is terminated to the Failed state." So
  Recovering transitions to Executing (continues) and Failed (terminates). These edges are constitutionally
  determined across the two documents and are required for the `execution-states.md` invariant "Every path
  through the model reaches Closed" - without them Recovering would be a dead-end that violates the model's own
  invariant. They are not invented. The tests prove reachability of Closed from every state by BFS.
- `executionPhaseAtOrAfter`, `sessionPhaseAtOrAfter`, `workflowStepAtOrAfter`, `validationStageAtOrAfter` - the
  four **orderings** (execution-lifecycle 5 phases; session-lifecycle 3 phases; execution-workflow 14 steps;
  validation-pipeline 3 stages), each a total order the document declares, realized via a private rank map and
  `>=`.

The unordered classifications (`ContextInput`, `ExecutionBoundary`, `RuntimeEvent`) carry no predicate. The
`RuntimeEvent` set is not a total order because its three terminal events are mutually exclusive alternatives.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard).

- `namespace.ts` - `RuntimeInvariant` (8), `RuntimeConcern` (10).
- `execution-lifecycle.ts` - principles (4), `ExecutionLifecyclePhase` (5, ordered), invariants (5),
  `executionPhaseAtOrAfter`.
- `session-lifecycle.ts` - principles (4), `SessionLifecyclePhase` (3, ordered), invariants (5),
  `sessionPhaseAtOrAfter`.
- `execution-states.ts` - principles (4), `ExecutionState` (13), `EXECUTION_STATE_TRANSITIONS`, invariants (5),
  `transitionAllowed`.
- `execution-workflow.ts` - principles (5), `ExecutionWorkflowStep` (14, ordered), invariants (4),
  `workflowStepAtOrAfter`.
- `context-loading.ts` - principles (5), `ContextInput` (4), invariants (4).
- `knowledge-resolution.ts` - principles (5), invariants (5). Definitions only.
- `validation-pipeline.ts` - principles (5), `ValidationStage` (3, ordered), invariants (5),
  `validationStageAtOrAfter`.
- `execution-boundaries.ts` - principles (5), `ExecutionBoundary` (5), invariants (5).
- `failure-recovery.ts` - principles (5), invariants (5). Definitions only.
- `event-lifecycle.ts` - principles (4), `RuntimeEvent` (8), invariants (4).

**Classification vs. definitions-only.** Per the rule in `docs/implementation/13-retrieval.md` section 4, a
Specification becomes a classification only where it enumerates a genuine closed domain set. Modeled:
lifecycle phases, session phases, states + transitions, workflow steps, validation stages,
`ContextInput` (the "four kinds of input" the runtime combines - a clean homogeneous enumeration, unlike
prompt-composition's heterogeneous facets), `ExecutionBoundary`, `RuntimeEvent`. Definitions only:
knowledge-resolution (orchestration facets; the loading order follows the knowledge-owned Hierarchy and tiers,
referenced not recreated) and failure-recovery (seven heterogeneous failure facets).

**Referenced models.** The governance rules (constitutional-validation, permission-governance,
policy-enforcement, escalation, autonomy-boundaries); the Knowledge Hierarchy and loading strategy/tiers
(`knowledge/`); business truth (the knowledge repository); and the operational namespaces' behavior are all
referenced in prose and never recreated as a runtime classification (referenced-model non-restatement rule).

## 5. Dependency usage

`NAMESPACE_DEPS.runtime = ['governance', 'agents', 'reasoning', 'retrieval']` permits those edges. No runtime
concern's model uses a type owned by any of them - all, plus the memory/prompts/providers/tools namespaces and
the knowledge repository, are referenced in prose, never restated or imported (referenced-model
non-restatement; ADR-0021, "import only what you use") - so the package imports nothing and its
dependency-graph edge is `[]`. It uses no substrate package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for the Runtime *package*: **lifecycle** none (the execution and session phases,
states, steps, and events are modeled *data*, not a package lifecycle; the package does not boot, run, or shut
down); **state** none (the model is immutable/frozen; the execution states are a description of the conditions
an execution may hold, carrying no mutable current-state); **errors** none (it performs no execution); **events**
none (the runtime *event lifecycle* is modeled data, not an event bus). These empty sections are the correct
shape of a domain model realized per ADR-0020, not gaps - the actual runtime service owns the live lifecycle,
state, errors, and events.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted against
the constitution (`toEqual`); every description is asserted non-empty; immutability is asserted
(`Object.isFrozen`). The four orderings are proven total and deterministic across their whole matrices
(5x5, 3x3, 14x14, 3x3). The state machine is proven exhaustively: the adjacency map is asserted equal to the
constitution's enumeration; `transitionAllowed` is checked over the full 13x13 matrix against the map; and the
structural invariants (single terminal state Closed; the predecessors of Closed; Ready entered only from
Validating; and reachability of Closed from every state, by BFS) are asserted from the map. Executable code is
at 100% coverage. Benchmarks measure the five predicates only.

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/runtime/` document, and no runtime engine,
  orchestrator, scheduler, or executor is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test
  (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the eight prior frozen namespaces unchanged;
  the dependency graph unchanged (`runtime: []`).
