# 40. Safety Engine implementation design (Phase 4, Stage 9)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 9).** Built design-first per ADR-0007.
[ADR-0043](adr/0043-safety-engine.md) is Accepted. Package: `apps/safety-engine`
(`@openlance/aios-safety-engine`).

## 1. Mandate and scope (Ambiguity Gate: clean, no conflict)

Stage 9 builds the **Safety Engine**: the runtime protection layer that determines whether an already authorized
`AgentExecutionPlan` is safe to execute. It is the operational realization of the frozen `@openlance/aios-safety`
namespace, the runtime evaluation the frozen namespace defers to the operational consumer ("Evaluating a concrete hazard,
risk, impact, refusal, escalation, or degradation over a concrete action is a runtime evaluation deferred to the runtime
and the operational namespaces that consume this model"). It **applies** the frozen safety model and produces an
immutable `SafetyDecision`. It **protects and stops**: it authorizes nothing, executes nothing, invokes no engine,
selects and invokes no provider, performs no inference, schedules nothing, and aggregates no result.

The Ambiguity Gate was run and found no conflict: safety is cleanly scoped (protection only), consumes the
`GovernanceDecision` and never overrides it, invents no risk-level enum (the frozen model deliberately exposes none), and
its dependency surface is legal and excludes the Provider Engine.

## 2. The runtime pipeline (constitutionally fixed, ADR-0042 / ADR-0043)

`Agent Engine -> Governance Engine -> Safety Engine -> Operations Engine -> Execution/Provider Runtime -> Results`.
Governance decides **whether** execution is authorized; Safety decides whether authorized execution is **safe**;
Operations performs execution **only**, and may never override, recompute, or modify a governance or safety decision. No
stage may bypass this pipeline. Safety evaluates only an `AUTHORIZE` plan; for any other governance outcome it defers to
governance and fails closed to `REFUSE` without evaluating.

## 3. What it owns / never owns

Owns: runtime hazard identification (over the plan's steps and coordination, categorized by the frozen
`HAZARD_CATEGORIES`), runtime risk classification (expressed as required protection, ordered by protection, applying the
governed `TrustLevel`), impact assessment (along the frozen `IMPACT_DIMENSIONS`), prompt / tool / memory / retrieval
safety inspection, runtime boundary enforcement, isolation, sanitization, safe refusal / degradation / escalation
determination, and the immutable `SafetyDecision` (with its outcome, hazards, protective directives, refusal category,
governed oversight and trust, consumed governance id, explaining reason, and content-hash audit id), by **applying** the
frozen safety model. Never owns: authorization, permissions, governance policy, human approval, compliance, clearance
(all governance's); execution, scheduling, retries, recovery, concurrency, result aggregation, orchestration, execution
lifecycle (all Operations'); provider selection, provider invocation, model routing, networking, inference (all the
Provider Engine's); and the definition, versioning, or ownership of the safety model (the frozen namespace's). It scores
no risk into an invented level (it applies the governed trust and the frozen protection ordering) and mints no clearance.

## 4. Component inventory (implemented)

- **Safety types.** `SafetyRequest` (the authorized `AgentExecutionPlan` and the `GovernanceDecision` that authorized
  it), `SafetyOutcome` (`SAFE | SANITIZE | RESTRICT | DEGRADE | ESCALATE | REFUSE | UNSAFE`), `Hazard` (a frozen
  `HazardCategory`, the `source` element, a `SAFETY.*` code, the base protective `response`, and a `detail`),
  `SafetyDirective` (`sanitize | restrict | isolate | degrade`, the target, and the detail Operations is to apply),
  `SafetyDecision` (the immutable outcome: `subject`, `outcome`, `reason`, `hazards`, `directives`, `refusalCategory`,
  `escalated`, `emergencyStop`, `impact`, `oversight`, `trust`, `governance` id, `evaluated`, content-hash `id`,
  `validated: true`),
  `SafetyRule` / `SafetyRuleInput` (a named extension to the policy), `SafetyStatistics`, `SafetyDiagnostics`.
- **`SafetyConfiguration`, `SafetyPolicy`.** The immutable, deterministic safety policy: the known and sandboxed tool
  capabilities, the dangerous tool combinations, the restricted prompt tokens, the allowed and restricted memory and
  retrieval scopes, and the structural bounds (`maxSteps`, `maxCoordinationLinks`). Owned by the engine; a later stage may
  source it from the frozen `ConfigService`.
- **`SafetyRuleRegistry`, `SafetyFactory`.** Register named policy rules (extensions that add restricted capabilities,
  tokens, scopes, sandboxes, or combinations) by name; the factory validates a rule input (fail closed on a blank name or
  a blank entry) and freezes it; no duplicate name.
- **`SafetyNormalizer`.** Structural normalization of a scope, capability, or token name (deterministic policy matching).
- **`SafetyHash`.** A deterministic, dependency-free FNV-1a content hash that produces the decision's reproducible audit
  id from its canonical content; no randomness, no crypto library.
- **`PromptSafetyInspector`.** Inspects a prompt step's `CompositionInput` (its `variables` and `contextReferences`) for
  a restricted instruction token (prompt injection / instruction hijacking, `SANITIZE`), a self-referential or unbounded
  context reference (recursive prompt abuse, `REFUSE`), and reference counts beyond the bound (`UNSAFE`), applying the
  effective policy.
- **`ToolSafetyInspector`.** Inspects a `ToolRequest` (its `capability`, `arguments`, `permitted`, `cleared`) for an
  unknown tool capability (`UNSAFE`), a sandbox-required capability (`RESTRICT`, with an isolation directive), and a
  dangerous capability combination across the plan (`REFUSE`), applying the effective policy.
- **`MemorySafetyInspector`.** Inspects a `MemoryRequest` (its `scope`) for an unknown memory scope (`UNSAFE`) and a
  restricted or cross-tenant scope (`RESTRICT`, with an isolation directive), applying the effective policy.
- **`RetrievalSafetyInspector`.** Inspects a `RetrievalRequest` (its `scope`) for an unknown retrieval scope (`UNSAFE`)
  and a restricted knowledge scope (`REFUSE`, a protective refusal), applying the effective policy.
- **`HazardAnalyzer`.** Iterates the plan's steps, routes each to its inspector by capability, and identifies the runtime
  and agent hazards it owns directly: a plan with more steps than the bound (a `runtime` hazard, `UNSAFE`), a coordination
  topology larger than the bound (an `agent` hazard, `UNSAFE`), and two or more distinct hazard categories over one plan
  (a `compound` hazard, raising protection). A provider or reasoning step is categorized structurally (a `capability` or
  `reasoning` hazard) under a restricting policy, without importing the Provider or Reasoning Engine.
- **`RiskAnalyzer`.** Classifies each identified hazard's required protection by applying the governed `TrustLevel`: the
  final response is the stronger of the hazard's base response and the trust floor (a `critical`-trust action with any
  hazard must at least `ESCALATE` to an accountable human, per the governed `requiresHumanApproval` and the frozen
  `reserved-matter-ascends-to-human`). It assesses the implicated impact dimensions (a deterministic mapping from hazard
  category to a subset of the frozen `IMPACT_DIMENSIONS`). It never lowers protection.
- **`SanitizationEngine`, `RuntimeBoundaryEnforcer`, `IsolationManager`, `SafeRefusalEngine`.** The inert protective
  responders. The SanitizationEngine builds a `sanitize` directive, the RuntimeBoundaryEnforcer a `restrict` directive,
  and the IsolationManager an `isolate` directive, each describing the protection Operations is to apply; the
  SafeRefusalEngine builds the refusal / escalation / degradation disposition (the frozen `RefusalCategory` and the
  reason) for a non-executing or degraded outcome. None sanitizes, restricts, isolates, refuses, degrades, or executes;
  each produces a description only.
- **`SafetyEvaluator`.** Orchestrates the order and produces the immutable `SafetyDecision`, fail closed: the governance
  gate (a non-`AUTHORIZE` governance decision, or an unrecognized governed trust, short-circuits without evaluation), then
  hazard identification, risk classification, protective-directive construction, and defense-in-depth combination (the
  strongest protection wins; no hazards yields `SAFE`). It computes the deterministic content-hash id over the canonical
  decision and deep-freezes the result.
- **`SafetyMetrics`, `SafetyStatistics`, `SafetyDiagnostics`.** Operational counters (evaluations and each outcome) and a
  read-only view.
- **`SafetyEvents`, `SAFETY_EVENT_TYPES`.** Emits framework events (evaluated, decided) via the frozen `createEvent` and
  the injected `EventBus`; the decided event carries the audit timestamp.
- **`SafetyError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `SAFETY.*` codes. An unsafe plan
  is not an error; it is a governed `SafetyDecision`.
- **`SafetyPluginBridge`, `SafetyPlugin`.** Adopts rule-carrying plugins into the rule registry atomically.
- **`SafetyManager`.** The facade and DI entry (`SAFETY_MANAGER`): register a policy rule, decide a request into a safety
  decision, remove a rule, and read statistics and diagnostics.
- **`safetyEngineModule`, `SAFETY_MANAGER`.** The `di` `Module` and token, through the ADR-0026 seam.

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-safety-engine -> {
@openlance/aios-agent-engine, @openlance/aios-governance-engine, @openlance/aios-tool-engine,
@openlance/aios-prompt-engine, @openlance/aios-memory-engine, @openlance/aios-retrieval-engine, @openlance/aios-safety,
@openlance/aios-governance, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }`. Six `app -> app` (all type-only request and decision contracts), two `app -> namespace` (the
frozen safety model it applies and the governed trust model), and five `app -> substrate`. All legal, acyclic (nothing
depends on the safety-engine, and none of the six consumed engines depends on it), and each engine is imported only
through its public barrel. The Provider Engine is **not** a dependency: a provider step is categorized structurally
through the plan. The composition root, config, and logging are test-only devDependencies.

## 6. Decision model (deterministic, fail-closed, explainable)

Outcomes, ordered by protection: `SAFE < SANITIZE < RESTRICT < DEGRADE < ESCALATE < REFUSE < UNSAFE`. `SAFE`, `SANITIZE`,
`RESTRICT`, and `DEGRADE` still execute (unprotected, neutralized, contained, or reduced); `ESCALATE`, `REFUSE`, and
`UNSAFE` do not. `UNSAFE` is the fail-closed terminal verdict and carries an emergency-stop recommendation. The
evaluation is a pure function of the plan, the governance decision, the configuration, and the registered rules:
identical inputs always yield an identical decision, including its FNV-1a content-hash id (no randomness). An unknown or
unconfirmed element (an unknown tool capability, memory or retrieval scope, an over-bound plan or coordination, or an
unrecognized governed trust) always fails closed to `UNSAFE` or `REFUSE`, never a proceed. Protection is layered: the
strongest required protection applies and protection is never lowered. Every hazard, directive, refusal, and escalation
is explained. The evaluation holds no mutable shared state and the `SafetyDecision` is a pure function of its inputs; the
only side effects are immutable event emission and the operational metric counters, and neither feeds back into the
decision (so an identical plan, governance decision, configuration, and registered-rule set always reproduce an
identical decision, including its content-hash id).

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component and every decision path is tested: the four inspectors (unknown, restricted, sandboxed, combination,
  recursive, over-bound), the hazard analyzer (over-step, over-coordination, compound, provider / reasoning
  categorization), the risk analyzer (trust floor, never-lowers, impact mapping), the four responders, the evaluator
  (every outcome, the governance gate for each non-`AUTHORIZE` outcome, the unrecognized-trust fail-closed, the no-hazard
  `SAFE`, and determinism / idempotency), the registry, factory, normalizer, hash, metrics, events, configuration, plugin
  bridge, and manager. Plus the security suites: prompt injection, tool abuse, memory leakage, retrieval leakage,
  isolation, cross-tenant, boundary, determinism, fail-closed, and idempotency; and the no-vendor-knowledge and
  no-execution guards.
- **Fail-closed.** The public API never throws; an unknown or unresolved condition yields `UNSAFE` or `REFUSE`.
- **Benchmarks (ADR-0022 Rule 5).** Evaluation (decision), hazard analysis, risk classification, prompt / tool / memory /
  retrieval inspection, normalization, and hashing, each with a recorded baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0043 and this design are the Stage 9 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 10 (the Operations Engine, which consumes exactly
`AgentExecutionPlan + GovernanceDecision + SafetyDecision` and executes only) is not begun.
