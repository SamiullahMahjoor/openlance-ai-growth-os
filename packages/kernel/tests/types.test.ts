import { describe, expect, it } from 'vitest';

import { correlationId, traceId } from '../src/index';

describe('canonical ids', () => {
  it('correlationId wraps a string value unchanged at runtime', () => {
    expect(correlationId('req-1')).toBe('req-1');
  });

  it('traceId wraps a string value unchanged at runtime', () => {
    expect(traceId('trace-1')).toBe('trace-1');
  });
});
