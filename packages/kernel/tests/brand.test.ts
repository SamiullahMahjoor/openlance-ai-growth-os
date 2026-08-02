import { describe, expect, it } from 'vitest';

import { brand } from '../src/index';

describe('brand', () => {
  it('returns the underlying value unchanged at runtime', () => {
    const value = brand<string, 'Sku'>('ABC-123');
    expect(value).toBe('ABC-123');
  });

  it('adds no runtime property (the brand is phantom)', () => {
    const value = brand<number, 'Cents'>(500);
    expect(value).toBe(500);
    expect(Object.prototype.hasOwnProperty.call(Object(value), '__brand')).toBe(false);
  });
});
