import { token } from '@openlance/aios-di';
import type { Token } from '@openlance/aios-di';
import type { Clock } from '@openlance/aios-kernel';

import type { CorrelationContext } from './context.js';
import { meetsThreshold } from './level.js';
import type { LogLevel } from './level.js';
import type { LogRecord } from './record.js';
import type { Redactor } from './redaction.js';
import type { LogSink } from './sink.js';

/**
 * A structured logger. Each method records a message at a level with optional
 * fields; records below the configured threshold are dropped. `child` binds
 * additional fields for a scope without creating new state.
 */
export interface Logger {
  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void;
  trace(message: string, fields?: Record<string, unknown>): void;
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
  fatal(message: string, fields?: Record<string, unknown>): void;
  child(fields: Record<string, unknown>): Logger;
}

/** Options for constructing a logger. The threshold is injected (read from config). */
export interface LoggerOptions {
  readonly level: LogLevel;
  readonly clock: Clock;
  readonly sinks: readonly LogSink[];
  readonly context?: CorrelationContext;
  readonly redactor?: Redactor;
  readonly fields?: Record<string, unknown>;
}

/**
 * The dependency-injection token under which a built `Logger` is registered and
 * resolved within a container (composition follows the token pattern of ADR-0010).
 */
export const LOGGER: Token<Logger> = token<Logger>('aios.logging.logger');

type MutableLogRecord = { -readonly [K in keyof LogRecord]: LogRecord[K] };

class LoggerImpl implements Logger {
  readonly #level: LogLevel;
  readonly #clock: Clock;
  readonly #sinks: readonly LogSink[];
  readonly #context: CorrelationContext | undefined;
  readonly #redactor: Redactor | undefined;
  readonly #fields: Readonly<Record<string, unknown>>;

  constructor(options: LoggerOptions) {
    this.#level = options.level;
    this.#clock = options.clock;
    this.#sinks = options.sinks;
    this.#context = options.context;
    this.#redactor = options.redactor;
    this.#fields = Object.freeze({ ...options.fields });
  }

  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void {
    if (!meetsThreshold(level, this.#level)) {
      return;
    }
    const merged = { ...this.#fields, ...fields };
    const shaped = this.#redactor ? this.#redactor.redact(merged) : merged;
    const ids = this.#context ? this.#context.current() : {};

    const record: MutableLogRecord = {
      level,
      message,
      timestamp: this.#clock.now(),
      fields: Object.freeze(shaped),
    };
    if (ids.correlationId !== undefined) {
      record.correlationId = ids.correlationId;
    }
    if (ids.traceId !== undefined) {
      record.traceId = ids.traceId;
    }
    if (ids.spanId !== undefined) {
      record.spanId = ids.spanId;
    }
    Object.freeze(record);

    for (const sink of this.#sinks) {
      sink.write(record);
    }
  }

  trace(message: string, fields?: Record<string, unknown>): void {
    this.log('trace', message, fields);
  }

  debug(message: string, fields?: Record<string, unknown>): void {
    this.log('debug', message, fields);
  }

  info(message: string, fields?: Record<string, unknown>): void {
    this.log('info', message, fields);
  }

  warn(message: string, fields?: Record<string, unknown>): void {
    this.log('warn', message, fields);
  }

  error(message: string, fields?: Record<string, unknown>): void {
    this.log('error', message, fields);
  }

  fatal(message: string, fields?: Record<string, unknown>): void {
    this.log('fatal', message, fields);
  }

  child(fields: Record<string, unknown>): Logger {
    return new LoggerImpl({
      level: this.#level,
      clock: this.#clock,
      sinks: this.#sinks,
      ...(this.#context !== undefined ? { context: this.#context } : {}),
      ...(this.#redactor !== undefined ? { redactor: this.#redactor } : {}),
      fields: { ...this.#fields, ...fields },
    });
  }
}

/** Creates a logger from injected collaborators. */
export const createLogger = (options: LoggerOptions): Logger => new LoggerImpl(options);
