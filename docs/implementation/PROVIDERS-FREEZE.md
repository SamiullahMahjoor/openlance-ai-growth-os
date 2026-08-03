# Providers Namespace, Freeze Declaration

**Status:** FROZEN (all ten provider concerns implemented, validated, and independently audited).
**Package:** `@openlance/aios-providers` (`packages/namespaces/providers`).
**Scope:** the Providers namespace Pure Domain Model, the second namespace of Phase 2B, built on top of
the immutable Phase 2A substrate, the frozen Governance namespace, and the frozen `ai/` and `knowledge/`
constitution.

The Providers namespace is **immutable**. It states the provider- and model-neutral abstraction of the
AI layer and owns none of the behavior that flows through it; it never executes a provider, never
networks, and never defines a protocol, an interface, or code. A provider is invoked and executed by
the runtime, which consumes this model.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/providers/<file>.md` document.
Each models the two normative sections of the Provider Document Standard (Principles, Invariants) and,
where the Specification enumerates a genuine closed set, that classification.

| Module | Concern | Specification classification |
|---|---|---|
| `namespace.ts` | namespace-wide | `PROVIDER_INVARIANTS` (7), `PROVIDER_CONCERNS` (10) |
| `provider-architecture.ts` | Provider Architecture | `PROVIDER_PARTS` (3) |
| `provider-lifecycle.ts` | Provider Lifecycle | `PROVIDER_LIFECYCLE_PHASES` (5, ordered) + predicates |
| `provider-capabilities.ts` | Provider Capabilities | none (open declared ability) |
| `provider-abstraction.ts` | Provider Abstraction | none |
| `provider-selection.ts` | Provider Selection | none (evaluation deferred to runtime) |
| `provider-routing.ts` | Provider Routing | none (evaluation deferred to runtime) |
| `provider-fallback.ts` | Provider Fallback | none (evaluation deferred to runtime) |
| `provider-compatibility.ts` | Provider Compatibility | `COMPATIBILITY_KINDS` (2) |
| `provider-boundaries.ts` | Provider Boundaries | `PROVIDER_BOUNDARIES` (6) |
| `provider-versioning.ts` | Provider Versioning | `PROVIDER_VERSIONING_ASPECTS` (4) |

The ten concerns match the ten concerns in the inventory `ai/providers/providers.md` exactly.

## Category and purity

ADR-0024 classifies Providers as category 4 (Infrastructure Adapter): it owns the external-integration
boundary abstraction. Per ADR-0020 (foundational to and cited by ADR-0024), that ownership is realized
at this layer as an **immutable, stateless domain model** with no IO; the constitution independently
forbids the namespace from executing, networking, or containing code. The IO-bearing invocation is the
runtime's. See `docs/implementation/11-providers.md` section 2.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **27 exported types** and **56
  exported runtime values** (54 frozen catalogs and description records + 2 predicates).
- The only executable logic is the two pure, total, deterministic lifecycle predicates `phaseAtOrAfter`
  and `usableInPhase`, over the provider-owned `ProviderLifecyclePhase` classification. The other
  concerns are immutable definitions; runtime evaluation over a concrete need or registry is deferred.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). Every exported catalog
  is `Object.freeze`d. The namespace imports nothing: its dependency edges are `[]` (it references the
  constitution and the Governance mandates but uses no governance-owned type; ADR-0021).
- 100% coverage on all executable code; full validation green end to end; two independent audits CLEAN.

## What "frozen" means

The namespace's concerns, identities, classifications, orderings, invariants, public API, ownership, and
constitutional traceability are settled. Every runtime evaluation the concerns imply (selecting,
routing, falling back, judging compatibility for a specific request; invoking a provider) is deferred to
the runtime and the operational namespaces, which consume this model and do not modify it.

## Allowed changes (no architecture review required)

Only these categories may change a frozen provider file without an architecture change process, each
still running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**,
**dependency updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a
description that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, ordering, invariant, or description; the introduction of a predicate or the reproduction
of a referenced model owned by another owner; a change of purity category (ADR-0024); the dependency
graph; or the constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional
guard). This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The next namespaces (Memory, Retrieval, Safety, Reasoning, Prompts, Tools, Agents), the Runtime, and the
operational layers consume this model and do not modify it. Agents composes Providers; the Runtime
invokes a provider. They may not modify any frozen provider file except under the allowed-changes policy
above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
