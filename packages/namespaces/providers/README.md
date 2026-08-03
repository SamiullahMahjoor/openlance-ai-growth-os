# @openlance/aios-providers

The immutable, technology-neutral **domain model** of the AI layer's provider abstraction.

- **Constitution:** `ai/providers/` (id `OL-AI-PROVIDERS-README`), the **Specification** authority layer.
- **Category:** Infrastructure Adapter (ADR-0024, category 4) - it owns the external-integration
  boundary abstraction; realized at this layer per ADR-0020 as an **immutable, stateless domain model**
  (no IO). **Design:** [docs/implementation/11-providers.md](../../../docs/implementation/11-providers.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states provider truth as strongly-typed classifications, immutable definitions and invariants, and
pure deterministic predicates that express the provider specification verbatim. A provider is the
provider- and model-neutral abstraction over a source of intelligence: this package defines what a
provider is and how it is identified, described by capability, presented, selected, routed to, fallen
back from, kept compatible, bounded, and versioned. It **never executes a provider, never networks,
never orchestrates, and never defines a protocol, an interface, or code** (`ai/providers/README.md`,
ADR-0020): a provider is invoked and executed by `ai/runtime/`, and the intelligence a source produces
is the source's own. It owns no runtime, no mutable state, no lifecycle, no events, no IO, and no
services.

### Why a Pure Domain Model for an "Infrastructure Adapter"

ADR-0024 classifies Providers as category 4 (Infrastructure Adapter): it owns the boundary/abstraction
to external sources of intelligence. ADR-0020 - foundational to and cited by ADR-0024 - fixes how
*every* technology-neutral constitutional namespace is realized in code: "a set of types, frozen data,
and pure predicates... no IO," while "the category a namespace belongs to is fixed by ADR-0024." The
frozen constitution independently forbids this namespace from executing, networking, or containing code.
So Providers owns the external-integration boundary **as an immutable specification model**; the
IO-bearing invocation is the runtime's. Runtime evaluations over a concrete need and provider registry
(selecting, routing, falling back, and judging compatibility for a specific request) are deferred to the
runtime, exactly as a governance concern defers its runtime evaluation.

## Public API (single barrel, Engineering Rule 1)

All ten provider concerns from `ai/providers/`, plus the namespace-wide truth, are implemented as an
immutable model. Each concern exposes its **Principles** and **Invariants** (the two normative sections
of the Provider Document Standard), and, where the **Specification** enumerates a genuine closed domain
set, that classification too.

- **Namespace** (`README.md`, `providers.md`): `ProviderInvariant` + `PROVIDER_INVARIANTS` (the seven
  provider invariants every concern instantiates); `ProviderConcern` + `PROVIDER_CONCERNS` (the ten
  concerns of the inventory). The namespace is deterministic, scalable, provider-neutral, and additively
  extensible.
- **Provider architecture** (`provider-architecture.md`): principles, invariants, and `ProviderPart` +
  `PROVIDER_PARTS` (the three parts a provider is composed of: identity, capabilities, abstraction).
- **Provider lifecycle** (`provider-lifecycle.md`): principles, invariants, and `ProviderLifecyclePhase`
  + `PROVIDER_LIFECYCLE_PHASES` (the five ordered phases). Two pure predicates express the ordering and
  the usability rule: `phaseAtOrAfter(a, b)` and `usableInPhase(phase)` (a provider is used only in
  Activation and Operation).
- **Provider capabilities** (`provider-capabilities.md`): principles and invariants. No capability
  enumeration - a capability is an open declared ability and names no vendor or model.
- **Provider abstraction** (`provider-abstraction.md`): principles and invariants.
- **Provider selection** (`provider-selection.md`): principles and invariants; the choice over a need
  and a registry is deferred to the runtime.
- **Provider routing** (`provider-routing.md`): principles and invariants; directing a concrete request
  is deferred to the runtime.
- **Provider fallback** (`provider-fallback.md`): principles and invariants; walking a concrete chain is
  deferred to the runtime.
- **Provider compatibility** (`provider-compatibility.md`): principles, invariants, and
  `CompatibilityKind` + `COMPATIBILITY_KINDS` (capability, version); judging a concrete provider or
  version is deferred to the runtime.
- **Provider boundaries** (`provider-boundaries.md`): principles, invariants, and `ProviderBoundary` +
  `PROVIDER_BOUNDARIES` (the six architectural boundaries a provider operates within).
- **Provider versioning** (`provider-versioning.md`): principles, invariants, and
  `ProviderVersioningAspect` + `PROVIDER_VERSIONING_ASPECTS` (version-rules, evolution, migration,
  deprecation). Governed change is owned by `ai/governance/change-governance.md`, referenced not restated.

Every exported symbol traces directly to a frozen `ai/providers/` document. No provider executor,
network, protocol, or runtime-context evaluator (`selectProvider(request)`, `route(request)`,
`invoke(...)`) is exported; that boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Providers depends on the constitution and the
Governance namespace, and on no other namespace (dependency-cruiser `NAMESPACE_DEPS.providers =
['governance']`). As a pure domain model it uses no governance-owned type - it references governance
rules in prose and never restates or imports them (ADR-0021, import only what you use; referenced-model
non-restatement) - so it imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no execution, orchestration, reasoning, retrieval, memory, prompt, agent, safety rule, tool,
evaluation, or operations behavior, no business truth, and no intelligence a source produces. It
presents a source of intelligence neutrally; it does not use it. Invocation and execution of a provider
are performed by the runtime, which consumes this model.
