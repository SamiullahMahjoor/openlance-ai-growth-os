---
id: ADR-0004
title: Test framework
status: Accepted
date: 2026-08-02
supersedes: []
superseded_by: null
---

# ADR-0004: Test framework

## Status

Accepted

## Context

Every package must be independently and deterministically testable, with unit and integration coverage, in a TypeScript ESM monorepo.

## Decision

Use Vitest as the unit and integration test runner, with a shared root config and per-package coverage thresholds. Determinism seams (`FixedClock`, `SequentialId`) from `@openlance/aios-testing` are mandatory in tests.

## Rationale

Vitest is TypeScript- and ESM-native, fast, and unifies unit and integration testing without extra transform layers, keeping runs deterministic. Jest was considered but adds heavier ESM/TS configuration for no offsetting benefit here.

## Consequences

Tests run under Vitest; the `bench` capability (subsystem 09, Rule 5) reuses the same toolchain. Real `Date`/random are banned in tests; the deterministic seams are used instead.

## Related constitutional references

Determinism invariants across `ai/reasoning/`, `ai/memory/`, `ai/providers/` (realized by test seams). References only.

## Related ADRs

Relates to ADR-0003; supports Rule 5.
