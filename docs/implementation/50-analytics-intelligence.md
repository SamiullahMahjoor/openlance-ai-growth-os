# 50 - Analytics Intelligence (Phase 5, Stage 5)

Design artifact for `@openlance/aios-analytics-intelligence`, approved with [ADR-0053](adr/0053-analytics-intelligence.md) under the ADR-0007 design-first cadence. This is the fifth AI Growth OS Feature (Phase 5, Stage 5), built alongside Stage 6, and the `Social -> Analytics` step of the growth chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign**. It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

Analytics Intelligence owns the analytics behavior: given a social plan (a Social Intelligence output, consumed by reference and carrying its SEO, content, and marketing references), an analytics objective, and knowledge references, it frames a governed analytics task and an analytics-quality evaluation. It owns none of the business truth it works from; it consumes it by reference and produces governed AI outputs (analytics plans, evaluations).

## 2. Ownership (behavior only; no overlap)

There is no `ai/analytics/` or `knowledge/analytics/` namespace; analytics-relevant truth is owned by the existing knowledge namespaces. Analytics Intelligence owns the analytics behavior only, consumes that truth (and the four upstream plans) by reference, and owns none. Its twelve capabilities are disjoint from Marketing, Content, SEO, and Social. It frames an `EvaluationRequest` but never performs or scores an evaluation.

## 3. Public API

- `ANALYTICS_CAPABILITIES` (closed set of 12), `isAnalyticsCapability`.
- `AnalyticsRequest = { capability, objective, agent, marketing: string, content: string, seo: string, social: string, knowledge?: string[] }`.
- `analyticsRequestFromSocial(plan: SocialPlan, framing): AnalyticsRequest` (consumes a Social output through its public contract, deriving the SEO, content, and marketing references from it).
- `AnalyticsPlan = { capability, objective, agent, marketing, content, seo, social, knowledge, deliverable, request: AgentRequest, id }` (immutable, content-hashed).
- `AnalyticsIntelligence` (facade, DI entry under `ANALYTICS_MANAGER`): `plan(request): Result<AnalyticsPlan, AnalyticsError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(plan, metrics): EvaluationRequest`, `statistics()`.

The twelve capabilities: `kpi-planning`, `funnel-analysis`, `attribution-planning`, `conversion-analysis`, `event-planning`, `dashboard-framing`, `metric-recommendation`, `performance-interpretation`, `cohort-analysis`, `retention-planning`, `experiment-recommendation`, `analytics-evaluation`.

## 4. Framing (consumes the platform, no execution)

`plan` validates the request (known capability; non-blank objective and agent; non-blank marketing, content, seo, and social references; any extra knowledge references canonical) and frames a governed `AgentRequest`:

- step `prompt`: `{ variables: { objective, analyticsTask: capability }, contextReferences: [marketing, content, seo, social, ...knowledge] }` (compose the analytics output, grounded in the four upstream plans and knowledge);
- step `provider`: `{ capability: 'text-generation' }`.

It builds no `AgentExecutionPlan` and performs no execution, evaluation, orchestration, or scheduling. `evaluationRequest` frames an analytics-quality `EvaluationRequest` for the frozen Evaluation Engine (subject = the analytics output, caller-supplied metrics). The analytics growth agent is a frozen-seam `AgentDefinitionInput` (specialization `analytics-intelligence`, capabilities `prompt`, `provider`).

## 5. Determinism, fail-closed, boundaries

- Deterministic: the plan and its FNV-1a id are a pure function of the request; knowledge references are trimmed, de-duplicated, and sorted before hashing; no wall clock.
- Fail-closed and zero-trust: an unknown capability, a blank objective/agent/marketing/content/seo/social reference, or a non-canonical knowledge reference yields `err(AnalyticsError)`; a malformed request never throws. The knowledge reference validator rejects a bare namespace, a non-document path, and any path-traversal or control-character segment.
- Never executes, invokes a provider, selects a model, evaluates, decides, orchestrates, or schedules, and owns no business truth. Holds no vendor knowledge.

## 6. Dependencies and the Social interaction

Type-only, barrel-only app-to-app: `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `social-intelligence` (the `SocialPlan` output contract it consumes, its immediate predecessor). Substrate: `kernel`, `errors`, `di`. Acyclic step of the linear chain (Social does not depend on Analytics); the earlier plans are reached transitively through the social plan. Social to Analytics interaction: a caller frames a social plan, then `analyticsRequestFromSocial(plan, ...)` builds an analytics request that references the social plan id and its seo, content, and marketing ids; the subsystems integrate through the public output contract by reference, with no shared orchestrator.

## 7. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Two independent audits CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
