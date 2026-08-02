/**
 * @packageDocumentation
 * `@openlance/aios-config`
 *
 * The configuration system: it absorbs environment and technology churn so the
 * constitution and core stay stable. Configuration is layered and deterministic:
 * sources are merged by fixed precedence, the merged result is validated once
 * through a neutral typed `Schema<T>` seam, and secrets are references, never
 * values. No package reads `process.env` directly; they read typed, validated
 * configuration from this service.
 *
 * It owns configuration only: no dependency injection, logging, runtime behavior,
 * providers, events, plugins, orchestration, AI, or business configuration. Its
 * dependencies are @openlance/aios-kernel, @openlance/aios-errors, and
 * @openlance/aios-di (for the `CONFIG_SERVICE` token by which a built service is
 * wired into a container).
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports
 * into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/04-configuration.md.
 */

export { ConfigError } from './provider.js';
export type { ConfigRecord, ConfigProvider } from './provider.js';
export { ObjectProvider, DefaultsProvider } from './object-provider.js';
export { EnvProvider } from './env-provider.js';
export type { Schema } from './schema.js';
export { createConfigService, loadConfig, CONFIG_SERVICE } from './service.js';
export type { ConfigService } from './service.js';
export { EnvSecretProvider } from './secret.js';
export type { SecretRef, SecretProvider } from './secret.js';
