# @openlance/aios-governance-engine

The AIOS **Governance Enforcement Engine** (Phase 4, Stage 8): the Runtime's operational authorization subsystem, the
operational realization of the frozen Governance namespace (the runtime validation pipeline ADR-0035 anticipated). It
**authorizes** an immutable `AgentExecutionPlan` by applying the frozen governance model (permission, constitutional
validation, autonomy, human oversight) and produces an immutable `GovernanceDecision`. It **authorizes and stops**; it
executes nothing, invokes no engine, and mints no policy.

- **Layer:** `app` (`apps/*`), the runtime authorization engine.
- **Design:** [docs/implementation/39-governance-engine.md](../../docs/implementation/39-governance-engine.md).
  **Decision:** [ADR-0042](../../docs/implementation/adr/0042-governance-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## The runtime pipeline (constitutionally fixed, ADR-0042)

`Agent Engine -> Governance Engine -> Safety Engine (Stage 9) -> Operations Engine (Stage 10) -> Execution/Provider
Runtime`. Governance decides **whether** execution is authorized; Safety decides whether authorized execution is
**safe**; Operations performs execution **only** and may never override or recompute a governance or safety decision. No
stage may bypass this pipeline.

## What this package is

The operational realization of the frozen `@openlance/aios-governance` model. The governance model defers operational
enforcement to the runtime ("Governance defines what validation means; the runtime performs it"); this engine is that
runtime enforcement. It **consumes, never recreates**: the governance classifications and predicates (trust, oversight,
autonomy, validation, permission). It **applies** governance and never **defines, versions, or owns** governance policy;
it mints decisions, not policy, and mints no provider clearance (the frozen provider-engine clearance brand is private).

## Authorizes; never executes; no vendor knowledge (ADR-0042)

Per ADR-0020 ("Governance provides truth. Runtime performs enforcement.") the engine performs the per-action
enforcement: it evaluates permission (an ungranted capability is a denial), constitutional validation (the six frozen
validation dimensions), autonomy (the frozen autonomy levels and bounds), and human oversight (the frozen trust to
oversight mapping), and produces an immutable `GovernanceDecision`. It scores no risk (it consumes a provided trust
classification), executes nothing, and holds **no vendor knowledge**. Both boundaries are enforced structurally by
`src/`-scanning guard tests (`no-vendor-knowledge.test.ts` and `no-execution.test.ts`).

## Deterministic, fail-closed, zero-trust, explainable

Every request is untrusted. Where the subject is unknown, a capability is ungranted, or the plan is not validated, the
decision is `DENY`. The four legal outcomes are `AUTHORIZE`, `DENY`, `REQUIRE_APPROVAL`, `ESCALATE` (the safety-owned
`SANITIZE`/`RESTRICT` are the Safety Engine's). The decision is deterministic: identical plan, grant, trust, and approval
always yield an identical decision, including its FNV-1a content-hash audit id (no randomness). Every decision carries an
explaining reason and the violations that produced it.

## Public API (single barrel, Engineering Rule 1)

- `GovernanceManager` (and `governanceEngineModule`, `GOVERNANCE_MANAGER`): the engine facade and its DI module,
  registered through the frozen composition root's extension seam (ADR-0026).
- `GovernanceRegistry`, `GovernanceFactory`, `GovernanceNormalizer`, `GovernanceHash`, `PermissionEvaluator`,
  `ConstitutionalValidator`, `AutonomyEvaluator`, `OversightEvaluator`, `GovernanceEvaluator`, `GovernanceMetrics`,
  `GovernanceEvents`, `GovernanceConfiguration`, `GovernancePluginBridge`: the operational components.
- `GovernanceGrant`, `GovernanceGrantInput`, `GovernanceRequest`, `GovernanceDecision`, `GovernanceOutcome`,
  `GovernanceStatistics`, `GovernanceDiagnostics`, `GovernanceEngineSettings`, `GovernancePlugin`, `GovernanceId`: the
  read-only types.
- `GovernanceError`: a `BaseError` subtype (`infrastructure`) with `GOVERNANCE.*` codes; failures ride the `Result`
  channel.

## Dependency direction

`@openlance/aios-governance-engine -> { @openlance/aios-governance, @openlance/aios-agent-engine, @openlance/aios-di,
@openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (seven). `app ->
namespace` (governance), one `app -> app` (agent-engine, for the immutable `AgentExecutionPlan`), and `app -> substrate`
(the rest). All legal, acyclic, no rule and no namespace edge changes. The composition root, config, and logging are
test-only devDependencies.

## Non-responsibilities

No execution, scheduling, orchestration, engine invocation, provider/model selection, inference, retrieval, memory, tool
execution, result aggregation, agent composition, safety protection (hazards, risk scoring, refusal, sanitization,
degradation - Stage 9), governance policy definition / versioning / ownership, provider-clearance minting, or vendor
client library. It authorizes an agent execution plan into an immutable governance decision, and nothing else.
