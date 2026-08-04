/**
 * @packageDocumentation
 * `@openlance/aios-namespace-wiring`
 *
 * The AIOS namespace wiring (Phase 3, Stage 2). It declares the 13 frozen namespaces to the application as an
 * immutable, validated namespace manifest, and extends the Stage 1 Application graph into an immutable
 * `WiredApplication` (the Stage 1 `Application`, the manifest, and diagnostics), or fails closed with
 * `NamespaceWiringError[]`.
 *
 * The manifest is descriptive metadata, not runtime state: it is never a runtime registry, service locator,
 * execution registry, dependency resolver, scheduler, or orchestrator. This stage declares, validates
 * (structurally), and wires only; it executes nothing, registers no service, resolves no dependency, starts no
 * runtime, and holds no runtime state (ADR-0027). It consumes the frozen namespace packages and the Stage 1
 * composition root and recreates none of them; it re-encodes no constitutional dependency map, referencing
 * `ai/architecture/dependency-map.md` as the owner of the allowed-edge topology and declaring only each
 * namespace's actual (empty) dependency edges.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI. Design: docs/implementation/24-namespace-wiring.md. Decision: ADR-0027.
 */

export { validateNamespaces, wireNamespaces } from './manifest.js';
export type {
  NamespaceSource,
  NamespaceDescriptor,
  NamespaceManifest,
  NamespaceDiagnostics,
  WiredApplication,
} from './manifest.js';
export { NamespaceWiringError } from './errors.js';
