---
id: ADR-0033
title: The error propagation plan describes the chain's coded error topology and delegates validation to the frozen error registry
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0033: The error propagation plan describes the chain's coded error topology and delegates validation to the frozen error registry

## Status

**Accepted** (Phase 3, Stage 7). It introduces no duplicate constitutional or engineering truth, changes no frozen
work, and preserves ADR-0005, ADR-0006, ADR-0020, ADR-0021, and ADR-0026 to ADR-0032. ADR-0032 already anticipated
Stage 7 (Error Propagation) in the reopened Phase 3 roadmap, so no supersession is required.

## Context

The reopened Phase 3 roadmap (ADR-0032) continues with Stage 7, Error Propagation. A full source reading (the
`@openlance/aios-errors` and `@openlance/aios-kernel` packages, `docs/implementation/02-error-framework.md`,
ADR-0006, and the Stage 1 to 6 docs) establishes:

- The **error framework** is owned, in full, by the frozen substrate. `@openlance/aios-errors` owns the error
  hierarchy (`BaseError`, the `domain`/`infrastructure`/`validation` `ErrorCategory`), `DomainError`/
  `InfrastructureError`/`ValidationError`, the per-package error-code registry (`InMemoryErrorCodeRegistry`, which
  enforces global code uniqueness), and the throw-to-`Result` bridges (`fromThrowable`, `toResult`). Its barrel
  explicitly disclaims "retry, recovery, monitoring." `@openlance/aios-kernel` owns the `Result` channel and its
  combinators (`map`, `mapErr`, `andThen`), the propagation mechanism. There is no `ai/` error namespace; errors is
  an engineering substrate concern.
- Each frozen integration stage (Stages 1 to 6) already surfaces its own coded `BaseError` subtype on the `Result`
  channel and fails closed. Error *propagation* as a mechanism is therefore already realized by the frozen
  substrate and the frozen stages.

What no package owns is the application-level *description* of the composed chain's aggregate error surface: which
coded errors propagate through the chain, in which category. That descriptive topology is a genuine, previously
unowned integration concern, directly parallel to Plugin Loading (Stage 6) declaring the plugin set.

## Decision

1. **Stage 7 is a new `apps/`-layer package, `@openlance/aios-error-propagation`, that owns the application-level
   error propagation description only.** It produces an immutable `ErrorPropagationPlan` declaring a topology of
   coded error surfaces (`{ code, category }` nodes), each on the `Result` channel, attached to the Stage 6
   `PluginLoadingPlan`.
2. **It consumes, never recreates.** It consumes the frozen `ErrorCategory` type, the frozen
   `InMemoryErrorCodeRegistry` (to validate code uniqueness), the frozen `Result` channel, and the Stage 6 chain
   handle. It re-declares no error type, category set, registry, bridge, or chain handle.
3. **It executes nothing.** It does not catch, retry, recover, roll back, orchestrate, schedule, or handle any
   runtime error, and runs no provider/tool/agent/plugin/namespace/workflow. It validates a declared topology (code
   uniqueness, delegated to the frozen registry, fail closed) and builds an immutable plan.
4. **Design-first cadence continues (ADR-0007).** This ADR and `docs/implementation/30-error-propagation.md` are
   the Stage 7 design artifacts, approved before implementation.

## Rationale

The chain's aggregate coded error surface is a real integration concern the frozen substrate does not own (the
substrate owns error modeling and the propagation channel; the stages own their individual error types). Describing
it as an immutable topology, validated for code uniqueness through the frozen registry, honors "consume, never
recreate" and the execution ban, exactly as Stages 2 to 6 did for their frozen models. Enforcing category validity
through the frozen `ErrorCategory` type (compile-time) avoids re-encoding the category set.

## Consequences

- A new `apps/`-layer package exists, depending on the Stage 6 plugin loading plan, the frozen
  `@openlance/aios-errors` substrate package, and the kernel; its edges are recorded in
  `dependency-graph.snapshot.json`. The `app -> app` and `app -> substrate` (errors) edges are legal; no
  dependency-cruiser rule or namespace edge changes.
- The Phase 3 integration layer continues toward the consolidated Stage 9 Runtime Freeze (ADR-0032). Stage 8 (Event
  Flow) is not begun here.
- No frozen namespace, no substrate package, no constitution document, and no other ADR's decision changes.
  ADR-0006 (the error framework) is preserved and consumed, not modified.

## Related constitutional references

None. This is an engineering composition decision; it realizes no constitutional concept and changes no
constitutional ownership. `docs/implementation/02-error-framework.md` and ADR-0006 (the frozen error framework) are
referenced and consumed, never restated.

## Related ADRs

Builds on ADR-0032 (plugin loading; the reopened Phase 3 roadmap), ADR-0030 (execution pipeline plan), ADR-0006
(Result error handling), ADR-0026 to ADR-0029 (the Phase 3 chain), and ADR-0007 (design-first cadence).
