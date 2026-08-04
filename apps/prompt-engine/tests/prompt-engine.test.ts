import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';

import {
  DEFAULT_SETTINGS,
  PROMPT_EVENT_TYPES,
  PromptAssembler,
  PromptCompiler,
  PromptConfiguration,
  PromptEvents,
  PromptFactory,
  PromptLifecycle,
  PromptManager,
  PromptMetrics,
  PromptNormalizer,
  PromptPluginBridge,
  PromptRegistry,
  PromptTemplateResolver,
  PromptValidator,
  PromptVariableResolver,
  VALIDATION_ERROR_CODES,
} from '../src/index';

/** A prompt part. `reference` marks a context reference (points to knowledge, never embeds it). */
const part = (layer, content, reference) => ({ layer, content, reference });

/** A prompt definition (durable architecture). */
const definition = (id, parts, extra = {}) => ({
  id,
  capability: 'chat',
  parts,
  requiredVariables: [],
  phase: 'definition',
  ...extra,
});

const clock = { now: () => 0 };

const expectOk = (result) => {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`expected ok, got ${JSON.stringify(result.error)}`);
  return result.value;
};
const expectErr = (result) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('expected an error');
  return result.error;
};

const governedParts = [
  part('governing', 'Stay within the rules.'),
  part('task', 'Summarize this.'),
];

describe('PromptRegistry', () => {
  it('registers, discovers, lists in order, and unregisters', () => {
    const registry = new PromptRegistry();
    expectOk(registry.register(definition('a', governedParts)));
    expectOk(registry.register(definition('b', governedParts)));
    expect(registry.has('a')).toBe(true);
    expect(registry.has('z')).toBe(false);
    expect(registry.get('a')?.id).toBe('a');
    expect(registry.get('z')).toBeUndefined();
    expect(registry.list().map((d) => d.id)).toEqual(['a', 'b']);
    expect(registry.unregister('a')).toBe(true);
    expect(registry.unregister('a')).toBe(false);
    expect(registry.list().map((d) => d.id)).toEqual(['b']);
  });

  it('fails closed on a duplicate id', () => {
    const registry = new PromptRegistry();
    expectOk(registry.register(definition('a', governedParts)));
    expect(expectErr(registry.register(definition('a', governedParts))).code).toBe(
      'PROMPT.DUPLICATE_ID',
    );
  });
});

describe('PromptFactory', () => {
  it('builds a frozen definition, filling the default phase', () => {
    const built = expectOk(
      new PromptFactory().create({ id: 'a', capability: 'chat', parts: governedParts }),
    );
    expect(built.phase).toBe('definition');
    expect(built.requiredVariables).toEqual([]);
    expect(built.inheritsFrom).toBeUndefined();
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.parts)).toBe(true);
    expect(Object.isFrozen(built.parts[0])).toBe(true);
  });

  it('keeps a provided phase, required variables, and base', () => {
    const built = expectOk(
      new PromptFactory().create({
        id: 'a',
        capability: 'chat',
        parts: governedParts,
        requiredVariables: ['name'],
        phase: 'composition',
        inheritsFrom: 'base',
      }),
    );
    expect(built.phase).toBe('composition');
    expect(built.requiredVariables).toEqual(['name']);
    expect(built.inheritsFrom).toBe('base');
  });

  it('fails closed on a blank id, blank capability, or no parts', () => {
    const factory = new PromptFactory();
    expect(
      expectErr(factory.create({ id: '  ', capability: 'chat', parts: governedParts })).code,
    ).toBe('PROMPT.BLANK_ID');
    expect(
      expectErr(factory.create({ id: 'a', capability: '  ', parts: governedParts })).code,
    ).toBe('PROMPT.BLANK_CAPABILITY');
    expect(expectErr(factory.create({ id: 'a', capability: 'chat', parts: [] })).code).toBe(
      'PROMPT.NO_PARTS',
    );
  });
});

describe('PromptLifecycle (consumes the frozen lifecycle model)', () => {
  it('exposes the frozen ordered phases and the ordering predicate', () => {
    const lifecycle = new PromptLifecycle();
    expect(lifecycle.phases()).toEqual([
      'definition',
      'composition',
      'validation',
      'expression',
      'retirement',
    ]);
    expect(lifecycle.atOrAfter('validation', 'composition')).toBe(true);
    expect(lifecycle.atOrAfter('composition', 'validation')).toBe(false);
  });

  it('is composable until expression', () => {
    const lifecycle = new PromptLifecycle();
    expect(lifecycle.isComposable(definition('a', governedParts, { phase: 'definition' }))).toBe(
      true,
    );
    expect(lifecycle.isComposable(definition('a', governedParts, { phase: 'expression' }))).toBe(
      false,
    );
    expect(lifecycle.isComposable(definition('a', governedParts, { phase: 'retirement' }))).toBe(
      false,
    );
  });
});

