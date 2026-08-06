---
id: ADR-0056
title: Automation Intelligence is a deterministic domain subsystem that owns the automation-planning behavior only; it consumes the frozen Growth Workflows output by reference and frames governed automation opportunities as a task (an AgentRequest and an automation-quality EvaluationRequest), and it never executes, schedules, or orchestrates automation, never bypasses GovernanceClearance, never duplicates Runtime Execution, owns no business truth, and builds no new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0056: Automation Intelligence is a deterministic domain subsystem that owns the automation-planning behavior only; it consumes the frozen Growth Workflows output by reference and frames governed automation opportunities as a task (an AgentRequest and an automation-quality EvaluationRequest), and it never executes, schedules, or orchestrates automation, never bypasses GovernanceClearance, never duplicates Runtime Execution, owns no business truth, and builds no new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 8). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen`, `platform-complete`, and `phase5-stage1-frozen` … `phase5-stage7-frozen` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure. It is the final Phase 5 behavior subsystem.

## Context

Stage 8 is the Automation Intelligence subsystem. It is the `Growth Workflows -> Automation` step of the ratified linear chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows -> Automation**. The same frozen boundaries fix its shape:

- **The AI layer never owns business truth.** There is no `ai/automation/` or `knowledge/automation/` namespace. Automation Intelligence consumes the frozen Growth Workflows output by reference and knowledge by canonical reference; it owns none of it. (Automation is not a constitutional concept: `ai/` assigns orchestration, scheduling, the event model, and the task lifecycle to `ai/runtime/`, and the knowledge repository defers automation, background jobs, and queues to the codebase rather than the knowledge repository.)
- **An automation opportunity is a plan, not an execution.** The subsystem owns automation-opportunity behavior: capability catalogue, framing, dependency mapping, validation, and statistics. It never owns an orchestration engine, execution, scheduling, or a runtime. Preparing a governed automation opportunity is a declarative framing; running it is the platform's job (`runtime-execution-engine` realizing `ai/runtime/`), behind the deferred governance clearance minter (private to `provider-engine`). The subsystem never mints, forges, re-exports, or bypasses a `GovernanceClearance`, and never produces or consumes a Runtime Execution `ExecutionRequest` / `ExecutionRecord`.
- **Automation capabilities are a distinct namespace.** The eleven automation capabilities are not planner capabilities and never collide with the sixty-eight planner capabilities or the fifteen Growth Workflows types.

## Decision

1. **Automation Intelligence (`@openlance/aios-automation-intelligence`, Phase 5 Stage 8) is a deterministic domain subsystem that owns the automation-planning behavior only.** It is an `apps/*` package that owns a closed set of eleven automation capabilities, each a governed-automation-opportunity planning behavior the AI frames by consuming a completed growth workflow and knowledge. It owns none of the Growth Workflows behavior, planner behaviors, or the business truth it works from; it references them and never restates or redefines them, and it owns no execution, scheduling, orchestration, governance, runtime, or evaluation mechanism.

2. **It consumes the Growth Workflows output, by reference, through its immediate predecessor.** An automation request carries the `capability` to frame, an `objective`, an `agent`, a reference to the `workflow` (a `GrowthWorkflow` id), and any additional canonical `knowledge/...` document references. A helper builds an automation request from a `GrowthWorkflow` (consuming the workflow output through its public contract, type-only, by referencing its id). This is the `Growth Workflows -> Automation` chain step: Automation depends only on its immediate predecessor and reaches the earlier plans transitively through the growth workflow (which itself carries the six planner references). It introduces no fan-in edge.

3. **It frames a governed automation opportunity as a task; it does not execute.** For an automation request it produces an immutable `AutomationPlan` recording the capability, objective, agent, the `workflow` it consumes by reference, any knowledge references, a plain-language deliverable, and the frozen Agent Engine `AgentRequest` (an automation agent, a task, and a generation step pipeline: a `prompt` step grounded in the workflow reference and knowledge, and a `provider` step for a provider-neutral `text-generation` need). It builds no `AgentExecutionPlan` and no execution; it never executes, schedules, or orchestrates automation, drives a runtime, invokes a provider, selects a model, mints or bypasses a governance clearance, or decides. When the platform later acts on the opportunity, the framed `AgentRequest` runs through the certified governed runtime unchanged.

4. **It owns automation-quality evaluation as a framing.** It produces an automation-quality `EvaluationRequest` (subject = the automation output, plus caller-supplied metric measurements) for the frozen Evaluation Engine to assess; it defines no evaluation model and computes no score.

5. **It owns the automation agent role** as a frozen-seam `AgentDefinitionInput` (specialization `automation-intelligence`, capabilities `prompt` and `provider`), and it is deterministic, fail-closed, builds no new infrastructure, holds no vendor knowledge, and registers through the composition-root seam.

## Rationale

The decision keeps Automation Intelligence a thin behavior-owning framer that prepares governed automation opportunities from the certified growth workflows by reference, honoring the "each subsystem owns its behavior, no overlap, no subsystem owns business truth" split and the ratified linear chain. Preparing an automation opportunity is declarative (a capability + a framed `AgentRequest`), never runtime orchestration or scheduling. Alternatives rejected: owning an orchestration engine, execution, scheduling, retries, timeouts, cancellation, checkpointing, or a runtime (that is `runtime-execution-engine` realizing `ai/runtime/`, and it requires the deferred clearance minter and platform runtime); minting, forging, re-exporting, or bypassing a `GovernanceClearance`, or producing a governance/safety decision or a Runtime `ExecutionRequest`/`ExecutionRecord` (that gate and envelope belong to the frozen `provider-engine`, `governance-engine`, and `runtime-execution-engine`); owning schedule, trigger, cron, or job primitives (all `ai/runtime/`); observing and supervising runtime outputs (that is `operations-engine`); owning any Growth Workflows, planner, or business truth (violates the subsystem split and the knowledge boundary); direct fan-in edges to the planners or Growth Workflows internals (the chain is linear, so Automation reaches the earlier plans transitively through the growth workflow); a new orchestrator or evaluation model (duplicates the Agent and Evaluation engines). It builds on the certified platform and adds no infrastructure.

## Consequences

- Automation Intelligence integrates with Growth Workflows through Growth Workflows' public output contract (by reference), not through a new orchestrator; the edge is acyclic (Growth Workflows does not depend on Automation), and the earlier plans are reached transitively.
- **The linear chain `Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows -> Automation` is the ratified constitutional architecture.** No fan-in edges may be introduced: Automation consumes Growth Workflows (which already carries the earlier context) and never imports another planner or the Growth Workflows internals at runtime; every app-to-app import stays type-only, barrel-only, and acyclic. Permanent pipeline-ownership and runtime-dependency-boundary guard tests enforce this chain; introducing a fan-in edge requires a superseding ADR.
- The subsystem takes no dependency on `runtime-execution-engine`, `governance-engine`, `provider-engine`, `operations-engine`, or `safety-engine`; permanent no-execution, no-orchestration, and runtime-dependency-boundary guards prove it neither duplicates Runtime Execution nor bypasses GovernanceClearance.
- When the governance clearance production path exists, the framed automation `AgentRequest` runs through the platform unchanged.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns business truth), `ai/architecture/ownership-map.md` and `ai/runtime/README.md` (orchestration, scheduling, the event model, and the task lifecycle are owned by `ai/runtime/`), `ai/governance/human-oversight.md` (accountability is never delegated to automation), the existing `knowledge/` namespaces (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md`, and the frozen `@openlance/aios-agent-engine`, `-prompt-engine`, `-provider-engine`, `-evaluation-engine`, and `-openlance-growth-workflows` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0055 (OpenLance Growth Workflows, whose output it consumes) and, transitively, ADR-0049..0054 (the planners), ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0044 (Runtime Execution Engine, the owner of execution it defers to), ADR-0042 (Governance Engine), ADR-0035 (the Phase 4 operational layer and Provider Engine, owner of the private clearance gate it never bypasses), ADR-0026, ADR-0006, and ADR-0007 / ADR-0023 / ADR-0015. Eighth and final AI Growth OS Feature of Phase 5.
