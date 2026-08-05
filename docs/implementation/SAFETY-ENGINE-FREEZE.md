# Safety Engine, Freeze Declaration (Phase 4, Stage 9)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-safety-engine` (`apps/safety-engine`).
**Scope:** Phase 4, Stage 9: the Runtime's operational protection subsystem, the operational realization of the frozen
Safety namespace (the runtime evaluation the frozen namespace defers to the operational consumer), built on the frozen
Phase 2A substrate, the frozen `@openlance/aios-safety` model, the governed trust model, and the Agent and Governance
Engines' contracts, and registered through the frozen Phase 3 composition-root seam. Decision:
[ADR-0043](adr/0043-safety-engine.md) (Accepted). Design: [docs/implementation/40-safety-engine.md](40-safety-engine.md).

It is the ninth operational stage and the Runtime's protection gate. It performs real protection work (hazard
identification, risk classification, impact assessment, prompt/tool/memory/retrieval safety, boundary enforcement,
isolation, sanitization, safe refusal/degradation/escalation) but **authorizes nothing and executes nothing**: it
produces an immutable `SafetyDecision` and stops.

## The Ambiguity Gate (clean) and the fixed runtime pipeline

The Stage 9 mandate is cleanly scoped to protection, so no Ambiguity Gate was required. The reconciliation: the frozen
`@openlance/aios-safety` namespace (ADR-0024 category 1 Pure Domain Model) states verbatim that "evaluating a concrete
hazard, risk, impact, refusal, escalation, or degradation over a concrete action is a runtime evaluation deferred to the
runtime and the operational namespaces that consume this model" - the Safety Engine is that operational consumer. It
applies the frozen model and never redefines it; it invents no `RiskLevel` enum (the frozen model deliberately exposes
none), expressing risk as required protection; and it deliberately excludes the Provider Engine from its dependencies.
The constitutionally-fixed runtime pipeline (ADR-0042) is `Agent -> Governance -> Safety -> Operations ->
Execution/Provider Runtime`: governance decides **whether** execution is authorized, safety decides whether authorized
execution is **safe**, operations executes **only**, and no stage may bypass, override, recompute, or modify a governance
or safety decision.

## What this stage owns

