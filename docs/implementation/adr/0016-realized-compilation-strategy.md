---
id: ADR-0016
title: Realized compilation and type-checking strategy
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0016: Realized compilation and type-checking strategy

## Status

Accepted

## Context

ADR-0003 locked the compilation approach as "tsc project references (+ tsup for dist bundles)",
and ADR-0009 preserves `composite: true` so packages can participate in a `tsc` project-reference
graph. The realized implementation differs in one respect worth recording: no per-package
`tsconfig.json` declares `references` to its dependencies, and `tsc -b` (`tsc --build`) is invoked
nowhere. Instead, each package's dist bundle and rolled-up declarations are produced by tsup, and
type checking is performed per package with `tsc --noEmit` against dependencies' built `.d.ts`,
with build order guaranteed by Turborepo (`typecheck` depends on `^build`). Documentation and
reality should agree, so the realized strategy is recorded here. Both ADR-0003 and ADR-0009 are
Accepted and immutable; this ADR records the operational interpretation and supersedes neither.

## Decision

The realized Phase 2A strategy is:

- **Build:** each package builds its ESM bundle and rolled-up `.d.ts` with tsup, pointed at a
  dedicated `tsconfig.build.json` (`composite: false`, per ADR-0009).
- **Type check:** each package runs `tsc --noEmit` against its own `tsconfig.json`; cross-package
  types resolve through dependencies' built declarations, and Turborepo orders the graph via
  `typecheck` depending on `^build`.
- **Project references:** `composite: true` remains in the shared `library.json` preset, so a
  package can participate in a `tsc` project-reference graph and incremental type checking is
  available. Phase 2A does not wire a `tsc -b` reference graph; the Turborepo build order provides
  the same "dependencies first" guarantee.

## Rationale

The realized approach is coherent, deterministic, and already green in CI; the only gap was that
the design text described a `tsc -b` reference graph that is not actually wired. Recording the
operational reality closes the doc-versus-reality gap without re-litigating the locked decisions
in ADR-0003 and ADR-0009. tsup remains the single source of the dist bundle and its declarations
(ADR-0009's reason for the build-only tsconfig), and per-package `tsc --noEmit` keeps type
checking strict and fast under Turborepo ordering.

## Consequences

Design documentation (subsystem 00 and 09) describes the tsup-build + per-package `tsc --noEmit`
strategy and notes that a full `tsc -b` reference graph is available but not wired in Phase 2A. If
a wired project-reference graph is wanted later (for example for very large incremental builds), a
superseding ADR adds per-package `references` and a `tsc -b` build/typecheck path.

## Related constitutional references

None. This is an engineering build-tooling decision; it realizes no constitutional concept and
changes no constitutional ownership.

## Related ADRs

Records the realization of ADR-0003 (monorepo, package manager, and build tooling); relates to
ADR-0009 (declaration bundling under composite) and subsystem 09 (Build & Dev Infrastructure).
