/**
 * @packageDocumentation
 * `@openlance/aios-kernel`
 *
 * The zero-dependency root of the implementation substrate. It provides only
 * universal engineering primitives that every package needs:
 *
 * - value types: `Result` and `Option` with their combinators,
 * - nominal typing: `Brand` and the canonical `CorrelationId` / `TraceId`,
 * - determinism seams: the `Clock` and `IdGenerator` interfaces (and `SystemClock`,
 *   the single sanctioned wrapper around real time),
 * - lifecycle: the `Disposable` teardown contract.
 *
 * It owns no AI concept, no business concept, and no engineering-subsystem
 * behavior (no DI, configuration, logging, events, or plugins). Nothing in the
 * kernel depends on another repository package.
 *
 * This file is the single supported public API (Engineering Rule 1). Consumers
 * import only from the package entry point; deep imports into internal modules are
 * prohibited and fail CI.
 *
 * Design: docs/implementation/01-core-framework.md. Decisions: ADR-0006 (Result),
 * ADR-0008 (combinator export strategy).
 */

export { ok, err, isOk, isErr, map, mapErr, andThen, unwrapOr } from './result.js';
export type { Ok, Err, Result } from './result.js';
export {
  some,
  none,
  fromNullable,
  isSome,
  isNone,
  mapOption,
  andThenOption,
  unwrapOrOption,
} from './option.js';
export type { Some, None, Option } from './option.js';
export { brand } from './brand.js';
export type { Brand } from './brand.js';
export { correlationId, traceId } from './types.js';
export type { CorrelationId, TraceId } from './types.js';
export { SystemClock } from './clock.js';
export type { Clock } from './clock.js';
export type { IdGenerator } from './id.js';
export type { Disposable } from './disposable.js';
