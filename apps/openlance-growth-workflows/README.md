# @openlance/aios-openlance-growth-workflows

The AIOS **OpenLance Growth Workflows** subsystem (Phase 5, Stage 7). See [ADR-0055](../../docs/implementation/adr/0055-openlance-growth-workflows.md) and the [design doc](../../docs/implementation/52-openlance-growth-workflows.md).

It is a deterministic domain subsystem that owns the growth-workflow **behavior** only. It builds no infrastructure; it is the `Campaign -> Growth Workflows` step of the chain (Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows). It **composes the six frozen planners** into reusable OpenLance growth workflows; it never executes, schedules, automates, or orchestrates them.

## What it does

`OpenLanceGrowthWorkflows.plan(request)` frames a governed growth-workflow task for a workflow type (freelancer acquisition, employer acquisition, founder campaign, marketplace liquidity, freelancer/employer activation, user onboarding, reactivation, referral growth, product launch, feature announcement, seasonal promotion, email nurture, retention, conversion optimization). Each workflow type is defined by a structural category and an ordered subsequence of the six planners it composes. It validates the request and produces an immutable, content-hashed `GrowthWorkflow` carrying the ordered planner `sequence`, the `plannerReferences` for that sequence, the full `upstream` planner ids, immutable `metadata`, and the frozen Agent Engine `AgentRequest` (a `prompt` step grounded in the composed planner references and knowledge, and a `provider` step for a provider-neutral `text-generation` need). `workflowFromCampaign(campaignPlan, framing)` builds a workflow request from a Campaign Intelligence `CampaignPlan` (consumed by reference, carrying all five earlier planner references). `evaluationRequest(workflow, metrics)` frames a workflow-quality `EvaluationRequest`. `agentDefinition()` returns the growth-workflow agent.

## Ownership and boundaries

It owns workflow definitions, framing, sequencing, dependency mapping, validation, and statistics. It consumes the six planner outputs (by reference, via a `CampaignPlan`) and knowledge (canonical `knowledge/...` references) by reference, and owns no business truth. It never owns marketing/content/SEO/social/analytics/campaign behavior, execution, scheduling, automation, an orchestration engine, a provider, prompts, retrieval, governance, evaluation, or knowledge. It never executes, schedules, automates, or orchestrates a workflow; it builds no `AgentExecutionPlan` and no new platform mechanism. It is deterministic and fail-closed, and holds no vendor knowledge.

## Dependencies

Type-only, barrel-only app-to-app (consumed frozen contracts): `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `campaign-intelligence` (the `CampaignPlan` output contract, its immediate predecessor in the chain, which carries the five earlier planner references). Substrate: `di`, `errors`, `kernel`. Acyclic terminal step of the linear chain (Campaign does not depend on Growth Workflows); registers through the composition-root seam under `WORKFLOW_MANAGER`.
