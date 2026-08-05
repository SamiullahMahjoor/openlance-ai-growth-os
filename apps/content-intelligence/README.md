# @openlance/aios-content-intelligence

The AIOS **Content Intelligence** subsystem (Phase 5, Stage 2): the second AI Growth OS Feature, built alongside Stage 1. See [ADR-0050](../../docs/implementation/adr/0050-content-intelligence.md) and the [design doc](../../docs/implementation/47-content-intelligence.md).

It is a deterministic domain subsystem that owns the content-creation **behavior** only. It builds no infrastructure; it consumes the frozen platform and Marketing Intelligence's output.

## What it does

`ContentIntelligence.plan(request)` frames a governed content-generation task for a content capability (blog, landing page, website copy, product copy, email campaign, newsletter, case study, documentation, knowledge article, rewrite, tone adaptation). It validates the request and produces an immutable, content-hashed `ContentPlan` carrying the frozen Agent Engine `AgentRequest` (a `prompt` step that composes the content grounded in the marketing direction and the brand voice, and a `provider` step for a provider-neutral `text-generation` need). `contentRequestFromMarketing(brief, over)` builds a content request from a Marketing Intelligence `MarketingBrief` (consumed by reference). `evaluationRequest(plan, metrics)` frames a content-quality `EvaluationRequest` for the frozen Evaluation Engine. `agentDefinition()` returns the content growth agent.

## Ownership and boundaries

It owns the content-creation behavior only. It consumes a Marketing Intelligence output (a marketing direction) and the brand voice (a canonical `knowledge/brand/...` reference) by reference, and owns neither marketing strategy nor brand truth. It never executes, invokes a provider, selects a model, authorizes, or decides; it builds no `AgentExecutionPlan` and no new platform mechanism. It is deterministic and fail-closed, and holds no vendor knowledge. Marketing to Content integration is by reference through Marketing's public output contract, with no shared orchestrator.

## Dependencies

Type-only app-to-app (consumed frozen contracts): `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `marketing-intelligence` (the `MarketingBrief` output contract). Substrate: `di`, `errors`, `kernel`. Acyclic leaf (Marketing does not depend on Content); registers through the composition-root seam under `CONTENT_MANAGER`.
