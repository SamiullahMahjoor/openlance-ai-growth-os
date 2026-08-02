---
id: ADR-0013
title: Internal semver range subset for plugin compatibility
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0013: Internal semver range subset for plugin compatibility

## Status

Accepted

## Context

Plugin compatibility validation (`docs/implementation/07-plugin-framework.md`, sections 3 and 6) requires checking that an `apiVersion` satisfies the host's supported range and that each `dependsOn` version is in range: it references semver ranges. The plugin package's allowed dependency set is the six workspace substrate packages only; an external semver library (for example the `semver` npm package) is not an allowed dependency and would be the first external runtime dependency in the substrate.

## Decision

Plugin compatibility uses a small semver checker implemented internally in `compatibility.ts` over a documented subset:

- versions are `major.minor.patch` (three non-negative integers);
- `^X.Y.Z` (caret) matches the same major at or above `X.Y.Z`;
- comparators `>=`, `>`, `<=`, `<`, `=` followed by a version may be space-separated as a conjunction;
- a bare `X.Y.Z` means exact equality;
- an unparseable version or range does not satisfy.

No external semver library is added. The supported subset is documented in the package README.

## Rationale

An external semver library is outside the allowed dependency set and would break the substrate's external-dependency-free posture. The design requires only range satisfaction for `apiVersion` and `dependsOn`; a documented subset covering caret, comparators, exact, and conjunction is sufficient, deterministic, and fully testable. The caret rule is simplified to "same major, at least the base" (rather than the standard `0.x` minor-locking) for determinism and testability; this is documented, not implied.

## Consequences

Plugin authors and hosts use the documented range subset. If a richer range grammar is needed later, it can be added behind the same internal `satisfies` seam, or a superseding ADR can adopt an external library if the dependency posture changes. The checker is `compatibility.ts`-internal and not part of the public API.

## Related constitutional references

None. This is an engineering implementation decision; it realizes no constitutional concept and changes no constitutional ownership.

## Related ADRs

Relates to ADR-0003 (monorepo, package manager, and build tooling) and subsystem 07 (Plugin Framework).
