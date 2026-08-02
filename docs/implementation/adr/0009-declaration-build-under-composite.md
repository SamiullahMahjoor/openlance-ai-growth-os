---
id: ADR-0009
title: Declaration bundling under TypeScript project references
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0009: Declaration bundling under TypeScript project references

## Status

Accepted

## Context

The locked compilation decision (design README) is "tsc project references (+ tsup for dist bundles)". Substrate packages therefore set `composite: true` (via the shared `library.json`) so they can participate in a `tsc` project-reference graph and be type-checked incrementally. The dist bundle, including its rolled-up `.d.ts`, is produced by `tsup --dts`. These two collide: `tsup --dts` builds declarations from a synthetic program rooted at the entry file, and a `composite` project rejects that program with TS6307 ("File is not listed within the file list of project"), because a composite project requires an explicit, complete file list rather than an import-followed one.

## Decision

Each package keeps its normal `tsconfig.json` (`composite: true`) for type checking (`tsc --noEmit`) and for project references. For the declaration bundle only, `tsup` is pointed at a dedicated `tsconfig.build.json` that extends the package config and sets `composite: false` (and `declarationMap: false`). The build script becomes `tsup src/index.ts --format esm --dts --clean --sourcemap --tsconfig tsconfig.build.json`. Type checking, project references, and the determinism/strictness settings are unchanged; only the declaration-rollup pass runs without `composite`.

## Rationale

This preserves both locked decisions rather than dropping one. Project references and incremental type checking remain available through the composite `tsconfig.json`; the tsup declaration rollup gets the non-composite program it requires. The alternative, dropping `composite` entirely, would revise the locked "tsc project references" decision; the alternative of emitting declarations with `tsc` instead of tsup would split JS and types across two tools with different module-resolution behavior. A build-only tsconfig override is the smallest change that keeps the design intact.

## Consequences

Every substrate package that ships a bundle carries a small `tsconfig.build.json` used only by tsup. The scaffold template (subsystem 09) should emit this file and the matching build script so future packages inherit the pattern; until subsystem 09 is implemented, a package added before then adds the two-line build config by hand. Declaration source maps are not shipped for the bundled types.

## Related constitutional references

None. This is an engineering build-tooling decision; it realizes no constitutional concept and changes no constitutional ownership.

## Related ADRs

Relates to ADR-0003 (monorepo, package manager, and build tooling) and subsystems 01 (Core Framework) and 09 (Build & Dev Infrastructure).
