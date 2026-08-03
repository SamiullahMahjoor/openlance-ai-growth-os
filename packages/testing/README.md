# @openlance/aios-testing

Engineering test tooling. It is developed alongside the substrate and is a devDependency of every package and a runtime dependency of none.

## Ownership

This package owns test utilities only: deterministic testing seams, fake implementations, mock infrastructure, assertion helpers, fixture helpers, an integration harness, and (where used) benchmark helpers. It makes the substrate provable in isolation and deterministically.

## Responsibilities

- **Deterministic seams.** `FixedClock` (fixed time, explicit `advance`) and `SequentialId` (`id-1`, `id-2`, ...) remove ambient time and randomness.
- **Doubles.** `mock<T>(partial?)` builds a typed partial double; `spy(impl?)` records the arguments and return of every call.
- **Fakes.** `CapturingSink` captures log records; `InMemoryEventBus` captures published events and delivers to subscribers.
- **Isolated DI.** `createTestContainer(configure?)` returns a fresh, isolated container per call.
- **Integration harness.** `createHarness(modules?)` boots a set of DI modules with the deterministic seams pre-wired (a logger writing to a `CapturingSink` under `LOGGER`, an `InMemoryEventBus` under `EVENT_BUS`).
- **Result matchers.** `resultMatchers` provides Vitest matchers `toBeOk`, `toBeErr`, and `toHaveErrorCode(code)`.

## Public API

The single supported surface is the barrel (`@openlance/aios-testing`); deep imports fail CI (Engineering Rule 1).

`FixedClock` · `SequentialId` · `createTestContainer` · `mock` · `spy` · `Spy` · `CapturingSink` · `InMemoryEventBus` · `resultMatchers` · `createHarness` · `Harness`.

## Examples

```ts
import { FixedClock, SequentialId, createTestContainer, spy, resultMatchers, createHarness } from '@openlance/aios-testing';
import { expect } from 'vitest';

expect.extend(resultMatchers); // once, e.g. in a setup file

const clock = new FixedClock(0);
clock.advance(1000); // clock.now() === 1000

const ids = new SequentialId(); // ids.next() === 'id-1'

const load = spy((key: string) => key.length);
load('abc'); // load.calls === [['abc']], load.returned === [3]

const container = createTestContainer((registry) => {
  // register test services
});

const harness = createHarness(/* modules */);
// harness.clock, harness.ids, harness.logs, harness.events, harness.container
await harness.dispose();

// with the matchers registered:
// expect(result).toBeOk();
// expect(result).toHaveErrorCode('CONFIG.MISSING_SECTION');
```

## Dependency direction

Runtime dependencies are `@openlance/aios-kernel` and `@openlance/aios-errors` only. It has a peer/dev awareness of `@openlance/aios-di`, `@openlance/aios-logging`, and `@openlance/aios-events` so its fixtures and harness can be built without inverting the substrate dependency graph. **No package depends on this package at runtime**; it is a development dependency everywhere it is used, enforced by dependency-cruiser.

## Constitutional traceability

Owns no constitutional concept; `aios.constitution` is intentionally empty. It supplies the deterministic seams that make the constitution's determinism (same inputs yield the same outcome) testable in practice, and asserts nothing about AI behavior (none exists in Phase 2A). It restates no constitutional text.

## Explicit non-responsibilities

It owns no business test, AI behavior, runtime execution, orchestration, provider, agent, plugin, production implementation, observability, deployment, or workflow. It provides test seams and harnesses; it does not test any particular subject or embed any production behavior.

## Stability

`Low` (Engineering Rule 4). Development tooling that iterates freely.
