---
id: ADR-0045
title: The Operations Engine is the Runtime's operational supervision subsystem operationalizing the frozen operations model; it consumes only immutable runtime outputs, derives operational state internally, produces only operations-owned outputs, and never executes or extends a runtime contract
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0045: The Operations Engine is the Runtime's operational supervision subsystem; it operationalizes the frozen ai/operations model, consumes only immutable runtime outputs (RuntimeEvent, ExecutionRecord, ExecutionStatistics), derives its operational state internally, produces only operations-owned outputs, and never executes, orchestrates, or extends a runtime contract

## Status

**Accepted** (Phase 4, Stage 11). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, and ADR-0035 to ADR-0044. It occupies the
Operations position of the pipeline that ADR-0044 fixed: `Agent -> Governance -> Safety -> Runtime Execution -> Provider
Runtime`, with Operations observing the running runtime.

## Context

The Stage 11 mandate builds the Operations Engine: the operational supervision layer (observability, monitoring, health,
incident management, maintenance, diagnostics) over the running runtime. A full source reading fixed one ownership
conflict that forced an Ambiguity Gate, and confirmed the rest is a clean application of the frozen model.

- **`RuntimeEvent` is a frozen type owned by `ai/runtime/`; Operations consumes it and never introduces or extends it.**
  The mandate said "introduce a frozen immutable RuntimeEvent contract" with examples (`RetryStarted`, `CheckpointCreated`,
  `TimeoutOccurred`) that are execution-domain and are not emitted by the frozen Stage-10 Runtime Execution Engine (which
  emits only `execution-started`, one terminal, and `session-closed` of the frozen 8-event `RUNTIME_EVENTS`, plus the
  immutable `ExecutionRecord` / `ExecutionStatistics` / `ExecutionDiagnostics`). Introducing a second `RuntimeEvent` would
  duplicate the frozen `ai/runtime/event-lifecycle` ownership; defining retry / checkpoint events would claim
  execution-domain concerns the mandate itself disowns. The approved resolution (Option 1): **Operations consumes only the
  existing immutable runtime outputs; it introduces no new or competing `RuntimeEvent`; it observes retry, recovery,
  checkpoint, and timeout by reading the immutable `ExecutionRecord` (step `attempts`, the `recovering` state in the
  path) and `ExecutionStatistics` (`retries`), never as new runtime events and never by modifying Stage 10.**
