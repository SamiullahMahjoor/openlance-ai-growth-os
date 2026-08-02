# Subsystem 08, Testing Infrastructure (`@openlance/aios-testing`)

> **Classification:** Engineering tooling. Owns no AI concept. Provides deterministic test seams and harnesses; asserts nothing about AI behavior (none exists in Phase 2A).

## 1. Architectural analysis

Every package must be provable in isolation and deterministically. The testing package supplies the seams that make the constitution's determinism testable in practice: a `FixedClock` and `SequentialId` remove ambient time and randomness; a capturing log sink and an in-memory event bus make side effects observable; a test DI container makes composition isolatable. It is a devDependency of every package and a runtime dependency of none.

## 2. Package design

`@openlance/aios-testing`, depends on `kernel`, `errors` at runtime; dev-only awareness of `di`, `config`, `logging`, `events`, `plugins` via peer/dev deps so it can build fixtures without inverting the dependency graph. Modules: `container`, `mocks`, `fakes`, `fixtures`, `harness`, `matchers`.

## 3. Interface design

```ts
export const createTestContainer: (configure?: (r: Registry) => void) => Container;   // isolated DI

export class FixedClock implements Clock { constructor(startMs: number); advance(ms: number): void }
export class SequentialId implements IdGenerator { constructor(prefix?: string) }      // id-1, id-2, ...

export const mock:  <T>(partial?: Partial<T>) => T;            // typed partial double
export const spy:   <A extends unknown[], R>(impl?: (...a: A) => R) => Spy<A, R>;
export interface Spy<A extends unknown[], R> { (...a: A): R; calls: A[]; returned: R[] }

export class CapturingSink implements LogSink { readonly records: LogRecord[]; write(r: LogRecord): void }
export class InMemoryEventBus implements EventBus { readonly published: FrameworkEvent[]; /* ...EventBus */ }

export interface Harness {                                    // integration composition root for tests
  container: Container;
  clock: FixedClock;
  ids: SequentialId;
  logs: CapturingSink;
  events: InMemoryEventBus;
  dispose(): Promise<void>;
}
export const createHarness: (modules?: Module[]) => Harness;

// custom matchers (Vitest): toBeOk / toBeErr / toHaveErrorCode(code) for Result assertions
```

`createHarness` boots a chosen set of modules with the deterministic seams pre-wired, so an integration test exercises real DI + config + logging + events without touching real time, randomness, or vendors.

## 4. Dependency graph

`testing ◀ {kernel, errors}` (runtime); dev/peer on the rest. No package depends on `testing` at runtime.

## 5. Folder structure

```
packages/testing/
  src/ index.ts container.ts mocks.ts fakes.ts fixtures.ts harness.ts matchers.ts clocks.ts ids.ts
  tests/ harness.test.ts mocks.test.ts matchers.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `FixedClock` + `SequentialId` (deterministic seams).
2. `createTestContainer` + isolation guarantees.
3. `mock`/`spy`/`fake` builders (typed).
4. `CapturingSink` + `InMemoryEventBus` fixtures.
5. `createHarness` integration composition root.
6. `Result` matchers (`toBeOk`, `toBeErr`, `toHaveErrorCode`).

## 7. Risks

| Risk | Mitigation |
|---|---|
| Testing pkg inverts the dependency graph | Runtime deps limited to kernel/errors; heavier fixtures use peer/dev deps; depcruise enforces. |
| Flaky tests from ambient time/random | Mandatory `FixedClock`/`SequentialId` in harness; lint bans real `Date`/random in tests too. |
| Fixtures drift from real contracts | Fixtures implement the same public interfaces; type-checked against them. |

## 8. Acceptance criteria

- Every substrate package has isolated unit tests using these utilities and a meaningful coverage threshold.
- `createHarness` boots a real module set deterministically (fixed clock/ids) for integration tests.
- `Result` matchers and doubles are typed and self-tested.
- Testing package is a runtime dependency of no package.
