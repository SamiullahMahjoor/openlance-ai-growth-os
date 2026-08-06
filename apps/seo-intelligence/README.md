# @openlance/aios-seo-intelligence

The AIOS **SEO Intelligence** subsystem (Phase 5, Stage 3): the third AI Growth OS Feature, built alongside Stage 4. See [ADR-0051](../../docs/implementation/adr/0051-seo-intelligence.md) and the [design doc](../../docs/implementation/48-seo-intelligence.md).

It is a deterministic domain subsystem that owns the SEO **behavior** only. It builds no infrastructure; it is the `Content -> SEO` step of the growth chain (Marketing -> Content -> SEO -> Social).

## What it does

`SeoIntelligence.plan(request)` frames a governed SEO task for an SEO capability (keyword research, search intent analysis, topical/semantic clustering, content gap analysis, technical SEO planning, on-page optimization planning, internal linking strategy, schema recommendations, SERP opportunity analysis, backlink opportunity recommendations, SEO roadmap planning, SEO evaluation framing). It validates the request and produces an immutable, content-hashed `SeoPlan` carrying the frozen Agent Engine `AgentRequest` (a `prompt` step grounded in the marketing direction, the content plan, and knowledge references, and a `provider` step for a provider-neutral `text-generation` need). `seoRequestFromContent(contentPlan, framing)` builds an SEO request from a Content Intelligence `ContentPlan` (consumed by reference, carrying its own marketing reference). `evaluationRequest(plan, metrics)` frames an SEO-quality `EvaluationRequest` for the frozen Evaluation Engine. `agentDefinition()` returns the SEO growth agent.

## Ownership and boundaries

It owns the SEO behavior only. It consumes a Marketing Intelligence output (a marketing direction), a Content Intelligence output (the content it optimizes), and knowledge (canonical `knowledge/...` references) by reference, and owns no business truth. Its capabilities do not overlap Marketing (strategy), Content (creation), or Social (distribution). It never executes, invokes a provider, selects a model, retrieves, crawls, indexes, scores, or decides; it builds no `AgentExecutionPlan` and no new platform mechanism. It is deterministic and fail-closed, and holds no vendor knowledge.

## Dependencies

Type-only, barrel-only app-to-app (consumed frozen contracts): `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `content-intelligence` (the `ContentPlan` output contract, its immediate predecessor in the chain, which carries the marketing reference). Substrate: `di`, `errors`, `kernel`. Acyclic leaf of the linear chain (Content does not depend on SEO); registers through the composition-root seam under `SEO_MANAGER`.
