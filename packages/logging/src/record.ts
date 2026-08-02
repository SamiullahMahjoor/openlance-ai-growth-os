import type { LogLevel } from './level.js';

/**
 * A single structured, correlated log record. Immutable once created. The timestamp
 * comes from an injected `Clock`, never `Date.now()`, and correlation ids are
 * attached from the ambient `CorrelationContext`, so identical inputs under a fixed
 * clock and context produce identical records.
 */
export interface LogRecord {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: number;
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly fields: Readonly<Record<string, unknown>>;
}
