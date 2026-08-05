# @openlance/aios-reasoning-engine

The AIOS **Reasoning Engine** (Phase 4, Stage 6): the Runtime's operational reasoning subsystem, the operational
realization of the frozen Reasoning namespace. It performs deterministic structural reasoning over provided knowledge
(register **premises**, **frame**, **decompose**, **validate**, produce a governed reasoning plan), per the frozen
`@openlance/aios-reasoning` model, and produces a validated `ReasoningPlan` whose terminal stage is `concluded`,
`inconclusive`, or `escalated`. It **reasons and stops**; it invokes no provider and performs no inference.

- **Layer:** `app` (`apps/*`), the sixth Phase 4 operational service and the fourth **foundational** one.
- **Design:** [docs/implementation/37-reasoning-engine.md](../../docs/implementation/37-reasoning-engine.md).
  **Decision:** [ADR-0040](../../docs/implementation/adr/0040-reasoning-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

The operational realization of the frozen `@openlance/aios-reasoning` model. It **consumes, never recreates**: the
reasoning model (lifecycle phases, workflow steps, the stage state machine, strategies, validation dimensions, and their
predicates). It is **foundational** and depends on **no operational service**.

## No inference, no provider; reasons deterministically and structurally (ADR-0040)

Per the frozen `reasoning-boundaries`, a reasoning is **expressed as prompts and executed by providers**, owned by their
namespaces; the reasoning **mechanism is the runtime's**; and a reasoning **produces a conclusion and stops** (it never
executes, loads, retrieves, or expresses). So the Reasoning Engine performs the deterministic, structural part the model
owns (framing, decomposition, the four validation dimensions, uncertainty classification, and the governed disposition)
and produces a **reasoning plan**. It invokes no LLM, constructs no prompt, and reaches into no Retrieval, Prompt, or
Provider Engine; the actual inference (running the plan through a prompt and a provider) is a later execution stage,
driven by an agent. It holds **no vendor knowledge**. Both boundaries are enforced structurally by `src/`-scanning guard
tests (`no-vendor-knowledge.test.ts` and `no-cross-boundary.test.ts`).

## Governed, grounded, deterministic

The four frozen validation dimensions (assumption identification, grounding, evidence sufficiency, governed validation)
run in order, conjunctive and fail-closed. A reasoning rests only on registered premises and stated assumptions (never
an invented fact); where the evidence is insufficient it yields a governed `inconclusive` outcome with a classified
uncertainty, and where the governance verdict is denied it `escalates`, never an invented conclusion
("no conclusion is preferable to an unsound one"). The same task, premises, and rules always produce the same plan.

## Public API (single barrel, Engineering Rule 1)

- `ReasoningManager` (and `reasoningEngineModule`, `REASONING_MANAGER`): the engine facade and its DI module, registered
  through the frozen composition root's extension seam (ADR-0026).
- `ReasoningRegistry`, `ReasoningFactory`, `ReasoningLifecycle`, `ReasoningNormalizer`, `ReasoningDecomposer`,
  `ReasoningValidator`, `ReasoningPlanner`, `ReasoningMetrics`, `ReasoningEvents`, `ReasoningConfiguration`,
  `ReasoningPluginBridge`: the operational components.
- `Premise`, `ReasoningRequest`, `ReasoningPlan`, `ReasoningStatistics`, `ReasoningDiagnostics`, `ReasoningEngineSettings`,
  `ReasoningPlugin`, `ReasoningId`: the read-only types.
- `ReasoningError`: a `BaseError` subtype (`infrastructure`) with `REASONING.*` codes; failures ride the `Result`
  channel.

## Dependency direction

`@openlance/aios-reasoning-engine -> { @openlance/aios-reasoning, @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges, recorded in
`dependency-graph.snapshot.json`). `app -> namespace` (reasoning) and `app -> substrate` (the rest); **no** `app -> app`
edge (foundational). All legal, no rule and no namespace edge changes. The composition root, config, and logging are
test-only devDependencies.

## Non-responsibilities

No inference, provider invocation, prompt / tool / retrieval / memory execution, agent orchestration, knowledge
retrieval or loading, expression, governance-rule definition or clearance minting, scheduling, persistence, runtime
execution, or vendor client library. It reasons deterministically and structurally over provided knowledge, produces a
governed reasoning plan, and nothing else.
