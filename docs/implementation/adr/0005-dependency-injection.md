---
id: ADR-0005
title: Custom dependency-injection container
status: Accepted
date: 2026-08-02
supersedes: []
superseded_by: null
---

# ADR-0005: Custom dependency-injection container

## Status

Accepted

## Context

Composition of packages (and later namespace packages) needs a DI mechanism with singleton, scoped, and transient lifetimes, module registration, and startup validation. Options: adopt a container (inversify, tsyringe, NestJS DI) or build one. ADR-0002 set a framework-neutral posture.

## Decision

Build a minimal custom DI container in `@openlance/aios-di`: typed tokens, three lifetimes, module registration, and startup validation that rejects missing dependencies, cycles, and lifetime mismatches. Decorators are optional and additive.

## Rationale

A custom container keeps the substrate framework-neutral (per ADR-0002) and lets startup validation enforce the acyclicity the constitution requires (`ai/architecture/dependency-map.md`), returning structured errors rather than throwing. Adopting an external container would either re-introduce a framework or a decorator-mandatory idiom. The cost is bounded by keeping the surface small and exhaustively tested.

## Consequences

We maintain a small DI core. Its module graph is a runtime twin of the frozen dependency map; its `validate()` is a startup gate. A future switch to an external container would require a superseding ADR.

## Related constitutional references

`ai/architecture/dependency-map.md` (acyclic graph enforced at wiring time). References only.

## Related ADRs

Depends on ADR-0002; relates to Rule 2.
