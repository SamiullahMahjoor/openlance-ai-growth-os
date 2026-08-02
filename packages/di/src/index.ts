/**
 * @packageDocumentation
 * `@openlance/aios-di`
 *
 * The custom, framework-neutral dependency-injection container (ADR-0005). It owns
 * service registration, the three lifetimes (singleton, scoped, transient), scopes,
 * module registration and composition, and deterministic startup validation that
 * rejects missing dependencies, cycles, and lifetime mismatches with structured
 * errors returned in a `Result` rather than thrown.
 *
 * It owns dependency injection only: no runtime execution, configuration, logging,
 * events, plugins, providers, orchestration, or AI concept. Registration is
 * explicit, resolution is deterministic, and there is no reflection, no decorators,
 * no ambient registration, and no hidden service locator. Its dependencies are
 * @openlance/aios-kernel and @openlance/aios-errors.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports
 * into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/03-dependency-injection.md.
 */

export { token } from './token.js';
export type { Token } from './token.js';
export type { Lifetime, Provider, Resolver } from './provider.js';
export type { Registry } from './registry.js';
export type { Scope } from './scope.js';
export { createContainer } from './container.js';
export type { Container } from './container.js';
export { createModuleHost } from './module.js';
export type { Module, ModuleHost } from './module.js';
export { DependencyError } from './validation.js';
