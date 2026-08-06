# 51 - Campaign Intelligence (Phase 5, Stage 6)

Design artifact for `@openlance/aios-campaign-intelligence`, approved with [ADR-0054](adr/0054-campaign-intelligence.md) under the ADR-0007 design-first cadence. This is the sixth AI Growth OS Feature (Phase 5, Stage 6), built alongside Stage 5, and the final `Analytics -> Campaign` step of the growth chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign**. It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

Campaign Intelligence owns the campaign planning behavior: given an analytics plan (an Analytics Intelligence output, consumed by reference and carrying its social, SEO, content, and marketing references), a campaign objective, and knowledge references, it frames a governed campaign task and a campaign-quality evaluation. It owns none of the business truth it works from; it consumes it by reference and produces governed AI outputs (campaign plans, evaluations).

## 2. Ownership (behavior only; no overlap; a resolved identifier collision)

There is no `ai/campaign/` or `knowledge/campaign/` namespace. Campaign Intelligence owns the campaign planning behavior only, consumes the five upstream plans and knowledge by reference, and owns none. An Architecture Ambiguity Gate resolved two capability-identifier collisions: the frozen Marketing owns `campaign-planning` (ADR-0049) and the frozen Social owns `campaign-evaluation` (ADR-0052), so Campaign uses the distinct identifiers `campaign-orchestration-planning` and `campaign-plan-evaluation`. Marketing and Social keep their identifiers unchanged; the disjointness invariant holds across all six subsystems.

## 3. Public API

- `CAMPAIGN_CAPABILITIES` (closed set of 10), `isCampaignCapability`.
- `CampaignRequest = { capability, objective, agent, marketing: string, content: string, seo: string, social: string, analytics: string, knowledge?: string[] }`.
- `campaignRequestFromAnalytics(plan: AnalyticsPlan, framing): CampaignRequest` (consumes an Analytics output through its public contract, deriving the social, SEO, content, and marketing references from it).
- `CampaignPlan = { capability, objective, agent, marketing, content, seo, social, analytics, knowledge, deliverable, request: AgentRequest, id }` (immutable, content-hashed).
- `CampaignIntelligence` (facade, DI entry under `CAMPAIGN_MANAGER`): `plan(request): Result<CampaignPlan, CampaignError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(plan, metrics): EvaluationRequest`, `statistics()`.

The ten capabilities: `campaign-orchestration-planning`, `launch-planning`, `multi-channel-planning`, `funnel-planning`, `audience-sequencing`, `lifecycle-planning`, `budget-recommendations`, `experiment-planning`, `optimization-planning`, `campaign-plan-evaluation`.

## 4. Framing (consumes the platform, no execution)

`plan` validates the request (known capability; non-blank objective and agent; non-blank marketing, content, seo, social, and analytics references; any extra knowledge references canonical) and frames a governed `AgentRequest`:

- step `prompt`: `{ variables: { objective, campaignTask: capability }, contextReferences: [marketing, content, seo, social, analytics, ...knowledge] }` (compose the campaign plan, grounded in the five upstream plans and knowledge);
- step `provider`: `{ capability: 'text-generation' }`.

It builds no `AgentExecutionPlan` and performs no execution or scheduling; it creates none of the upstream outputs (it references them by id). `evaluationRequest` frames a campaign-quality `EvaluationRequest` for the frozen Evaluation Engine (subject = the campaign output, caller-supplied metrics). The campaign growth agent is a frozen-seam `AgentDefinitionInput` (specialization `campaign-intelligence`, capabilities `prompt`, `provider`).

## 5. Determinism, fail-closed, boundaries

- Deterministic: the plan and its FNV-1a id are a pure function of the request; extra knowledge references are trimmed, de-duplicated, and sorted before hashing; no wall clock.
- Fail-closed and zero-trust: an unknown capability, a blank objective/agent/marketing/content/seo/social/analytics reference, or a non-canonical knowledge reference yields `err(CampaignError)`; a malformed request never throws. The knowledge reference validator rejects a bare namespace, a non-document path, and any path-traversal or control-character segment.
- Never creates marketing, content, SEO, social, or analytics; never executes, schedules, invokes a provider, selects a model, orchestrates at runtime, or decides. Holds no vendor knowledge.

## 6. Dependencies and the Analytics interaction

Type-only, barrel-only app-to-app: `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `analytics-intelligence` (the `AnalyticsPlan` output contract it consumes, its immediate predecessor). Substrate: `kernel`, `errors`, `di`. Acyclic terminal step of the linear chain (Analytics does not depend on Campaign); the earlier plans are reached transitively through the analytics plan. Analytics to Campaign interaction: a caller frames an analytics plan, then `campaignRequestFromAnalytics(plan, ...)` builds a campaign request that references the analytics plan id and its social, seo, content, and marketing ids; the subsystems integrate through the public output contract by reference, with no shared orchestrator.

## 7. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Two independent audits CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
