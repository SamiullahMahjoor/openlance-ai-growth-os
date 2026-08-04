---
id: ADR-0035
title: Phase 4 operational services execute behind a governance-cleared seam and register through the composition root; the Provider Engine is the Runtime's vendor-neutral operational provider subsystem
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0035: Phase 4 operational services execute behind a governance-cleared seam and register through the composition root; the Provider Engine is the Runtime's vendor-neutral operational provider subsystem

## Status

**Accepted** (Phase 4, Stage 1). This ADR opens the operational phase and was approved under ADR-0007's
design-first cadence before Stage 1 implementation began. It introduces no duplicate constitutional or engineering
truth, changes no frozen work, supersedes nothing, and preserves ADR-0005, ADR-0006, ADR-0007, ADR-0020, ADR-0021,
ADR-0024, and ADR-0026 to ADR-0034.

## Context

Phase 2B froze the thirteen AI namespaces as pure ADR-0020 domain models (each dependency edge `[]`, no runtime
code). Phase 3 built the runtime-integration layer as eight immutable, descriptive, non-executing `apps/`-layer
packages that plan, validate by delegation to frozen predicates, and fail closed, carrying nothing out. Both phases
executed nothing by design; `PHASE-3-COMPLETE.md` records that real execution and enforcement are "operational
implementations that begin Phase 4," a separate design-first phase.

Phase 4, Stage 1 is the Provider Engine: the first stage that introduces real executable behavior. A full source
reading (below) fixes three facts that this ADR must honor, and that make Stage 1 a foundational decision rather than
a routine package:

- **Provider execution and invocation belong to the Runtime, not to the Providers namespace.** `ai/providers/README.md`:
  "A provider is not the runtime. The runtime orchestrates and executes; a provider is the abstraction the runtime
  invokes to use intelligence. A provider never orchestrates, schedules, or executes; those are owned by ai/runtime/."
  Its boundary assigns "Execution, orchestration, and run-time invocation of a provider" to `ai/runtime/`, and its
  invariant states "A provider serves; it owns none of the behavior it serves." The frozen `@openlance/aios-providers`
  barrel repeats it: "a provider is invoked and executed by ai/runtime/ (ADR-0020)," and the runtime evaluations over
  a concrete need and registry (selecting, routing, falling back, judging compatibility for a specific request) "are
  deferred to the runtime." `ai/runtime/README.md`: the Runtime "owns execution ... It is the kernel," and "Runtime
  sequences and combines their results" for the operational namespaces including Providers.
- **Governance precedes execution, absolutely.** The runtime invariant is "Governance precedes execution. Every
  significant action is validated against governance before it runs." The providers invariant is "A provider is
  selected and used only within the rules governance sets and the limits safety allows." ADR-0020: "Governance
  provides truth. Runtime performs enforcement. This boundary is absolute." Per ADR-0031 and `PHASE-3-COMPLETE.md`,
  the governance enforcement engine and the runtime execution/validation pipeline that would mint that validation are
  themselves later Phase 4 stages and do not yet exist.
