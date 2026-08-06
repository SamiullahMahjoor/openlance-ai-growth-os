---
id: ADR-0054
title: Campaign Intelligence is a deterministic domain subsystem that owns the campaign planning behavior only; it is the final Analytics-to-Campaign step of the growth chain, consuming an Analytics Intelligence output and its upstream references plus knowledge by reference and framing a governed campaign task (an AgentRequest and a campaign-quality EvaluationRequest), and it never creates marketing, content, SEO, social, or analytics, executes, schedules, or builds new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0054: Campaign Intelligence is a deterministic domain subsystem that owns the campaign planning behavior only; it is the final Analytics-to-Campaign step of the growth chain, consuming an Analytics Intelligence output and its upstream references plus knowledge by reference and framing a governed campaign task (an AgentRequest and a campaign-quality EvaluationRequest), and it never creates marketing, content, SEO, social, or analytics, executes, schedules, or builds new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 6). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen`, `platform-complete`, `phase5-stage1-frozen`, `phase5-stage2-frozen`, `phase5-stage3-frozen`, and `phase5-stage4-frozen` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure.

## Context

Stage 6 is the Campaign Intelligence subsystem, built alongside Stage 5 (Analytics Intelligence, ADR-0053) under the same approved Architecture Ambiguity Gate that shaped Stages 1 and 2. It is the final `Analytics -> Campaign` step of the ratified linear growth chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign**. The same frozen boundaries fix its shape:

- **The AI layer never owns business truth.** There is no `ai/campaign/` namespace and no `knowledge/campaign/` namespace; Campaign Intelligence consumes truth by canonical reference and owns none of it.
- **Campaign planning is a distinct behavior from marketing, content, SEO, social, and analytics.** Its ten capabilities plan the cross-channel assembly of a campaign; they never create the strategy, content, SEO, social, or analytics they build on.
- **A capability-identifier collision was resolved by an Architecture Ambiguity Gate.** Two suggested Campaign capabilities collided with frozen identifiers: `campaign-planning` is owned by Marketing (ADR-0049) and `campaign-evaluation` is owned by Social (ADR-0052). To preserve the disjointness invariant and the frozen ownership, Campaign's corresponding capabilities are named distinctly: **`campaign-orchestration-planning`** (the final cross-channel assembly, distinct from Marketing's strategy-level `campaign-planning`) and **`campaign-plan-evaluation`** (framing an evaluation of the campaign plan, distinct from Social's `campaign-evaluation`). Marketing and Social keep their identifiers unchanged.
- **The platform executes only behind a deferred clearance minter**, so Campaign Intelligence frames a governed task rather than executing one.

## Decision

1. **Campaign Intelligence (`@openlance/aios-campaign-intelligence`, Phase 5 Stage 6) is a deterministic domain subsystem that owns the campaign planning behavior only.** It is an `apps/*` package that owns a closed set of campaign planning capabilities as behaviors (`campaign-orchestration-planning`, `launch-planning`, `multi-channel-planning`, `funnel-planning`, `audience-sequencing`, `lifecycle-planning`, `budget-recommendations`, `experiment-planning`, `optimization-planning`, `campaign-plan-evaluation`). It owns none of the business truth it works from; it consumes each source by canonical reference and never restates or redefines it.

2. **It consumes an Analytics Intelligence output and, through it, the social, SEO, content, and marketing references, plus knowledge, by reference.** A campaign request carries references to a Marketing Intelligence output (a `MarketingBrief` id), a Content Intelligence output (a `ContentPlan` id), an SEO Intelligence output (a `SeoPlan` id), a Social Intelligence output (a `SocialPlan` id), and an Analytics Intelligence output (an `AnalyticsPlan` id), and any additional canonical `knowledge/...` document references. A helper builds a campaign request from an `AnalyticsPlan` (consuming the analytics output through its public contract, type-only, and deriving the social, SEO, content, and marketing references from it, since the analytics plan carries them). This is the final `Analytics -> Campaign` chain step: Campaign depends only on its immediate predecessor, and reaches the earlier plans transitively.

3. **It frames a governed campaign task; it does not execute.** For a campaign request it produces an immutable `CampaignPlan` carrying the frozen Agent Engine `AgentRequest` (a campaign growth agent, a task, and a generation step pipeline: a `prompt` step grounded in the five upstream plans and knowledge, and a `provider` step for a provider-neutral `text-generation` need). It builds no `AgentExecutionPlan` and no execution; it never creates marketing, content, SEO, social, or analytics, never executes or schedules a campaign, invokes a provider, selects a model, orchestrates at runtime, or decides.

4. **It owns campaign-quality evaluation as a framing.** It produces a campaign-quality `EvaluationRequest` (subject = the campaign output, plus caller-supplied metric measurements) for the frozen Evaluation Engine to assess; it defines no evaluation model and computes no score.

5. **It owns the campaign growth-agent role** as a frozen-seam `AgentDefinitionInput` (specialization `campaign-intelligence`, capabilities `prompt` and `provider`), and it is deterministic, fail-closed, builds no new infrastructure, holds no vendor knowledge, and registers through the composition-root seam.

## Rationale

The decision keeps Campaign Intelligence a thin behavior-owning framer that consumes its immediate predecessor's output (the analytics plan, which carries the social, SEO, content, and marketing references) and knowledge by reference and reuses the certified platform, honoring the "each subsystem owns its behavior, no overlap, no subsystem owns business truth" split and the ratified linear growth chain. The capability renaming preserves the frozen Marketing and Social ownership while giving Campaign distinct identifiers for its final-assembly behaviors. Alternatives rejected: reusing the frozen `campaign-planning` / `campaign-evaluation` identifiers (would duplicate frozen ownership and break the disjointness invariant); creating any upstream domain output (violates the subsystem split); executing or scheduling a campaign (requires the deferred clearance minter and platform runtime); a new orchestrator or evaluation model (duplicates the Agent and Evaluation engines); direct fan-in edges to every upstream package (the chain is linear, so Campaign reaches the earlier plans transitively through the analytics plan). It builds on the certified platform and adds no infrastructure.

## Consequences

- Campaign Intelligence integrates with Analytics Intelligence through Analytics's public output contract (by reference), not through a new orchestrator; the edge is acyclic (Analytics does not depend on Campaign), and the earlier plans are reached transitively.
- **The linear planner pipeline `Marketing -> Content -> SEO -> Social -> Analytics -> Campaign` is the officially ratified constitutional architecture.** No fan-in edges may be introduced: Campaign consumes Analytics (which already carries the earlier context) and never imports Marketing, Content, SEO, or Social directly; every app-to-app import stays type-only, barrel-only, and acyclic. Permanent pipeline-ownership guard tests enforce this chain; introducing a fan-in edge requires a superseding ADR.
- When the governance clearance production path exists, the framed campaign `AgentRequest` runs through the platform unchanged.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns business truth), the existing `knowledge/` namespaces (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md`, and the frozen `@openlance/aios-agent-engine`, `-prompt-engine`, `-provider-engine`, `-evaluation-engine`, and `-analytics-intelligence` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0053 (Analytics Intelligence, whose output it consumes) and, transitively, ADR-0052 (Social), ADR-0051 (SEO), ADR-0050 (Content), and ADR-0049 (Marketing), ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0035, ADR-0026, ADR-0006, and ADR-0007 / ADR-0023 / ADR-0015. Sixth AI Growth OS Feature, built alongside Stage 5 (ADR-0053).
