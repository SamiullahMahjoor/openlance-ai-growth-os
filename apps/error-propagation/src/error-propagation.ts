import { InMemoryErrorCodeRegistry } from '@openlance/aios-errors';
import type { ErrorCategory } from '@openlance/aios-errors';
import { err, map, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginLoadingPlan } from '@openlance/aios-plugin-loading';

import { ErrorPropagationError } from './errors.js';

/**
 * One declared error-propagation node: a coded error surface that propagates on the frozen `Result` channel, in a
 * frozen `ErrorCategory`. It is metadata only; no error is caught, mapped, or handled here. `category` is the
 * frozen `ErrorCategory` type, so an invalid category cannot be declared (compile-time enforced).
 */
export interface ErrorPropagationNode {
  readonly code: string;
  readonly category: ErrorCategory;
}

/** A read-only report over the error propagation plan. */
export interface ErrorPropagationDiagnostics {
  readonly nodeCount: number;
  readonly codes: readonly string[];
}

/**
 * The immutable error propagation plan, attached to the runtime integration chain. Descriptive planning metadata
 * only: it declares which coded errors propagate through the chain and in which category, and holds no runtime
 * state. It catches, retries, recovers, and handles nothing; it is never an exception engine, and it executes
 * nothing. A Phase 4 error-handling stage consumes it.
 */
export interface ErrorPropagationPlan {
  readonly chain: PluginLoadingPlan;
  readonly nodes: readonly ErrorPropagationNode[];
  readonly diagnostics: ErrorPropagationDiagnostics;
  readonly validated: true;
}

/**
 * Validate the declared propagation topology, failing closed. Pure: it delegates code-uniqueness to the frozen
 * `InMemoryErrorCodeRegistry` (registering each node's code, then asserting uniqueness) and, on a duplicate,
 * returns a single `ERROR_PROPAGATION.DUPLICATE_CODE` error wrapping the frozen registry's error as its cause, and
 * no validated topology. The registry's `assertUnique` throw is bridged to the `Result` channel here (the same
 * pattern the frozen `fromThrowable` uses); no runtime error is caught, mapped, or handled. On success it returns
 * the frozen topology. Pure; no IO.
 */
export function validateErrorPropagation(
  nodes: readonly ErrorPropagationNode[],
): Result<readonly ErrorPropagationNode[], ErrorPropagationError[]> {
  const registry = new InMemoryErrorCodeRegistry();
  for (const node of nodes) {
    registry.register(node.code);
  }
  try {
    registry.assertUnique();
  } catch (cause) {
    return err([
      new ErrorPropagationError(
        'ERROR_PROPAGATION.DUPLICATE_CODE',
        'The error propagation topology declares one or more duplicate error codes.',
        {},
        cause,
      ),
    ]);
  }
  return ok(Object.freeze([...nodes]));
}

/**
 * Build the immutable error propagation plan from a declared topology, attaching it to the Stage 6 runtime
 * integration chain handle, failing closed. It validates the topology through {@link validateErrorPropagation}
 * (delegating code-uniqueness to the frozen registry) and, on success, returns an immutable
 * {@link ErrorPropagationPlan} whose `nodes` are the validated topology and whose `diagnostics` report the node
 * count and codes. It consumes the frozen `PluginLoadingPlan` and the frozen error subsystem, recreates neither,
 * and executes nothing: it catches, retries, recovers, and handles no runtime error. On an invalid topology it
 * returns `ErrorPropagationError[]` and builds no partial plan. Pure; no IO.
 */
export function buildErrorPropagationPlan(
  chain: PluginLoadingPlan,
  nodes: readonly ErrorPropagationNode[],
): Result<ErrorPropagationPlan, ErrorPropagationError[]> {
  return map(validateErrorPropagation(nodes), (topology) =>
    Object.freeze({
      chain,
      nodes: topology,
      diagnostics: Object.freeze({
        nodeCount: topology.length,
        codes: Object.freeze(topology.map((node) => node.code)),
      }),
      validated: true,
    }),
  );
}
