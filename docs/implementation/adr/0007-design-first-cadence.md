---
id: ADR-0007
title: Design-first delivery cadence
status: Accepted
date: 2026-08-02
supersedes: []
superseded_by: null
---

# ADR-0007: Design-first delivery cadence

## Status

Accepted

## Context

Phase 2A is enterprise engineering on top of an immutable constitution. Implementing before designing risks constitutional drift and costly rework. The constraint "never implement first, always design first" was set for this phase.

## Decision

For Phase 2A, produce the full design package for all subsystems first, obtain a single approval, then build in dependency order. Production code begins only after that approval. If implementation appears to need an architectural concept the constitution does not define, stop and request architectural clarification rather than invent it.

## Rationale

Designing all subsystems first surfaces cross-cutting boundary and dependency issues before any code exists, and keeps every construct traceable to the constitution. It matches the constraint and lowers rework risk. A per-subsystem gate was considered but the whole-picture review was chosen for this foundational phase.

## Consequences

The design package under `docs/implementation/` is the approval artifact. The "never invent architecture" gate is permanent. Later phases may adopt a different cadence via a superseding ADR.

## Related constitutional references

`ai/CONTRIBUTING.md` (design and review discipline); `ai/evolution/` (controlled change). References only.

## Related ADRs

Governs the delivery of subsystems 00 through 09.
