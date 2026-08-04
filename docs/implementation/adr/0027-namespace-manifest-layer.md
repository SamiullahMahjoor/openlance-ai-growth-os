---
id: ADR-0027
title: The namespace manifest layer consumes frozen namespaces and defers the dependency topology to the constitution
status: Accepted
date: 2026-08-04
supersedes: []
superseded_by: null
---

# ADR-0027: The namespace manifest layer consumes frozen namespaces and defers the dependency topology to the constitution

## Status

Accepted (Phase 3, Stage 2). It introduces no duplicate constitutional truth, preserves ADR-0020, ADR-0021, and
ADR-0026, and modifies no frozen namespace.

## Context

Phase 3 Stage 1 (ADR-0026) built the composition root, which composes the substrate services into a validated
object graph. Stage 2 (Namespace Wiring) connects the 13 frozen namespaces to that Application. Two facts
constrain what it can do:

- The 13 namespace packages are pure ADR-0020 domain models: each has dependency edge `[]` (imports nothing),
  no DI token, and no runtime service. There is no namespace service to register into the DI container; a
  namespace "receives cross-cutting services by dependency injection at composition time" (ADR-0021), which is a
  later phase, once those services exist.
- The inter-namespace dependency topology (governance <- providers, agents <- reasoning, and so on) is
  constitutional truth owned by `ai/architecture/dependency-map.md` (Frozen, Reference authority), already
  encoded once as an engineering derivation in `.dependency-cruiser.cjs` `NAMESPACE_DEPS`.

So Stage 2 cannot wire services (there are none) and must not create a third, drifting copy of the
constitutional dependency map. The question this ADR settles: what the namespace wiring layer declares, and how
it relates to the frozen namespaces and the constitution, without recreating either.

## Decision

1. **Stage 2 is a new `apps/`-layer package (`@openlance/aios-namespace-wiring`) that consumes the frozen
   namespace packages and the Stage 1 `Application`.** Importing a frozen namespace package from the `apps/`
   layer is a legal edge: the frozen dependency graph governs namespace <-> namespace edges and the AI ->
   knowledge edge, and forbids substrate -> namespace; it does not forbid app -> namespace. No dependency-cruiser
   rule is added or changed.

2. **The manifest declares namespace identity and availability, and the actual (empty) package dependency
   edges, and defers the allowed-edge topology to the constitution.** Each namespace descriptor records its
   slug, its constitution README id, its availability (its barrel is importable and its referenced catalog is
   non-empty), a `conceptCount` diagnostic (the catalog size; the model is not restated), and its actual
   inter-namespace dependency edges, which are empty because the frozen packages import nothing. The manifest
   **references** `ai/architecture/dependency-map.md` as the owner of the allowed-edge topology and **never
   re-encodes** `NAMESPACE_DEPS` as runtime data. This preserves a single source of truth for the dependency
   map and avoids wiring allowed edges that have no runtime existence yet.

3. **It wires no service and executes nothing.** It declares, validates structurally (identity present,
   available with a non-empty catalog, unique slug, and every declared dependency references a registered
   namespace), and attaches an immutable manifest to the Stage 1 Application, failing closed on any invalidity. It recreates no container, registry, application, bootstrap, namespace model, or runtime
   model (ADR-0020, ADR-0026). Registering namespace services under the allowed dependency edges is a later
   phase, through the composition root's extension seam, once namespaces have operational services.

4. **Design-first cadence continues (ADR-0007).** This ADR and `docs/implementation/24-namespace-wiring.md` are
   the Stage 2 design artifacts, approved before implementation.

## Rationale

Consuming the frozen namespaces and referencing the constitutional dependency map keeps the manifest a truthful,
non-duplicating declaration of what exists today: the namespaces, their identity, and their availability. It
honors "consume, never recreate" for both the namespace models and the dependency graph, and it keeps the
dependency map's single source of truth in the constitution. Declaring the actual (empty) edges rather than the
constitutional allowed edges avoids premature wiring of dependencies that no runtime consumes yet, consistent
with the reasoning that deferred the composition root itself (ADR-0017) until there was something real to wire.

## Consequences

- A new `apps/`-layer package exists, depending on the 13 frozen namespace packages, the Stage 1 composition
  root, and the kernel/errors substrate. Its edges are recorded in `dependency-graph.snapshot.json` (a reviewable
  diff). It introduces the first app -> namespace edges; no existing edge or rule changes.
- The manifest is a validated, immutable data structure; it performs no execution. Later phases add namespace
  services and wire them under the constitutional allowed edges through the composition root's seam.
- No frozen namespace, no constitution document, no dependency rule, and no other ADR's decision changes.

## Related constitutional references

`ai/architecture/dependency-map.md` (owner of the namespace dependency topology, referenced not restated). This
ADR records an engineering composition decision; it realizes no constitutional concept and changes no
constitutional ownership.

## Related ADRs

Builds on ADR-0026 (composition root), ADR-0020 (namespace implementation model), ADR-0021 (namespace dependency
policy), ADR-0024 (namespace categories), and ADR-0007 (design-first cadence).
