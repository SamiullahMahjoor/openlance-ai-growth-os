---
id: ADR-0008
title: Kernel combinator export strategy
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0008: Kernel combinator export strategy

## Status

Accepted

## Context

The kernel exposes flat, free-function combinators for both `Result` and `Option` from a single package barrel. The design (`docs/implementation/01-core-framework.md`, section 3) fixes the exact `Result` surface as top-level names: `ok`, `err`, `isOk`, `isErr`, `map`, `mapErr`, `andThen`, `unwrapOr`. It specifies the `Option` types (`Option`, `Some`, `None`) and calls for "exhaustive combinators" (section 6) but does not name the `Option` combinators. Because `Result` and `Option` share combinator shapes (`map`, `andThen`, `unwrapOr`), exporting both flat with identical names would collide in the barrel, and a `export *` collision would silently drop those names from the public surface.

## Decision

`Result` combinators are exported flat under the exact names the design fixes, unchanged. `Option` combinators are exported flat but carry an `Option` suffix where a bare name would collide: `mapOption`, `andThenOption`, `unwrapOrOption`. The non-colliding `Option` members keep their natural names: `some`, `none`, `fromNullable`, `isSome`, `isNone`. No namespace objects (for example `Result.map`) are introduced, so the flat `Result` surface the design specifies is preserved exactly.

## Rationale

The design's `Result` surface is authoritative and must not change, which rules out namespacing `Result`. The design leaves `Option` combinator names open, so suffixing the three colliding `Option` transformers is the minimal change that keeps every kernel export flat, unambiguous, and tree-shakeable from one barrel. This is an implementation-detail decision about export naming; it introduces no new architectural concept and moves no ownership.

## Consequences

Callers write `map`/`andThen`/`unwrapOr` for `Result` and `mapOption`/`andThenOption`/`unwrapOrOption` for `Option`. The distinction is visible at the call site, and the barrel has no ambiguous re-export. If a future `Option` combinator shape would collide with a `Result` name, it takes the same `Option` suffix.

## Related constitutional references

None. This is an engineering export-naming decision only; it realizes no constitutional concept and changes no constitutional ownership. `Result` ownership itself is recorded in ADR-0006.

## Related ADRs

Relates to ADR-0006 (Result pattern) and subsystem 01 (Core Framework).
