import { CONFIG_SERVICE, createConfigService } from '@openlance/aios-config';
import type { ConfigProvider } from '@openlance/aios-config';
import { createModuleHost } from '@openlance/aios-di';
import type { Container, Lifetime, Module, Token } from '@openlance/aios-di';
import { EVENT_BUS, createEventBus } from '@openlance/aios-events';
import { LOGGER, createLogger } from '@openlance/aios-logging';
import type { LoggerOptions } from '@openlance/aios-logging';
import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { CompositionError } from './errors.js';

const PACKAGE_NAME = '@openlance/aios-composition-root';
const STAGE = 'phase-3-stage-1';
const MODULE_VERSION = '1.0.0';

/**
 * The startup configuration for a composition. It supplies exactly what each substrate service needs to be
 * built - the configuration providers, the logger options - plus the extension seam. Every field is read-only;
 * the composition root reads it and never mutates it.
 */
export interface CompositionConfig {
  /** The configuration providers merged into the `ConfigService` (owned by @openlance/aios-config). */
  readonly config: readonly ConfigProvider[];
  /** The options the `Logger` is built from (owned by @openlance/aios-logging): level, clock, sinks. */
  readonly logging: LoggerOptions;
  /**
   * The extension seam: additional frozen `di` modules later Phase 3 stages register their services through.
   * It is optional, inert, and immutable. The composition root performs no discovery, loading, scanning, or
   * registration of its own on these modules; it hands them, verbatim, to the frozen `di` module host, which
   * registers and validates them alongside the substrate modules. Stage 1 composes the substrate only.
   */
  readonly modules?: readonly Module[];
}

/** A read-only record of one service composed into the object graph. Not a `di` registry; frozen data only. */
export interface RegisteredService {
  /** The DI token description under which the service is registered (for example `aios.config.service`). */
  readonly token: string;
  /** The name of the composition module that registered the service. */
  readonly module: string;
  /** The lifetime the service is registered with. Substrate services are singletons. */
  readonly lifetime: Lifetime;
}

/** The read-only registry of services composed by the composition root (frozen). */
export type CompositionRegistry = readonly RegisteredService[];

/** A read-only report of the composed graph, for inspection. It decides nothing and changes nothing. */
export interface CompositionDiagnostics {
  /**
   * The composed module names, in submission order: the substrate services in dependency order (config,
   * logging, events), then any extension modules in the order given.
   */
  readonly modules: readonly string[];
  /** The registered substrate service token descriptions. */
  readonly services: readonly string[];
  /** Present only on a validated graph; `bootstrap` returns a failure rather than an unvalidated graph. */
  readonly validated: true;
}

/** Descriptive metadata about the composition (identity and counts). */
export interface CompositionMetadata {
  /** This package's name. */
  readonly package: string;
  /** The roadmap stage this composition root implements. */
  readonly stage: string;
  /** The number of substrate services composed. */
  readonly serviceCount: number;
  /** The number of modules composed (substrate plus any extension modules). */
  readonly moduleCount: number;
}

/**
 * The immutable result of a successful bootstrap: the validated object graph and the read-only composition
 * state. It holds a validated `di` `Container` (resolve-only, downstream), the frozen registry, diagnostics,
 * the configuration it was composed from, and metadata. No mutable builder remains; disposal delegates to the
 * container, which disposes what it owns in reverse construction order.
 */
export interface Application {
  readonly container: Container;
  readonly registry: CompositionRegistry;
  readonly diagnostics: CompositionDiagnostics;
  readonly configuration: CompositionConfig;
  readonly metadata: CompositionMetadata;
  dispose(): Promise<void>;
}

/** Internal: one substrate service to compose, as its module name, token, built instance, and module deps. */
interface SubstrateRegistration {
  readonly module: string;
  readonly token: Token<unknown>;
  readonly instance: unknown;
  readonly dependsOn: readonly string[];
}

/** Internal: a `di` module that registers a pre-built substrate instance as a singleton under its token. */
const toModule = (registration: SubstrateRegistration): Module => ({
  name: registration.module,
  version: MODULE_VERSION,
  dependsOn: registration.dependsOn,
  register(registry) {
    registry.register(registration.token, { useValue: registration.instance });
  },
});

/** Internal: the frozen, read-only record of a composed substrate service. */
const toRegisteredService = (registration: SubstrateRegistration): RegisteredService =>
  Object.freeze({
    token: String(registration.token.description),
    module: registration.module,
    lifetime: 'singleton',
  });

/**
 * Bootstraps AIOS: composes the substrate services (`CONFIG_SERVICE`, `LOGGER`, `EVENT_BUS`) into a validated,
 * immutable {@link Application}. It consumes the frozen `@openlance/aios-di` mechanism (`createModuleHost`,
 * `Container`, `validate`) and each owning package's builder (`createConfigService`, `createLogger`,
 * `createEventBus`); it defines no container, registry, or validation of its own (ADR-0026).
 *
 * It fails closed. If the configuration service fails to build, or the composed dependency graph fails
 * validation, `bootstrap` returns `CompositionError[]` and builds no partial application. On success it returns
 * one immutable `Application`; the `di` module host used to build it is local and is discarded. It registers
 * only the substrate services; it executes nothing, wires no namespace, and runs no lifecycle (those are later
 * Phase 3 stages, which register their services through {@link CompositionConfig.modules}).
 */
export function bootstrap(config: CompositionConfig): Result<Application, CompositionError[]> {
  const configService = createConfigService(config.config);
  if (isErr(configService)) {
    return err([
      new CompositionError(
        'COMPOSITION.CONFIG_BUILD_FAILED',
        'The configuration service failed to build; no application was composed.',
        { cause: configService.error.code },
        configService.error,
      ),
    ]);
  }

  const logger = createLogger(config.logging);
  const eventBus = createEventBus(logger);

  const registrations: readonly SubstrateRegistration[] = [
    { module: 'config', token: CONFIG_SERVICE, instance: configService.value, dependsOn: [] },
    { module: 'logging', token: LOGGER, instance: logger, dependsOn: [] },
    { module: 'events', token: EVENT_BUS, instance: eventBus, dependsOn: ['logging'] },
  ];
  const extensionModules = config.modules ?? [];

  const host = createModuleHost();
  for (const registration of registrations) {
    host.add(toModule(registration));
  }
  for (const module of extensionModules) {
    host.add(module);
  }

  const built = host.build();
  if (isErr(built)) {
    return err(
      built.error.map(
        (dependencyError) =>
          new CompositionError(
            'COMPOSITION.GRAPH_VALIDATION_FAILED',
            'The composed dependency graph failed validation; no application was composed.',
            { cause: dependencyError.code },
            dependencyError,
          ),
      ),
    );
  }

  const container = built.value;
  const registry: CompositionRegistry = Object.freeze(registrations.map(toRegisteredService));
  const moduleNames: readonly string[] = Object.freeze([
    ...registrations.map((registration) => registration.module),
    ...extensionModules.map((module) => module.name),
  ]);
  const diagnostics: CompositionDiagnostics = Object.freeze({
    modules: moduleNames,
    services: Object.freeze(registry.map((service) => service.token)),
    validated: true,
  });
  const metadata: CompositionMetadata = Object.freeze({
    package: PACKAGE_NAME,
    stage: STAGE,
    serviceCount: registry.length,
    moduleCount: moduleNames.length,
  });

  const application: Application = Object.freeze({
    container,
    registry,
    diagnostics,
    configuration: Object.freeze({ ...config }),
    metadata,
    dispose: (): Promise<void> => container.dispose(),
  });

  return ok(application);
}
