import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';

import { WORKFLOW_MANAGER, OpenLanceGrowthWorkflows, workflowModule } from '../src/index';

/**
 * OpenLance Growth Workflows registers through the frozen composition root's extension seam (ADR-0026
 * CompositionConfig.modules), not by defining a container of its own. This proves the subsystem is wired into the object
 * graph and resolvable, as ADR-0055 anticipates.
 */
const clock = { now: () => 0 };
const sink = { write: () => undefined };

describe('composition-root seam (ADR-0026, ADR-0055)', () => {
  it('registers the subsystem through the seam and resolves it', () => {
    const manager = new OpenLanceGrowthWorkflows();
    const booted = bootstrap({
      config: [new DefaultsProvider({ app: { name: 'test' } })],
      logging: { level: 'info', clock, sinks: [sink] },
      modules: [workflowModule(manager)],
    });
    expect(booted.ok).toBe(true);
    if (!booted.ok) return;
    expect(booted.value.container.resolve(WORKFLOW_MANAGER)).toBe(manager);
  });
});
