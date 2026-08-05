# 46 - Marketing Intelligence (Phase 5, Stage 1)

Design artifact for `@openlance/aios-marketing-intelligence`, approved with [ADR-0049](adr/0049-marketing-intelligence.md) under the ADR-0007 design-first cadence. This is the first AI Growth OS Feature (Phase 5, Stage 1). It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

Marketing Intelligence owns the marketing-intelligence behavior: given a marketing objective and the canonical knowledge it consumes, it frames a governed platform task and a marketing evaluation. It owns none of the marketing strategy, brand, customer, competitor, product, or company truth it reasons over (those are knowledge-owned); it consumes each by reference and produces governed AI outputs (briefs, recommendations, plans, evaluations) that inform humans and are never promoted into the knowledge layer.

## 2. Ownership (behavior only; gate-confirmed)

The frozen constitution (`ai/README.md`) and `knowledge/marketing/` own marketing strategy, positioning, messaging, ICP, and competitor knowledge as business truth; the AI layer never owns them. Per the approved Ambiguity Gate, this subsystem owns the marketing-intelligence behavior only, consumes that truth by canonical reference, and never owns, redefines, or writes it.

## 3. Public API

- `MARKETING_CAPABILITIES` (closed set), `isMarketingCapability`.
- `MarketingRequest = { capability, objective, agent, knowledge: string[] (canonical refs), audience? }`.
- `MarketingBrief = { capability, objective, agent, knowledge, audience?, deliverable, request: AgentRequest, id }` (immutable, content-hashed).
- `MarketingIntelligence` (facade, DI entry under `MARKETING_MANAGER`): `plan(request): Result<MarketingBrief, MarketingError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(brief, metrics): EvaluationRequest`, `statistics()`.

## 4. Framing (consumes the platform, no execution)

`plan` validates the request (known capability; non-blank objective and agent; at least one canonical `knowledge/...` reference, so a brief is always grounded) and frames a governed `AgentRequest`:

- step `retrieval`: `{ scope: capability }` (gather the referenced knowledge);
- step `prompt`: `{ variables: { objective, audience }, contextReferences: knowledge }` (compose the grounded deliverable);
- step `provider`: `{ capability: 'text-generation' }` (a provider-neutral generation need).

It builds no `AgentExecutionPlan` (the Agent Engine composes and validates that) and performs no execution. `evaluationRequest` frames a marketing-output `EvaluationRequest` for the frozen Evaluation Engine (subject = the brief, caller-supplied metrics). The marketing growth agent is a frozen-seam `AgentDefinitionInput` (specialization `marketing-intelligence`, capabilities `retrieval`, `prompt`, `provider`).

## 5. Determinism, fail-closed, boundaries

- Deterministic: the brief and its FNV-1a id are a pure function of the request over canonically ordered data; no wall clock.
- Fail-closed and zero-trust: an unknown capability, a blank objective/agent, or a missing/non-canonical knowledge reference yields `err(MarketingError)`; a malformed request never throws.
- Never executes, invokes a provider, selects a model, authorizes, decides, or owns/writes business truth. Holds no vendor knowledge.

## 6. Dependencies

Type-only app-to-app (frozen contracts consumed): `agent-engine` (the `AgentRequest` / `AgentStep` contract, which carries the frozen `RetrievalRequest`, `CompositionInput`, and `ProviderNeed` step shapes) and `evaluation-engine` (the `EvaluationRequest` contract). Substrate: `kernel`, `errors`, `di`. Acyclic leaf; nothing depends on it; registers through the composition-root seam. It builds no new platform architecture.

## 7. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Two independent audits CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
