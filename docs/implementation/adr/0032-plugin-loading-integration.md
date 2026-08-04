---
id: ADR-0032
title: Plugin Loading is an application-level integration stage that consumes the frozen plugin framework; Phase 3 continues through Stage 9
status: Accepted
date: 2026-08-04
supersedes: [ADR-0031]
superseded_by: null
---

# ADR-0032: Plugin Loading is an application-level integration stage that consumes the frozen plugin framework; Phase 3 continues through Stage 9

## Status

**Accepted** (Phase 3, Stage 6). This ADR **supersedes ADR-0031**; ADR-0031's status is `Superseded by ADR-0032`.
It reopens Phase 3, which ADR-0031 had recorded complete at Stage 5, and records that the runtime integration chain
continues through Stage 9 per the approved roadmap (Stage 6 Plugin Loading, Stage 7 Error Propagation, Stage 8
Event Flow, Stage 9 Runtime Freeze). It introduces no duplicate constitutional truth, changes no frozen work, and
preserves ADR-0005, ADR-0012, ADR-0013, ADR-0020, ADR-0021, and ADR-0026 to ADR-0030.

## Context

ADR-0031 found that Governance Enforcement added no new descriptive ownership and, on that basis, recorded the
Phase 3 chain complete at Stage 5. On review, the project roadmap is canonical and Phase 3 continues with further
integration concerns whose mechanisms are frozen but whose application-level integration into the runtime chain is
not yet expressed: Plugin Loading, Error Propagation, and Event Flow, before a single consolidated Runtime Freeze
(Stage 9).

For Plugin Loading specifically, a full source reading (the `@openlance/aios-plugins` package,
`docs/implementation/07-plugin-framework.md`, ADR-0012, ADR-0013, and the Stage 1 to 5 docs) establishes:

- The plugin loading **mechanism** is owned, in full, by the frozen Phase 2A substrate package
  `@openlance/aios-plugins`: `PluginHost` (`discover`/`validateCompatibility`/`load`/`start`/`stop`),
  `createPluginHost`, the register -> init -> start / stop -> dispose activation model, compatibility validation,
  and the plugin contracts. It "is a module loader and nothing more." There is no `ai/` plugin document; it is an
  engineering substrate mechanism.
- ADR-0012 fixes the integration point: "The composition root supplies the in-memory `Plugin[]`," and Phase 2A
  "ships zero plugins."
- **Actually** loading, initializing, starting, stopping, or scheduling plugins is execution and activation, a
  Phase 4 operational concern.

So there is a narrow, previously-unowned **application-level** concern between the frozen mechanism and Phase 4
execution: which plugins this application declares available and enabled, whether the enabled set is compatible,
and how that declaration attaches to the runtime integration chain. This is directly parallel to Namespace Wiring
(Stage 2), which declares which namespaces are wired without owning the namespace models.

## Decision

1. **Stage 6 is a new `apps/`-layer package, `@openlance/aios-plugin-loading`, that owns the application-level
   plugin integration only.** It produces an immutable `PluginLoadingPlan` declaring the application's available,
   enabled, compatible, and ready plugins, attached to the Stage 5 `ExecutionPipelinePlan`.
2. **It consumes, never recreates.** It receives a frozen `PluginHost` and consumes only its
   `validateCompatibility`; it recreates no plugin host, registry, loader, lifecycle, compatibility validator, or
   contract (all owned by `@openlance/aios-plugins`), and no chain handle (Stages 1 to 5). It re-declares no
   `PluginManifest`/`PluginContext`/`Plugin`/`PluginError`; it consumes those types.
3. **It executes nothing.** It does not discover, load, initialize, start, stop, or schedule plugins, and runs no
   provider, tool, agent, or workflow. It only validates compatibility by delegation and builds the immutable plan,
   failing closed with no partial plan.
4. **Phase 3 is reopened and continues through Stage 9.** ADR-0031 is superseded. Stages 7 (Error Propagation) and
   8 (Event Flow) are separate, design-first stages, each consuming its frozen substrate package
   (`@openlance/aios-errors`, `@openlance/aios-events`); Stage 9 is a single consolidated Runtime Freeze of the
   Phase 3 integration layer. Only Stage 6 is implemented under this ADR; Stages 7 to 9 are not begun here.

## Rationale

The application-level plugin declaration is a genuine integration concern the frozen mechanism package does not own
(that package is the loader; the composition root supplies the plugin set), and it is the plan a Phase 4 loader
consumes. Building it as a thin descriptive layer that delegates compatibility to the frozen host honors "consume,
never recreate" and the execution ban, exactly as Stages 2 to 5 did for their frozen models. Reopening Phase 3
aligns the freeze boundary with the roadmap: the remaining integration concerns are frozen together at Stage 9
rather than each independently.

## Consequences

- A new `apps/`-layer package exists, depending on the Stage 5 execution pipeline, the frozen
  `@openlance/aios-plugins` substrate package, and the kernel/errors substrate; its edges are recorded in
  `dependency-graph.snapshot.json`. The `app -> app` and `app -> substrate` (plugins) edges are legal; no
  dependency-cruiser rule or namespace edge changes.
- ADR-0031 is superseded on acceptance; Phase 3 continues. `PHASE-3-COMPLETE.md` is updated to record the
  reopening; the Phase 3 freeze is now the consolidated Stage 9 Runtime Freeze.
- No frozen namespace, no substrate package, no constitution document, and no other ADR's decision changes.
  ADR-0012 and ADR-0013 (the plugin framework) are preserved and consumed, not modified.

## Related constitutional references

None. This is an engineering composition decision; it realizes no constitutional concept and changes no
constitutional ownership. `docs/implementation/07-plugin-framework.md` and ADR-0012/ADR-0013 (the frozen plugin
framework) are referenced and consumed, never restated.

## Related ADRs

Supersedes ADR-0031. Builds on ADR-0012 and ADR-0013 (plugin framework), ADR-0030 (execution pipeline plan),
ADR-0026 to ADR-0029 (the Phase 3 chain), ADR-0020 (namespace model), ADR-0005 (frozen DI), and ADR-0007
(design-first cadence).
