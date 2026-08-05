---
id: ADR-0049
title: Marketing Intelligence is a deterministic domain subsystem that owns the marketing-intelligence behavior only; it consumes knowledge-owned marketing truth by reference and frames a governed platform task (an AgentRequest and an EvaluationRequest), and it never owns business truth, executes, decides, or builds new platform infrastructure
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0049: Marketing Intelligence is a deterministic domain subsystem that owns the marketing-intelligence behavior only; it consumes knowledge-owned marketing truth by reference and frames a governed platform task (an AgentRequest and an EvaluationRequest), and it never owns business truth, executes, decides, or builds new platform infrastructure

## Status

**Accepted** (Phase 5, Stage 1). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen` and `platform-complete` baselines. It is a Phase 5 (AI Growth OS Features) domain capability, not platform infrastructure.

## Context

Phase 5 builds AI Growth OS Features on the certified, frozen platform. Stage 1 is the Marketing Intelligence subsystem. Two frozen boundaries fix its shape, confirmed by a source reading and by an approved Architecture Ambiguity Gate:

- **The AI layer never owns marketing business truth.** `ai/README.md` (frozen Charter): "The AI layer never owns business knowledge, company information, product definitions, policies, brand, marketing, legal truth, customer definitions, competitor knowledge." `knowledge/marketing/README.md` (frozen): "The namespace owns marketing strategy ... Marketing owns only strategy"; positioning, differentiators, channel and growth strategy are owned there; brand voice and messaging by `knowledge/brand/`, ICP by `knowledge/customers/`, competitor knowledge by `knowledge/competitors/`. So marketing strategy, positioning, messaging, ICP, and competitor analysis are business truth the AI layer must consume by reference and never own.
- **The platform executes only behind a governance clearance whose production minter is deferred.** `PLATFORM-COMPLETE.md`: a provider is reachable only through the executor behind an unforgeable `GovernanceClearance`, whose production minter is a future governance-enforcement stage. So a growth feature cannot perform an end-to-end generation today; it frames a governed task the platform will execute once the minter exists.

The approved gate decisions: (1) Marketing Intelligence owns the marketing-intelligence **behavior** only, consuming knowledge-owned truth by reference and producing governed AI outputs, never owning, redefining, or writing business truth; (2) it is a **deterministic domain subsystem** that frames governed platform tasks (`AgentRequest`, structured artifacts, `EvaluationRequest`), consumes the existing Agent, Evaluation, Provider, Prompt, Retrieval infrastructure without duplicating orchestration, never executes, invokes, selects, authorizes, or decides, and runs unchanged once the clearance minter exists.

Source read this session: `ai/README.md`, `knowledge/marketing/README.md`, `ai/agents/agent-specialization.md`, the frozen Agent Engine contract (`apps/agent-engine/src/types.ts`: `AgentDefinition`, `AgentRequest`, `AgentStep`, `AgentExecutionPlan`), and the step contracts it composes (`RetrievalRequest`, `CompositionInput`, `ProviderNeed`) and the Evaluation Engine's `EvaluationRequest`.

## Decision

1. **Marketing Intelligence (`@openlance/aios-marketing-intelligence`, Phase 5 Stage 1) is a deterministic domain subsystem that owns the marketing-intelligence behavior only.** It is an `apps/*` package that owns a closed set of marketing capabilities as behaviors (market research, ICP discovery, competitor analysis, positioning, messaging, offer strategy, funnel strategy, campaign planning, go-to-market planning, recommendation, and marketing evaluation). It owns none of the marketing strategy, brand, customer, competitor, product, or company truth those behaviors reason over; it consumes each by canonical reference and never restates, redefines, or writes it.

2. **It consumes knowledge-owned truth by reference and requires grounding.** A marketing request carries canonical `knowledge/...` references (the strategy, brand, customer, competitor, or product knowledge the behavior consumes). The subsystem validates that a request is grounded in at least one canonical reference and never proceeds on invented ground; it stores and restates no business truth.

3. **It frames a governed platform task; it does not execute.** For a marketing request it produces an immutable `MarketingBrief` carrying the frozen Agent Engine `AgentRequest` (a growth agent, a task, and a grounded step pipeline: a `retrieval` step for the referenced knowledge, a `prompt` step that composes the deliverable with the references as context, and a `provider` step for a provider-neutral `text-generation` need). It builds no `AgentExecutionPlan` (composition is the Agent Engine's) and no execution; it never invokes a provider, selects a model, authorizes, or decides.

4. **It frames marketing evaluation through the frozen Evaluation Engine.** It produces an `EvaluationRequest` (subject = the marketing output, plus caller-supplied metric measurements) for the Evaluation Engine to assess; it defines no evaluation model and computes no score.

5. **It owns the marketing growth-agent role.** It defines the marketing growth agent as a frozen-seam `AgentDefinitionInput` (specialization `marketing-intelligence`, capabilities drawn from the operational engines it composes). Agent specialization is AI-owned (`ai/agents/agent-specialization.md`); the agent owns none of the namespaces it composes.

6. **It is deterministic, fail-closed, and builds no new infrastructure.** Every output is a pure function of the request (content-hash id, no wall clock). A malformed or ungrounded request yields an `err(MarketingError)` and never throws. It defines no container, orchestration, execution, provider, or evaluation mechanism; it consumes the frozen substrate and the frozen engines' public contracts, and registers through the composition-root seam. It holds no vendor knowledge.

## Rationale

The naive reading (a subsystem that owns marketing strategy and generates content) would violate the frozen knowledge boundary and require execution the platform cannot yet perform. The decision reframes it, per the approved gate, as a thin behavior-owning framer over the certified platform. Alternatives rejected: owning marketing strategy in the AI layer (violates `ai/README.md` and `knowledge/marketing`); building an `AgentExecutionPlan` or an orchestration of its own (duplicates the Agent Engine); executing end to end (requires the deferred clearance minter and would re-own execution); building a new evaluation model (duplicates the Evaluation Engine). Phase 5 consumes the frozen platform and adds no infrastructure.

## Consequences

- The `apps/` layer gains its first AI Growth OS Feature. It composes the frozen engines' contracts through legal, type-only app-to-app edges and is an acyclic leaf.
- Stage 2 (Content Intelligence) consumes Marketing Intelligence outputs by reference; the two integrate through their public contracts, not through a new orchestrator.
- When the governance clearance production path exists, the framed `AgentRequest` runs through the platform unchanged; no architectural change to this subsystem is required.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, engine, substrate package, constitution document, knowledge document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/README.md` (the AI never owns marketing truth), `knowledge/marketing/README.md` and `knowledge/brand/`, `knowledge/customers/`, `knowledge/competitors/` (the owners of the truth consumed by reference), `ai/agents/agent-specialization.md` (the growth-agent role model), and the frozen `@openlance/aios-agent-engine`, `-retrieval-engine`, `-prompt-engine`, `-provider-engine`, and `-evaluation-engine` public contracts.

## Related ADRs

Supersedes none. Builds on ADR-0041 (Agent Engine), ADR-0046 (Evaluation Engine), ADR-0035 (operational-layer pattern), ADR-0026 (composition-root seam), ADR-0006 (Result), and ADR-0007 / ADR-0023 / ADR-0015. First AI Growth OS Feature; Stage 2 is ADR-0050.
