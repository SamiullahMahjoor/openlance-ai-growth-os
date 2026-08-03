---
id: ADR-0015
title: Runtime coverage policy - measure all source, exclude only barrels and type-only modules
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0015: Runtime coverage policy - measure all source, exclude only barrels and type-only modules

## Status

Accepted

## Context

The Definition of Done (Rule 6, criterion 3) requires per-package coverage at or above a
threshold. The implemented configuration used a per-package `coverage.include` allowlist naming
the modules to measure, with thresholds of 90/90/85/90. Two problems followed: the enforced floor
(90/85) did not match the intended full-coverage bar the substrate actually holds, and, more
seriously, a newly added runtime module that was not appended to the allowlist was measured by
nothing and escaped the gate entirely. This is an engineering policy decision (which files are
measured, and at what threshold), so it is recorded here.

## Decision

Coverage is measured over every source file under a package's `src/` automatically
(`coverage.all` with `include: ['src/**/*.ts']`), with thresholds of 100 for lines, functions,
branches, and statements. The only permitted exclusions are:

- the public barrel `src/index.ts` (pure re-exports, no executable statements), excluded once in
  the root configuration, and
- genuinely type-only modules (interfaces and type aliases with no emitted statements), each
  excluded in the owning package's own `vitest.config.ts` with a comment naming the module and why.

There are no opt-in allowlists. A new runtime module participates in the coverage gate the moment
it is added.

## Rationale

Measuring all of `src` by default makes the gate match the documented intent (full coverage of
runtime code) and removes the escape hatch where an unlisted file was silently unmeasured.
Excluding barrels and type-only modules avoids phantom 0-of-0 entries without hiding any runtime
logic; each exclusion is explicit and reviewable in the package config.

## Consequences

The root `vitest.config.ts` sets the policy (all of `src`, exclude the barrel, 100 thresholds);
each package config lists only its own type-only exclusions. `DEFINITION-OF-DONE.md` is updated to
state the 100% / exclude-barrels-and-type-only policy. The scaffold template inherits the root
policy so new packages participate automatically.

## Related constitutional references

None. This is an engineering quality-gate decision; it realizes no constitutional concept and
changes no constitutional ownership.

## Related ADRs

Relates to ADR-0004 (test framework) and Rule 6 (Definition of Done).
