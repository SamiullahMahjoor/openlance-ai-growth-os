# 49 - Social Intelligence (Phase 5, Stage 4)

Design artifact for `@openlance/aios-social-intelligence`, approved with [ADR-0052](adr/0052-social-intelligence.md) under the ADR-0007 design-first cadence. This is the fourth AI Growth OS Feature (Phase 5, Stage 4), built alongside Stage 3, and the `SEO -> Social` step of the growth chain **Marketing -> Content -> SEO -> Social**. It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

Social Intelligence owns the social-media behavior: given an SEO plan (an SEO Intelligence output, consumed by reference and carrying its content and marketing references), a social objective, and knowledge references, it frames a governed social task and a social-quality evaluation. It owns none of the marketing, content, SEO, or brand truth it works from; it consumes each by reference and produces governed AI outputs (social plans, evaluations).

## 2. Ownership (behavior only; no overlap with Marketing, Content, or SEO)

Marketing strategy is owned by `knowledge/marketing/` and Marketing Intelligence's outputs; brand voice by `knowledge/brand/`; content by Content Intelligence's outputs; SEO by SEO Intelligence's outputs. Social Intelligence owns the social-media behavior only, consumes each by reference, and owns none. Its eleven capabilities plan distribution and engagement across social platforms and never author content: no overlap. `platform-strategy` is social-platform strategy, never marketing strategy.

## 3. Public API

- `SOCIAL_CAPABILITIES` (closed set of 11), `isSocialCapability`.
- `SocialRequest = { capability, objective, agent, marketing: string (a MarketingBrief reference), content: string (a ContentPlan reference), seo: string (a SeoPlan reference), knowledge?: string[] }`.
- `socialRequestFromSeo(plan: SeoPlan, framing): SocialRequest` (consumes an SEO output through its public contract, deriving the content and marketing references from it).
- `SocialPlan = { capability, objective, agent, marketing, content, seo, knowledge, deliverable, request: AgentRequest, id }` (immutable, content-hashed).
- `SocialIntelligence` (facade, DI entry under `SOCIAL_MANAGER`): `plan(request): Result<SocialPlan, SocialError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(plan, metrics): EvaluationRequest`, `statistics()`.

The eleven capabilities: `platform-strategy`, `post-planning`, `campaign-framing`, `content-calendar`, `audience-engagement-recommendations`, `hashtag-planning`, `posting-schedule-recommendations`, `community-growth-recommendations`, `influencer-collaboration-planning`, `platform-specific-adaptation`, `campaign-evaluation`.

## 4. Framing (consumes the platform, no execution)

`plan` validates the request (known capability; non-blank objective and agent; non-blank marketing, content, and seo references; any extra knowledge references canonical) and frames a governed `AgentRequest`:

- step `prompt`: `{ variables: { objective, socialTask: capability }, contextReferences: [marketing, content, seo, ...knowledge] }` (compose the social plan, grounded in the marketing direction, the content plan, the SEO plan, and knowledge);
- step `provider`: `{ capability: 'text-generation' }`.

It builds no `AgentExecutionPlan` and performs no execution; it authors no content (it references a `ContentPlan` by id) and a schedule or calendar is framed as a recommendation, never enacted. `evaluationRequest` frames a social-quality `EvaluationRequest` for the frozen Evaluation Engine (subject = the social output, caller-supplied metrics). The social growth agent is a frozen-seam `AgentDefinitionInput` (specialization `social-intelligence`, capabilities `prompt`, `provider`).

## 5. Determinism, fail-closed, boundaries

- Deterministic: the plan and its FNV-1a id are a pure function of the request; extra knowledge references are trimmed, de-duplicated, and sorted before hashing; no wall clock.
- Fail-closed and zero-trust: an unknown capability, a blank objective/agent/marketing/content/seo reference, or a non-canonical knowledge reference yields `err(SocialError)`; a malformed request never throws. The knowledge reference validator rejects a bare namespace, a non-document path, and any path-traversal or control-character segment.
- Never executes, publishes, schedules, posts, calls an API, invokes a provider, selects a model, authorizes, decides, or owns marketing, content, or brand truth. Never authors content or duplicates SEO. Holds no vendor knowledge.

## 6. Dependencies and the SEO interaction

Type-only, barrel-only app-to-app: `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `seo-intelligence` (the `SeoPlan` output contract it consumes, its immediate predecessor). Substrate: `kernel`, `errors`, `di`. Acyclic leaf of the linear chain (SEO does not depend on Social); content and marketing are reached transitively through the SEO plan. SEO to Social interaction: a caller frames an SEO plan, then `socialRequestFromSeo(plan, ...)` builds a social request that references the SEO plan id and its content and marketing ids; the subsystems integrate through the public output contract by reference, with no shared orchestrator.

## 7. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Two independent audits CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
