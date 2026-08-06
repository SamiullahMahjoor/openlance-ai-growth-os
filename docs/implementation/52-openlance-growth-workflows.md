# 52 - OpenLance Growth Workflows (Phase 5, Stage 7)

Design artifact for `@openlance/aios-openlance-growth-workflows`, approved with [ADR-0055](adr/0055-openlance-growth-workflows.md) under the ADR-0007 design-first cadence. This is the seventh AI Growth OS Feature (Phase 5, Stage 7), and the `Campaign -> Growth Workflows` step of the chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows**. It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

OpenLance Growth Workflows owns the growth-workflow behavior: given a campaign plan (a Campaign Intelligence output, consumed by reference and carrying the five earlier planner references), a workflow objective, and knowledge references, it frames a governed workflow task and a workflow-quality evaluation. It composes the six frozen planners into reusable marketplace growth workflows; it owns none of the planner behaviors or the business truth, and never executes, schedules, automates, or orchestrates a workflow.

## 2. Ownership (workflow behavior only)

There is no `ai/workflows/` or `knowledge/workflows/` namespace. Growth Workflows owns workflow definitions, framing, sequencing, dependency mapping, validation, and statistics. It composes the planners by reference and owns no marketing/content/SEO/social/analytics/campaign behavior, no execution, scheduling, automation, or orchestration engine, no provider, prompts, retrieval, governance, evaluation, or knowledge. Its fifteen workflow types are a distinct namespace from the sixty-eight planner capabilities (a permanent guard asserts disjointness).

## 3. Public API

- `WORKFLOW_TYPES` (closed set of 15), `WORKFLOW_DEFINITIONS` (type -> { category, sequence }), `CANONICAL_CHAIN`, `isWorkflowType`.
- `GrowthWorkflowRequest = { type, objective, agent, marketing, content, seo, social, analytics, campaign, knowledge? }` (the six planner ids by reference).
- `workflowFromCampaign(plan: CampaignPlan, framing): GrowthWorkflowRequest` (derives the five earlier references from the campaign plan).
- `GrowthWorkflow = { id, type, objective, agent, sequence, plannerReferences, upstream, knowledge, metadata, deliverable, request }` (immutable, content-hashed).
- `OpenLanceGrowthWorkflows` (facade, DI entry under `WORKFLOW_MANAGER`): `plan(request): Result<GrowthWorkflow, GrowthWorkflowError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(workflow, metrics): EvaluationRequest`, `statistics()`.

The fifteen workflow types: `freelancer-acquisition`, `employer-acquisition`, `founder-campaign`, `marketplace-liquidity`, `freelancer-activation`, `employer-activation`, `user-onboarding`, `reactivation`, `referral-growth`, `product-launch`, `feature-announcement`, `seasonal-promotion`, `email-nurture`, `retention`, `conversion-optimization`.

## 4. Workflow catalogue and sequencing

Each workflow type is defined by a structural `category` (acquisition, activation, retention, growth, launch, campaign, optimization) and an ordered planner `sequence` it composes. Every sequence is a canonical-order subsequence of `CANONICAL_CHAIN` (`marketing -> content -> seo -> social -> analytics -> campaign`) that begins at `marketing` and ends at `campaign`; a workflow may skip middle stages that its business phase does not need (for example, `user-onboarding` and `retention` compose `marketing -> content -> analytics -> campaign`, and `feature-announcement` composes `marketing -> content -> social -> campaign`). The sequence drives the composition: the workflow grounds its framed task on exactly the planner references in its sequence (plus knowledge), while recording the full upstream provenance. A permanent sequencing guard asserts every sequence is a valid canonical-order subsequence.

## 5. Framing (consumes the platform, no execution)

`plan` validates the request (known workflow type; non-blank objective and agent; all six planner references non-blank; any extra knowledge references canonical) and frames a governed `AgentRequest`:

- step `prompt`: `{ variables: { objective, workflowType }, contextReferences: [...plannerReferences, ...knowledge] }` (compose the workflow, grounded in the composed planner outputs and knowledge);
- step `provider`: `{ capability: 'text-generation' }`.

It builds no `AgentExecutionPlan` and performs no execution, scheduling, automation, or orchestration. `evaluationRequest` frames a workflow-quality `EvaluationRequest` for the frozen Evaluation Engine. The growth-workflow agent is a frozen-seam `AgentDefinitionInput` (specialization `openlance-growth-workflows`, capabilities `prompt`, `provider`).

## 6. Determinism, fail-closed, boundaries

- Deterministic: the workflow and its FNV-1a id are a pure function of the request; knowledge references are trimmed, de-duplicated, and sorted before hashing; the id is invariant under knowledge order/duplication and changes when the type or any planner reference changes; no wall clock.
- Fail-closed and zero-trust: an unknown type, a blank objective/agent, a missing planner reference (each with its own code), or a non-canonical knowledge reference yields `err(GrowthWorkflowError)`; a malformed request never throws.
- Never executes, schedules, automates, orchestrates, invokes a provider, selects a model, decides, or owns business truth. Holds no vendor knowledge.

## 7. Dependencies and the Campaign interaction

Type-only, barrel-only app-to-app: `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `campaign-intelligence` (the `CampaignPlan` output contract it consumes, its immediate predecessor). Substrate: `kernel`, `errors`, `di`. Acyclic terminal step of the linear chain (Campaign does not depend on Growth Workflows); the earlier plans are reached transitively through the campaign plan. The five planner packages are imported only as **test-only devDependencies** by the ownership-boundary disjointness guard and create no runtime edge.

## 8. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Four independent audits (architecture/constitution, correctness/security, dependency/ownership, regression) CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
