---
id: ADR-0042
title: The Governance Enforcement Engine is the Runtime's operational authorization subsystem; it operationalizes the frozen governance model to authorize an agent execution plan and produces an immutable GovernanceDecision, and the runtime pipeline is Agent to Governance to Safety to Operations
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0042: The Governance Enforcement Engine is the Runtime's operational authorization subsystem; it operationalizes the frozen governance model to authorize an agent execution plan and produces an immutable GovernanceDecision, and the runtime pipeline is Agent to Governance to Safety to Operations

## Status

**Accepted** (Phase 4, Stage 8). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, and ADR-0035 to ADR-0041.

## Context

The Stage 8 mandate ("Runtime Safety Engine") assigned one engine a scope spanning two frozen namespaces: runtime
authorization (permissions, clearance, policy/compliance, human approval, audit) and runtime protection (risk, hazards,
refusal, boundaries, degradation). A full source reading fixed a constitutional conflict that forced an Ambiguity Gate:

- **Authorization is governance's; protection is safety's; they are two frozen namespaces with disjoint ownership.**
  `ai/safety/README.md`: "**Safety is not governance. Governance owns the mandates, permissions, autonomy bounds, and
  escalation triggers; safety applies them as protective architecture and never defines them.**" The frozen
  `@openlance/aios-governance` namespace owns `permission`, `validation` (constitutional validation), `policy-enforcement`,
  `human-oversight`, `risk` (trust and oversight), `autonomy`, `escalation`, and `decision-making`. The frozen
  `@openlance/aios-safety` namespace owns hazard identification, risk classification, boundary enforcement, refusal,
  escalation-model, impact, uncertainty, and safe degradation. A single engine owning both violates ADR-0020
  single-ownership and the safety invariant `consumes-rules-and-truth-owns-neither`.
- **Governance defers operational enforcement to the runtime.** `constitutional-validation`: "Governance defines what
  validation means; the runtime performs it." `permission-governance`: "The runtime enforces these rules later;
  governance states them." `human-oversight`: "Governance defines oversight truth; the runtime performs oversight
  workflow." This operational enforcement is exactly the engine ADR-0035 anticipated: "the runtime validation pipeline /
  governance enforcement engine (a later Phase 4 stage)."
- **The clearance seam is module-private to the Provider Engine.** The frozen `provider-engine` `GovernanceClearance` is
  a branded type whose brand and minter are module-private and never re-exported; a separate engine cannot construct it.
  So the Governance Enforcement Engine produces its own immutable `GovernanceDecision`, and a later runtime-execution
  stage bridges a decision to the provider clearance, with no change to the frozen `ProviderExecutor.execute` contract.

The Ambiguity Gate resolution (approved) is **Option D**: split the mandated gateway into two engines, each
operationalizing its own frozen namespace, and fix the runtime pipeline sequencing. Stage 8 is the Governance
Enforcement Engine; Stage 9 is the Safety Engine; Stage 10 is the Operations Engine.

## Decision

1. **The runtime pipeline is Agent to Governance to Safety to Operations, and no stage may bypass it.** The Agent Engine
   composes an immutable `AgentExecutionPlan`; the Governance Enforcement Engine authorizes it into an immutable
   `GovernanceDecision`; the Safety Engine (Stage 9) protects the authorized plan into an immutable `SafetyDecision`; the
   Operations Engine (Stage 10) executes only when it holds a plan, an authorizing governance decision, and a safe
   safety decision, and may never override, recompute, or modify either. Governance decides **whether** execution is
   authorized; Safety decides whether authorized execution is **safe**; Operations performs execution **only**.

