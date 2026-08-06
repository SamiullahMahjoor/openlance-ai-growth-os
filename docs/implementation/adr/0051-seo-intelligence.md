---
id: ADR-0051
title: SEO Intelligence is a deterministic domain subsystem that owns the SEO behavior only; it is the Content-to-SEO step of the growth chain, consuming a Content Intelligence output and its marketing direction plus knowledge by reference and framing a governed SEO task (an AgentRequest and an SEO-quality EvaluationRequest), and it never owns business truth, executes, crawls, indexes, scores, or builds new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0051: SEO Intelligence is a deterministic domain subsystem that owns the SEO behavior only; it is the Content-to-SEO step of the growth chain, consuming a Content Intelligence output and its marketing direction plus knowledge by reference and framing a governed SEO task (an AgentRequest and an SEO-quality EvaluationRequest), and it never owns business truth, executes, crawls, indexes, scores, or builds new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 3). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen`, `platform-complete`, `phase5-stage1-frozen`, and `phase5-stage2-frozen` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure.

## Context

Stage 3 is the SEO Intelligence subsystem, built alongside Stage 4 (Social Intelligence, ADR-0052) under the same approved Architecture Ambiguity Gate that shaped Stages 1 and 2. It is the `Content -> SEO` step of the growth chain **Marketing -> Content -> SEO -> Social**. The same frozen boundaries fix its shape:

- **The AI layer never owns business truth.** There is no `ai/seo/` namespace and no `knowledge/seo/` namespace; SEO-relevant truth is owned by the existing knowledge namespaces (`knowledge/marketing/`, `knowledge/product/`, `knowledge/competitors/`, `knowledge/customers/`, `knowledge/brand/`). SEO Intelligence consumes that truth by canonical reference and owns none of it.
- **SEO is a distinct behavior from marketing strategy, content creation, and social distribution.** Its thirteen capabilities (keyword research, search intent analysis, topical and semantic clustering, content gap analysis, technical SEO planning, on-page optimization planning, internal linking strategy, schema recommendations, SERP opportunity analysis, backlink opportunity recommendations, SEO roadmap planning, and SEO evaluation framing) do not overlap the Marketing, Content, or Social capability sets.
- **The platform executes only behind a deferred clearance minter**, so SEO Intelligence frames a governed task rather than executing one.

## Decision

1. **SEO Intelligence (`@openlance/aios-seo-intelligence`, Phase 5 Stage 3) is a deterministic domain subsystem that owns the SEO behavior only.** It is an `apps/*` package that owns a closed set of SEO capabilities as behaviors. It owns none of the business truth it works from; it consumes each source by canonical reference and never restates or redefines it.

2. **It consumes a Content Intelligence output and its marketing direction, plus knowledge, by reference.** An SEO request carries a reference to a Content Intelligence output (a `ContentPlan` id, the content it optimizes), the marketing direction that content works from (a `MarketingBrief` id, carried on the content plan), and any additional canonical `knowledge/...` document references. A helper builds an SEO request from a `ContentPlan` (consuming the content output through its public contract, type-only, and deriving the marketing reference from it). This is the `Content -> SEO` chain step: SEO depends only on its immediate predecessor, and reaches marketing transitively. It optimizes for the content and aligns to the marketing direction; it never sets or redefines either.

3. **It frames a governed SEO task; it does not execute.** For an SEO request it produces an immutable `SeoPlan` carrying the frozen Agent Engine `AgentRequest` (an SEO growth agent, a task, and a generation step pipeline: a `prompt` step that composes the SEO output with the marketing direction, the content plan, and knowledge as context references, and a `provider` step for a provider-neutral `text-generation` need). It frames no `retrieval` step and performs no retrieval, crawling, or indexing; it builds no `AgentExecutionPlan` and no execution; it never invokes a provider, selects a model, scores, or decides.

4. **It owns SEO-quality evaluation as a framing.** It produces an SEO-quality `EvaluationRequest` (subject = the SEO output, plus caller-supplied metric measurements) for the frozen Evaluation Engine to assess; it defines no evaluation model and computes no score.

5. **It owns the SEO growth-agent role** as a frozen-seam `AgentDefinitionInput` (specialization `seo-intelligence`, capabilities `prompt` and `provider`), and it is deterministic, fail-closed, builds no new infrastructure, holds no vendor knowledge, and registers through the composition-root seam.

## Rationale

The decision keeps SEO Intelligence a thin behavior-owning framer that consumes its immediate predecessor's output (the content plan, which carries the marketing direction) and knowledge by reference and reuses the certified platform, honoring the "each subsystem owns its behavior, no overlap, no subsystem owns business truth" split and the linear growth chain. Alternatives rejected: owning SEO truth or marketing strategy (violates the frozen knowledge boundary and the subsystem split); performing retrieval, crawling, or indexing (unnecessary because grounding is referenced explicitly, and out of the behavior boundary); generating SEO output at runtime (requires the deferred clearance minter); a new orchestrator or evaluation model (duplicates the Agent and Evaluation engines); direct fan-in edges to every upstream package (the chain is linear, so SEO reaches marketing transitively through content, keeping the graph a clean chain). It builds on the certified platform and adds no infrastructure.

## Consequences

- SEO Intelligence integrates with Content Intelligence through Content's public output contract (by reference), not through a new orchestrator; the edge is acyclic (Content does not depend on SEO), and marketing is reached transitively.
- **The linear planner pipeline `Marketing -> Content -> SEO -> Social` is the officially ratified constitutional architecture (ratified at the Stage 3 & 4 freeze).** No fan-in edges may be introduced: SEO consumes Content (which already carries the Marketing context) and never imports Marketing directly; every app-to-app import stays type-only, barrel-only, and acyclic. Permanent pipeline-ownership guard tests enforce this chain; introducing a fan-in edge (for example, a direct `SEO -> Marketing` dependency) requires a superseding ADR.
- When the governance clearance production path exists, the framed SEO `AgentRequest` runs through the platform unchanged.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns business truth), `knowledge/marketing/`, `knowledge/product/`, `knowledge/competitors/`, `knowledge/customers/`, and `knowledge/brand/` (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md`, and the frozen `@openlance/aios-agent-engine`, `-prompt-engine`, `-provider-engine`, `-evaluation-engine`, and `-content-intelligence` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0050 (Content Intelligence, whose output it consumes), ADR-0049 (Marketing Intelligence, whose direction it reaches transitively), ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0035, ADR-0026, ADR-0006, and ADR-0007 / ADR-0023 / ADR-0015. Third AI Growth OS Feature, built alongside Stage 4 (ADR-0052).
