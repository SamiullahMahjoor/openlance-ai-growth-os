---
id: ADR-0024
title: Namespace purity categories
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0024: Namespace purity categories

## Status

Accepted (architecture review decision P5, Phase 2B).

## Context

ADR-0020 fixes what a technology-neutral namespace becomes in code. To prevent architectural drift
across the remaining AI namespaces, each namespace must have a single, declared implementation
category, so that its shape (pure model, pure algorithm, service, adapter, or composition root)
cannot blur over time.

## Decision

Every namespace belongs to **exactly one** implementation category. The categories are:

1. **Pure Domain Model.** Immutable truth. No runtime, no state, no IO, no services. Contains
   domain models, classifications, immutable definitions, and pure predicates. Example: **Governance**.
2. **Pure Algorithms.** Stateless deterministic computation. No runtime ownership, no persistence,
   no orchestration. Contains algorithms only. Example: **Reasoning**.
3. **Runtime Service.** Coordinates execution. Owns lifecycle and orchestration. Consumes other
   namespaces. Example: **Runtime**.
4. **Infrastructure Adapter.** Boundary to external systems. Owns integrations only. Examples:
   **Providers**, **Memory** storage adapters, **Tool** adapters.
5. **Composition Root.** Builds the complete application, creates the dependency graph, and performs
   dependency-injection composition. Owns nothing else. Example: **Operations**.

Mixing categories is prohibited. A namespace may not gradually evolve from one category into
another. If a change of category ever becomes necessary, it requires a new ADR, an architecture
review, and implementation approval before any code changes.

Each namespace's category is declared in its implementation design (ADR-0023) when it is designed;
the categories above are the ones fixed by this review. Governance is implemented as category 1
(Pure Domain Model), consistent with ADR-0020.

## Rationale

A single declared category per namespace makes the boundary between "owns truth", "computes",
"coordinates", "adapts", and "composes" explicit and enforceable by review, so no namespace silently
acquires responsibilities that belong to another.

## Consequences

The category constrains what a namespace's package may contain and depend on, in addition to
ADR-0020 and ADR-0021. A category change is an architecture-review event, never an incremental
refactor.

## Related constitutional references

`ai/architecture/ownership-map.md` (one owner per concern). Engineering categorization; changes no
constitutional ownership.

## Related ADRs

Builds on ADR-0020 (namespace implementation model); relates to ADR-0023 (namespace development
lifecycle).
