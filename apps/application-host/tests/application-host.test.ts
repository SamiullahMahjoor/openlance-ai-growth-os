import { DefaultsProvider } from '@openlance/aios-config';
import type { Module } from '@openlance/aios-di';
import { createEventBus } from '@openlance/aios-events';
import { isErr, isOk } from '@openlance/aios-kernel';
import {
  EVALUATION_MANAGER,
  EvaluationManager,
  evaluationEngineModule,
} from '@openlance/aios-evaluation-engine';
import {
  OPERATIONS_MANAGER,
  OperationsManager,
  operationsEngineModule,
} from '@openlance/aios-operations-engine';
import {
  PROVIDER_MANAGER,
  ProviderManager,
  providerEngineModule,
} from '@openlance/aios-provider-engine';
import { createOpenAIProvider } from '@openlance/aios-provider-adapter-openai';
import type { Transport } from '@openlance/aios-provider-adapter-openai';
import { describe, expect, it } from 'vitest';

import { bootstrapAios } from '../src/index';

const clock = { now: () => 0 };
const sink = { write: () => undefined };
const config = [new DefaultsProvider({ app: { name: 'test' } })];
const logging = { level: 'info' as const, clock, sinks: [sink] };
const transport: Transport = { send: () => Promise.resolve({ status: 200, body: '{}' }) };

describe('bootstrapAios', () => {
  it('composes the engine modules and registers a provider adapter, exposing a governed handle', async () => {
    const bus = createEventBus();
    const evaluation = new EvaluationManager({ clock, bus });
    const operations = new OperationsManager({ clock, bus });
    const provider = new ProviderManager({ clock, bus });
    const adapter = createOpenAIProvider({ transport, apiKey: 'k', model: 'm' });

    const result = await bootstrapAios({
      config,
      logging,
      modules: [
        evaluationEngineModule(evaluation),
        operationsEngineModule(operations),
        providerEngineModule(provider),
      ],
      providers: { manager: provider, adapters: [adapter] },
    });

    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const app = result.value;
    expect(app.resolve(EVALUATION_MANAGER)).toBe(evaluation);
    expect(app.resolve(OPERATIONS_MANAGER)).toBe(operations);
    expect(app.resolve(PROVIDER_MANAGER)).toBe(provider);
    expect(app.providers).toEqual(['openai:m']);
    expect(app.application.diagnostics.validated).toBe(true);
    await app.dispose();
  });

  it('composes with no modules and no providers', async () => {
    const result = await bootstrapAios({ config, logging });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.providers).toEqual([]);
    await result.value.dispose();
  });

  it('fails closed when composition fails', async () => {
    const bad: Module = {
      name: 'bad',
      version: '1.0.0',
      dependsOn: ['does-not-exist'],
      register: () => undefined,
    };
    const result = await bootstrapAios({ config, logging, modules: [bad] });
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.code).toBe('AIOS.COMPOSITION_FAILED');
  });

  it('fails closed and disposes when a provider adapter fails to register', async () => {
    const bus = createEventBus();
    const provider = new ProviderManager({ clock, bus });
    const first = createOpenAIProvider({ transport, apiKey: 'k', model: 'dup' });
    const duplicate = createOpenAIProvider({ transport, apiKey: 'k', model: 'dup' });

    const result = await bootstrapAios({
      config,
      logging,
      modules: [providerEngineModule(provider)],
      providers: { manager: provider, adapters: [first, duplicate] },
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.code).toBe('AIOS.PROVIDER_REGISTRATION_FAILED');
  });
});
