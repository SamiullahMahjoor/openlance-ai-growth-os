# @openlance/aios-campaign-intelligence

The AIOS **Campaign Intelligence** subsystem (Phase 5, Stage 6): the sixth AI Growth OS Feature, built alongside Stage 5. See [ADR-0054](../../docs/implementation/adr/0054-campaign-intelligence.md) and the [design doc](../../docs/implementation/51-campaign-intelligence.md).

It is a deterministic domain subsystem that owns the campaign planning **behavior** only. It builds no infrastructure; it is the final `Analytics -> Campaign` step of the growth chain (Marketing -> Content -> SEO -> Social -> Analytics -> Campaign).

## What it does

`CampaignIntelligence.plan(request)` frames a governed campaign task for a campaign capability (campaign orchestration planning, launch planning, multi-channel planning, funnel planning, audience sequencing, lifecycle planning, budget recommendations, experiment planning, optimization planning, campaign-plan evaluation framing). It validates the request and produces an immutable, content-hashed `CampaignPlan` carrying the frozen Agent Engine `AgentRequest` (a `prompt` step grounded in the marketing, content, SEO, social, and analytics plans plus knowledge references, and a `provider` step for a provider-neutral `text-generation` need). `campaignRequestFromAnalytics(analyticsPlan, framing)` builds a campaign request from an Analytics Intelligence `AnalyticsPlan` (consumed by reference, carrying its own social, SEO, content, and marketing references). `evaluationRequest(plan, metrics)` frames a campaign-quality `EvaluationRequest` for the frozen Evaluation Engine. `agentDefinition()` returns the campaign growth agent.

## Ownership and boundaries

It owns the campaign planning behavior only. It consumes a marketing direction, a content plan, an SEO plan, a social plan, an analytics plan, and knowledge (canonical `knowledge/...` references) by reference, and owns none of them. Its capabilities are named distinctly from the frozen Marketing `campaign-planning` and Social `campaign-evaluation` (`campaign-orchestration-planning`, `campaign-plan-evaluation`) so the disjointness boundary holds. It never creates marketing strategy, content, SEO, social, or analytics; it never executes, schedules, invokes a provider, orchestrates at runtime, or decides; it builds no `AgentExecutionPlan` and no new platform mechanism. It is deterministic and fail-closed, and holds no vendor knowledge.

## Dependencies

Type-only, barrel-only app-to-app (consumed frozen contracts): `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `analytics-intelligence` (the `AnalyticsPlan` output contract, its immediate predecessor in the chain, which carries the social, SEO, content, and marketing references). Substrate: `di`, `errors`, `kernel`. Acyclic terminal step of the linear chain (Analytics does not depend on Campaign); registers through the composition-root seam under `CAMPAIGN_MANAGER`.
