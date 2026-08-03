---
id: ADR-0021
title: Namespace to substrate dependency policy
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0021: Namespace to substrate dependency policy

## Status

Accepted (architecture review decision P2, Phase 2B).

## Context

AI namespaces are built on the Phase 2A substrate, but the frozen constitutional dependency map
(`ai/architecture/dependency-map.md`) governs only namespace-to-namespace edges and the AI-to-
knowledge edge; it does not enumerate substrate use. The H1 remediation (ADR-0019) established that
a namespace-to-substrate edge is legal under the enforced graph, but the policy was never recorded.

## Decision

The policy is stated generally, without hardcoding package names:

- AI namespaces may import only substrate packages explicitly permitted by the frozen dependency
  graph (the enforced Rule 2 rules in `.dependency-cruiser.cjs`, which allow a namespace to depend
  on the substrate and forbid the reverse).
- A namespace may never introduce a substrate dependency outside that graph, and never a
  dependency on another namespace outside its constitutional allow-set.
- A namespace imports only what it actually requires; it does not take a substrate dependency it
  does not use.

## Rationale

Stating the rule generally keeps it valid as packages are added and avoids coupling the policy to a
fixed list. Import-only-what-is-required keeps each namespace's dependency surface minimal and its
graph edges reviewable in the committed snapshot.

## Consequences

A pure domain-model namespace (ADR-0020) typically needs little or nothing from the substrate: it
uses value types from `@openlance/aios-kernel` (and error types from `@openlance/aios-errors`) only
where it genuinely needs them, and receives cross-cutting services by dependency injection at
composition time rather than importing them for behavior. Governance in particular imports no
substrate package it does not use.

## Related constitutional references

`ai/architecture/dependency-map.md`. This ADR records an engineering dependency policy; it changes
no constitutional ownership.

## Related ADRs

Relates to ADR-0019 (production import enforcement) and ADR-0020 (namespace implementation model).
