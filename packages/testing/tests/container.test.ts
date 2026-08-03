import { token } from '@openlance/aios-di';
import { describe, expect, it } from 'vitest';

import { createTestContainer } from '../src/index';

describe('createTestContainer', () => {
  it('creates isolated containers that do not share registration state', () => {
    const first = createTestContainer();
    const second = createTestContainer();
    const service = token<number>('service');
    first.register(service, { useValue: 1 });
    expect(first.resolve(service)).toBe(1);
    expect(second.tryResolve(service)).toEqual({ some: false });
  });

  it('applies the configure callback before returning', () => {
    const service = token<number>('service');
    const container = createTestContainer((registry) => {
      registry.register(service, { useValue: 5 });
    });
    expect(container.resolve(service)).toBe(5);
  });
});