- **The frozen `ai/operations/` model is applied, not invented.** `@openlance/aios-operations` (ADR-0024 category 5, whose
  composition-root ROLE is realized by the separate frozen `apps/composition-root`; this engine realizes the observability
  member concerns) owns the operational model: `HEALTH_STATES` (a closed, ordered set of `healthy < degraded < failed`
  with `healthStateAtOrAfter`), `MAINTENANCE_CATEGORIES` (`corrective`, `preventive`, `adaptive`), and the observability,
  monitoring, incident-management, health-management, diagnostics, and maintenance principles and invariants. The
  mandate's example health states (`UNKNOWN/HEALTHY/DEGRADED/UNHEALTHY/OFFLINE`) are superseded by the frozen three (as
  Stage 10's example states were superseded by the frozen execution states); alerting, dashboards, and capacity are not
  named frozen concerns but ground as operational products of the frozen `monitoring` and `observability` concerns; and
  the incident and maintenance lifecycles are realized operationally (the frozen model narrates them "from recognition to
  closure" / "from plan to completion" and enumerates no closed state set).

## Decision

1. **The pipeline is unchanged; Operations occupies its Operations position and only observes.** `Agent -> Governance ->
   Safety -> Runtime Execution -> Provider Runtime`, with Operations observing the running runtime. Operations never
   participates in execution and never appears upstream of it.

2. **Stage 11 is a new `apps/`-layer package, `@openlance/aios-operations-engine`, the operational realization of the
   frozen `ai/operations/` observability model.** It consumes an immutable observation (a frozen `RuntimeEvent`
   occurrence, an `ExecutionRecord`, or an `ExecutionStatistics`), updates its internal
   operational state deterministically, and produces immutable operations-owned outputs: `OperationalStatus`,
   `HealthReport`, `IncidentReport`, `OperationalAlert`, `MaintenancePlan`, `OperationalMetrics`, `OperationalDashboard`,
   `CapacityReport`, `OperationalDiagnostics`, and `OperationalAudit`. It follows the ADR-0035 operational-layer pattern.

3. **It consumes only immutable runtime outputs, and never runtime internals.** It reads the frozen `RuntimeEvent`, the
   immutable `ExecutionRecord`, and `ExecutionStatistics`. It never consumes an `ExecutionPlan`,
   `GovernanceDecision`, `SafetyDecision`, `ExecutionRequest`, or any runtime internal (the coordinator, scheduler, retry,
   checkpoint, cancellation, or recovery managers). It never modifies an `ExecutionRecord`, a `RuntimeEvent`, or any
   runtime telemetry, and it recomputes no runtime metric.

4. **It applies the frozen operations model.** Health is assessed as one of the frozen `HEALTH_STATES`
   (`healthy | degraded | failed`) using `healthStateAtOrAfter`; the engine invents no health state. Every maintenance
   activity carries one frozen `MAINTENANCE_CATEGORY`. The incident and maintenance operational lifecycles are realized
   within the frozen "recognition to closure" and "plan to completion" bounds. Alerting is grounded in the frozen
   `monitoring` concern (signals watched against expectations), dashboards and capacity in `observability`.

5. **It never executes, and it defers protection and judgment.** It never executes, orchestrates, schedules, retries,
   recovers, cancels, checkpoints, invokes or selects a provider, performs inference, or performs any subject namespace's
   behavior. An operational incident is not a safety hazard: where safety is implied, the engine defers the protective
   response to `ai/safety/` and any governed decision to `ai/governance/`; it records and reports and never itself
   protects, degrades, or decides (the frozen health-management and incident-management invariants).

6. **Zero trust, fail closed, deterministic, idempotent.** Every observation is untrusted and validated; an unknown or
   unrecognized event, metric, component, or telemetry never yields `healthy` (it yields `degraded` or `failed`, the
   fail-closed default). The same sequence of observations always yields the same operational state and the same immutable
   reports (each carrying a deterministic content-hash id); there is no randomness. Processing the same observation twice
   (by its id) never duplicates an alert, incident, maintenance activity, health record, or audit entry.

7. **It consumes only public contracts, and the graph stays acyclic.** Its `src` edge set is
   `{ runtime-execution-engine (app, type-only: ExecutionRecord / ExecutionStatistics), runtime and
   operations (namespaces: the frozen RuntimeEvent and the frozen operations model), di, events, plugins, errors, kernel
   (substrate) }`. It imports each through its public barrel, depends on no other operational engine and on no runtime
   internal, and nothing depends on the Operations Engine, so the graph is acyclic.

8. **No vendor knowledge and no execution (the ADR-0035 invariant carries forward).** The engine names no monitoring
   tool, dashboard product, alerting platform, vendor, model, URL, or auth, and it never executes; both are enforced by
   guard tests.

9. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/42-operations-engine.md` are the Stage 11
   artifacts. A new ADR is warranted because Stage 11 makes genuinely new architectural decisions: the Ambiguity Gate
   resolution (consume the frozen contracts; never introduce or extend `RuntimeEvent`), the operational realization of the
   frozen observability model, and the immutable operations-owned output contracts.

## Rationale

Naming the operational realization of `ai/operations/` completes the Phase 4 operational layer. Separating it from the
runtime is forced by the frozen `ai/operations/` identity ("Operations is not the runtime ... never executes,
orchestrates, or schedules") and single-ownership (ADR-0020). Consuming the frozen contracts (rather than introducing a
new `RuntimeEvent`) is forced by the frozen `ai/runtime/event-lifecycle` ownership of `RuntimeEvent` and by the "do not
modify a frozen stage" rule. Alternatives rejected: introducing or extending a `RuntimeEvent` contract (owned by
`ai/runtime/`; would duplicate frozen ownership); defining execution-domain events (retry / checkpoint / timeout, which
Operations disowns and the frozen engine does not emit); modifying the Stage-10 engine to emit more (violates the freeze);
executing, orchestrating, or scheduling anything (the runtime's); protecting, degrading, or deciding (safety's /
governance's); and inventing health states (the frozen `HEALTH_STATES` owns them).

## Consequences

- The `apps/` layer gains its operational supervision engine; the Phase 4 runtime pipeline and its observing layer are
  complete. Operations consumes the runtime's immutable outputs and never changes them.
- The engine remains non-executing, non-authorizing, deterministic, idempotent, fail-closed, and provider-agnostic.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/operations/README.md` and the frozen
`ai/operations/observability.md`, `monitoring.md`, `health-management.md`, `incident-management.md`, `maintenance.md`,
`diagnostics.md`, `operations-lifecycle.md`, and `operations-boundaries.md` (the operational model the engine applies);
`ai/runtime/event-lifecycle.md` (the frozen `RuntimeEvent` it consumes and never extends); `ai/safety/` and
`ai/governance/` (to which an incident defers a protective or governed response); and ADR-0020, ADR-0024, ADR-0025,
ADR-0035, and ADR-0044.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer), ADR-0044 (the Runtime Execution Engine, whose
immutable `ExecutionRecord` / `ExecutionStatistics` / `ExecutionDiagnostics` and emitted frozen `RuntimeEvent`s it
observes), ADR-0026 (the composition-root seam), ADR-0005 (frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and
ADR-0020 / ADR-0024 / ADR-0025. Consumes the frozen Phase 2B `@openlance/aios-operations` and `@openlance/aios-runtime`
models. Completes Phase 4.
