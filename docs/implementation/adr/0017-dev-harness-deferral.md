---
id: ADR-0017
title: Defer apps/dev-harness to the start of the Runtime phase
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0017: Defer apps/dev-harness to the start of the Runtime phase

## Status

Accepted

## Context

The repository architecture (subsystem 00, sections 2 and 5) lists an `apps/dev-harness`
composition root for Phase 2A that "boots the substrate to prove wiring", and Definition-of-Done
criterion 4 (integration testing) references it. It was not built; `apps/` contains only a
`.gitkeep`. Rule 3 and DoD criteria 2 and 11 require any deviation from the approved design to be
recorded as an ADR or a design amendment. This ADR records the deferral.

## Decision

Defer `apps/dev-harness` to the start of the Runtime phase, when the first namespace composition
root exists to wire. `apps/` remains a reserved location. The substrate's composed wiring is, in
Phase 2A, exercised by the `@openlance/aios-testing` harness (`createHarness`) and by the package
test suites, which instantiate `di`, `config`, `logging`, `events`, and `plugins` together; a
standalone boot application would add a composition root with no consumer to wire until a namespace
package has runtime code. Substrate correctness is therefore not gated on the dev-harness.

## Rationale

A composition root is most meaningful once there is something to compose. Building an empty boot
app now would either duplicate what the testing harness already exercises or invite premature
wiring of reserved namespaces. Deferring it keeps Phase 2A to substrate hardening while making the
documentation truthful about what ships.

## Consequences

Subsystem 00 and the Definition of Done are annotated to mark `apps/dev-harness` deferred by this
ADR; the integration-testing criterion is satisfied in Phase 2A by the `createHarness` suite. The
dev-harness application is added when the Runtime phase begins, at which point a superseding note
or its own acceptance record covers it.

## Related constitutional references

None. This is an engineering scope decision; it realizes no constitutional concept and changes no
constitutional ownership.

## Related ADRs

Relates to ADR-0007 (design-first delivery cadence) and subsystem 00 (Repository Architecture).
