import { createContainer } from '@openlance/aios-di';
import { ValidationError } from '@openlance/aios-errors';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  CONFIG_SERVICE,
  ConfigError,
  createConfigService,
  loadConfig,
  ObjectProvider,
} from '../src/index';
import type { ConfigProvider, ConfigRecord, Schema } from '../src/index';

const portSchema: Schema<{ port: number }> = {
  parse: (input) => {
    if (
      typeof input === 'object' &&
      input !== null &&
      typeof (input as { port?: unknown }).port === 'number'
    ) {
      return ok({ port: (input as { port: number }).port });
    }
    return err(
      new ValidationError('V.PORT', 'invalid', [{ path: 'port', message: 'must be a number' }]),
    );
  },
};

const hostSchema: Schema<{ host: string }> = {
  parse: (input) => {
    if (
      typeof input === 'object' &&
      input !== null &&
      typeof (input as { host?: unknown }).host === 'string'
    ) {
      return ok({ host: (input as { host: string }).host });
    }
    return err(
      new ValidationError('V.HOST', 'invalid', [{ path: 'host', message: 'must be a string' }]),
    );
  },
};

const failing: ConfigProvider = {
  name: 'failing',
  priority: 0,
  load: (): Result<ConfigRecord, ConfigError> =>
    err(new ConfigError('CONFIG.LOAD_FAILED', 'source failed', {})),
};

describe('createConfigService', () => {
  it('builds a service and returns validated typed config', () => {
    const service = createConfigService([new ObjectProvider('base', 0, { port: 8080 })]);
    expect(service.ok).toBe(true);
    if (service.ok) {
      expect(service.value.get(portSchema)).toEqual({ ok: true, value: { port: 8080 } });
    }
  });

  it('returns a ConfigError when validation fails', () => {
    const service = createConfigService([new ObjectProvider('base', 0, { port: 'nope' })]);
    expect(service.ok).toBe(true);
    if (service.ok) {
      const result = service.value.get(portSchema);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('CONFIG.VALIDATION_FAILED');
        expect(result.error.cause).toBeInstanceOf(ValidationError);
      }
    }
  });

  it('resolves a validated section', () => {
    const service = createConfigService([
      new ObjectProvider('base', 0, { db: { host: 'localhost' } }),
    ]);
    expect(service.ok).toBe(true);
    if (service.ok) {
      expect(service.value.getSection('db', hostSchema)).toEqual({
        ok: true,
        value: { host: 'localhost' },
      });
    }
  });

  it('returns a ConfigError for a missing section', () => {
    const service = createConfigService([new ObjectProvider('base', 0, { db: { host: 'x' } })]);
    expect(service.ok).toBe(true);
    if (service.ok) {
      const result = service.value.getSection('cache', hostSchema);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('CONFIG.MISSING_SECTION');
      }
    }
  });

  it('returns a ConfigError when a section fails validation', () => {
    const service = createConfigService([new ObjectProvider('base', 0, { db: { host: 'x' } })]);
    expect(service.ok).toBe(true);
    if (service.ok) {
      const result = service.value.getSection('db', portSchema);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('CONFIG.VALIDATION_FAILED');
      }
    }
  });

  it('fails closed when a provider fails to load', () => {
    const service = createConfigService([failing]);
    expect(service.ok).toBe(false);
    if (!service.ok) {
      expect(service.error.code).toBe('CONFIG.LOAD_FAILED');
    }
  });
});

describe('loadConfig (startup validation)', () => {
  it('returns validated typed config for a good graph', () => {
    expect(loadConfig([new ObjectProvider('base', 0, { port: 8080 })], portSchema)).toEqual({
      ok: true,
      value: { port: 8080 },
    });
  });

  it('fails closed when a source fails to load', () => {
    const result = loadConfig([failing], portSchema);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('CONFIG.LOAD_FAILED');
    }
  });

  it('fails closed when validation fails', () => {
    const result = loadConfig([new ObjectProvider('base', 0, { port: 'no' })], portSchema);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('CONFIG.VALIDATION_FAILED');
    }
  });
});

describe('CONFIG_SERVICE di token', () => {
  it('registers and resolves a built ConfigService through a container', () => {
    const built = createConfigService([new ObjectProvider('base', 0, { port: 8080 })]);
    expect(built.ok).toBe(true);
    if (built.ok) {
      const container = createContainer();
      container.register(CONFIG_SERVICE, { useValue: built.value });
      const resolved = container.resolve(CONFIG_SERVICE);
      expect(resolved.get(portSchema)).toEqual({ ok: true, value: { port: 8080 } });
    }
  });
});
