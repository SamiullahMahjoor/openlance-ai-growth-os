import type { Clock } from '@openlance/aios-kernel';
import { bench, describe } from 'vitest';

import { createCorrelationContext, createLogger, createRedactor } from '../src/index';
import type { LogRecord, LogSink } from '../src/index';

/**
 * Observational micro-baselines for the logging substrate (Engineering Rule 5).
 * Measurement only: these run outside `src`, never on a runtime path, and never
 * change behavior. Recorded results live in benchmarks/baseline.md.
 */
const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };

class NullSink implements LogSink {
  last: LogRecord | undefined;
  write(record: LogRecord): void {
    this.last = record;
  }
}

describe('logging primitives', () => {
  const sink = new NullSink();
  const logger = createLogger({ level: 'trace', clock, sinks: [sink], redactor: createRedactor() });

  bench('log creation', () => {
    logger.info('message', { a: 1, b: 2 });
  });

  const context = createCorrelationContext();
  const contextLogger = createLogger({ level: 'trace', clock, sinks: [sink], context });
  bench('context merge (log within a run)', () => {
    context.run({ correlationId: 'c1', traceId: 't1' }, () => contextLogger.info('m', { a: 1 }));
  });

  const filtered = createLogger({ level: 'error', clock, sinks: [sink] });
  bench('filtering (below threshold)', () => {
    filtered.debug('dropped');
  });

  bench('child logger creation', () => {
    logger.child({ scope: 'x' });
  });

  const record: LogRecord = Object.freeze({
    level: 'info',
    message: 'm',
    timestamp: 1,
    fields: Object.freeze({ a: 1, b: 2 }),
  });
  bench('serialization', () => {
    JSON.stringify(record);
  });
});
