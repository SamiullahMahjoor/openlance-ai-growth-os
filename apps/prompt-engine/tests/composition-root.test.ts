import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import { createEventBus } from '@openlance/aios-events';

import { PROMPT_MANAGER, PromptManager, promptEngineModule } from '../src/index';

/**
 * The Prompt Engine registers through the frozen composition root's extension seam (ADR-0026
 * CompositionConfig.modules), not by defining a container of its own. This proves the operational service
 * is wired into the object graph and resolvable, exactly as ADR-0035/ADR-0036 anticipate.
 */
const clock = { now: () => 0 };
const sink = { write: () => undefined };

describe('composition-root seam (ADR-0026, ADR-0036)', () => {
  it('registers the manager through the seam and resolves it', () => {
    const manager = new PromptManager({ clock, bus: createEventBus() });
    const booted = bootstrap({
      config: [new DefaultsProvider({ app: { name: 'test' } })],
      logging: { level: 'info', clock, sinks: [sink] },
      modules: [promptEngineModule(manager)],
    });
    expect(booted.ok).toBe(true);
    if (!booted.ok) return;
    expect(booted.value.container.resolve(PROMPT_MANAGER)).toBe(manager);
  });
});
