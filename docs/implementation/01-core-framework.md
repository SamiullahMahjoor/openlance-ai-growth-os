# Subsystem 01, Core Framework (`@openlance/aios-kernel`)

## 1. Architectural analysis

The kernel is the single zero-dependency root of the substrate. It owns the primitives every other package needs and the **determinism seams** the constitution requires in code form: time and identity must be injectable so that "the same inputs produce the same outcome" (the determinism invariant repeated across `ai/reasoning/`, `ai/memory/`, `ai/providers/`, etc.) is mechanically achievable. The kernel owns no engineering subsystem behavior (no DI, no config); it owns only value types and seams.

## 2. Package design

`@openlance/aios-kernel`, no runtime dependencies. Modules: `result`, `option`, `brand`, `clock`, `id`, `disposable`, `types`. Pure, side-effect-free, tree-shakeable. This is the only package permitted to have zero internal deps.

## 3. Interface design

```ts
// result.ts, the Result pattern (railway-oriented, deterministic propagation)
export type Result<T, E> = Ok<T> | Err<E>;
export interface Ok<T>  { readonly ok: true;  readonly value: T }
export interface Err<E> { readonly ok: false; readonly error: E }
export const ok:  <T>(value: T) => Ok<T>;
export const err: <E>(error: E) => Err<E>;
export const isOk:  <T, E>(r: Result<T, E>) => r is Ok<T>;
export const isErr: <T, E>(r: Result<T, E>) => r is Err<E>;
export const map:     <T, U, E>(r: Result<T, E>, f: (t: T) => U) => Result<U, E>;
export const mapErr:  <T, E, F>(r: Result<T, E>, f: (e: E) => F) => Result<T, F>;
export const andThen: <T, U, E>(r: Result<T, E>, f: (t: T) => Result<U, E>) => Result<U, E>;
export const unwrapOr:<T, E>(r: Result<T, E>, fallback: T) => T;

// option.ts
export type Option<T> = Some<T> | None;
export interface Some<T> { readonly some: true;  readonly value: T }
export interface None    { readonly some: false }

// brand.ts, nominal typing for ids
export type Brand<T, B extends string> = T & { readonly __brand: B };

// clock.ts, injectable time seam
export interface Clock { now(): number; nowIso(): string }
export class SystemClock implements Clock { /* wraps Date, injected only at the edge */ }

// id.ts, injectable identity seam
export interface IdGenerator { next(): string }

// disposable.ts, deterministic teardown
export interface Disposable { dispose(): void | Promise<void> }
```

`SystemClock` and a real `IdGenerator` are the **only** places wrapping `Date`/random; every other package receives `Clock`/`IdGenerator` by injection. Tests inject `FixedClock`/`SequentialId` (subsystem 08).

## 4. Dependency graph

`kernel` depends on nothing. Everything depends on `kernel`.

## 5. Folder structure

```
packages/kernel/
  src/ index.ts result.ts option.ts brand.ts clock.ts id.ts disposable.ts types.ts
  tests/ result.test.ts option.test.ts clock.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `result` + `option` with exhaustive combinators and property-based tests.
2. `brand` helpers and canonical id types (`CorrelationId`, `TraceId` re-used downstream).
3. `clock` + `SystemClock`; `id` interface (concrete generator lives where a real uuid is chosen, injected at the edge).
4. `disposable` + async disposal contract. Barrel export; 100% unit coverage target.

## 7. Risks

| Risk | Mitigation |
|---|---|
| `Result` ergonomics tempt throwing instead | Lint rule discouraging `throw` in domain code; ADR documents the boundary. |
| Seam bypass (`Date.now()` sneaks into a package) | ESLint `no-restricted-globals`/`no-restricted-properties` for `Date.now`, `Math.random`, `process.env` outside the kernel/edge. |

## 8. Acceptance criteria

- `Result`/`Option` combinators are total and covered by unit + property tests.
- No package other than kernel references `Date`/`Math.random` directly (CI lint gate).
- Kernel has zero dependencies and a single barrel.
