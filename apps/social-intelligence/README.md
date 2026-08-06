# @openlance/aios-social-intelligence

The AIOS **Social Intelligence** subsystem (Phase 5, Stage 4): the fourth AI Growth OS Feature, built alongside Stage 3. See [ADR-0052](../../docs/implementation/adr/0052-social-intelligence.md) and the [design doc](../../docs/implementation/49-social-intelligence.md).

It is a deterministic domain subsystem that owns the social-media **behavior** only. It builds no infrastructure; it is the `SEO -> Social` step of the growth chain (Marketing -> Content -> SEO -> Social).

## What it does

`SocialIntelligence.plan(request)` frames a governed social task for a social capability (platform strategy, post planning, campaign framing, content calendar, audience engagement recommendations, hashtag planning, posting schedule recommendations, community growth recommendations, influencer collaboration planning, platform-specific adaptation, campaign evaluation framing). It validates the request and produces an immutable, content-hashed `SocialPlan` carrying the frozen Agent Engine `AgentRequest` (a `prompt` step grounded in the marketing direction, the content plan, the SEO plan, and knowledge references, and a `provider` step for a provider-neutral `text-generation` need). `socialRequestFromSeo(seoPlan, framing)` builds a social request from an SEO Intelligence `SeoPlan` (consumed by reference, carrying its own content and marketing references). `evaluationRequest(plan, metrics)` frames a social-quality `EvaluationRequest` for the frozen Evaluation Engine. `agentDefinition()` returns the social growth agent.

## Ownership and boundaries

It owns the social-media behavior only. It consumes a Marketing Intelligence output (a marketing direction), a Content Intelligence output (the content being distributed), an SEO Intelligence output, and knowledge (canonical `knowledge/...` references) by reference, and owns none of them. It plans distribution and engagement; it never authors content (that is Content's behavior; it references a `ContentPlan` by id) nor sets strategy (that is Marketing's). A schedule or calendar is framed as a recommendation, never executed. It never executes, publishes, schedules, posts, calls an API, invokes a provider, selects a model, authorizes, or decides; it builds no `AgentExecutionPlan` and no new platform mechanism. It is deterministic and fail-closed, and holds no vendor knowledge.

## Dependencies

Type-only, barrel-only app-to-app (consumed frozen contracts): `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `seo-intelligence` (the `SeoPlan` output contract, its immediate predecessor in the chain, which carries the content and marketing references). Substrate: `di`, `errors`, `kernel`. Acyclic leaf of the linear chain (SEO does not depend on Social); registers through the composition-root seam under `SOCIAL_MANAGER`.
