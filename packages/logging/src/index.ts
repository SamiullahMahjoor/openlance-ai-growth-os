/**
 * @packageDocumentation
 * `@openlance/aios-logging`
 *
 * The logging substrate: it turns program activity into structured, correlated,
 * immutable records. Timestamps come from an injected `Clock` and correlation from
 * an ambient context seam, so identical inputs produce identical records. The sink
 * is abstracted, so no logging vendor is named anywhere.
 *
 * This package emits records only. It is deliberately below the Operations
 * observability model: observability, monitoring, health, diagnostics, incident
 * management, telemetry analysis, log storage, shipping, aggregation, dashboards,
 * and operational policy are owned by the constitutional Operations namespace
 * (ai/operations) and are not implemented here. This package classifies nothing,
 * raises nothing, and decides nothing.
 *
 * Dependencies: @openlance/aios-kernel (Clock), @openlance/aios-errors
 * (ValidationError), @openlance/aios-di (the LOGGER token), and
 * @openlance/aios-config (the level schema and the SecretRef redaction convention).
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports
 * into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/05-logging.md.
 */

export type { LogLevel } from './level.js';
export { logLevelSchema } from './level.js';
export type { LogRecord } from './record.js';
export type { LogSink } from './sink.js';
export type { CorrelationContext } from './context.js';
export { createCorrelationContext } from './context.js';
export type { Redactor } from './redaction.js';
export { createRedactor } from './redaction.js';
export type { Logger, LoggerOptions } from './logger.js';
export { createLogger, LOGGER } from './logger.js';
