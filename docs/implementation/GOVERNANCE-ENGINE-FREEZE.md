# Governance Enforcement Engine, Freeze Declaration (Phase 4, Stage 8)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-governance-engine` (`apps/governance-engine`).
**Scope:** Phase 4, Stage 8: the Runtime's operational authorization subsystem, the operational realization of the frozen
Governance namespace (the runtime validation pipeline ADR-0035 anticipated), built on the frozen Phase 2A substrate, the
frozen `@openlance/aios-governance` model, and the Agent Engine's plan contract, and registered through the frozen Phase
3 composition-root seam. Decision: [ADR-0042](adr/0042-governance-engine.md) (Accepted). Design:
[docs/implementation/39-governance-engine.md](39-governance-engine.md).

It is the eighth operational stage and the Runtime's authorization gate. It performs real authorization work (permission,
constitutional validation, autonomy, human oversight) but **executes nothing**: it produces an immutable
`GovernanceDecision` and stops.

## The Ambiguity Gate (resolved: Option D) and the fixed runtime pipeline

The original Stage 8 mandate ("Runtime Safety Engine") assigned one engine a scope spanning two frozen namespaces
(governance authorization and safety protection). The frozen `ai/safety/README.md` ("Safety is not governance; governance
owns permissions, autonomy bounds, and escalation triggers; safety applies them and never defines them") and
single-ownership (ADR-0020) forbid it. The approved resolution (Option D) splits the gateway and fixes the pipeline:
**Stage 8 = Governance Enforcement Engine (`ai/governance/`)**, Stage 9 = Safety Engine (`ai/safety/`), Stage 10 =
Operations Engine. The constitutionally-fixed runtime pipeline is `Agent -> Governance -> Safety -> Operations ->
Execution/Provider Runtime`: governance decides **whether** execution is authorized, safety decides whether authorized
execution is **safe**, operations executes **only**, and no stage may bypass, override, recompute, or modify a governance
or safety decision.

## What this stage owns

Operational runtime authorization: permission evaluation, constitutional validation, autonomy evaluation, human-oversight
requirement, and the immutable governance decision (with its explaining reason, violations, and content-hash audit id),
by **applying** the frozen governance model. It re-owns nothing: it never owns safety protection (hazards, risk scoring,
refusal, sanitization, degradation, tool/prompt/memory/retrieval safety - all Stage 9), nor the definition, versioning,
or ownership of governance policy (governance's). It scores no risk (it applies a provided trust classification) and
mints no provider clearance (the frozen provider-engine clearance brand is module-private).

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`GovernanceGrant`, `GovernanceGrantInput`, `GovernanceRequest`, `GovernanceDecision`, `GovernanceOutcome`, `GovernanceStatistics`, `GovernanceDiagnostics`, `GovernanceId`); type-only, excluded from coverage |
| `src/errors.ts` | `GovernanceError` (a `BaseError` subtype, `infrastructure`, `GOVERNANCE.*` codes) |
| `src/normalizer.ts` | `GovernanceNormalizer` (structural normalization) |
| `src/hash.ts` | `GovernanceHash` (a deterministic, dependency-free FNV-1a content hash for the decision's audit id) |
| `src/registry.ts` | `GovernanceRegistry` (register / has / get / list / unregister of grants) |
| `src/factory.ts` | `GovernanceFactory` (validates + freezes a `GovernanceGrant`; fails closed on blank subject, invalid autonomy, or blank capability; consumes `AUTONOMY_LEVELS`) |
| `src/permission-evaluator.ts` | `PermissionEvaluator` (applies `explicit-grant`; partitions the plan's capabilities into granted and ungranted) |
| `src/constitutional-validator.ts` | `ConstitutionalValidator` (consumes `VALIDATION_DIMENSIONS`; validation precedes authorization) |
| `src/autonomy-evaluator.ts` | `AutonomyEvaluator` (consumes `AUTONOMY_LEVELS` / `autonomyAtLeast`) |
| `src/oversight-evaluator.ts` | `OversightEvaluator` (consumes `requiredOversight` / `requiresHumanApproval`) |
| `src/evaluator.ts` | `GovernanceEvaluator` (orchestrates the order and produces the immutable `GovernanceDecision`, fail-closed) |
| `src/metrics.ts` | `GovernanceMetrics` |
| `src/events.ts` | `GovernanceEvents`, `GOVERNANCE_EVENT_TYPES` (consumes frozen `createEvent` / the injected `EventBus`) |
| `src/configuration.ts` | `GovernanceConfiguration`, `GovernanceEngineSettings`, `DEFAULT_SETTINGS` |
| `src/plugin-bridge.ts` | `GovernancePluginBridge`, `GovernancePlugin` (adopts grant-carrying plugins atomically) |
| `src/manager.ts` | `GovernanceManager` (the facade + DI entry), `GovernanceManagerOptions` |
| `src/module.ts` | `governanceEngineModule`, `GOVERNANCE_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Applies governance; never executes; no vendor knowledge

Per ADR-0020 ("Governance provides truth. Runtime performs enforcement.") the engine performs the per-action enforcement
the governance model defers to the runtime: constitutional validation (an unvalidated plan is refused), permission (an
ungranted capability is a denial), autonomy (an action needing more autonomy than granted escalates), and human oversight
(a critical action requires approval, a high action requires review). It produces an immutable `GovernanceDecision` and
**carries out nothing**: it invokes no engine, executes nothing, scores no risk, mints no policy, and mints no provider
clearance. It consumes the Agent Engine's `AgentExecutionPlan` type only (never its manager). It holds **no vendor
knowledge**. Both boundaries are enforced structurally by `src/`-scanning guard tests: `no-vendor-knowledge.test.ts` and
`no-execution.test.ts` (which forbids execution/scheduling calls, any engine's executing manager, and the provider
clearance minter; the engine's own `GovernanceManager` / `GOVERNANCE_MANAGER` are permitted).

## Deterministic, fail-closed, zero-trust, explainable

Every request is untrusted. Where the trust level is unrecognized, the subject is unknown, a capability is ungranted, or
the plan is not validated, the decision is `DENY`; where the action needs more autonomy than granted, `ESCALATE`; where a
human approval is required and unrecorded, `REQUIRE_APPROVAL`; where a human rejected it, `DENY`; otherwise `AUTHORIZE`.
The four legal outcomes are `AUTHORIZE`, `DENY`, `REQUIRE_APPROVAL`, `ESCALATE` (the safety-owned `SANITIZE` / `RESTRICT`
are the Safety Engine's). The decision is deterministic: identical plan, grant, trust, and approval always yield an
identical decision, including its FNV-1a content-hash audit id, computed from a JSON-encoded canonical form over sorted
violations and permitted (injective, so distinct decisions never share an id); there is no randomness. Every decision
carries an explaining reason and the violations that produced it. The engine holds no mutable shared state and is
side-effect free except for immutable event emission.

## Dependency graph and immutability

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-governance-engine -> {
@openlance/aios-governance, @openlance/aios-agent-engine, @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (seven). `app -> namespace` (governance), one
`app -> app` (agent-engine, a type-only import of the immutable `AgentExecutionPlan`), and `app -> substrate` (the rest).
All legal, acyclic (nothing depends on the governance-engine), and the Agent Engine is imported only through its public
barrel. The non-existent identity and permissions namespaces are not dependencies. The built `GovernanceDecision`, its
`violations` and `permitted` arrays, the `GovernanceGrant` and its `permissions`, the statistics and diagnostics views,
and the module consts are all `Object.freeze`d and are copies independent of the input; the registry returns fresh
arrays; `GovernancePluginBridge.adopt` is atomic. Both audits verified the freezes, the determinism, and the fail-closed
behavior empirically.

## Consume, never recreate

Consumes the frozen `@openlance/aios-governance` model (`TRUST_LEVELS`, `requiredOversight`, `requiresHumanApproval`,
`AUTONOMY_LEVELS`, `autonomyAtLeast`, `VALIDATION_DIMENSIONS`) and the frozen substrate. It recreates no container, event
bus, error taxonomy, or plugin host, restates no governance rule, and registers through the frozen composition-root
extension seam (ADR-0026 `CompositionConfig.modules`) as one `di` `Module`.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 40 packages / 42 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements / branches / functions / lines coverage across all 16 executable modules (the barrel and the type-only
  `types.ts` excluded per ADR-0015); 30 tests across 4 files; benchmarks recorded (registration, evaluation, permission,
  constitutional validation, normalization, hashing); no `.only` / `.skip`.
- Two independent source audits, both CLEAN. Audit 1 (constitutional: single-ownership, consume-not-recreate,
  applies-not-defines governance, never-executes, mints-no-clearance, fail-closed determinism, the 7-edge acyclic graph,
  frozen-layer immutability, and the ADR traceability) finished CLEAN; a documentation-ordering advisory was corrected in
  the ADR and design doc. Audit 2 (correctness: fail-closed, determinism, immutability, security) raised one High and
  four Low, all fixed and re-verified: an unrecognized trust level now fails closed to `DENY` (was a fail-open that
  bypassed human oversight); the decision's content-hash id is now injective (JSON-encoded canonical) and its stored
  `violations` / `permitted` are sorted to match the hashed content; the plan's subject is normalized before lookup; and
  the tests now pin input-independence, the frozen permitted set, the high-trust review reason, and the bad-trust denial.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, the eight frozen Phase 3
packages, and the frozen Phase 4 Stages 1-7 (Provider, Prompt, Memory, Retrieval, Tool, Reasoning, Agent engines)
unchanged (`git diff HEAD -- ai/ knowledge/ packages/ apps/provider-engine apps/prompt-engine apps/memory-engine
apps/retrieval-engine apps/tool-engine apps/reasoning-engine apps/agent-engine .dependency-cruiser.cjs tools/ scripts/`
empty). The change set is the new `apps/governance-engine/` package, ADR-0042, the design doc, this freeze doc, the ADR
index row, the graph snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The Governance Enforcement Engine's public API, the authorizes-not-executes boundary, the four `GovernanceDecision`
outcomes, the applies-governance-never-defines-or-mints-policy boundary, the no-provider-clearance-minting invariant, the
no-vendor-knowledge invariant, the consume-not-recreate boundary, the deterministic and fail-closed evaluation, the
immutable decision shape, the seven acyclic dependency edges, and the `Agent -> Governance -> Safety -> Operations`
pipeline position are settled for Stage 8. Safety protection (Stage 9), execution (Stage 10), and bridging a decision to
the provider clearance (a later runtime-execution stage) are later stages', not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
governance-engine file without an architecture change process, each still running the full validation pipeline. Any
change to the public API, the authorizes-not-executes boundary, the decision outcomes, the applies-not-defines-policy or
no-clearance-minting or no-vendor-knowledge invariant, the consume-not-recreate boundary, the fail-closed contract, or the
dependency edges is an architectural modification requiring a new or superseding ADR, an architecture review, an
independent audit, and full validation.

## Do not begin Stage 9

Phase 4 Stage 9 (the Safety Engine, which consumes the `AgentExecutionPlan` and this engine's `GovernanceDecision`) is not
started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
