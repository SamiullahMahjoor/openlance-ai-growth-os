# 15. Reasoning namespace implementation design

The implementation design for `@openlance/aios-reasoning`, the package that conforms to the frozen
`ai/reasoning/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Like Providers, Memory,
Retrieval, and Safety, Reasoning was implemented as one cohesive cycle at explicit request; the design and
discipline are identical.

## 1. Ownership

Reasoning owns the **cognitive model of the AI layer**: how retrieved knowledge is transformed, under the
governing rules, into governed conclusions (`ai/reasoning/README.md`, `ai/reasoning/reasoning.md`;
ownership-map.md assigns Reasoning "Cognition. Transforming knowledge into governed conclusions"). It owns
the model of reasoning only: the lifecycle, the ordered workflow, the state model, the architectural
categories, validation, consistency, uncertainty classification, conclusion formation, quality, and
boundaries. It never executes reasoning, never determines the knowledge it reasons over (`ai/retrieval/`
and the knowledge repository), never defines the governing rules (`ai/governance/`), never expresses a
conclusion as a prompt (the Prompts namespace), and never becomes an algorithm, a chain of thought, a
provider, a model, or code.

## 2. Category (ADR-0024) and the purity reconciliation

ADR-0024 **enumerates Reasoning explicitly as category 2, Pure Algorithms**, so no §42 design-time
declaration is needed (unlike Retrieval and Safety, whose categories this project declared per §42).
Category 2 is the correct and expected classification: Reasoning's constitution owns genuine deterministic
algorithms, not only classifications. The reconciliation with ADR-0020 is the standard one:

- **ADR-0020** (foundational to, and cited by, ADR-0024) fixes how *every* technology-neutral
  constitutional namespace is realized in code: an "immutable, stateless domain model... a set of types,
  frozen data, and pure predicates... no IO," and adds "the category a namespace belongs to is fixed by
  ADR-0024." The two coexist by design: a category-2 namespace's algorithms are pure predicates over
  namespace-owned data, with no IO and no state.
- The constitution independently forbids Reasoning from being or containing an algorithm, a chain of
  thought, a hidden reasoning process, a method, or code (`ai/reasoning/README.md`;
  `reasoning-boundaries.md` Implementation boundary), and is supreme over any ADR. This is not a
  contradiction: the algorithms Reasoning owns are the constitution's own **relations and orderings** -
  the stage-transition relation and the lifecycle/workflow orderings - not a reasoning engine or a chain
  of thought. Reasoning owns the cognitive model **as an immutable specification model**; the reasoning
  execution over a concrete task is the runtime's.

The package is thus **types, frozen data, and three pure deterministic algorithms**, with every runtime
evaluation deferred to the runtime.

## 3. The three algorithms (the category-2 core)

Every executable predicate expresses a constitutional relation or ordering verbatim, over inputs and
outputs that are entirely reasoning-owned (the boundary rule inherited from Governance,
`docs/implementation/10-governance.md` section 7a):

- `transitionAllowed(from, to)` - the **reasoning state-transition relation**
  (`ai/reasoning/reasoning-stages.md`, "Specification"). The state model is a directed graph over the ten
  named stages; the permitted transitions are the edges the constitution enumerates verbatim. Realized as
  the immutable adjacency map `REASONING_STAGE_TRANSITIONS` and a pure total membership predicate over it.
  This is the namespace's genuine algorithm; the map encodes every structural invariant the document
  states (Complete is the sole terminal stage; Concluded/Inconclusive/Escalated are the only predecessors
  of Complete; Concluded is entered only from Validating, which is entered only from Concluding), and the
  tests assert each from the map.
- `reasoningPhaseAtOrAfter(a, b)` - the **lifecycle-phase ordering** (`reasoning-lifecycle.md`): the four
  phases framing < transformation < conclusion < validation form a total order; the predicate exposes it
  via a private rank map and `>=`.
- `reasoningStepAtOrAfter(a, b)` - the **workflow-step ordering** (`reasoning-workflow.md`): the nine steps
  from receive-request to produce-outcome form a total order; same realization.

The unordered classifications (`ReasoningStrategy`, `ReasoningValidationDimension`, `UncertaintyKind`,
`ReasoningQualityProperty`, `ReasoningBoundary`) carry no predicate.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Reasoning Document
Standard - **Principles** and **Invariants** - and, where the **Specification** enumerates a genuine closed
domain set, that classification.

- `namespace.ts` - `ReasoningInvariant` (8), `ReasoningConcern` (10).
- `reasoning-lifecycle.ts` - principles (4), `ReasoningLifecyclePhase` (4, ordered), invariants (4),
  predicate `reasoningPhaseAtOrAfter`.
- `reasoning-workflow.ts` - principles (5), `ReasoningWorkflowStep` (9, ordered), invariants (4), predicate
  `reasoningStepAtOrAfter`.
- `reasoning-stages.ts` - principles (4), `ReasoningStage` (10), `REASONING_STAGE_TRANSITIONS`, invariants
  (5), predicate `transitionAllowed`.
- `reasoning-strategies.ts` - principles (4), `ReasoningStrategy` (4), invariants (4).
- `reasoning-validation.ts` - principles (4), `ReasoningValidationDimension` (4), invariants (5).
- `reasoning-consistency.ts` - principles (4), invariants (4). Definitions only.
- `uncertainty-handling.ts` - principles (4), `UncertaintyKind` (5), invariants (5).
- `conclusion-formation.ts` - principles (4), invariants (5). Definitions only.
- `reasoning-quality.ts` - principles (4), `ReasoningQualityProperty` (2), invariants (4).
- `reasoning-boundaries.ts` - principles (4), `ReasoningBoundary` (5), invariants (5).

**Classification vs. definitions-only.** The modeling rule is the one recorded in
`docs/implementation/13-retrieval.md` section 4: a Specification section becomes a classification only
where it "enumerates a genuine closed domain set" - a taxonomy of named member-kinds the model refers to
by identity, or a conjunctive checklist of homogeneous named checks restated in the invariants. Applying
it here: lifecycle phases, workflow steps, stages, strategies (architectural categories), uncertainty
kinds, quality properties, and boundaries are all such sets. Reasoning **validation** is the direct analog
of retrieval-validation - four conjunctive dimensions a reasoning is validated against, each restated 1:1
in the invariants - so it is modeled as `ReasoningValidationDimension`, exactly as `RetrievalValidationDimension`.
Reasoning **consistency** ("kept internally consistent in the following ways": contradiction detection,
resolution or non-conclusion, no conflicting conclusions, coherence with the basis) narrates heterogeneous
process facets - an activity, a procedure branch, an outcome guarantee, a property - not a homogeneous
taxonomy, so it is definitions only, like the retrieval process concerns. **Conclusion formation** ("forms
a governed conclusion in the following way", singular) narrates a single procedure, not a taxonomy, so it
too is definitions only. This asymmetry is deliberate and follows the established rule, not convenience.

**Referenced models.** The governing rules, escalation, decision-making, permission, risk (`ai/governance/`);
the retrieved knowledge and the retrieval model (`ai/retrieval/`); business truth and the authority that
resolves an authority uncertainty (the knowledge repository); and the expression of a conclusion (the
Prompts namespace) are all referenced in prose and never recreated as a reasoning classification
(referenced-model non-restatement rule, `docs/implementation/10-governance.md` section 7a). The stage model
references the workflow order that drives transitions; it records the reference and models only the
transition relation it owns.

## 5. Dependency usage

`NAMESPACE_DEPS.reasoning = ['governance', 'retrieval']` permits edges to Governance and Retrieval. No
reasoning concern's model uses a governance-owned or retrieval-owned type - both, and the knowledge
repository, are referenced in prose, never restated or imported (referenced-model non-restatement;
ADR-0021) - so the package imports nothing and its dependency-graph edge is `[]`. It uses no substrate
package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Reasoning: **lifecycle** none (the four lifecycle phases, nine workflow
steps, and ten stages are modeled *data*, not a package lifecycle; the package does not boot, run, or shut
down); **state** none (the model is immutable/frozen; the state model is a description of the states a
reasoning may hold, carrying no mutable current-state); **errors** none (it performs no execution);
**events** none. These empty sections are the correct shape of a category-2 domain model, not gaps.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted
against the constitution (`toEqual` on the full array); every description is asserted non-empty;
immutability is asserted (`Object.isFrozen`). The two ordering predicates are proven total and
deterministic across their whole matrices (`reasoningPhaseAtOrAfter` 4x4, `reasoningStepAtOrAfter` 9x9,
each against the declared order) plus explicit true/false cases. The state machine is proven exhaustively:
the adjacency map is asserted equal to the constitution's enumeration; `transitionAllowed` is checked over
the full 10x10 stage matrix against the map; and the structural invariants (single terminal stage, the
predecessors of Complete, Concluded-only-via-Validating-via-Concluding, no exit from Complete) are asserted
from the map. Executable code is at 100% coverage; there is no pure-data-only module to exclude. Benchmarks
measure the three predicates only (Rule 5). No integration tests yet (no downstream consumer exists).

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/reasoning/` document, and no reasoning engine,
  chain of thought, prompt builder, or runtime evaluator is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check,
  test (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance, Providers, Memory,
  Retrieval, and Safety namespaces unchanged; the dependency graph unchanged (`reasoning: []`).
