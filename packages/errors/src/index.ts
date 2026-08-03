/**
 * @packageDocumentation
 * `@openlance/aios-errors`
 *
 * The deterministic engineering error taxonomy. It owns the error hierarchy
 * (`BaseError` and the domain / infrastructure / validation categories), the
 * per-package error-code registry, and the bridges from throwing code to the
 * `Result` channel owned by @openlance/aios-kernel.
 *
 * It owns engineering error modeling only. It does not own logging, configuration,
 * dependency injection, events, plugins, retry, recovery, monitoring, or the
 * constitutional refusal / escalation / safe-failure models (owned by Safety and
 * Governance, ADR-0006). Its only dependency is @openlance/aios-kernel.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports
 * into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/02-error-framework.md. Decision: ADR-0006 (Result).
 */

export { BaseError } from './base.js';
export type { ErrorCategory } from './base.js';
export { DomainError } from './domain.js';
export { InfrastructureError } from './infrastructure.js';
export { ValidationError } from './validation.js';
export type { ValidationIssue } from './validation.js';
export { InMemoryErrorCodeRegistry } from './codes.js';
export type { ErrorCodeRegistry } from './codes.js';
export { fromThrowable, toResult } from './result-interop.js';
