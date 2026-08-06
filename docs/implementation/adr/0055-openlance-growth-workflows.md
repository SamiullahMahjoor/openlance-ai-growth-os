---
id: ADR-0055
title: OpenLance Growth Workflows is a deterministic domain subsystem that owns the growth-workflow behavior only; it composes the six frozen planners by reference into reusable workflows and frames a governed workflow task (an AgentRequest and a workflow-quality EvaluationRequest), and it never executes, schedules, automates, or orchestrates a workflow, owns no business truth, and builds no new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0055: OpenLance Growth Workflows is a deterministic domain subsystem that owns the growth-workflow behavior only; it composes the six frozen planners by reference into reusable workflows and frames a governed workflow task (an AgentRequest and a workflow-quality EvaluationRequest), and it never executes, schedules, automates, or orchestrates a workflow, owns no business truth, and builds no new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 7). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen`, `platform-complete`, and `phase5-stage1-frozen` … `phase5-stage6-frozen` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure.

## Context

Stage 7 is the OpenLance Growth Workflows subsystem. It is the `Campaign -> Growth Workflows` step of the ratified linear chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows**. The same frozen boundaries fix its shape:

- **The AI layer never owns business truth.** There is no `ai/workflows/` or `knowledge/workflows/` namespace. Growth Workflows composes the six frozen planners by reference and consumes knowledge by canonical reference; it owns none of it.
- **A workflow is a definition, not an execution.** The subsystem owns workflow definitions, framing, sequencing, dependency mapping, validation, and statistics. It never owns an orchestration engine, execution, scheduling, or automation. Composing planners into a reusable workflow is a declarative framing; running that workflow is the platform's job, behind the deferred clearance minter.
- **Workflow types are a distinct namespace.** The fifteen workflow types are not planner capabilities and never collide with the sixty-eight planner capabilities.

## Decision

1. **OpenLance Growth Workflows (`@openlance/aios-openlance-growth-workflows`, Phase 5 Stage 7) is a deterministic domain subsystem that owns the growth-workflow behavior only.** It is an `apps/*` package that owns a closed set of fifteen marketplace-oriented growth-workflow types, each defined by a structural category and an ordered subsequence of the six planners it composes (a canonical-order subsequence of the frozen chain, from `marketing` to `campaign`). It owns none of the planner behaviors or the business truth it works from; it composes and references them and never restates or redefines them.

2. **It consumes the six planner outputs, by reference, through its immediate predecessor.** A growth-workflow request carries references to a `MarketingBrief`, `ContentPlan`, `SeoPlan`, `SocialPlan`, `AnalyticsPlan`, and `CampaignPlan` id, and any additional canonical `knowledge/...` document references. A helper builds a workflow request from a `CampaignPlan` (consuming the campaign output through its public contract, type-only, and deriving the five earlier planner references from it, since the campaign plan carries them). This is the `Campaign -> Growth Workflows` chain step: Growth Workflows depends only on its immediate predecessor and reaches the earlier plans transitively.

3. **It frames a governed workflow task; it does not execute.** For a workflow request it produces an immutable `GrowthWorkflow` recording the workflow type, the ordered planner `sequence`, the `plannerReferences` for that sequence, the full `upstream` planner ids, immutable `metadata`, and the frozen Agent Engine `AgentRequest` (a growth-workflow agent, a task, and a generation step pipeline: a `prompt` step grounded in the composed planner references and knowledge, and a `provider` step for a provider-neutral `text-generation` need). It builds no `AgentExecutionPlan` and no execution; it never executes, schedules, automates, or orchestrates a workflow, invokes a provider, selects a model, or decides.

4. **It owns workflow-quality evaluation as a framing.** It produces a workflow-quality `EvaluationRequest` (subject = the workflow output, plus caller-supplied metric measurements) for the frozen Evaluation Engine to assess; it defines no evaluation model and computes no score.

5. **It owns the growth-workflow agent role** as a frozen-seam `AgentDefinitionInput` (specialization `openlance-growth-workflows`, capabilities `prompt` and `provider`), and it is deterministic, fail-closed, builds no new infrastructure, holds no vendor knowledge, and registers through the composition-root seam.

## Rationale

The decision keeps OpenLance Growth Workflows a thin behavior-owning framer that composes the certified planners by reference into reusable business workflows, honoring the "each subsystem owns its behavior, no overlap, no subsystem owns business truth" split and the ratified linear chain. Composition is declarative (a workflow definition + a framed `AgentRequest`), never runtime orchestration. Alternatives rejected: owning an orchestration engine, execution, scheduling, or automation (violates the boundary and requires the deferred clearance minter and platform runtime); owning any planner behavior or business truth (violates the subsystem split and the knowledge boundary); direct fan-in edges to every planner (the chain is linear, so Growth Workflows reaches the earlier plans transitively through the campaign plan); a new orchestrator or evaluation model (duplicates the Agent and Evaluation engines). It builds on the certified platform and adds no infrastructure.

## Consequences

- Growth Workflows integrates with Campaign Intelligence through Campaign's public output contract (by reference), not through a new orchestrator; the edge is acyclic (Campaign does not depend on Growth Workflows), and the earlier plans are reached transitively.
- **The linear chain `Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows` is the ratified constitutional architecture.** No fan-in edges may be introduced: Growth Workflows consumes Campaign (which already carries the earlier context) and never imports another planner at runtime; every app-to-app import stays type-only, barrel-only, and acyclic. A permanent pipeline-ownership guard test enforces this chain; introducing a fan-in edge requires a superseding ADR.
- When the governance clearance production path exists, the framed workflow `AgentRequest` runs through the platform unchanged.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns business truth), the existing `knowledge/` namespaces (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md`, and the frozen `@openlance/aios-agent-engine`, `-prompt-engine`, `-provider-engine`, `-evaluation-engine`, and `-campaign-intelligence` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0054 (Campaign Intelligence, whose output it consumes) and, transitively, ADR-0049..0053 (the earlier planners), ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0035, ADR-0026, ADR-0006, and ADR-0007 / ADR-0023 / ADR-0015. Seventh AI Growth OS Feature.