describe('PromptAssembler (consumes the frozen layer order)', () => {
  it('composes parts in the frozen layer order, stable within a layer', () => {
    const assembler = new PromptAssembler();
    expect(assembler.layers()).toEqual(['governing', 'role', 'intent', 'context', 'task']);
    const composed = assembler.assemble([
      part('task', 'T'),
      part('governing', 'G1'),
      part('governing', 'G2'),
      part('intent', 'I'),
    ]);
    expect(composed).toBe('G1\n\nG2\n\nI\n\nT');
  });
});

describe('PromptNormalizer', () => {
  it('settles structure (spaces, blank lines, trailing spaces, ends)', () => {
    const normalized = new PromptNormalizer().normalize('  a   b  \n\n\n\nc  \n  ');
    expect(normalized).toBe('a b\n\nc');
  });
});

describe('PromptTemplateResolver (inheritance, bounded and acyclic)', () => {
  it('resolves a definition with no inheritance to its own parts', () => {
    const resolver = new PromptTemplateResolver();
    const parts = expectOk(
      resolver.resolve(definition('a', [part('task', 'T')]), new PromptRegistry()),
    );
    expect(parts.map((p) => p.content)).toEqual(['T']);
  });

  it('resolves an inheritance chain base-first', () => {
    const registry = new PromptRegistry();
    expectOk(registry.register(definition('base', [part('governing', 'G')])));
    const derived = definition('derived', [part('task', 'T')], { inheritsFrom: 'base' });
    const parts = expectOk(new PromptTemplateResolver().resolve(derived, registry));
    expect(parts.map((p) => p.content)).toEqual(['G', 'T']);
  });

  it('fails closed on an unknown base', () => {
    const derived = definition('derived', [part('task', 'T')], { inheritsFrom: 'nope' });
    expect(
      expectErr(new PromptTemplateResolver().resolve(derived, new PromptRegistry())).code,
    ).toBe('PROMPT.UNKNOWN_BASE');
  });

  it('fails closed on an inheritance cycle', () => {
    const registry = new PromptRegistry();
    expectOk(registry.register(definition('a', [part('task', 'A')], { inheritsFrom: 'b' })));
    expectOk(registry.register(definition('b', [part('task', 'B')], { inheritsFrom: 'a' })));
    const a = registry.get('a');
    expect(expectErr(new PromptTemplateResolver().resolve(a, registry)).code).toBe(
      'PROMPT.INHERITANCE_CYCLE',
    );
  });
});

describe('PromptVariableResolver', () => {
  it('substitutes provided variables and leaves an unprovided placeholder', () => {
    const resolved = expectOk(
      new PromptVariableResolver().resolve(
        [part('task', 'Hello {{name}} and {{other}}')],
        ['name'],
        { name: 'World' },
        true,
      ),
    );
    expect(resolved[0].content).toBe('Hello World and {{other}}');
  });

  it('fails closed on a missing required variable in strict mode', () => {
    expect(
      expectErr(
        new PromptVariableResolver().resolve([part('task', '{{name}}')], ['name'], {}, true),
      ).code,
    ).toBe('PROMPT.MISSING_VARIABLE');
  });

  it('leaves a missing required variable as a placeholder in non-strict mode', () => {
    const resolved = expectOk(
      new PromptVariableResolver().resolve([part('task', '{{name}}')], ['name'], {}, false),
    );
    expect(resolved[0].content).toBe('{{name}}');
  });

  it('does not treat a prototype-chain name as a supplied variable', () => {
    expect(
      expectErr(
        new PromptVariableResolver().resolve(
          [part('task', '{{constructor}}')],
          ['constructor'],
          {},
          true,
        ),
      ).code,
    ).toBe('PROMPT.MISSING_VARIABLE');
    const resolved = expectOk(
      new PromptVariableResolver().resolve([part('task', '{{toString}}')], [], {}, true),
    );
    expect(resolved[0].content).toBe('{{toString}}');
  });
});