2. **Stage 8 is a new `apps/`-layer package, `@openlance/aios-governance-engine`, the operational realization of the
   frozen Governance namespace.** It registers governance grants (a subject's granted capabilities and autonomy level),
   and, for a request (an `AgentExecutionPlan` plus the action's trust classification and any recorded human approval),
   it performs the per-action enforcement the governance model defers to the runtime, in order: constitutional
   validation (an unvalidated plan is refused, per `ordered-before-execution`, against the six frozen
   `VALIDATION_DIMENSIONS`), permission (an ungranted capability is a denial, per `explicit-grant`), autonomy (the frozen
   `AUTONOMY_LEVELS` and bounds), and human oversight (the frozen trust to oversight mapping, `requiredOversight` /
   `requiresHumanApproval`), and produces an immutable `GovernanceDecision`.
   It follows the ADR-0035 operational-layer pattern (`apps/*`, composition-root seam, no vendor knowledge).

3. **It applies governance; it never defines, versions, or owns governance policy, and it mints decisions, not policy.**
   It consumes the frozen `@openlance/aios-governance` model (classifications and pure predicates) and applies it; it
   restates no rule, defines no policy, and changes no governance ownership (`change-governance` remains governance's).
   The `GovernanceDecision` is a minted authorization, not a policy. It mints no provider clearance (the frozen
   provider-engine brand is private); the decision is the authorization a later runtime-execution stage carries.

4. **Fail closed, zero trust, deterministic, no bypass.** Every request is untrusted. Where the subject is unknown, a
   capability is ungranted, or the plan is not validated, the decision is `DENY`. The four legal outcomes are
   `AUTHORIZE`, `DENY`, `REQUIRE_APPROVAL`, and `ESCALATE` (the governance-owned outcomes; the safety-owned `SANITIZE`
   and `RESTRICT` are the Safety Engine's). The decision is deterministic: identical plan, grant, trust, and approval
   always produce an identical decision, including its content-hash identifier; there is no randomness. Every decision
   carries an explaining reason and the violations that produced it. The engine executes nothing, invokes no engine, and
   holds no mutable shared state.

5. **It consumes only the frozen governance model, the Agent Engine's plan contract, and the substrate.** Its `src` edge
   set is `{ governance, agent-engine, di, events, plugins, errors, kernel }` (seven): `app -> namespace` (governance),
   one `app -> app` (agent-engine, for the immutable `AgentExecutionPlan` it authorizes), and `app -> substrate` (the
   rest). It imports the Agent Engine only through its public barrel, depends on no other engine and no runtime, and the
   graph stays acyclic. The non-existent "identity" and "permissions" namespaces named in the mandate are not
   dependencies; permissions are governance's, and the subject identity is the plan's agent id.

6. **No vendor knowledge (the ADR-0035 invariant carries forward).** The engine holds no vendor client library, model,
   URL, or auth, and it never executes; both are enforced by guard tests.

7. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/39-governance-engine.md` are the Stage 8
   artifacts. A new ADR is warranted because Stage 8 makes genuinely new architectural decisions: the Ambiguity Gate
   resolution splitting governance enforcement from safety, the operational realization of governance enforcement (the
   ADR-0035 authorization engine), and the constitutionally-frozen Agent to Governance to Safety to Operations runtime
   pipeline.

## Rationale

Naming the operational realization of governance enforcement is what ADR-0020 ("Governance provides truth. Runtime
performs enforcement.") and ADR-0035 anticipate. Splitting it from safety is forced by the frozen `ai/safety/` identity
("Safety is not governance") and single-ownership. Alternatives rejected: one engine owning both governance and safety
(violates single-ownership and the frozen safety identity; the original mandate); minting the provider-engine's branded
clearance (impossible and would edit a frozen package); defining or versioning governance policy (governance's, ADR-0020);
executing or scheduling (the runtime's / Operations'); and re-owning the governance model (would duplicate the frozen
model).

## Consequences

- The `apps/` layer gains its authorization engine; the runtime pipeline Agent to Governance to Safety to Operations is
  fixed. Stages 9 (Safety) and 10 (Operations) consume this engine's `GovernanceDecision` and never recompute or override
  it.
- The `GovernanceDecision` is the authorization a later runtime-execution stage carries; bridging it to the frozen
  provider-engine clearance is that stage's concern, with no change to `ProviderExecutor.execute`.
- The engine remains non-executing, deterministic, fail-closed, and provider-agnostic.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/governance/README.md` and the frozen
`ai/governance/permission-governance.md`, `constitutional-validation.md`, `risk-management.md`, `autonomy-boundaries.md`,
`human-oversight.md`, `policy-enforcement.md`, `escalation.md`, and `decision-making.md` (the governance model,
permissions, validation dimensions, trust and oversight, autonomy, and human oversight), `ai/safety/README.md` (safety is
not governance; the Stage 9 boundary), `ai/runtime/README.md` ("Governance precedes execution"; the runtime performs
enforcement), `ai/agents/` (the plan's subject and its permissions), and ADR-0020.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer and the governance-cleared seam, which named this
engine), ADR-0041 (the Agent Engine, whose `AgentExecutionPlan` it authorizes), ADR-0026 (the composition-root seam),
ADR-0005 (frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021 / ADR-0024. Consumes the frozen
Phase 2B `@openlance/aios-governance` model. Anticipates the Stage 9 Safety Engine and the Stage 10 Operations Engine,
which consume its `GovernanceDecision`.
