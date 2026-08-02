---
id: ADR-0003
title: "Monorepo, package manager, and build tooling"
status: Accepted
date: 2026-08-02
supersedes: []
superseded_by: null
---

# ADR-0003: Monorepo, package manager, and build tooling

## Status

Accepted

## Context

The implementation is a multi-package monorepo whose graph must mirror the frozen dependency map and build deterministically. A package manager, task runner, compiler strategy, and boundary enforcer are needed.

## Decision

Use pnpm workspaces (package manager), Turborepo (cached task pipeline), `tsc` project references plus `tsup` for dist bundles (compilation), ESLint flat config and Prettier (lint/format), dependency-cruiser (boundary and graph enforcement), TypeDoc (docs), Plop (scaffolding), and Changesets (versioning).

## Rationale

pnpm gives strict, fast, content-addressed installs; Turborepo gives content-hash caching for reproducible, incremental builds; dependency-cruiser encodes the frozen graph as a CI gate. Alternatives (Nx; npm/yarn workspaces + bare tsc) were rejected as heavier/opinionated or as weaker in caching and orchestration.

## Consequences

Node and pnpm versions are pinned; the lockfile is committed; the Turbo pipeline runs build, typecheck, lint, test, and depcruise. The dependency-cruiser ruleset is the single encoding of the frozen graph.

## Related constitutional references

`ai/architecture/dependency-map.md` (the graph to enforce). References only.

## Related ADRs

Relates to ADR-0001; supports Rules 1, 2, 4, 5.
