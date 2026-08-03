---
id: ADR-0018
title: Scaffold conventions and golden-fixture testing strategy
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0018: Scaffold conventions and golden-fixture testing strategy

## Status

Accepted

## Context

The `package` generator must emit packages that match the hand-built substrate convention exactly
(the ADR-0009 declaration build, coverage-enabled tests, and a benchmark harness), and the
golden-file test must verify a realistic multi-file package end to end. Doing so requires
materializing a real package on disk during a test run, which must not pollute the workspace,
race the whole-repo dependency cruise, or appear in the committed graph snapshot. The conventions
and the isolation mechanism are engineering decisions worth recording rather than leaving to code
comments.

## Decision

The `package` generator emits the full skeleton: a `package.json` carrying the ADR-0009 build
script (`--tsconfig tsconfig.build.json`) plus coverage-enabled `test` and a `bench` script,
`tsconfig.json` and `tsconfig.build.json`, a `vitest.config.ts` that inherits the root coverage
policy (ADR-0015), a barrel plus a starter module, a test, a `benchmarks/` folder (stub plus
`baseline.md`), and a `README.md`.

The golden-file test materializes transient fixtures at `packages/goldenfixture` and
`packages/namespaces/goldennamespace`. These fixture names are:

- excluded from the pnpm workspace, so pnpm and Turborepo never treat them as members,
- excluded from the whole-repo dependency cruise and from the committed graph snapshot, so a
  transient fixture cannot race or perturb those mechanisms, and
- removed after the run.

The test cruises the fixture with a dedicated dependency-cruiser config
(`tools/scaffold/tests/scaffold.dependency-cruiser.cjs`) that reuses the root rules but does not
exclude the fixture, so the scaffolded package is actually validated. The test asserts the
generated package builds (including its rolled-up declarations), type-checks, tests at full
coverage, benchmarks, and passes the cruise, all with no manual edits.

## Rationale

This keeps the scaffold the guarantor of convention: the golden test exercises the exact scenario
(a multi-file barrel re-export) that would fail a broken declaration build, so the ADR-0009 build
config is verified rather than assumed. Isolating the fixtures by a fixed, reserved name keeps
every whole-repo mechanism (workspace resolution, the cruise, the graph snapshot) stable while the
test runs.

## Consequences

`pnpm-workspace.yaml`, `.dependency-cruiser.cjs`, `scripts/graph-snapshot.mjs`, and the dedicated
golden cruise config each carry the fixture exclusion for this purpose. The two fixture names
(`goldenfixture`, `goldennamespace`) are reserved and must not be used for real packages.

## Related constitutional references

None. This is an engineering tooling and testing decision; it realizes no constitutional concept
and changes no constitutional ownership.

## Related ADRs

Relates to ADR-0009 (declaration build under composite) and ADR-0015 (runtime coverage policy);
owned by subsystem 09 (Build & Dev Infrastructure).