- **No Phase 4 operational-layer architecture exists yet.** ADR-0026 anticipated the integration point ("Later stages
  (runtime execution, provider adapters, namespace operational services) register their services through the
  composition root's extension seam, each under its own design document and ... its own ADR"), but nothing yet
  decides where executable operational services live, their shape, how a service that executes honors
  "governance precedes execution" before the governance engine exists, or how the Provider Engine relates to the two
  frozen models it realizes. Stage 1 sets that pattern for all of Phase 4.

Source read from origin this session: `ai/providers/README.md`, the frozen `@openlance/aios-providers` public barrel,
`ai/runtime/README.md`, ADR-0026, ADR-0031 / `28-governance-enforcement.md`, `PHASE-3-COMPLETE.md` /
`RUNTIME-INTEGRATION-FREEZE.md`, and a search confirming no existing Phase 4 or operational design document.

## Decision

1. **Phase 4 introduces the operational layer: executable services that carry out what the descriptive layer planned.**
   Unlike Phase 2B namespaces (pure ADR-0020 models) and the Phase 3 chain (descriptive, executes-nothing), a Phase 4
   operational service performs real work: IO, state, orchestration, event emission, error recovery. This is expected
   and permitted; the constitution assigns execution to the Runtime and the operational namespaces. The
   "executes nothing" property was a per-stage contract of the frozen Phase 3 packages, never a layer-wide rule; those
   packages remain frozen and unchanged.

2. **Operational services are `apps/`-layer packages that register through the frozen composition-root seam.** Each is
   an `apps/*` package (`aios.layer: "app"`, the existing layer, reusing the frozen dependency rules; no new layer or
   dependency-cruiser rule is introduced) that consumes the frozen substrate, the frozen namespace models, and the
   frozen Phase 3 chain, and exposes a `@openlance/aios-di` `Module` registered through the composition root's
   documented extension seam (ADR-0026 `CompositionConfig.modules`). It defines no new container, registry, module
   host, event bus, error taxonomy, config service, or plugin host; those are consumed from the frozen substrate.

3. **Execution sits behind a governance-cleared seam.** Any operational executor whose action is a "significant
   action" in the runtime sense requires, as a typed precondition, a governance clearance that only the runtime
   validation pipeline / governance enforcement engine (a later Phase 4 stage) can mint. The operational service never
   fabricates its own clearance for an arbitrary request and never offers a path to execute without one. This makes
   "governance precedes execution" structural rather than conventional, even while the minting stage is unbuilt: the
   engine can invoke a provider only when handed a clearance, and Stage 1 supplies clearances only through a clearly
   marked test-and-benchmark seam that stands in for a completed validation, never a production auto-clear.

4. **The Provider Engine (Phase 4, Stage 1) is the Runtime's vendor-neutral operational provider subsystem.** It
   consumes the frozen `@openlance/aios-providers` pure model (identity, capability, abstraction, selection, routing,
   fallback, lifecycle phases, compatibility, versioning, boundaries) and the frozen `@openlance/aios-runtime`
   execution model, and realizes their operational behavior (registration, discovery, capability lookup, deterministic
   selection and routing, health, lifecycle, governed invocation, bounded failover, response normalization,
   observability) over a `Provider` abstraction. It re-owns nothing: the model stays owned by Providers, the execution
   model by Runtime; the engine is their operational realization. It binds to no vendor: it depends only on the
   `Provider` abstraction, names no provider, model, or SDK, and each concrete adapter (for example a specific vendor)
   is a separate later sub-stage implemented against the frozen engine, so vendor and model churn never touch the core.

5. **The Provider Engine never contains vendor knowledge (a constitutional invariant of this operational layer).**
   The engine holds no OpenAI, Anthropic, Gemini, Grok, DeepSeek, or Ollama logic, no provider-specific request or
   response model, no SDK reference, no API URL, and no authentication logic. It owns only: provider lifecycle,
   provider registry, provider selection, provider routing, provider capability evaluation, the provider execution
   contract, provider health, provider metrics, the provider normalization interface, and governed execution
   coordination. Concrete providers are implemented later as independent adapter packages that depend on the frozen
   `Provider` abstraction, never the reverse; that dependency direction is permanent. This invariant is enforced
   structurally: the engine declares no vendor dependency and imports no vendor SDK, and a guard test fails the build
   if any vendor name or SDK identifier appears in its source.

6. **Design-first cadence continues (ADR-0007).** This ADR and `docs/implementation/32-provider-engine.md` are the
   Stage 1 design artifacts, approved before implementation. Subsequent Phase 4 operational stages follow this ADR's
   pattern and need a fresh ADR only where they introduce a genuinely new architectural concept.

## Rationale

The three facts above make the naive reading of "Provider Engine" (a package that owns provider execution) a
constitutional violation, so the decision reframes it as what the constitution already anticipates: the Runtime's
operational realization of the frozen Providers model, gated by governance. Alternatives considered and rejected:

- **A new "provider engine" namespace or provider-owned execution.** Rejected: the Providers namespace "never executes"
  and the Runtime owns "run-time invocation of a provider"; this would re-own a frozen boundary (ADR-0020, ADR-0025).
- **An ungoverned infrastructure engine (execute freely, govern later at the caller).** Rejected: it creates a path to
  provider invocation that bypasses governance, violating "governance precedes execution" and "a provider is used only
  within the rules governance sets." The typed clearance seam removes the bypass by construction.
- **Defer all of Phase 4 until the governance and runtime execution engines exist.** Rejected: the roadmap sequences
  the Provider Engine first, and the cleared-seam pattern lets it proceed safely without waiting, while guaranteeing it
  cannot execute an unvalidated request.
- **A new operational package tier / layer.** Rejected: reusing the frozen `apps/` "app" layer inherits the existing,
  frozen dependency rules and touches no dependency-cruiser configuration; a new tier would be gratuitous architecture.
- **Implement concrete vendor adapters inside Stage 1.** Rejected (and the requester's own steer): binding a vendor in
  the engine would violate provider neutrality and couple the core to churn. Adapters are separate sub-stages against
  the frozen engine.

## Consequences

- The `apps/` layer gains its first executable occupants. It now holds both the frozen, descriptive Phase 3 packages
  (which still execute nothing) and Phase 4 operational packages (which execute). This is consistent: executes-nothing
  was a Phase 3 per-package contract, not a property of the layer.
- Subsequent Phase 4 operational stages (further namespace operational services, the runtime execution engine, the
  governance enforcement engine that mints clearances) follow this ADR: `apps/`-layer package, composition-root seam
  registration, governance-cleared execution seam, consume-not-recreate the frozen models. Each needs a new ADR only
  for a genuinely new architectural concept.
- The Provider Engine's concrete vendor adapters are separate, later sub-stages, each its own design artifact,
  implemented against the frozen engine and its `Provider` abstraction; none may be named or bound in the core.
- The governance-cleared seam creates a follow-on obligation: when the runtime validation pipeline / governance
  enforcement engine is built, it becomes the sole minter of clearances, and the Provider Engine's test-and-benchmark
  clearance seam is superseded by that real minter with no change to the executor's public contract.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/runtime/README.md` (the Runtime owns execution and the
run-time invocation of a provider; "Governance precedes execution"), `ai/providers/README.md` (the Providers namespace
owns the neutral model and never executes; run-time invocation belongs to the Runtime), `ai/governance/` (owns the
rules that bound execution), `ai/operations/` (ADR-0024 category 5, "runs the layer," the operational model this layer
conforms to), and ADR-0020 ("Governance provides truth. Runtime performs enforcement. This boundary is absolute").

## Related ADRs

Supersedes none. Builds on ADR-0026 (the composition-root extension seam), ADR-0005 (the frozen DI mechanism),
ADR-0006 (Result error handling), ADR-0020 / ADR-0021 / ADR-0024 (the namespace implementation model, substrate
dependency policy, and purity categories), ADR-0007 (design-first cadence), the frozen Phase 2B
`@openlance/aios-providers` model, and the Phase 3 chain (ADR-0027 to ADR-0034). Relates to ADR-0031 (which recorded
governance enforcement, the future clearance minter, as a Phase 4 operational capability).
