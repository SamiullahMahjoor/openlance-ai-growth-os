import { AGENT_CONCERNS } from '@openlance/aios-agents';
import type { Application } from '@openlance/aios-composition-root';
import { EVALUATION_CONCERNS } from '@openlance/aios-evaluation';
import { EVOLUTION_CONCERNS } from '@openlance/aios-evolution';
import { TRUST_LEVELS } from '@openlance/aios-governance';
import { err, map, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { MEMORY_CONCERNS } from '@openlance/aios-memory';
import { OPERATIONS_CONCERNS } from '@openlance/aios-operations';
import { PROMPT_CONCERNS } from '@openlance/aios-prompts';
import { PROVIDER_CONCERNS } from '@openlance/aios-providers';
import { REASONING_CONCERNS } from '@openlance/aios-reasoning';
import { RETRIEVAL_CONCERNS } from '@openlance/aios-retrieval';
import { RUNTIME_CONCERNS } from '@openlance/aios-runtime';
import { SAFETY_CONCERNS } from '@openlance/aios-safety';
import { TOOL_CONCERNS } from '@openlance/aios-tools';

import { NamespaceWiringError } from './errors.js';

/**
 * The input to validation: a namespace's identity, its availability catalog, and its actual dependency edges.
 * The catalog is a stable exported array from the namespace's barrel, referenced only to confirm availability
 * (importable, non-empty) and to record a `conceptCount` diagnostic; the model behind it is never restated.
 */
export interface NamespaceSource {
  readonly namespace: string;
  readonly constitution: string;
  readonly catalog: readonly unknown[];
  readonly dependencies?: readonly string[];
}

/**
 * A read-only descriptor of one validated namespace. Descriptive metadata only: identity, constitution
 * identity, availability, a diagnostic concept count, and the actual (empty) dependency edges. It is never a
 * runtime registry, service locator, resolver, or scheduler.
 */
export interface NamespaceDescriptor {
  readonly namespace: string;
  readonly constitution: string;
  readonly available: true;
  readonly conceptCount: number;
  readonly dependencies: readonly string[];
}

/**
 * The immutable, validated namespace manifest: descriptive metadata, not runtime state. `validated` records
 * that structural validation passed, including that every declared dependency edge references a registered
 * namespace; the constitutional dependency map (ai/architecture/dependency-map.md) is referenced, never copied.
 */
export interface NamespaceManifest {
  readonly namespaces: readonly NamespaceDescriptor[];
  readonly validated: true;
}

/** A read-only report over the manifest. */
export interface NamespaceDiagnostics {
  readonly names: readonly string[];
  readonly count: number;
  readonly edgeCount: number;
}

/** The Stage 1 Application extended with the validated manifest and diagnostics; immutable. */
export interface WiredApplication {
  readonly application: Application;
  readonly namespaces: NamespaceManifest;
  readonly diagnostics: NamespaceDiagnostics;
}

/**
 * The canonical 13 frozen namespaces, in constitutional inventory order, each paired with its slug, its
 * constitution README id (constitution identity), and a stable exported catalog referenced for availability:
 * the `<X>_CONCERNS` inventory for the twelve that publish one, and `TRUST_LEVELS` for governance, which was
 * built per stage and has no unified concerns inventory. Their dependency edges are the actual package edges,
 * which are empty (every frozen namespace imports nothing); the allowed-edge topology is owned by
 * ai/architecture/dependency-map.md and is referenced, never re-encoded here.
 */
const CANONICAL_NAMESPACES: readonly NamespaceSource[] = [
  { namespace: 'governance', constitution: 'OL-AI-GOVERNANCE-README', catalog: TRUST_LEVELS },
  { namespace: 'providers', constitution: 'OL-AI-PROVIDERS-README', catalog: PROVIDER_CONCERNS },
  { namespace: 'memory', constitution: 'OL-AI-MEMORY-README', catalog: MEMORY_CONCERNS },
  { namespace: 'retrieval', constitution: 'OL-AI-RETRIEVAL-README', catalog: RETRIEVAL_CONCERNS },
  { namespace: 'safety', constitution: 'OL-AI-SAFETY-README', catalog: SAFETY_CONCERNS },
  { namespace: 'reasoning', constitution: 'OL-AI-REASONING-README', catalog: REASONING_CONCERNS },
  { namespace: 'prompts', constitution: 'OL-AI-PROMPTS-README', catalog: PROMPT_CONCERNS },
  { namespace: 'tools', constitution: 'OL-AI-TOOLS-README', catalog: TOOL_CONCERNS },
  { namespace: 'agents', constitution: 'OL-AI-AGENTS-README', catalog: AGENT_CONCERNS },
  { namespace: 'runtime', constitution: 'OL-AI-RUNTIME-README', catalog: RUNTIME_CONCERNS },
  {
    namespace: 'evaluation',
    constitution: 'OL-AI-EVALUATION-README',
    catalog: EVALUATION_CONCERNS,
  },
  {
    namespace: 'operations',
    constitution: 'OL-AI-OPERATIONS-README',
    catalog: OPERATIONS_CONCERNS,
  },
  { namespace: 'evolution', constitution: 'OL-AI-EVOLUTION-README', catalog: EVOLUTION_CONCERNS },
];

/** Internal: the frozen, read-only descriptor of a validated namespace source. */
const toDescriptor = (source: NamespaceSource): NamespaceDescriptor =>
  Object.freeze({
    namespace: source.namespace,
    constitution: source.constitution,
    available: true,
    conceptCount: source.catalog.length,
    dependencies: Object.freeze([...(source.dependencies ?? [])]),
  });

/** Internal: the read-only diagnostics report derived from a validated manifest. */
const toDiagnostics = (manifest: NamespaceManifest): NamespaceDiagnostics =>
  Object.freeze({
    names: Object.freeze(manifest.namespaces.map((descriptor) => descriptor.namespace)),
    count: manifest.namespaces.length,
    edgeCount: manifest.namespaces.reduce(
      (total, descriptor) => total + descriptor.dependencies.length,
      0,
    ),
  });

/**
 * Validate an explicit namespace-source set into an immutable manifest, failing closed. The checks are
 * structural only (never runtime, execution, provider, or service compatibility): a blank slug
 * (INVALID_PACKAGE), a blank constitution reference (MISSING_CONSTITUTION), an empty catalog (UNAVAILABLE), a
 * duplicate slug (DUPLICATE), and a declared dependency on a namespace not in the set (MISSING_NAMESPACE). On
 * any failure it returns the aggregated `NamespaceWiringError[]` and builds no partial manifest. Pure; no IO.
 */
export function validateNamespaces(
  sources: readonly NamespaceSource[],
): Result<NamespaceManifest, NamespaceWiringError[]> {
  const errors: NamespaceWiringError[] = [];
  const registered = new Set<string>(sources.map((source) => source.namespace));
  const seen = new Set<string>();

  for (const source of sources) {
    if (source.namespace.trim() === '') {
      errors.push(
        new NamespaceWiringError(
          'NAMESPACE_WIRING.INVALID_PACKAGE',
          'A namespace source has a blank slug.',
          {},
        ),
      );
      continue;
    }
    if (seen.has(source.namespace)) {
      errors.push(
        new NamespaceWiringError(
          'NAMESPACE_WIRING.DUPLICATE',
          `Namespace '${source.namespace}' is registered more than once.`,
          { namespace: source.namespace },
        ),
      );
    }
    seen.add(source.namespace);
    if (source.constitution.trim() === '') {
      errors.push(
        new NamespaceWiringError(
          'NAMESPACE_WIRING.MISSING_CONSTITUTION',
          `Namespace '${source.namespace}' has no constitution reference.`,
          { namespace: source.namespace },
        ),
      );
    }
    if (source.catalog.length === 0) {
      errors.push(
        new NamespaceWiringError(
          'NAMESPACE_WIRING.UNAVAILABLE',
          `Namespace '${source.namespace}' is unavailable: its exported catalog is empty.`,
          { namespace: source.namespace },
        ),
      );
    }
    for (const dependency of source.dependencies ?? []) {
      if (!registered.has(dependency)) {
        errors.push(
          new NamespaceWiringError(
            'NAMESPACE_WIRING.MISSING_NAMESPACE',
            `Namespace '${source.namespace}' declares a dependency on unregistered namespace '${dependency}'.`,
            { namespace: source.namespace, missing: dependency },
          ),
        );
      }
    }
  }

  if (errors.length > 0) {
    return err(errors);
  }

  const namespaces: readonly NamespaceDescriptor[] = Object.freeze(sources.map(toDescriptor));
  return ok(Object.freeze({ namespaces, validated: true }));
}

/**
 * Wire the canonical 13 frozen namespaces and extend the Stage 1 Application, failing closed. It builds the
 * canonical source set from the frozen namespace barrels, validates it with {@link validateNamespaces}, and on
 * success returns an immutable {@link WiredApplication} pairing the consumed Stage 1 `Application` (unchanged)
 * with the validated manifest and derived diagnostics. It executes nothing, registers no service, and holds no
 * runtime state.
 */
export function wireNamespaces(
  application: Application,
): Result<WiredApplication, NamespaceWiringError[]> {
  return map(validateNamespaces(CANONICAL_NAMESPACES), (manifest) =>
    Object.freeze({ application, namespaces: manifest, diagnostics: toDiagnostics(manifest) }),
  );
}
