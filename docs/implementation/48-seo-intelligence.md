# 48 - SEO Intelligence (Phase 5, Stage 3)

Design artifact for `@openlance/aios-seo-intelligence`, approved with [ADR-0051](adr/0051-seo-intelligence.md) under the ADR-0007 design-first cadence. This is the third AI Growth OS Feature (Phase 5, Stage 3), built alongside Stage 4, and the `Content -> SEO` step of the growth chain **Marketing -> Content -> SEO -> Social**. It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

SEO Intelligence owns the SEO behavior: given a content plan (a Content Intelligence output, consumed by reference and carrying its marketing direction), an SEO objective, and knowledge references, it frames a governed SEO task and an SEO-quality evaluation. It owns none of the business truth it works from; it consumes it by reference and produces governed AI outputs (SEO plans, evaluations).

## 2. Ownership (behavior only; no overlap with Marketing, Content, or Social)

There is no `ai/seo/` or `knowledge/seo/` namespace; SEO-relevant truth is owned by the existing knowledge namespaces (`knowledge/marketing/`, `knowledge/product/`, `knowledge/competitors/`, `knowledge/customers/`, `knowledge/brand/`). SEO Intelligence owns the SEO behavior only, consumes that truth (and the marketing and content outputs) by reference, and owns none. Its thirteen capabilities are disjoint from Marketing (strategy), Content (creation), and Social (distribution): no overlap.

## 3. Public API

- `SEO_CAPABILITIES` (closed set of 13), `isSeoCapability`.
- `SeoRequest = { capability, objective, agent, marketing: string (a MarketingBrief reference), content: string (a ContentPlan reference), knowledge?: string[] }`.
- `seoRequestFromContent(plan: ContentPlan, framing): SeoRequest` (consumes a Content output through its public contract, deriving the marketing reference from it).
- `SeoPlan = { capability, objective, agent, marketing, content, knowledge, deliverable, request: AgentRequest, id }` (immutable, content-hashed).
- `SeoIntelligence` (facade, DI entry under `SEO_MANAGER`): `plan(request): Result<SeoPlan, SeoError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(plan, metrics): EvaluationRequest`, `statistics()`.

The thirteen capabilities: `keyword-research`, `search-intent-analysis`, `topical-clustering`, `semantic-clustering`, `content-gap-analysis`, `technical-seo-planning`, `on-page-optimization-planning`, `internal-linking-strategy`, `schema-recommendations`, `serp-opportunity-analysis`, `backlink-opportunity-recommendations`, `seo-roadmap-planning`, `seo-evaluation`.

## 4. Framing (consumes the platform, no execution)

`plan` validates the request (known capability; non-blank objective and agent; non-blank marketing and content references; any extra knowledge references canonical) and frames a governed `AgentRequest`:

- step `prompt`: `{ variables: { objective, seoTask: capability }, contextReferences: [marketing, content, ...knowledge] }` (compose the SEO output, grounded in the marketing direction, the content plan, and knowledge);
- step `provider`: `{ capability: 'text-generation' }`.

It frames no `retrieval` step and performs no retrieval, crawling, or indexing; grounding is referenced explicitly. It builds no `AgentExecutionPlan` and performs no execution or scoring. `evaluationRequest` frames an SEO-quality `EvaluationRequest` for the frozen Evaluation Engine (subject = the SEO output, caller-supplied metrics). The SEO growth agent is a frozen-seam `AgentDefinitionInput` (specialization `seo-intelligence`, capabilities `prompt`, `provider`).

## 5. Determinism, fail-closed, boundaries

- Deterministic: the plan and its FNV-1a id are a pure function of the request; knowledge references are trimmed, de-duplicated, and sorted before hashing, so identity is invariant under reference order and duplication; no wall clock.
- Fail-closed and zero-trust: an unknown capability, a blank objective/agent/marketing/content reference, or a non-canonical knowledge reference yields `err(SeoError)`; a malformed request never throws. The knowledge reference validator rejects a bare namespace, a non-document path, and any path-traversal or control-character segment.
- Never executes, invokes a provider, selects a model, retrieves, crawls, indexes, scores, or decides, and owns no business truth. Holds no vendor knowledge.

## 6. Dependencies and the Content interaction

Type-only, barrel-only app-to-app: `agent-engine` (the `AgentRequest` / `AgentStep` contract, which carries the frozen `CompositionInput` and `ProviderNeed` step shapes), `evaluation-engine` (the `EvaluationRequest` contract), and `content-intelligence` (the `ContentPlan` output contract it consumes, its immediate predecessor). Substrate: `kernel`, `errors`, `di`. Acyclic leaf of the linear chain (Content does not depend on SEO); marketing is reached transitively through the content plan. Content to SEO interaction: a caller frames a content plan, then `seoRequestFromContent(plan, ...)` builds an SEO request that references the content plan id and its marketing id; the subsystems integrate through the public output contract by reference, with no shared orchestrator.

## 7. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Two independent audits CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
