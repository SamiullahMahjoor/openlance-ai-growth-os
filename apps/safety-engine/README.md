# @openlance/aios-safety-engine

The AIOS **Safety Engine** (Phase 4, Stage 9): the Runtime's operational protection subsystem, the operational
realization of the frozen Safety namespace (`@openlance/aios-safety`). It is the runtime protection layer that determines
whether an already **authorized** plan is safe to execute. See [ADR-0043](../../docs/implementation/adr/0043-safety-engine.md)
and the [design doc](../../docs/implementation/40-safety-engine.md).

## What it does

For a request of an authorized `AgentExecutionPlan` plus the `GovernanceDecision` that authorized it, the engine:

1. **Defers to governance.** If the governance decision is not `AUTHORIZE`, safety performs no evaluation, fails closed to
   a constitutional `REFUSE`, and never overrides or modifies the governance decision.
2. **Identifies hazards** over the plan's steps and coordination, categorized by the frozen `HazardCategory` (capability,
   knowledge, permission, reasoning, runtime, prompt, agent, compound), through the prompt, tool, memory, and retrieval
   safety inspectors and the hazard analyzer.
3. **Classifies required protection** by applying the governed `TrustLevel` (higher governed risk raises protection and
   never lowers it), and assesses impact along the frozen `IMPACT_DIMENSIONS`.
4. **Produces an immutable `SafetyDecision`** with one of seven outcomes, ordered by protection:
   `SAFE < SANITIZE < RESTRICT < DEGRADE < ESCALATE < REFUSE < UNSAFE`, the identified hazards, the protective directives
   Operations is to apply, the frozen refusal category when it refuses or escalates, the governed oversight and trust it
   applied, the consumed governance id, and a deterministic content-hash audit id.

## What it never does

It authorizes nothing, executes nothing, invokes no engine, schedules nothing, aggregates no result, selects and invokes
no provider, and performs no inference. Its protective components (sanitization, boundary enforcement, isolation, safe
refusal) are **inert**: they describe the protection Operations must apply; they never perform it. It is deterministic,
fail-closed, zero-trust, and provider-agnostic.

## Public API

`SafetyManager` (facade and DI entry, registered under `SAFETY_MANAGER` through the composition-root seam) exposes
`register` (a policy rule), `decide` (a request into a `SafetyDecision`), `remove`, `statistics`, and `diagnostics`. The
inspectors, analyzers, responders, evaluator, configuration, registry, factory, events, metrics, and plugin bridge are
also exported. See `src/index.ts`.

## Boundaries

Safety is not governance (it never authorizes) and not the runtime / operations (it never executes). It consumes the
frozen safety model and the governed trust model, the `AgentExecutionPlan`, the `GovernanceDecision`, and the tool,
prompt, memory, and retrieval request contracts, and the substrate. It does not depend on the Provider Engine.
