/**
 * @packageDocumentation
 * `@openlance/aios-testing`
 *
 * Engineering test tooling: deterministic seams and harnesses that make the
 * substrate provable in isolation. It supplies a `FixedClock` and `SequentialId`
 * (removing ambient time and randomness), typed `mock`/`spy` doubles, a
 * `CapturingSink` and `InMemoryEventBus` (making side effects observable), an
 * isolated test DI container, an integration `Harness`, and `Result` matchers.
 *
 * It owns test utilities only. It owns no business test, AI behavior, runtime
 * execution, orchestration, provider, agent, plugin, production implementation,
 * observability, deployment, or workflow. It is a devDependency of every package
 * and a runtime dependency of none.
 *
 * Dependencies: @openlance/aios-kernel and @openlance/aios-errors at runtime; a
 * peer/dev awareness of @openlance/aios-di, @openlance/aios-logging, and
 * @openlance/aios-events so fixtures can build without inverting the dependency
 * graph.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports
 * into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/08-testing-infrastructure.md.
 */

export { FixedClock } from './clocks.js';
export { SequentialId } from './ids.js';
export { createTestContainer } from './container.js';
export { mock, spy } from './mocks.js';
export type { Spy } from './mocks.js';
export { CapturingSink, InMemoryEventBus } from './fakes.js';
export { resultMatchers } from './matchers.js';
export { createHarness } from './harness.js';
export type { Harness } from './harness.js';
