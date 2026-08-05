# @openlance/aios-marketing-intelligence

The AIOS **Marketing Intelligence** subsystem (Phase 5, Stage 1): the first AI Growth OS Feature. See [ADR-0049](../../docs/implementation/adr/0049-marketing-intelligence.md) and the [design doc](../../docs/implementation/46-marketing-intelligence.md).

It is a deterministic domain subsystem that owns the marketing-intelligence **behavior** only. It builds no infrastructure; it consumes the frozen platform.

## What it does

`MarketingIntelligence.plan(request)` frames a governed platform task for a marketing capability (market research, ICP discovery, competitor analysis, positioning, messaging, offer strategy, funnel strategy, campaign planning, go-to-market planning, recommendation, evaluation). It validates the request and produces an immutable, content-hashed `MarketingBrief` carrying the frozen Agent Engine `AgentRequest` (a grounded step pipeline: `retrieval` for the referenced knowledge, `prompt` to compose the deliverable with the references as context, `provider` for a provider-neutral `text-generation` need). `evaluationRequest(brief, metrics)` frames a marketing-output `EvaluationRequest` for the frozen Evaluation Engine. `agentDefinition()` returns the marketing growth agent (a frozen-seam `AgentDefinitionInput`).

## Ownership and boundaries

It owns the marketing-intelligence behavior only. It consumes the knowledge-owned marketing strategy, brand, customer, competitor, product, and company truth by canonical `knowledge/...` reference and never owns, redefines, or writes it; a marketing request must be grounded in at least one canonical reference. It never executes, invokes a provider, selects a model, authorizes, or decides; it builds no `AgentExecutionPlan` (the Agent Engine composes that) and no new platform mechanism. It is deterministic and fail-closed, and holds no vendor knowledge. When the governance clearance production path exists, the framed `AgentRequest` runs through the platform unchanged.

## Dependencies

Type-only app-to-app (consumed frozen contracts): `agent-engine` (the `AgentRequest` / `AgentStep` contract, which carries the frozen `RetrievalRequest`, `CompositionInput`, and `ProviderNeed` step shapes) and `evaluation-engine` (the `EvaluationRequest` contract). Substrate: `di`, `errors`, `kernel`. Acyclic leaf; registers through the composition-root seam under `MARKETING_MANAGER`.
