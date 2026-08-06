# 53 - Automation Intelligence (Phase 5, Stage 8)

Design artifact for `@openlance/aios-automation-intelligence`, approved with [ADR-0056](adr/0056-automation-intelligence.md) under the ADR-0007 design-first cadence. This is the eighth and final AI Growth OS Feature (Phase 5, Stage 8), and the `Growth Workflows -> Automation` step of the chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows -> Automation**. It is a domain capability that consumes the frozen platform; it builds no infrastructure.

## 1. Purpose

Automation Intelligence owns the automation-planning behavior: given a completed growth workflow (a Growth Workflows output, consumed by reference and carrying the six planner references transitively), an automation objective, and knowledge references, it frames a governed automation opportunity and an automation-quality evaluation. It prepares reusable, governed automation opportunities from the certified growth workflows; it owns none of the Growth Workflows or planner behaviors or the business truth, and never executes, schedules, or orchestrates automation, never bypasses `GovernanceClearance`, and never duplicates Runtime Execution.

## 2. Ownership (automation-planning behavior only)

There is no `ai/automation/` or `knowledge/automation/` namespace. Automation Intelligence owns its capability catalogue, framing, dependency mapping, validation, and statistics. It consumes the growth workflow by reference and owns no Growth Workflows, marketing/content/SEO/social/analytics/campaign behavior, no execution, scheduling, orchestration, or runtime, no provider, prompts, retrieval, governance, evaluation, or knowledge. It owns no schedule, trigger, cron, or job primitive (all `ai/runtime/`), mints, forges, re-exports, or bypasses no `GovernanceClearance` (private to the frozen `provider-engine`), and produces no Runtime `ExecutionRequest`/`ExecutionRecord`. Its eleven automation capabilities are a distinct namespace from the sixty-eight planner capabilities and the fifteen Growth Workflows types (a permanent guard asserts disjointness).

## 3. Public API

- `AUTOMATION_CAPABILITIES` (closed set of 11), `isAutomationCapability`.
- `AutomationRequest = { capability, objective, agent, workflow, knowledge? }` (the growth workflow id by reference).
- `automationRequestFromWorkflow(workflow: GrowthWorkflow, framing): AutomationRequest` (derives the `workflow` reference from the growth workflow id).
- `AutomationPlan = { id, capability, objective, agent, workflow, knowledge, deliverable, request }` (immutable, content-hashed).
- `AUTOMATION_AGENT` (`AgentDefinitionInput`), `automationEvaluationRequest(plan, metrics): EvaluationRequest`.
- `AutomationIntelligence` (facade, DI entry under `AUTOMATION_MANAGER`): `plan(request): Result<AutomationPlan, AutomationError>`, `agentDefinition(): AgentDefinitionInput`, `evaluationRequest(plan, metrics): EvaluationRequest`, `statistics()`.
- `AutomationFramer`, `AutomationHash`, `AutomationNormalizer`, `AutomationError`, `AUTOMATION_MANAGER`, `automationIntelligenceModule`.

## 4. Capability catalogue

The eleven automation capabilities, each a governed-automation-opportunity planning behavior the AI frames (never an execution): `automation-opportunity-analysis` (identify the automatable steps of a workflow), `workflow-automation-planning` (plan the end-to-end automation of a growth workflow), `task-automation-planning` (plan the automation of a specific task), `trigger-recommendation` (recommend the conditions that would initiate an automation, deferred to the runtime, never an executable trigger), `handoff-planning` (plan the human/AI handoff boundaries), `guardrail-recommendation` (recommend the governance guardrails an automation must respect), `escalation-recommendation` (recommend when an automation must escalate to human oversight), `monitoring-recommendation` (recommend what to observe once automated), `rollout-planning` (plan a phased, reversible rollout), `automation-roadmap-planning` (sequence multiple opportunities into a roadmap), and `automation-evaluation` (frame an evaluation of an automation plan's quality). Each is a recommendation or plan the platform later acts on through its governed runtime; none schedules, triggers, executes, or governs anything. A permanent ownership-boundary guard asserts the set is internally unique and disjoint from every planner capability and Growth Workflows type.

## 5. Framing (consumes the platform, no execution)

`plan` validates the request (known automation capability; non-blank objective and agent; a non-blank `workflow` reference; any extra knowledge references canonical) and frames a governed `AgentRequest`:

- step `prompt`: `{ variables: { objective, automationTask }, contextReferences: [workflow, ...knowledge] }` (prepare the automation opportunity, grounded in the growth workflow and knowledge);
- step `provider`: `{ capability: 'text-generation' }`.

It builds no `AgentExecutionPlan` and performs no execution, scheduling, or orchestration, and neither mints nor bypasses a governance clearance. `evaluationRequest` frames an automation-quality `EvaluationRequest` for the frozen Evaluation Engine. The automation agent is a frozen-seam `AgentDefinitionInput` (specialization `automation-intelligence`, capabilities `prompt`, `provider`).

## 6. Determinism, fail-closed, boundaries

- Deterministic: the plan and its FNV-1a id are a pure function of the request; knowledge references are trimmed, de-duplicated, and sorted before hashing; the id is invariant under knowledge order/duplication and changes when the capability, objective, agent, or workflow reference changes; no wall clock.
- Fail-closed and zero-trust: an unknown capability, a blank objective/agent, a missing workflow reference (each with its own code), or a non-canonical knowledge reference yields `err(AutomationError)`; a malformed request never throws.
- Never executes, schedules, orchestrates, drives a runtime, invokes a provider, selects a model, mints or bypasses a governance clearance, produces a Runtime `ExecutionRequest`/`ExecutionRecord`, decides, or owns business truth. Holds no vendor knowledge.

## 7. Dependencies and the Growth Workflows interaction

Type-only, barrel-only app-to-app: `agent-engine` (the `AgentRequest` / `AgentStep` contract), `evaluation-engine` (the `EvaluationRequest` contract), and `openlance-growth-workflows` (the `GrowthWorkflow` output contract it consumes, its immediate predecessor). Substrate: `kernel`, `errors`, `di`. It takes no dependency on `runtime-execution-engine`, `governance-engine`, `provider-engine`, `operations-engine`, or `safety-engine`. Acyclic terminal step of the linear chain (Growth Workflows does not depend on Automation); the earlier plans are reached transitively through the growth workflow. The six planner packages are imported only as **test-only devDependencies** by the ownership-boundary disjointness guard and create no runtime edge. Eight permanent guards enforce the boundary: ownership-boundary, no-execution, no-orchestration, no-provider-knowledge, pipeline-ownership (the 8-node chain), composition-root, runtime-dependency-boundaries, and type-only-imports (pinning the `import type` erasure of the three framed contracts so none can silently become a runtime value import).

## 8. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015). Benchmarks recorded. Four independent audits (architecture/constitution, correctness/security, dependency/ownership, regression) CLEAN, all Tier-1/2 resolved. A freeze document is prepared but not committed; the stage is frozen only on approval after the Stage Review Report.
