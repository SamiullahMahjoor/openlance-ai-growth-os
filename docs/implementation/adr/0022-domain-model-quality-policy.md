---
id: ADR-0022
title: Domain-model namespace quality policy
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0022: Domain-model namespace quality policy

## Status

Accepted (architecture review decision P3, Phase 2B).

## Context

A pure domain-model namespace (ADR-0020) is mostly types, frozen data, and pure predicates. Rule 6
(100% coverage, ADR-0015) and Rule 5 (benchmarks) were written for the substrate; how they apply to
a data-and-predicate package must be stated so quality does not regress and no coverage loophole is
introduced.

## Decision

Phase 2A standards are maintained without exception:

- **Executable code** (pure predicates, constructors, and any emitted logic) is held to **100%
  coverage**, exactly as the substrate.
- **Pure immutable data** modules (frozen tables and declarations with no branching logic) are
  excluded from coverage **exactly like Phase 2A type-only modules** (ADR-0015): named in the
  package's `vitest.config.ts` `coverage.exclude` with a comment stating why. This is not a
  loophole: such modules contain no logic to cover, and any module that mixes data with predicates
  is measured in full.
- **Benchmarks** apply only to executable predicates (Rule 5), following the substrate pattern.

## Rationale

Applying the substrate's exact coverage discipline keeps the gate honest: every branch of every
predicate is covered, and the only exclusions are declaration-only modules, documented per package.

## Consequences

A domain-model package's `vitest.config.ts` extends the root policy and excludes only its pure-data
modules (with a comment). Predicate modules are covered at 100%. Benchmarks measure predicates only.

## Related constitutional references

None. Engineering quality-gate policy; changes no constitutional ownership.

## Related ADRs

Relates to ADR-0015 (runtime coverage policy) and ADR-0020 (namespace implementation model).
