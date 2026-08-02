import type { Clock } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { createCorrelationContext, createLogger, createRedactor, LOGGER } from '../src/index';
import type { LogRecord, LogSink } from '../src/index';

const clock: Clock = {
  now: () => 1_700_000_000_000,
  nowIso: () => '2023-11-14T22:13:20.000Z',
};

class MemorySink implements LogSink {
  readonly records: LogRecord[] = [];
  write(record: LogRecord): void {
    this.records.push(record);
  }
}

describe('createLogger', () => {
  it('writes a structured record with an injected timestamp', () => {
    const sink = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [sink] }).info('hello', { user: 'alice' });
    const record = sink.records[0];
    expect(record).toMatchObject({
      level: 'info',
      message: 'hello',
      timestamp: 1_700_000_000_000,
      fields: { user: 'alice' },
    });
  });

  it('produces identical records for identical inputs under a fixed clock', () => {
    const a = new MemorySink();
    const b = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [a] }).info('m', { a: 1 });
    createLogger({ level: 'trace', clock, sinks: [b] }).info('m', { a: 1 });
    expect(a.records[0]).toEqual(b.records[0]);
  });

  it('drops records below the threshold', () => {
    const sink = new MemorySink();
    const logger = createLogger({ level: 'warn', clock, sinks: [sink] });
    logger.trace('t');
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');
    logger.fatal('f');
    expect(sink.records.map((r) => r.level)).toEqual(['warn', 'error', 'fatal']);
  });

  it('exposes a method per level', () => {
    const sink = new MemorySink();
    const logger = createLogger({ level: 'trace', clock, sinks: [sink] });
    logger.trace('t');
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');
    logger.fatal('f');
    expect(sink.records.map((r) => r.level)).toEqual([
      'trace',
      'debug',
      'info',
      'warn',
      'error',
      'fatal',
    ]);
  });

  it('records at an explicit level through log()', () => {
    const sink = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [sink] }).log('error', 'boom', { code: 500 });
    expect(sink.records[0]).toMatchObject({ level: 'error', fields: { code: 500 } });
  });

  it('writes to every sink', () => {
    const a = new MemorySink();
    const b = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [a, b] }).info('m');
    expect(a.records).toHaveLength(1);
    expect(b.records).toHaveLength(1);
  });

  it('produces immutable records', () => {
    const sink = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [sink] }).info('m', { a: 1 });
    const record = sink.records[0] as LogRecord;
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.fields)).toBe(true);
    expect(() => {
      (record as { message: string }).message = 'x';
    }).toThrow(TypeError);
  });
});

describe('child loggers', () => {
  it('binds fields inherited by every record', () => {
    const sink = new MemorySink();
    const child = createLogger({ level: 'trace', clock, sinks: [sink] }).child({
      service: 'billing',
    });
    child.info('m', { op: 'charge' });
    expect(sink.records[0]?.fields).toEqual({ service: 'billing', op: 'charge' });
  });

  it('merges bound fields across nested children, with child fields overriding', () => {
    const sink = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [sink], fields: { a: 1 } })
      .child({ b: 2 })
      .child({ a: 9 })
      .info('m');
    expect(sink.records[0]?.fields).toEqual({ a: 9, b: 2 });
  });

  it('a child inherits the context and redactor', () => {
    const sink = new MemorySink();
    const context = createCorrelationContext();
    const child = createLogger({
      level: 'trace',
      clock,
      sinks: [sink],
      context,
      redactor: createRedactor(),
    }).child({ svc: 'x' });
    context.run({ correlationId: 'c1' }, () => child.info('m', { password: 'p' }));
    expect(sink.records[0]).toMatchObject({
      correlationId: 'c1',
      fields: { svc: 'x', password: '[redacted]' },
    });
  });
});

describe('context propagation', () => {
  it('attaches all correlation ids present in the context', () => {
    const sink = new MemorySink();
    const context = createCorrelationContext();
    const logger = createLogger({ level: 'trace', clock, sinks: [sink], context });
    context.run({ correlationId: 'c1', traceId: 't1', spanId: 's1' }, () => logger.info('m'));
    expect(sink.records[0]).toMatchObject({ correlationId: 'c1', traceId: 't1', spanId: 's1' });
  });

  it('attaches only the ids present in the context', () => {
    const sink = new MemorySink();
    const context = createCorrelationContext();
    const logger = createLogger({ level: 'trace', clock, sinks: [sink], context });
    context.run({ correlationId: 'c1' }, () => logger.info('m'));
    const record = sink.records[0] as LogRecord;
    expect(record.correlationId).toBe('c1');
    expect('traceId' in record).toBe(false);
    expect('spanId' in record).toBe(false);
  });

  it('attaches no ids outside a context run', () => {
    const sink = new MemorySink();
    const context = createCorrelationContext();
    createLogger({ level: 'trace', clock, sinks: [sink], context }).info('m');
    expect('correlationId' in (sink.records[0] as LogRecord)).toBe(false);
  });

  it('attaches no ids when no context is configured', () => {
    const sink = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [sink] }).info('m');
    expect('correlationId' in (sink.records[0] as LogRecord)).toBe(false);
  });
});

describe('redaction integration', () => {
  it('redacts secret-shaped fields when a redactor is configured', () => {
    const sink = new MemorySink();
    createLogger({ level: 'trace', clock, sinks: [sink], redactor: createRedactor() }).info('m', {
      user: 'alice',
      password: 'hunter2',
    });
    expect(sink.records[0]?.fields).toEqual({ user: 'alice', password: '[redacted]' });
  });
});

describe('LOGGER token', () => {
  it('is a symbol token for container registration', () => {
    expect(typeof LOGGER).toBe('symbol');
  });
});
