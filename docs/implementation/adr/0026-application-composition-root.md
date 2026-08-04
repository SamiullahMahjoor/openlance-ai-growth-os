---
id: ADR-0026
title: Application composition root consumes the frozen DI mechanism; it is not a new container
status: Accepted
date: 2026-08-04
supersedes: [ADR-0017]
superseded_by: null
---

# ADR-0026: Application composition root consumes the frozen DI mechanism; it is not a new container

## Status

Accepted (Phase 3, Stage 1). This ADR supersedes ADR-0017; ADR-0017's status is `Superseded by ADR-0026`.

## Context

Phase 2A shipped the substrate (subsystems 00-09), and Phase 2B froze the 13 AI namespaces as pure ADR-0020
domain models (each with dependency edge `[]` and no runtime code). Phase 3, Stage 1 begins the operational
layer with the **application composition root**: the bootstrap that constructs the AIOS object graph later
stages extend.

Two prior decisions bear on this directly:

- **ADR-0005** built the DI mechanism in `@openlance/aios-di`: `createContainer`/`Container` (register, resolve,
  scopes, `validate()`, `dispose()`), `createModuleHost`/`ModuleHost` (whose own doc-comment names it "the
  composition root": collect modules, order by `dependsOn`, register, validate, return a `Container`), the
  `token()` primitive, and startup `validate()` that rejects missing dependencies, cycles, and lifetime
  mismatches, returning a `Result` rather than throwing. Its stability is High; a public-surface change requires
  a superseding ADR.
- **ADR-0014** (generalizing ADR-0010) fixed how the composition root wires cross-package substrate services:
  each owning package exposes one `Token<TheService>` (`CONFIG_SERVICE`, `LOGGER`, `EVENT_BUS`), constructs the
  instance explicitly (fallible builds return a `Result`, failing closed), and "the composition root registers
  the built instance under the token in a container."
- **ADR-0017** deferred the `apps/dev-harness` composition root "to the start of the Runtime phase, when the
  first namespace composition root exists to wire," because "a composition root is most meaningful once there
  is something to compose," and building an empty boot app earlier "would either duplicate what the testing
  harness already exercises or invite premature wiring of reserved namespaces."

Phase 3, Stage 1 is the start of that operational work. The question this ADR settles: what does the Stage 1
composition root own and build, given that a container, registries, a module host, and startup validation
already exist and are frozen, and that no namespace has runtime code yet.

## Decision

1. **The application composition root is a new `apps/`-layer package that consumes the frozen
   `@openlance/aios-di` mechanism. It does not define a new container, registry, provider model, module host,
   dependency-resolution algorithm, or startup-validation engine.** Those are owned by `@openlance/aios-di`
   (ADR-0005) and are consumed through its public barrel. Re-implementing any of them is prohibited (No
   Duplicated Truth; Engineering Rule 1).

2. **Stage 1 composes the substrate cross-package services only** (`CONFIG_SERVICE`, `LOGGER`, `EVENT_BUS`),
   using the ADR-0014 token pattern and `createModuleHost().build()`, and returns a validated, immutable
   application handle over a `Result` (failing closed on a build or validation failure). It registers no
   namespace or operational service, because none has runtime code; those are added by later Phase 3 stages as
   each namespace's operational implementation is designed. The composition root exposes a documented extension
   seam (accepting additional `di` `Module`s) so later stages register their services without changing this
   package's core.

3. **This supersedes ADR-0017's deferral.** The composition root is built now, scoped to the substrate, as the
   Phase 3 foundation. The distinction ADR-0017 drew (wait until a namespace has runtime code) is replaced by a
   staged one: build the substrate composition root now; add namespace wiring per stage as runtime code
   appears. The `@openlance/aios-testing` `createHarness` remains the integration-test composition root; this
   package is the production bootstrap entry, a distinct concern.

4. **Design-first cadence continues into Phase 3.** ADR-0007's approval-then-build discipline and its permanent
   "never invent architecture" gate carry forward: each Phase 3 stage produces a design document
   (`docs/implementation/NN-*.md`) approved before implementation. This ADR and `docs/implementation/23-composition-root.md`
   are the Stage 1 design artifacts.

## Rationale

The composition root is the one place the substrate services become an object graph, which is a genuine app
concern the substrate deliberately leaves to `apps/*` (subsystem 00). Building it on top of the frozen `di`
honors ADR-0005, ADR-0010, and ADR-0014 while inventing nothing: `di` already provides the container,
registries, ordering, and validation, so the app owns only the bootstrap entry, the service registration set,
composition diagnostics, and startup configuration. Superseding ADR-0017 is appropriate because Phase 3 is the
operational phase ADR-0017 pointed to, and a substrate-scoped root is now meaningful even before namespace
runtime code exists, as the seam later stages build on.

## Consequences

- A new package under `apps/` (layer `app`) exists, depending only on the substrate (`di`, `config`, `logging`,
  `events`, `kernel`, `errors`). It adds no namespace dependency and imports no frozen namespace package (the
  namespace models are referenced conceptually, never wired, until their operational stages).
- ADR-0017 is superseded on acceptance; `apps/` gains its first real occupant. `createHarness` is unaffected.
- Later Phase 3 stages (runtime execution, provider adapters, namespace operational services) register their
  services through the composition root's extension seam, each under its own design document and, where it
  needs a concept the constitution does not define, its own ADR.
- No frozen namespace, no constitution document, no dependency rule, and no other ADR's decision changes.

## Related constitutional references

None. This is an engineering composition decision; it realizes no constitutional concept and changes no
constitutional ownership. The Operations namespace (`ai/operations/`, ADR-0024 category 5) is the constitutional
model this operational layer conforms to; it is referenced, never restated.

## Related ADRs

Supersedes ADR-0017 (on acceptance). Builds on ADR-0005 (custom DI container), ADR-0010 and ADR-0014 (DI-token
composition), ADR-0007 (design-first cadence), and ADR-0024 (Operations is category 5, Composition Root).
