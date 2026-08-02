---
id: ADR-0006
title: Result pattern for domain error handling
status: Accepted
date: 2026-08-02
supersedes: []
superseded_by: null
---

# ADR-0006: Result pattern for domain error handling

## Status

Accepted

## Context

Failure handling must be deterministic and inspectable rather than stack-shaped or exception-driven. The substrate needs a single, consistent way to express expected failures.

## Decision

Expected and domain failures are returned as `Result<T, E>` (owned by `@openlance/aios-kernel`), where `E` is a `BaseError` subclass with a stable, registered code (owned by `@openlance/aios-errors`). Only unrecoverable infrastructure faults throw. Serialized errors exclude stacks so identical inputs yield identical output.

## Rationale

Returning `Result` makes failure part of the type signature and keeps propagation deterministic, aligning with the constitution's determinism invariants. Throwing everywhere hides failure from types and introduces stack- and timing-dependent behavior. This is an engineering error taxonomy only; it does not implement the constitutional refusal, escalation, or safe-failure models (owned by Safety and Governance), which will map onto it later.

## Consequences

A lint guideline discourages `throw` in domain code; `Result` combinators and `Result` matchers are provided. Error codes are namespaced per package and checked for uniqueness at build time.

## Related constitutional references

Determinism invariants (reasoning/memory/providers); distinct from `ai/safety/` refusal/degradation and `ai/governance/escalation.md`, which are deferred. References only.

## Related ADRs

Relates to subsystems 01 and 02.
