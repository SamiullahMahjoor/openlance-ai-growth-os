# @openlance/aios-analytics-intelligence

The AIOS **Analytics Intelligence** subsystem (Phase 5, Stage 5): the fifth AI Growth OS Feature, built alongside Stage 6. See [ADR-0053](../../docs/implementation/adr/0053-analytics-intelligence.md) and the [design doc](../../docs/implementation/50-analytics-intelligence.md).

It is a deterministic domain subsystem that owns the analytics **behavior** only. It builds no infrastructure; it is the `Social -> Analytics` step of the growth chain (Marketing -> Content -> SEO -> Social -> Analytics -> Campaign).

## What it does

`AnalyticsIntelligence.plan(request)` frames a governed analytics task for an analytics capability (KPI planning, funnel analysis, attribution planning, conversion analysis, event planning, dashboard framing, metric recommendation, performance interpretation, cohort analysis, retention planning, experiment recommendation, analytics evaluation framing). It validates the request and produces an immutable, content-hashed `AnalyticsPlan` carrying the frozen Agent Engine `AgentRequest` (a `prompt` step grounded in the marketing, content, SEO, and social plans plus knowledge references, and a `provider` step for a provider-neutral `text-generation` need). `analyticsRequestFromSocial(socialPlan, framing)` builds an analytics request from a Social Intelligence `SocialPlan` (consumed by reference, carrying its own SEO, content, and marketing references). `evaluationRequest(plan, metrics)` frames an analytics-quality `EvaluationRequest` for the frozen Evaluation Engine. `agentDefinition()` returns the analytics growth agent.

## Ownership and boundaries

It owns the analytics behavior only. It consumes a marketing direction, a content plan, an SEO plan, a social plan, and knowledge (canonical `knowledge/...` references) by reference, and owns no business truth. Its capabilities do not overlap Marketing, Content, SEO, or Social. It never executes, invokes a provider, selects a model, evaluates (it frames an `EvaluationRequest`; it never scores), decides, orchestrates, or schedules; it builds no `AgentExecutionPlan` and no new platform mechanism. It is deterministic and fail-closed, and holds no vendor knowledge.

## Dependencies

Type-only, barrel-only app-to-app (consumed frozen contracts): `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `social-intelligence` (the `SocialPlan` output contract, its immediate predecessor in the chain, which carries the SEO, content, and marketing references). Substrate: `di`, `errors`, `kernel`. Acyclic step of the linear chain (Social does not depend on Analytics); registers through the composition-root seam under `ANALYTICS_MANAGER`.
