---
id: ADR-0043
title: The Safety Engine is the Runtime's operational protection subsystem; it operationalizes the frozen safety model to evaluate an authorized agent execution plan and produces an immutable SafetyDecision, and it never authorizes, executes, or selects a provider
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0043: The Safety Engine is the Runtime's operational protection subsystem; it operationalizes the frozen safety model to evaluate an authorized agent execution plan and produces an immutable SafetyDecision, and it never authorizes, executes, or selects a provider

## Status

**Accepted** (Phase 4, Stage 9). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, and ADR-0035 to ADR-0042. It occupies the Safety
position of the runtime pipeline that ADR-0042 froze.

## Context

The runtime pipeline frozen by ADR-0042 is `Agent -> Governance -> Safety -> Operations`. Stage 8 built the Governance
Enforcement Engine (authorization). Stage 9 builds the **Safety Engine**: the runtime protection layer that determines
whether an already authorized plan is safe to execute. A full source reading confirmed the mandate is cleanly scoped and
conflicts with no frozen invariant, so no Ambiguity Gate was required. The reconciliations that establish this:

- **Safety is the operational consumer the frozen namespace defers to.** The frozen `@openlance/aios-safety`
  (`packages/namespaces/safety/src/index.ts`, ADR-0024 category 1 Pure Domain Model, like Governance) states verbatim:
  "Evaluating a concrete hazard, risk, impact, refusal, escalation, or degradation over a concrete action is a runtime
  evaluation deferred to the runtime and the operational namespaces that consume this model." The Safety Engine is that
  operational namespace. It **applies** the frozen model to a concrete plan; it defines, versions, or restates none of it
  (`consumes-rules-and-truth-owns-neither`, `protects-never-performs`).
- **Safety is not governance, and never authorizes.** `ai/safety/README.md`: "Safety is not governance. Governance owns
  the mandates, permissions, autonomy bounds, and escalation triggers; safety applies them as protective architecture and
  never defines them." The engine consumes the immutable `GovernanceDecision` and never creates a permission, an
  authorization, a clearance, a policy, a governance rule, a human approval, or compliance. It **never overrides** a
  governance decision.
- **The decision vocabulary grounds in the frozen concerns; it invents no risk classification.** The frozen namespace
  exposes classifications and principles but no `SafetyDecision` type and, deliberately, **no `RiskLevel` enum and no
  ordering predicate** (`risk-classification.ts`). The engine therefore invents no risk-level enum. Its seven operational
  outcomes are named here, each grounded in a frozen concern: `SAFE` / `UNSAFE` (safety-principles: protection before
  action, fail closed), `SANITIZE` / `RESTRICT` (boundary-enforcement: contain, isolate, narrow), `DEGRADE`
  (safe-degradation: reduce capability, safe mode), `REFUSE` (refusal-model: protective and constitutional refusal), and
  `ESCALATE` (escalation-model and the refusal `escalation` category: reserved to an accountable human). Risk is expressed
  through the strength of the required protection, ordered by protection exactly as `one-classified-level-ordered-by-protection`
  and `higher-risk-raises-protection` state, and the engine applies the governed `TrustLevel` the `GovernanceDecision`
  already carries as its risk baseline, never redefining governance's risk categories (`applies-governance-not-replaces`).
- **The dependency surface is legal and deliberately excludes the Provider Engine.** Re-verified from source
  (`.dependency-cruiser.cjs`, `scripts/arch-regression.mjs`): the only rules touching `apps/*` are `no-circular` and
  `no-orphans`; `NAMESPACE_DEPS.safety = ['governance']` binds the safety **namespace** package, not the engine. The
  Safety Engine consumes the immutable `AgentExecutionPlan` (Agent Engine), the immutable `GovernanceDecision` (Governance
  Engine), the four inspected request contracts (Prompt, Tool, Memory, Retrieval Engines), the frozen safety model, the
  governed trust model, and the substrate. It **never** imports the Provider Engine (a provider step is inspected
  structurally through the plan, never by importing provider-engine); it selects no provider, invokes no provider, mints
  no provider clearance, and performs no inference.

## Decision

