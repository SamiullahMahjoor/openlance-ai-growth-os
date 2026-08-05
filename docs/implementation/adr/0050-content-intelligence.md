---
id: ADR-0050
title: Content Intelligence is a deterministic domain subsystem that owns the content-creation behavior only; it consumes a Marketing Intelligence output and brand voice by reference and frames a governed content-generation task (an AgentRequest and a content-quality EvaluationRequest), and it never owns marketing strategy or brand truth, executes, decides, or builds new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0050: Content Intelligence is a deterministic domain subsystem that owns the content-creation behavior only; it consumes a Marketing Intelligence output and brand voice by reference and frames a governed content-generation task (an AgentRequest and a content-quality EvaluationRequest), and it never owns marketing strategy or brand truth, executes, decides, or builds new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 2). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen` and `platform-complete` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure.

## Context

Stage 2 is the Content Intelligence subsystem, built alongside Stage 1 (Marketing Intelligence, ADR-0049) under the same approved Architecture Ambiguity Gate. The same frozen boundaries fix its shape:

- **The AI layer never owns brand or marketing business truth.** `knowledge/brand/` (frozen) owns voice, tone, vocabulary, and the messaging standard; `knowledge/marketing/` owns strategy. Content Intelligence consumes both by reference and owns neither.
- **Content consumes Marketing strategy; it does not own it.** Per the mandate, Content Intelligence consumes Marketing Intelligence outputs (a marketing direction) but owns no marketing strategy.
- **The platform executes only behind a deferred clearance minter**, so Content Intelligence frames a governed content-generation task rather than executing one.

## Decision

1. **Content Intelligence (`@openlance/aios-content-intelligence`, Phase 5 Stage 2) is a deterministic domain subsystem that owns the content-creation behavior only.** It is an `apps/*` package that owns a closed set of content capabilities as behaviors (blog, landing page, website copy, product copy, email campaign, newsletter, case study, documentation, knowledge article, content rewrite, and tone adaptation). It owns none of the marketing strategy it works from nor the brand standards it applies; it consumes each by canonical reference and never restates or redefines them.

2. **It consumes a Marketing Intelligence output and brand voice by reference.** A content request carries a reference to a Marketing Intelligence output (a `MarketingBrief` id, the marketing direction) and a canonical `knowledge/brand/...` reference (the brand voice and tone it applies). A helper builds a content request from a `MarketingBrief` (consuming the marketing output through its public contract, type-only). It applies the brand voice; it never sets or redefines it.

3. **It frames a governed content-generation task; it does not execute.** For a content request it produces an immutable `ContentPlan` carrying the frozen Agent Engine `AgentRequest` (a content growth agent, a task, and a generation step pipeline: a `prompt` step that composes the content with the marketing direction and the brand voice as context references, and a `provider` step for a provider-neutral `text-generation` need). It builds no `AgentExecutionPlan` and no execution; it never invokes a provider, selects a model, authorizes, or decides.

4. **It owns content-quality evaluation as a framing.** It produces a content-quality `EvaluationRequest` (subject = the content output, plus caller-supplied quality, grounding, and brand-fidelity metric measurements) for the frozen Evaluation Engine to assess; it defines no evaluation model and computes no score.

5. **It owns the content growth-agent role** as a frozen-seam `AgentDefinitionInput` (specialization `content-intelligence`, capabilities `prompt` and `provider`), and it is deterministic, fail-closed, builds no new infrastructure, holds no vendor knowledge, and registers through the composition-root seam.

## Rationale

The decision keeps Content Intelligence a thin behavior-owning framer that consumes Marketing Intelligence's output and the brand standards by reference and reuses the certified platform, honoring the "Content owns creation, Marketing owns strategy, no overlap" split as behavior ownership. Alternatives rejected: owning marketing strategy or brand voice (violates the frozen knowledge boundary and the Marketing/Content split); generating content at runtime (requires the deferred clearance minter); a new orchestrator or evaluation model (duplicates the Agent and Evaluation engines). It builds on the certified platform and adds no infrastructure.

## Consequences

- Content Intelligence integrates with Marketing Intelligence through Marketing's public output contract (by reference), not through a new orchestrator; the edge is acyclic (Marketing does not depend on Content).
- When the governance clearance production path exists, the framed content `AgentRequest` runs through the platform unchanged.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns brand or marketing truth), `knowledge/brand/` and `knowledge/marketing/` (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md`, and the frozen `@openlance/aios-agent-engine`, `-prompt-engine`, `-provider-engine`, `-evaluation-engine`, and `-marketing-intelligence` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0049 (Marketing Intelligence, whose output it consumes), ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0035, ADR-0026, ADR-0006, and ADR-0007 / ADR-0023 / ADR-0015. Second AI Growth OS Feature, built alongside Stage 1.
