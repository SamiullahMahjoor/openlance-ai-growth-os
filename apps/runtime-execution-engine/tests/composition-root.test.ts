import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import { createEventBus } from '@openlance/aios-events';

import {
  RUNTIME_EXECUTION_MANAGER,
  RuntimeExecutionManager,
  runtimeExecutionEngineModule,
} from '../src/index';

/**
 * The Runtime Execution Engine registers through the frozen composition root's extension seam (ADR-0026
 * CompositionConfig.modules), not by defining a container of its own. This proves the operational service is wired into
 * the object graph and resolvable, exactly as ADR-0035/ADR-0044 anticipate.
 */
const clock = { now: () => 0 };
const sink = { write: () => undefined };
const executor = { execute: async () => ({ status: 'succeeded' as const }) };

describe('composition-root seam (ADR-0026, ADR-0044)', () => {
  it('registers the manager through the seam and resolves it', () => {
    const manager = new RuntimeExecutionManager({ clock, bus: createEventBus(), executor });
    const booted = bootstrap({
      config: [new DefaultsProvider({ app: { name: 'test' } })],
      logging: { level: 'info', clock, sinks: [sink] },
      modules: [runtimeExecutionEngineModule(manager)],
    });
    expect(booted.ok).toBe(true);
    if (!booted.ok) return;
    expect(booted.value.container.resolve(RUNTIME_EXECUTION_MANAGER)).toBe(manager);
  });
});