1. **The runtime pipeline `Agent -> Governance -> Safety -> Operations` (ADR-0042) is unchanged, and the Safety Engine
   occupies its Safety position.** Governance decides **whether** execution is authorized; Safety decides whether an
   authorized execution is **safe**; Operations (Stage 10) performs execution **only**, and may never override,
   recompute, or modify a governance or safety decision. No stage may bypass this pipeline.

2. **Stage 9 is a new `apps/`-layer package, `@openlance/aios-safety-engine`, the operational realization of the frozen
   Safety namespace.** For a request (an authorized `AgentExecutionPlan` plus the `GovernanceDecision` that authorized
   it), it identifies runtime hazards over the plan's steps and coordination (categorized by the frozen
   `HAZARD_CATEGORIES`), classifies the required protection using the governed `TrustLevel`, assesses impact along the
   frozen `IMPACT_DIMENSIONS`, and produces an immutable `SafetyDecision` carrying the outcome, the identified hazards,
   the protective directives Operations is to carry out (sanitize, restrict, isolate, degrade), the frozen refusal
   category when it refuses or escalates, the governed oversight and trust it applied, the id of the `GovernanceDecision`
   it consumed, and a deterministic content-hash audit id. It follows the ADR-0035 operational-layer pattern (`apps/*`,
   composition-root seam, no vendor knowledge).

3. **Governance precedes safety, and safety never evaluates an unauthorized plan.** If the `GovernanceDecision` is not
   `AUTHORIZE` (`DENY`, `REQUIRE_APPROVAL`, or `ESCALATE`), the Safety Engine performs no runtime evaluation. It fails
   closed to `REFUSE` (a constitutional refusal), records the governance outcome verbatim, and marks the decision
   `evaluated: false`. It never modifies the `GovernanceDecision` and never turns a non-authorization into a permission.

4. **It protects; it never performs.** The engine identifies, classifies, bounds, refuses, escalates, and degrades, and
   its protective components are **inert**: the SanitizationEngine, RuntimeBoundaryEnforcer, IsolationManager, and
   SafeRefusalEngine produce **directives and dispositions** describing the protection Operations must apply; they never
   sanitize, restrict, isolate, refuse, or execute anything (`refusing-is-inert`, `applying-is-inert`,
   `degrading-is-inert`). The engine invokes no engine, selects and invokes no provider, performs no inference, schedules
   nothing, aggregates no result, and holds no mutable shared state.

5. **Fail closed, zero trust, deterministic, no bypass.** Every prompt, tool, memory, retrieval, and runtime element is
   untrusted and requires evaluation. An unknown or unconfirmed element (an unknown tool capability, memory or retrieval
   scope, or an unrecognized governed trust) always yields `UNSAFE` or `REFUSE`, never a proceed
   (`unconfirmed-refuses-escalates-degrades`, `low-confidence-raises-protection`, `incompleteness-treated-as-hazard`).
   Protection is layered (defense in depth): where several hazards demand different protections, the strongest applies and
   protection is never lowered (`higher-risk-raises-protection`, `threshold-crossing-escalates-inherited-never-lowers`).
   The decision is deterministic: an identical plan, governance decision, configuration, and registered policy always
   produce an identical `SafetyDecision`, including its content-hash id; there is no randomness. Every refusal,
   restriction, sanitization, and degradation is explained and reproducible.

