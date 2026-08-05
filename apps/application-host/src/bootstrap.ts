import { bootstrap } from '@openlance/aios-composition-root';
import type { Application } from '@openlance/aios-composition-root';
import type { ConfigProvider } from '@openlance/aios-config';
import type { Module, Token } from '@openlance/aios-di';
import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { LoggerOptions } from '@openlance/aios-logging';
import type { ProviderDescriptor, ProviderManager } from '@openlance/aios-provider-engine';

import { AiosError } from './errors.js';

/** The provider wiring: the Provider Engine manager and the adapter descriptors to register with it. */
export interface AiosProviderWiring {
  readonly manager: ProviderManager;
  readonly adapters: readonly ProviderDescriptor[];
}

/**
 * The options the AIOS application is bootstrapped from: the configuration providers and logger options the frozen
 * composition root needs, the engine DI modules to compose, and, optionally, the provider adapters to register.
 */
export interface AiosOptions {
  readonly config: readonly ConfigProvider[];
  readonly logging: LoggerOptions;
  readonly modules?: readonly Module[];
  readonly providers?: AiosProviderWiring;
}

/**
 * The governed AIOS application handle: the composed immutable `Application`, a resolver that returns any registered
 * engine manager from the frozen container, the ids of the registered provider adapters, and disposal. It exposes only
 * the governed engine APIs; it drives no execution and mints no clearance.
 */
export interface AiosApplication {
  readonly application: Application;
  resolve<T>(token: Token<T>): T;
  readonly providers: readonly string[];
  dispose(): Promise<void>;
}

/**
 * Bootstrap the AIOS application: compose the supplied engine modules through the frozen composition root, register the
 * provider adapters, and expose one governed application handle. It is fail-closed and atomic: a composition failure
 * yields an `AiosError` and no application; a failed adapter registration disposes the composed application and yields an
 * `AiosError`, so no partially wired application is ever exposed. It composes and registers only; it drives no execution,
 * mints no clearance, invokes no provider, and constructs no engine (engine managers are supplied as DI modules).
 */
export const bootstrapAios = async (
  options: AiosOptions,
): Promise<Result<AiosApplication, AiosError>> => {
  const composed = bootstrap({
    config: options.config,
    logging: options.logging,
    modules: options.modules ?? [],
  });
  if (isErr(composed)) {
    return err(
      new AiosError(
        'AIOS.COMPOSITION_FAILED',
        'The application composition failed; no application was bootstrapped.',
        { causes: composed.error.map((error) => error.code) },
      ),
    );
  }
  const application = composed.value;

  const providerIds: string[] = [];
  const wiring = options.providers;
  if (wiring !== undefined) {
    for (const adapter of wiring.adapters) {
      const registered = await wiring.manager.register(adapter);
      if (isErr(registered)) {
        await application.dispose();
        return err(
          new AiosError(
            'AIOS.PROVIDER_REGISTRATION_FAILED',
            'A provider adapter failed to register; the composed application was disposed.',
            { cause: registered.error.code },
          ),
        );
      }
      providerIds.push(registered.value);
    }
  }

  const handle: AiosApplication = {
    application,
    resolve: <T>(token: Token<T>): T => application.container.resolve(token),
    providers: Object.freeze(providerIds),
    dispose: (): Promise<void> => application.dispose(),
  };
  return ok(Object.freeze(handle));
};