describe('PromptValidator (frozen checks, in order, conjunctive)', () => {
  const validator = new PromptValidator();

  it('exposes and proves the frozen check order', () => {
    expect(validator.checks()).toEqual([
      'governance-conformance',
      'boundary-conformance',
      'structural-completeness',
      'grounding-and-separation',
    ]);
    expect(validator.checksInConstitutionalOrder()).toBe(true);
  });

  it('accepts a governed, complete, grounded prompt', () => {
    expectOk(
      validator.validate(
        [part('governing', 'G'), part('task', 'T'), part('context', 'ref', true)],
        'G\n\nT',
      ),
    );
  });

  it('rejects each disqualifying condition in order', () => {
    expect(expectErr(validator.validate([part('task', 'T')], 'T')).code).toBe(
      'PROMPT.GOVERNANCE_LAYER_MISSING',
    );
    expect(
      expectErr(validator.validate([part('governing', 'G'), part('task', 'T')], 'has {{x}}')).code,
    ).toBe('PROMPT.UNRESOLVED_PLACEHOLDER');
    expect(expectErr(validator.validate([part('governing', 'G')], 'G')).code).toBe(
      'PROMPT.INCOMPLETE',
    );
    expect(
      expectErr(validator.validate([part('governing', 'G'), part('task', 'T')], '')).code,
    ).toBe('PROMPT.INCOMPLETE');
    expect(
      expectErr(
        validator.validate(
          [part('governing', 'G'), part('task', 'T'), part('context', 'embedded', false)],
          'G\n\nT',
        ),
      ).code,
    ).toBe('PROMPT.CONTEXT_NOT_SEPARATED');
  });

  it('exposes the validation error codes', () => {
    expect(VALIDATION_ERROR_CODES.has('PROMPT.GOVERNANCE_LAYER_MISSING')).toBe(true);
    expect(VALIDATION_ERROR_CODES.has('PROMPT.MISSING_VARIABLE')).toBe(false);
  });
});

describe('PromptCompiler (drives the frozen assembly stages)', () => {
  const build = () =>
    new PromptCompiler(
      new PromptTemplateResolver(),
      new PromptVariableResolver(),
      new PromptAssembler(),
      new PromptNormalizer(),
      new PromptValidator(),
    );

  it('exposes and proves the frozen assembly stage order', () => {
    const compiler = build();
    expect(compiler.stages()).toEqual([
      'resolve-inheritance',
      'gather-layers-and-template',
      'reference-context',
      'compose',
      'normalize',
      'finalize-for-validation',
    ]);
    expect(compiler.stagesInConstitutionalOrder()).toBe(true);
  });

  it('compiles a governed prompt into an execution-ready ProviderRequest', () => {
    const compiled = expectOk(
      build().compile(
        definition('a', [part('governing', 'Governed.'), part('task', 'Do {{x}}.')], {
          requiredVariables: ['x'],
        }),
        { variables: { x: 'the thing' } },
        new PromptRegistry(),
        true,
      ),
    );
    expect(compiled.content).toBe('Governed.\n\nDo the thing.');
    expect(compiled.capability).toBe('chat');
    expect(compiled.request).toEqual({
      capability: 'chat',
      payload: { prompt: 'Governed.\n\nDo the thing.' },
    });
    expect(compiled.compiled).toBe(true);
    expect(Object.isFrozen(compiled)).toBe(true);
    expect(Object.isFrozen(compiled.request)).toBe(true);
  });

  it('fails closed on an unknown base, a missing variable, and a validation failure', () => {
    const compiler = build();
    expect(
      expectErr(
        compiler.compile(
          definition('a', [part('task', 'T')], { inheritsFrom: 'nope' }),
          { variables: {} },
          new PromptRegistry(),
          true,
        ),
      ).code,
    ).toBe('PROMPT.UNKNOWN_BASE');
    expect(
      expectErr(
        compiler.compile(
          definition('a', [part('task', '{{x}}')], { requiredVariables: ['x'] }),
          { variables: {} },
          new PromptRegistry(),
          true,
        ),
      ).code,
    ).toBe('PROMPT.MISSING_VARIABLE');
    expect(
      expectErr(
        compiler.compile(
          definition('a', [part('task', 'T')]),
          { variables: {} },
          new PromptRegistry(),
          true,
        ),
      ).code,
    ).toBe('PROMPT.GOVERNANCE_LAYER_MISSING');
  });
});

describe('PromptMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new PromptMetrics();
    metrics.recordRegistration();
    metrics.recordCompilation();
    metrics.recordSuccess();
    metrics.recordFailure();
    metrics.recordValidationFailure();
    expect(metrics.statistics()).toEqual({
      registrations: 1,
      compilations: 1,
      successes: 1,
      failures: 1,
      validationFailures: 1,
    });
    expect(Object.isFrozen(metrics.statistics())).toBe(true);
  });
});