6. **The seven outcomes are the complete decision vocabulary, ordered by protection.** `SAFE`, `SANITIZE`, `RESTRICT`,
   `DEGRADE`, `ESCALATE`, `REFUSE`, `UNSAFE`, from least to strongest protection. `SAFE`, `SANITIZE`, `RESTRICT`, and
   `DEGRADE` still execute (unprotected, neutralized, contained, or reduced); `ESCALATE`, `REFUSE`, and `UNSAFE` do not
   execute. `UNSAFE` is the fail-closed terminal verdict and carries an emergency-stop recommendation. No additional
   decision type is introduced without a superseding ADR (the governance-owned `AUTHORIZE` / `DENY` / `REQUIRE_APPROVAL`
   and governance's `ESCALATE` remain governance's; safety's `ESCALATE` is a protective escalation, not an authorization).

7. **It consumes only public contracts, and the graph stays acyclic.** Its `src` edge set is
   `{ agent-engine, governance-engine, tool-engine, prompt-engine, memory-engine, retrieval-engine, safety (namespace),
   governance (namespace), di, events, plugins, errors, kernel }`: `app -> app` (the six engines, all type-only request
   and decision contracts), `app -> namespace` (the frozen safety model it applies and the governed trust model), and
   `app -> substrate`. It imports each engine only through its public barrel, depends on no runtime and no operations
   service, does not import the Provider Engine, and nothing depends on the Safety Engine, so the graph is acyclic. The
   "identity" and "permissions" concerns are not dependencies; permissions are governance's and the subject identity is
   the plan's agent id.

8. **No vendor knowledge (the ADR-0035 invariant carries forward).** The engine holds no vendor client library, model,
   URL, or auth, and it never executes; both are enforced by guard tests.

9. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/40-safety-engine.md` are the Stage 9 artifacts.
   A new ADR is warranted because Stage 9 makes genuinely new architectural decisions: the operational realization of the
   frozen safety model (the runtime protection layer), the seven-outcome protection-ordered `SafetyDecision` grounded in
   the frozen concerns, the zero-trust fail-closed evaluation model, and the governance-precedes-safety propagation rule.

## Rationale

Naming the operational realization of safety is what the frozen safety namespace anticipates ("a runtime evaluation
deferred to the ... operational namespaces that consume this model") and what ADR-0035 established for the Phase 4
operational layer. Separating it from governance is required by the frozen `ai/safety/` identity ("Safety is not
governance") and single-ownership (ADR-0020), and separating it from operations is required because safety protects
action while operations performs it. Alternatives rejected: authorizing, or overriding a governance decision (governance's,
ADR-0042); executing, scheduling, isolating, sanitizing, or aggregating a result (the runtime's / Operations', and it
would make protection perform); selecting or invoking a provider or performing inference (the Provider Engine's, and the
Provider Engine is deliberately excluded from the dependency set); inventing a `RiskLevel` enum (the frozen model
deliberately exposes none); and re-owning the safety model (would duplicate the frozen model).

## Consequences

- The `apps/` layer gains its protection engine; the runtime pipeline `Agent -> Governance -> Safety -> Operations` is
  complete for its first three stages. Operations (Stage 10) consumes exactly `AgentExecutionPlan + GovernanceDecision +
  SafetyDecision`, three immutable inputs, and executes only when it holds an authorizing governance decision and a safe
  safety decision; it never recomputes or overrides either.
- The engine remains non-authorizing, non-executing, deterministic, fail-closed, and provider-agnostic. Its protective
  components emit directives; a later execution stage carries them out.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/safety/README.md` (safety identity, invariants, boundaries)
and the frozen `ai/safety/safety-principles.md`, `risk-classification.md`, `hazard-identification.md`,
`boundary-enforcement.md`, `refusal-model.md`, `escalation-model.md`, `impact-assessment.md`,
`uncertainty-management.md`, and `safe-degradation.md` (the safety model the engine applies); `ai/governance/README.md`
and the frozen governance risk, oversight, and escalation model (the governed trust and oversight the engine applies and
never redefines); `ai/runtime/README.md` ("Governance precedes execution"; the runtime performs enforcement); `ai/agents/`
(the plan and its steps); and ADR-0020, ADR-0024, ADR-0035, ADR-0041, and ADR-0042.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer and the governance-cleared seam), ADR-0042 (the
Governance Enforcement Engine, whose `GovernanceDecision` it consumes and never overrides), ADR-0041 (the Agent Engine,
whose `AgentExecutionPlan` it evaluates), ADR-0039 / ADR-0038 / ADR-0037 / ADR-0036 (the Tool, Retrieval, Memory, and
Prompt Engines, whose request contracts its inspectors consume), ADR-0026 (the composition-root seam), ADR-0005 (frozen
DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021 / ADR-0024. Consumes the frozen Phase 2B
`@openlance/aios-safety` and `@openlance/aios-governance` models. Anticipates the Stage 10 Operations Engine, which
consumes its `SafetyDecision`.
