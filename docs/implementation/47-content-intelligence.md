# 47 - Content Intelligence (Phase 5, Stage 2)

Design artifact for `@openlance/aios-content-intelligence`, approved with [ADR-0050](adr/0050-content-intelligence.md) under the ADR-0007 design-first cadence. This is the second AI Growth OS Feature (Phase 5, Stage 2), built alongside Stage 1. It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

Content Intelligence owns the content-creation behavior: given a marketing direction (a Marketing Intelligence output, consumed by reference), a content objective, and the brand voice (consumed by reference), it frames a governed content-generation task and a content-quality evaluation. It owns neither the marketing strategy it works from nor the brand standards it applies; it consumes both by reference and produces governed AI outputs (content plans, drafts framing, evaluations).

## 2. Ownership (behavior only; no overlap with Marketing)

Marketing strategy is owned by `knowledge/marketing/` and by Marketing Intelligence's outputs (consumed by reference); brand voice and tone are owned by `knowledge/brand/`. Content Intelligence owns the content-creation behavior only, consumes Marketing outputs and brand standards by reference, and owns neither. This preserves the frozen split: Marketing owns strategy behavior, Content owns creation behavior, no overlap.

## 3. Public API

- `CONTENT_CAPABILITIES` (closed set), `isContentCapability`.
- `ContentRequest = { capability, objective, agent, marketing: string (a MarketingBrief reference), brandVoice: string (canonical knowledge/brand ref), knowledge?: string[] }`.
- `contentRequestFromMarketing(brief: MarketingBrief, over): ContentRequest` (consumes a Marketing output through its public contract).
- `ContentPlan = { capability, objective, agent, marketing, brandVoice, knowledge, request: AgentRequest, id }` (immutable, content-hashed).
- `ContentIntelligence` (facade, DI entry under `CONTENT_MANAGER`): `plan(request): Result<ContentPlan, ContentError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(plan, metrics): EvaluationRequest`, `statistics()`.

## 4. Framing (consumes the platform, no execution)

`plan` validates the request (known capability; non-blank objective and agent; non-blank marketing reference; a canonical `knowledge/brand/...` brand-voice reference; any extra knowledge references canonical) and frames a governed `AgentRequest`:

- step `prompt`: `{ variables: { objective, contentType }, contextReferences: [marketing, brandVoice, ...knowledge] }` (compose the content, grounded in the marketing direction and the brand voice);
- step `provider`: `{ capability: 'text-generation' }`.

It builds no `AgentExecutionPlan` and performs no execution. `evaluationRequest` frames a content-quality `EvaluationRequest` for the frozen Evaluation Engine (subject = the content output, caller-supplied quality/grounding/brand-fidelity metrics). The content growth agent is a frozen-seam `AgentDefinitionInput` (specialization `content-intelligence`, capabilities `prompt`, `provider`).

## 5. Determinism, fail-closed, boundaries

- Deterministic: the plan and its FNV-1a id are a pure function of the request; no wall clock.
- Fail-closed and zero-trust: an unknown capability, a blank objective/agent/marketing reference, or a non-canonical brand-voice reference yields `err(ContentError)`; a malformed request never throws.
- Never executes, invokes a provider, selects a model, authorizes, decides, or owns marketing strategy or brand truth. Holds no vendor knowledge.

## 6. Dependencies and the Marketing interaction

Type-only app-to-app: `agent-engine` (the `AgentRequest` / `AgentStep` contract, which carries the frozen `CompositionInput` and `ProviderNeed` step shapes), `evaluation-engine` (the `EvaluationRequest` contract), and `marketing-intelligence` (the `MarketingBrief` output contract it consumes). Substrate: `kernel`, `errors`, `di`. Acyclic leaf (Marketing does not depend on Content). Marketing to Content interaction: a caller frames a marketing brief, then `contentRequestFromMarketing(brief, ...)` builds a content request that references the brief; the two integrate through Marketing's public output contract by reference, with no shared orchestrator.

## 7. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Two independent audits CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
