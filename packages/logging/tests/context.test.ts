import { describe, expect, it } from 'vitest';

import { createCorrelationContext } from '../src/index';

describe('createCorrelationContext', () => {
  it('returns empty ids outside any run', () => {
    expect(createCorrelationContext().current()).toEqual({});
  });

  it('exposes ids within a run and returns the callback value', () => {
    const context = createCorrelationContext();
    const result = context.run({ correlationId: 'c1', traceId: 't1' }, () => {
      expect(context.current()).toEqual({ correlationId: 'c1', traceId: 't1' });
      return 42;
    });
    expect(result).toBe(42);
  });

  it('restores the outer ids after a nested run', () => {
    const context = createCorrelationContext();
    context.run({ correlationId: 'outer' }, () => {
      context.run({ correlationId: 'inner' }, () => {
        expect(context.current().correlationId).toBe('inner');
      });
      expect(context.current().correlationId).toBe('outer');
    });
  });

  it('propagates ids across async continuations', async () => {
    const context = createCorrelationContext();
    const seen = await context.run({ correlationId: 'c1' }, async () => {
      await Promise.resolve();
      return context.current().correlationId;
    });
    expect(seen).toBe('c1');
  });
});