Operational runtime protection: hazard identification (categorized by the frozen `HazardCategory`), risk classification
(expressed as required protection, ordered by protection, applying the governed `TrustLevel`), impact assessment (along
the frozen `IMPACT_DIMENSIONS`), prompt/tool/memory/retrieval safety inspection, boundary enforcement, isolation,
sanitization, safe refusal/degradation/escalation determination, and the immutable `SafetyDecision`, by **applying** the
frozen safety model. It re-owns nothing: it never authorizes (governance's, ADR-0042), never executes / schedules /
aggregates (operations' / the runtime's), never selects or invokes a provider or performs inference (the Provider
Engine's), and never defines, versions, or owns the safety model (the frozen namespace's). Its protective components are
**inert**: they emit directives and dispositions describing the protection Operations must apply.

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the public types (`SafetyRequest`, `SafetyOutcome`, `Hazard`, `SafetyDirective`, `SafetyDecision`, `SafetyRule`/`SafetyRuleInput`, `SafetyStatistics`, `SafetyDiagnostics`, `SafetyId`, `ProtectiveResponse`, `DirectiveKind`); type-only, excluded from coverage |
| `src/errors.ts` | `SafetyError` (a `BaseError` subtype, `infrastructure`, `SAFETY.*` codes) |
| `src/normalizer.ts` | `SafetyNormalizer` (structural normalization: whitespace, trim, lowercase) |
| `src/hash.ts` | `SafetyHash` (a deterministic, dependency-free FNV-1a content hash for the decision's audit id) |
| `src/configuration.ts` | `SafetyPolicy`, `DEFAULT_POLICY` (fail-closed, empty allowlists), `SafetyConfiguration` |
| `src/policy.ts` | `resolveEffectivePolicy` (base + rules, normalized), `scopeMatches` (':' hierarchy), `PROTECTION_RANK` / `strongest` / `isExecuting` (the protection ordering) |
| `src/factory.ts` | `SafetyFactory` (validates + freezes a `SafetyRule`; fails closed on blank name, blank entry, empty combination) |
| `src/registry.ts` | `SafetyRuleRegistry` (register / has / list / unregister of named rules) |
| `src/prompt-safety-inspector.ts` | `PromptSafetyInspector` (restricted token, recursion, reference overflow) |
| `src/tool-safety-inspector.ts` | `ToolSafetyInspector` (restricted, unknown, sandbox, argument token) |
| `src/memory-safety-inspector.ts` | `MemorySafetyInspector` (restricted / unknown scope) |
| `src/retrieval-safety-inspector.ts` | `RetrievalSafetyInspector` (restricted / unknown scope) |
| `src/hazard-analyzer.ts` | `HazardAnalyzer` (routes steps to inspectors; oversize, restricted capability, dangerous combination) |
| `src/risk-analyzer.ts` | `RiskAnalyzer` (applies the governed trust floor, never lowers protection; impact mapping) |
| `src/sanitization-engine.ts` | `SanitizationEngine` (inert `sanitize` directive) |
| `src/runtime-boundary-enforcer.ts` | `RuntimeBoundaryEnforcer` (inert `restrict` / `degrade` directives) |
| `src/isolation-manager.ts` | `IsolationManager` (inert `isolate` directive; containment) |
| `src/safe-refusal-engine.ts` | `SafeRefusalEngine` (inert refusal / escalation / degradation disposition) |
| `src/evaluator.ts` | `SafetyEvaluator` (orchestrates: governance gate, hazard identification, risk classification, defense-in-depth combination; produces the immutable `SafetyDecision`, fail-closed) |
| `src/metrics.ts` | `SafetyMetrics` (evaluation and per-outcome counters) |
| `src/events.ts` | `SafetyEvents` + `SAFETY_EVENT_TYPES` (`registered`, `decided`; frozen `createEvent` + `EventBus`) |
| `src/plugin-bridge.ts` | `SafetyPluginBridge` (atomic adoption of rule-carrying plugins) |
| `src/manager.ts` | `SafetyManager` (facade + DI entry: register / decide / remove / statistics / diagnostics) |
| `src/module.ts` | `safetyEngineModule` + `SAFETY_MANAGER` (the `di` module and token, ADR-0026 seam) |
| `src/index.ts` | the single public barrel (Engineering Rule 1) |

## The decision model

Outcomes ordered by protection: `SAFE < SANITIZE < RESTRICT < DEGRADE < ESCALATE < REFUSE < UNSAFE`. `SAFE`, `SANITIZE`,
`RESTRICT`, `DEGRADE` still execute (unprotected, neutralized, contained, reduced); `ESCALATE`, `REFUSE`, `UNSAFE` do
not. `UNSAFE` is the fail-closed terminal verdict with an emergency-stop recommendation. Governance precedes safety: a
non-`AUTHORIZE` governance decision short-circuits to a constitutional `REFUSE` without evaluation, never overriding
governance. Zero-trust and fail-closed: an unknown tool capability, memory or retrieval scope, over-bound plan, or
unrecognized governed trust always yields `UNSAFE` or `REFUSE`. Defense in depth: the strongest required protection wins,
protection is never lowered. Deterministic: an identical plan, governance decision, configuration, and registered rules
always produce an identical `SafetyDecision`, including its FNV-1a content-hash id.

## Dependency graph (acyclic)

`safety-engine -> { agent-engine, governance-engine, tool-engine, prompt-engine, memory-engine, retrieval-engine (app);
safety, governance (namespace); di, events, plugins, errors, kernel (substrate) }` (13 edges, recorded in
`dependency-graph.snapshot.json`). Six `app -> app` (all type-only contracts), two `app -> namespace`, five
`app -> substrate`. It does **not** depend on the Provider Engine or Reasoning Engine. Nothing depends on the
safety-engine; the graph is acyclic.

## Validation and audits

`pnpm run validate` EXIT 0: typecheck, lint, format, depcruise, arch (10/10), graph:check, docs-check (41 packages, 43
ADRs, 255 constitution ids), test, bench, docs, build. **100% coverage** (statements/branches/functions/lines; barrel and
the type-only module excluded), 59 tests across 6 files, no `.only`/`.skip`. Benchmarks recorded. Two independent audits
(constitutional/ownership and correctness/security) returned CLEAN. No file under `ai/` or `knowledge/` was modified.

## Stage 10 readiness

The next stage (Operations Engine) consumes exactly `AgentExecutionPlan + GovernanceDecision + SafetyDecision`, three
immutable inputs, and executes only when it holds an authorizing governance decision and a safe safety decision; it may
never override, recompute, or modify either. All three inputs are immutable, single-owned, and non-overlapping. There is
no scheduling, execution, or provider invocation inside the Safety Engine. The runtime pipeline is constitutionally
frozen.
