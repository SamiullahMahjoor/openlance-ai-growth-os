# 39. Governance Enforcement Engine implementation design (Phase 4, Stage 8)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 8).** Built design-first per ADR-0007.
[ADR-0042](adr/0042-governance-engine.md) is Accepted. Package: `apps/governance-engine`
(`@openlance/aios-governance-engine`).

## 1. Mandate and scope (Ambiguity Gate resolved: Option D)

The Stage 8 mandate ("Runtime Safety Engine") assigned one engine a scope spanning two frozen namespaces (governance
authorization and safety protection). The frozen `ai/safety/README.md` ("Safety is not governance; governance owns
permissions, autonomy bounds, and escalation triggers; safety applies them and never defines them") and single-ownership
(ADR-0020) forbid a single engine owning both. The approved resolution (Option D) splits the gateway into two engines and
fixes the pipeline: **Stage 8 = Governance Enforcement Engine (`ai/governance/`)**, Stage 9 = Safety Engine
(`ai/safety/`), Stage 10 = Operations Engine.

Stage 8 builds the **Governance Enforcement Engine**: the operational realization of the frozen Governance namespace, the
runtime authorization subsystem ADR-0035 anticipated ("the runtime validation pipeline / governance enforcement engine").
It authorizes an immutable `AgentExecutionPlan` and produces an immutable `GovernanceDecision`. It **authorizes and
stops**; it executes nothing, invokes no engine, and mints no policy.

## 2. The runtime pipeline (constitutionally fixed, ADR-0042)

`Agent Engine -> Governance Engine -> Safety Engine -> Operations Engine -> Execution/Provider Runtime -> Results`.
Governance decides **whether** execution is authorized; Safety decides whether authorized execution is **safe**;
Operations performs execution **only**, and may never override, recompute, or modify a governance or safety decision. No
stage may bypass this pipeline.

## 3. What it owns / never owns

Owns: runtime authorization, permission evaluation, constitutional validation, autonomy evaluation, human-oversight
requirement, and the immutable governance decision (with its explaining reason, violations, and content-hash audit id),
by **applying** the frozen governance model. Never owns: execution, scheduling, orchestration, provider/model selection,
inference, retrieval, memory, tool execution, result aggregation, agent composition, safety protection (hazards, risk
scoring, refusal, sanitization, degradation, tool/prompt/memory/retrieval safety - all Stage 9), or the **definition,
versioning, or ownership** of governance policy (governance's). It scores no risk (it consumes a provided trust
classification) and mints no provider clearance (the frozen provider-engine brand is private).

## 4. Component inventory (implemented)

- **Governance types.** `GovernanceGrant` (a subject's granted `permissions` and `autonomy` level), `GovernanceRequest`
  (the `AgentExecutionPlan`, the action's `trust`, and any recorded `approved`), `GovernanceDecision` (the immutable
  outcome: `subject`, `decision`, `reason`, `oversight`, `violations`, `permitted`, `trust`, content-hash `id`,
  `validated: true`), `GovernanceOutcome` (`AUTHORIZE | DENY | REQUIRE_APPROVAL | ESCALATE`).
- **`GovernanceRegistry`.** Registers, looks up, and lists governance grants by subject id; no duplicate id.
- **`GovernanceFactory`.** Validates a grant input and builds an immutable `GovernanceGrant`; fails closed on a blank
  subject, a blank granted capability, or an invalid autonomy level (consuming the frozen `AUTONOMY_LEVELS`).
- **`GovernanceNormalizer`.** Structural normalization of a subject or capability name.
- **`GovernanceHash`.** A deterministic, dependency-free content hash (FNV-1a) that produces the decision's reproducible
  audit id from its canonical content; no randomness, no crypto library.
- **`PermissionEvaluator`.** Applies the frozen permission mandate `explicit-grant`: every plan step's capability must be
  a granted permission, and an ungranted capability is a violation (a denial), never a default.
- **`ConstitutionalValidator`.** Consumes the frozen `VALIDATION_DIMENSIONS`; validates that the plan is a validated
  agent plan and that the subject is present, applying the constitutional-validation mandate; a plan that is not
  validated fails.
- **`AutonomyEvaluator`.** Consumes the frozen `AUTONOMY_LEVELS` / `autonomyAtLeast`; where the request requires more
  autonomy than the subject is granted, the action must escalate (the `must-escalate` bound), never proceed.
- **`OversightEvaluator`.** Consumes the frozen trust model (`requiredOversight`, `requiresHumanApproval`); a critical or
  high-trust action requires human approval or review before it proceeds, unless a human approval is recorded.
- **`GovernanceEvaluator`.** Orchestrates the order (trust check, constitutional validation, permission, autonomy,
  oversight) and produces the immutable `GovernanceDecision`, fail-closed: an unrecognized trust level, an unvalidated
  plan, an unknown subject, or an ungranted capability -> `DENY`; insufficient autonomy -> `ESCALATE`;
  required-but-unrecorded approval -> `REQUIRE_APPROVAL`; a human rejection -> `DENY`; otherwise `AUTHORIZE`. It
  normalizes the plan's subject before lookup, and authorizes and stops; it invokes no engine and executes nothing.
- **`GovernanceMetrics`, `GovernanceStatistics`, `GovernanceDiagnostics`.** Operational counters (registrations,
  evaluations, authorized, denied, approvals-required, escalated) and a read-only view.
- **`GovernanceEvents`, `GOVERNANCE_EVENT_TYPES`.** Emits framework events (registered, decided) via the frozen
  `createEvent` and the injected `EventBus`; the decided event carries the audit timestamp.
- **`GovernanceConfiguration`, `GovernanceEngineSettings`.** Engine-owned operational settings (`strictApproval`).
- **`GovernanceError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `GOVERNANCE.*` codes.
- **`GovernancePluginBridge`, `GovernancePlugin`.** Adopts grant-carrying plugins into the registry atomically.
- **`GovernanceManager`.** The facade and DI entry (`GOVERNANCE_MANAGER`): register a grant, decide a request into a
  governance decision, remove a grant, and read statistics and diagnostics.
- **`governanceEngineModule`, `GOVERNANCE_MANAGER`.** The `di` `Module` and token, through the ADR-0026 seam.

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-governance-engine -> {
@openlance/aios-governance, @openlance/aios-agent-engine, @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (seven). `app -> namespace` (governance), one
`app -> app` (agent-engine, for the immutable `AgentExecutionPlan`), and `app -> substrate` (the rest). All legal,
acyclic (nothing depends on the governance-engine), and the Agent Engine is imported only through its public barrel. No
other engine and no runtime are consumed; the non-existent identity and permissions namespaces are not dependencies. The
composition root, config, and logging are test-only devDependencies.

## 6. Decision model (deterministic, fail-closed, explainable)

Outcomes: `AUTHORIZE`, `DENY`, `REQUIRE_APPROVAL`, `ESCALATE` (governance-owned; `SANITIZE`/`RESTRICT` are the Safety
Engine's). The evaluation is a pure function of the plan, the grant, the trust, and the recorded approval: identical
inputs always yield an identical decision, including its FNV-1a content-hash id (no randomness). Every decision carries a
reason and the violations that produced it; every denial and every approval requirement is explained. The engine holds no
mutable shared state and is side-effect free except for immutable event emission.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component and every decision path is tested: registry, factory (blank subject / blank capability / invalid
  autonomy), normalizer, hash (determinism), permission (granted / ungranted -> deny), constitutional (validated /
  unvalidated -> deny), autonomy (sufficient / insufficient -> escalate), oversight (low/moderate -> authorize,
  high/critical -> require-approval, approved -> authorize), evaluator (every outcome and the unknown-subject deny),
  metrics, events, configuration, plugin bridge, and the manager. Plus the no-vendor-knowledge and no-execution guards.
- **Fail-closed.** The public API never throws; an unknown or unresolved condition yields `DENY`.
- **Benchmarks (ADR-0022 Rule 5).** Registration, evaluation (decision), permission, constitutional validation,
  normalization, and hashing, each with a recorded baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0042 and this design are the Stage 8 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 9 (the Safety Engine, which consumes the
`AgentExecutionPlan` and this engine's `GovernanceDecision`) is not begun.