describe('PromptConfiguration', () => {
  it('defaults to strict variables and applies overrides', () => {
    expect(new PromptConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(new PromptConfiguration().settings.strictVariables).toBe(true);
    expect(new PromptConfiguration({ strictVariables: false }).settings.strictVariables).toBe(
      false,
    );
  });
});

describe('PromptEvents', () => {
  it('publishes registered, compiled, and failed on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new PromptEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => seen.push(event));
    await events.registered('a');
    await events.compiled('a', 'chat');
    await events.failed('a', 'chat');
    expect(seen.map((e) => e.type)).toEqual([
      PROMPT_EVENT_TYPES.registered,
      PROMPT_EVENT_TYPES.compiled,
      PROMPT_EVENT_TYPES.failed,
    ]);
    expect(seen[0].payload).toEqual({ promptId: 'a' });
    expect(seen[1].payload).toEqual({ promptId: 'a', capability: 'chat' });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('PromptPluginBridge (adopts definition-carrying plugins)', () => {
  const manifest = { name: 'greeting', version: '1.0.0', apiVersion: '1.0.0' };
  const input = (id) => ({ id, capability: 'chat', parts: governedParts });

  it('adopts each plugin definition into the registry, validated through the factory', () => {
    const registry = new PromptRegistry();
    const adopted = expectOk(
      new PromptPluginBridge(registry).adopt([
        { manifest, definition: input('a') },
        { manifest, definition: input('b') },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((d) => d.id)).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(expectOk(new PromptPluginBridge(new PromptRegistry()).adopt([]))).toEqual([]);
  });

  it('rejects an invalid definition (no blank id slips in)', () => {
    expect(
      expectErr(
        new PromptPluginBridge(new PromptRegistry()).adopt([{ manifest, definition: input('  ') }]),
      ).code,
    ).toBe('PROMPT.BLANK_ID');
  });

  it('fails closed on a conflicting definition', () => {
    const registry = new PromptRegistry();
    expectOk(registry.register(definition('a', governedParts)));
    expect(
      expectErr(new PromptPluginBridge(registry).adopt([{ manifest, definition: input('a') }]))
        .code,
    ).toBe('PROMPT.DUPLICATE_ID');
  });
});

describe('PromptManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new PromptManager({ clock, bus }), bus };
  };
  const input = (id, parts = governedParts, extra = {}) => ({
    id,
    capability: 'chat',
    parts,
    ...extra,
  });

  it('registers a definition and emits a registered event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.register(input('a')))).toBe('a');
    expect(manager.statistics().registrations).toBe(1);
    expect(events).toContain(PROMPT_EVENT_TYPES.registered);
  });

  it('fails closed on an invalid definition and on a duplicate', async () => {
    const { manager } = build();
    expect(expectErr(await manager.register(input('  '))).code).toBe('PROMPT.BLANK_ID');
    expectOk(await manager.register(input('a')));
    expect(expectErr(await manager.register(input('a'))).code).toBe('PROMPT.DUPLICATE_ID');
  });

  it('retires a definition', async () => {
    const { manager } = build();
    expectOk(await manager.register(input('a')));
    expect(manager.unregister('a')).toBe(true);
    expect(manager.unregister('a')).toBe(false);
  });

  it('compiles a registered definition into an execution-ready payload and emits compiled', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(await manager.register(input('a')));
    const compiled = expectOk(await manager.compile('a', { variables: {} }));
    expect(compiled.request.capability).toBe('chat');
    expect(compiled.request.payload).toEqual({
      prompt: 'Stay within the rules.\n\nSummarize this.',
    });
    expect(events).toContain(PROMPT_EVENT_TYPES.compiled);
    expect(manager.statistics()).toMatchObject({ compilations: 1, successes: 1 });
  });

  it('refuses an unknown id', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectErr(await manager.compile('nope', { variables: {} })).code).toBe('PROMPT.UNKNOWN');
    expect(events).toContain(PROMPT_EVENT_TYPES.failed);
  });

  it('refuses a definition that has passed expression', async () => {
    const { manager } = build();
    expectOk(await manager.register(input('a', governedParts, { phase: 'retirement' })));
    expect(expectErr(await manager.compile('a', { variables: {} })).code).toBe(
      'PROMPT.NOT_COMPOSABLE',
    );
  });

  it('counts a validation failure distinctly from another failure', async () => {
    const { manager } = build();
    // no governing layer -> a validation failure
    expectOk(await manager.register(input('novgov', [part('task', 'T')])));
    expect(expectErr(await manager.compile('novgov', { variables: {} })).code).toBe(
      'PROMPT.GOVERNANCE_LAYER_MISSING',
    );
    expect(manager.statistics()).toMatchObject({ failures: 1, validationFailures: 1 });
    // a missing variable -> a non-validation failure
    expectOk(
      await manager.register(
        input('needsvar', [part('governing', 'G'), part('task', '{{x}}')], {
          requiredVariables: ['x'],
        }),
      ),
    );
    expectErr(await manager.compile('needsvar', { variables: {} }));
    expect(manager.statistics()).toMatchObject({ failures: 2, validationFailures: 1 });
  });

  it('reports a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.register(input('a')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.definitionCount).toBe(1);
    expect(diagnostics.statistics.registrations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });
});
