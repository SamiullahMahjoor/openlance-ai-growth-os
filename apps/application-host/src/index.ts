/**
 * @packageDocumentation
 * `@openlance/aios-application-host`
 *
 * The AIOS application host (Platform Completion, PC-3): the thin operational bootstrap (ADR-0048). `bootstrapAios(options)`
 * consumes the frozen composition root to compose the supplied engine modules into one validated application, registers
 * the provider adapters, and returns a governed `AiosApplication` handle (a resolver over the frozen container, the
 * registered provider ids, and disposal). It is fail-closed and atomic; it drives no execution, mints no clearance, and
 * invokes no provider; it constructs no engine and owns no engine behavior and no composition mechanism.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI.
 */

export { bootstrapAios } from './bootstrap.js';
export type { AiosApplication, AiosOptions, AiosProviderWiring } from './bootstrap.js';
export { AiosError } from './errors.js';
