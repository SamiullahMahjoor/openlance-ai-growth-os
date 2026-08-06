---
id: ADR-0053
title: Analytics Intelligence is a deterministic domain subsystem that owns the analytics behavior only; it is the Social-to-Analytics step of the growth chain, consuming a Social Intelligence output and its upstream references plus knowledge by reference and framing a governed analytics task (an AgentRequest and an analytics-quality EvaluationRequest), and it never owns business truth, executes, evaluates, orchestrates, schedules, or builds new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0053: Analytics Intelligence is a deterministic domain subsystem that owns the analytics behavior only; it is the Social-to-Analytics step of the growth chain, consuming a Social Intelligence output and its upstream references plus knowledge by reference and framing a governed analytics task (an AgentRequest and an analytics-quality EvaluationRequest), and it never owns business truth, executes, evaluates, orchestrates, schedules, or builds new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 5). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen`, `platform-complete`, `phase5-stage1-frozen`, `phase5-stage2-frozen`, `phase5-stage3-frozen`, and `phase5-stage4-frozen` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure.

## Context

Stage 5 is the Analytics Intelligence subsystem, built alongside Stage 6 (Campaign Intelligence, ADR-0054) under the same approved Architecture Ambiguity Gate that shaped Stages 1 and 2. It is the `Social -> Analytics` step of the ratified linear growth chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign**. The same frozen boundaries fix its shape:

- **The AI layer never owns business truth.** There is no `ai/analytics/` namespace and no `knowledge/analytics/` namespace; analytics-relevant truth is owned by the existing knowledge namespaces. Analytics Intelligence consumes it by canonical reference and owns none of it.
- **Analytics is a distinct behavior from marketing, content, SEO, and social.** Its twelve capabilities (KPI planning, funnel analysis, attribution planning, conversion analysis, event planning, dashboard framing, metric recommendation, performance interpretation, cohort analysis, retention planning, experiment recommendation, and analytics evaluation framing) do not overlap any frozen capability set.
- **The platform executes only behind a deferred clearance minter**, so Analytics Intelligence frames a governed task rather than executing one, and it frames an `EvaluationRequest` rather than performing an evaluation.

## Decision

1. **Analytics Intelligence (`@openlance/aios-analytics-intelligence`, Phase 5 Stage 5) is a deterministic domain subsystem that owns the analytics behavior only.** It is an `apps/*` package that owns a closed set of analytics capabilities as behaviors. It owns none of the business truth it works from; it consumes each source by canonical reference and never restates or redefines it.

2. **It consumes a Social Intelligence output and, through it, the SEO, content, and marketing references, plus knowledge, by reference.** An analytics request carries references to a Marketing Intelligence output (a `MarketingBrief` id), a Content Intelligence output (a `ContentPlan` id), an SEO Intelligence output (a `SeoPlan` id), and a Social Intelligence output (a `SocialPlan` id), and any additional canonical `knowledge/...` document references. A helper builds an analytics request from a `SocialPlan` (consuming the social output through its public contract, type-only, and deriving the SEO, content, and marketing references from it, since the social plan carries them). This is the `Social -> Analytics` chain step: Analytics depends only on its immediate predecessor, and reaches the earlier plans transitively.

3. **It frames a governed analytics task; it does not execute.** For an analytics request it produces an immutable `AnalyticsPlan` carrying the frozen Agent Engine `AgentRequest` (an analytics growth agent, a task, and a generation step pipeline: a `prompt` step grounded in the four upstream plans and knowledge, and a `provider` step for a provider-neutral `text-generation` need). It builds no `AgentExecutionPlan` and no execution; it never invokes a provider, selects a model, evaluates, decides, orchestrates, or schedules.

4. **It owns analytics-quality evaluation as a framing.** It produces an analytics-quality `EvaluationRequest` (subject = the analytics output, plus caller-supplied metric measurements) for the frozen Evaluation Engine to assess; it defines no evaluation model, computes no score, and performs no evaluation.

5. **It owns the analytics growth-agent role** as a frozen-seam `AgentDefinitionInput` (specialization `analytics-intelligence`, capabilities `prompt` and `provider`), and it is deterministic, fail-closed, builds no new infrastructure, holds no vendor knowledge, and registers through the composition-root seam.

## Rationale

The decision keeps Analytics Intelligence a thin behavior-owning framer that consumes its immediate predecessor's output (the social plan, which carries the SEO, content, and marketing references) and knowledge by reference and reuses the certified platform, honoring the "each subsystem owns its behavior, no overlap, no subsystem owns business truth" split and the ratified linear growth chain. Alternatives rejected: owning analytics truth or any upstream domain (violates the frozen knowledge boundary and the subsystem split); performing evaluation, orchestration, or scheduling (owned by the frozen engines, and out of the behavior boundary); generating analytics output at runtime (requires the deferred clearance minter); a new orchestrator or evaluation model (duplicates the Agent and Evaluation engines); direct fan-in edges to every upstream package (the chain is linear, so Analytics reaches the earlier plans transitively through the social plan, keeping the graph a clean chain). It builds on the certified platform and adds no infrastructure.

## Consequences

- Analytics Intelligence integrates with Social Intelligence through Social's public output contract (by reference), not through a new orchestrator; the edge is acyclic (Social does not depend on Analytics), and the earlier plans are reached transitively.
- **The linear planner pipeline `Marketing -> Content -> SEO -> Social -> Analytics -> Campaign` is the officially ratified constitutional architecture.** No fan-in edges may be introduced: Analytics consumes Social (which already carries the earlier context) and never imports Marketing, Content, or SEO directly; every app-to-app import stays type-only, barrel-only, and acyclic. Permanent pipeline-ownership guard tests enforce this chain; introducing a fan-in edge requires a superseding ADR.
- When the governance clearance production path exists, the framed analytics `AgentRequest` runs through the platform unchanged.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns business truth), the existing `knowledge/` namespaces (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md`, and the frozen `@openlance/aios-agent-engine`, `-prompt-engine`, `-provider-engine`, `-evaluation-engine`, and `-social-intelligence` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0052 (Social Intelligence, whose output it consumes) and, transitively, ADR-0051 (SEO), ADR-0050 (Content), and ADR-0049 (Marketing), ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0035, ADR-0026, ADR-0006, and ADR-0007 / ADR-0023 / ADR-0015. Fifth AI Growth OS Feature, built alongside Stage 6 (ADR-0054).
