import type { Application } from '@openlance/aios-composition-root';
import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { NamespaceDescriptor, WiredApplication } from '@openlance/aios-namespace-wiring';

import { DiIntegrationError } from './errors.js';

/**
 * The substrate dependency-injection token descriptions available for future injection into namespace operational
 * services. It is referenced from the composition root's already-registered services
 * (`Application.diagnostics.services`); this layer registers none of them and defines no new token.
 */
export type InjectableSurface = readonly string[];

/**
 * A read-only record of one namespace's readiness to receive substrate services by dependency injection at a
 * future operational stage. Descriptive metadata only: it is not an activation, holds no service, resolves
 * nothing, and triggers no lifecycle. `serviceBindings` is empty today, because no frozen namespace exposes an
 * operational service (ADR-0020); a later stage populates it through the composition root's extension seam
 * (ADR-0026).
 */
export interface NamespaceInjectionReadiness {
  readonly namespace: string;
  readonly available: true;
  readonly serviceBindings: readonly string[];
  readonly ready: true;
}

/**
 * The immutable, validated integration of the composition root and the namespace wiring: the consumed
 * `WiredApplication` (which nests the Stage 1 `Application`), the injectable substrate surface referenced from it,
 * and the per-namespace injection readiness. `validated` records that the frozen `di` container's `validate()`
 * passed. It is descriptive metadata, not runtime state: it is never a container, registry, resolver, scheduler,
 * or service, and it holds no runtime state.
 */
export interface IntegratedApplication {
  readonly wired: WiredApplication;
  readonly injectable: InjectableSurface;
  readonly readiness: readonly NamespaceInjectionReadiness[];
  readonly validated: true;
}

/** Internal: the shared, frozen empty binding set (no namespace has an operational service to bind yet). */
const NO_BINDINGS: readonly string[] = Object.freeze([]);

/**
 * Internal: the injectable substrate surface, referenced from the composition root's already-registered service
 * token descriptions. It is not recomputed and no service is re-registered here.
 */
const injectableSurface = (application: Application): InjectableSurface =>
  application.diagnostics.services;

/** Internal: the frozen, read-only injection-readiness record for one wired namespace. */
const toReadiness = (descriptor: NamespaceDescriptor): NamespaceInjectionReadiness =>
  Object.freeze({
    namespace: descriptor.namespace,
    available: true,
    serviceBindings: NO_BINDINGS,
    ready: true,
  });

/**
 * Integrate the namespace wiring with the composition root's dependency-injection graph, failing closed. It
 * delegates dependency-graph validation to the frozen `di` container (`wired.application.container.validate()`),
 * references the injectable substrate surface from the composition root (`wired.application.diagnostics.services`),
 * records each wired namespace's injection readiness (with an empty binding set today), and returns an immutable
 * {@link IntegratedApplication}. It registers no service, resolves nothing for execution, activates nothing, and
 * runs no lifecycle. On a graph-validation failure it returns `DiIntegrationError[]` and builds no partial
 * result. Pure; no IO.
 */
export function integrate(
  wired: WiredApplication,
): Result<IntegratedApplication, DiIntegrationError[]> {
  const validation = wired.application.container.validate();
  if (isErr(validation)) {
    return err(
      validation.error.map(
        (cause) =>
          new DiIntegrationError(
            'DI_INTEGRATION.GRAPH_VALIDATION_FAILED',
            'The composed dependency graph failed validation; no integration was produced.',
            { cause: cause.code },
            cause,
          ),
      ),
    );
  }

  const readiness: readonly NamespaceInjectionReadiness[] = Object.freeze(
    wired.namespaces.namespaces.map(toReadiness),
  );
  return ok(
    Object.freeze({
      wired,
      injectable: injectableSurface(wired.application),
      readiness,
      validated: true,
    }),
  );
}
