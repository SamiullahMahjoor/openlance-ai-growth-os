---
id: ADR-0052
title: Social Intelligence is a deterministic domain subsystem that owns the social-media behavior only; it is the SEO-to-Social step of the growth chain, consuming an SEO Intelligence output and its content and marketing references plus knowledge by reference and framing a governed social task (an AgentRequest and a social-quality EvaluationRequest), and it never owns marketing, content, or brand truth, executes, publishes, schedules, posts, or builds new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0052: Social Intelligence is a deterministic domain subsystem that owns the social-media behavior only; it is the SEO-to-Social step of the growth chain, consuming an SEO Intelligence output and its content and marketing references plus knowledge by reference and framing a governed social task (an AgentRequest and a social-quality EvaluationRequest), and it never owns marketing, content, or brand truth, executes, publishes, schedules, posts, or builds new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 4). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen`, `platform-complete`, `phase5-stage1-frozen`, and `phase5-stage2-frozen` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure.

## Context

Stage 4 is the Social Intelligence subsystem, built alongside Stage 3 (SEO Intelligence, ADR-0051) under the same approved Architecture Ambiguity Gate that shaped Stages 1 and 2. It is the `SEO -> Social` step of the growth chain **Marketing -> Content -> SEO -> Social**. The same frozen boundaries fix its shape:

- **The AI layer never owns business truth.** There is no `ai/social/` namespace and no `knowledge/social/` namespace; brand voice is owned by `knowledge/brand/`, marketing strategy by `knowledge/marketing/` and Marketing Intelligence outputs, content by Content Intelligence outputs. Social Intelligence consumes each by reference and owns none of it.
- **Social planning is a distinct behavior from marketing strategy, content creation, and SEO.** Its eleven capabilities (platform strategy, post planning, campaign framing, content calendar, audience engagement recommendations, hashtag planning, posting schedule recommendations, community growth recommendations, influencer collaboration planning, platform-specific adaptation, and campaign evaluation framing) plan distribution and engagement across social platforms; they never author the content itself (owned by Content Intelligence), set the strategy (owned by Marketing Intelligence), or do SEO. `platform-strategy` is social-platform strategy, never marketing strategy.
- **The platform executes only behind a deferred clearance minter**, so Social Intelligence frames a governed task rather than executing one.

## Decision

1. **Social Intelligence (`@openlance/aios-social-intelligence`, Phase 5 Stage 4) is a deterministic domain subsystem that owns the social-media behavior only.** It is an `apps/*` package that owns a closed set of social capabilities as behaviors. It owns none of the marketing strategy, content, SEO, or brand truth it works from; it consumes each by reference and never restates or redefines it.

2. **It consumes an SEO Intelligence output and, through it, the content plan and marketing direction, plus knowledge, by reference.** A social request carries references to a Marketing Intelligence output (a `MarketingBrief` id), a Content Intelligence output (a `ContentPlan` id), and an SEO Intelligence output (a `SeoPlan` id), and any additional canonical `knowledge/...` document references. A helper builds a social request from a `SeoPlan` (consuming the SEO output through its public contract, type-only, and deriving the content and marketing references from it, since the SEO plan carries both). This is the `SEO -> Social` chain step: Social depends only on its immediate predecessor, and reaches content and marketing transitively. It applies these directions; it never sets or redefines them, and it never authors content or duplicates SEO.

3. **It frames a governed social task; it does not execute.** For a social request it produces an immutable `SocialPlan` carrying the frozen Agent Engine `AgentRequest` (a social growth agent, a task, and a generation step pipeline: a `prompt` step that composes the social plan with the marketing direction, the content plan, the SEO plan, and knowledge as context references, and a `provider` step for a provider-neutral `text-generation` need). It builds no `AgentExecutionPlan` and no execution; a schedule or calendar is framed as a recommendation, never enacted; it never publishes, schedules, posts, calls an API, invokes a provider, selects a model, authorizes, or decides.

4. **It owns social-quality evaluation as a framing.** It produces a social-quality `EvaluationRequest` (subject = the social output, plus caller-supplied metric measurements) for the frozen Evaluation Engine to assess; it defines no evaluation model and computes no score.

5. **It owns the social growth-agent role** as a frozen-seam `AgentDefinitionInput` (specialization `social-intelligence`, capabilities `prompt` and `provider`), and it is deterministic, fail-closed, builds no new infrastructure, holds no vendor knowledge, and registers through the composition-root seam.

## Rationale

The decision keeps Social Intelligence a thin behavior-owning framer that consumes its immediate predecessor's output (the SEO plan, which carries the content and marketing references) and knowledge by reference and reuses the certified platform, honoring the "each subsystem owns its behavior, no overlap, no subsystem owns business truth" split and the linear growth chain. Alternatives rejected: owning marketing strategy, content, SEO, or brand voice (violates the frozen knowledge boundary and the subsystem split); authoring or publishing social content (that is Content's behavior and platform execution respectively; Social plans distribution and references content by id); generating social output at runtime (requires the deferred clearance minter); a new orchestrator or evaluation model (duplicates the Agent and Evaluation engines); direct fan-in edges to every upstream package (the chain is linear, so Social reaches content and marketing transitively through SEO, keeping the graph a clean chain). It builds on the certified platform and adds no infrastructure.

## Consequences

- Social Intelligence integrates with SEO Intelligence through SEO's public output contract (by reference), not through a new orchestrator; the edge is acyclic (SEO does not depend on Social), and content and marketing are reached transitively.
- **The linear planner pipeline `Marketing -> Content -> SEO -> Social` is the officially ratified constitutional architecture (ratified at the Stage 3 & 4 freeze).** No fan-in edges may be introduced: Social consumes SEO (which already carries the Content and Marketing context) and never imports Marketing or Content directly; every app-to-app import stays type-only, barrel-only, and acyclic. Permanent pipeline-ownership guard tests enforce this chain; introducing a fan-in edge (for example, a direct `Social -> Content` dependency) requires a superseding ADR.
- When the governance clearance production path exists, the framed social `AgentRequest` runs through the platform unchanged.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns business truth), `knowledge/brand/`, `knowledge/marketing/`, and `knowledge/customers/` (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md`, and the frozen `@openlance/aios-agent-engine`, `-prompt-engine`, `-provider-engine`, `-evaluation-engine`, and `-seo-intelligence` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0051 (SEO Intelligence, whose output it consumes) and, transitively, ADR-0050 (Content Intelligence) and ADR-0049 (Marketing Intelligence), ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0035, ADR-0026, ADR-0006, and ADR-0007 / ADR-0023 / ADR-0015. Fourth AI Growth OS Feature, built alongside Stage 3 (ADR-0051).
