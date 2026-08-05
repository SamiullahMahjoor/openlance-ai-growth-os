import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { RetrievalError } from './errors.js';
import type { RetrievalFilter } from './filter.js';
import type { RetrievalRanker } from './ranker.js';
import type { RetrievalRegistry } from './registry.js';
import type { RetrievalResolver } from './resolver.js';
import type { RetrievalRequest, RetrievalResult } from './types.js';
import type { RetrievalValidator } from './validator.js';

/**
 * The retrieval executor: it carries out the frozen retrieval workflow over a request and the registry,
 * in order: discover candidates for the scope, select the governance-permitted subset, resolve
 * dependencies to a complete set, prioritize by authority, assemble the result, and validate it, then
 * produce the validated {@link RetrievalResult}. It **determines and stops**: it loads nothing, assembles
 * no execution context, and executes nothing. It fails closed at every step, terminating in a validated
 * result or a refusal.
 */
export class RetrievalExecutor {
  readonly #filter: RetrievalFilter;
  readonly #resolver: RetrievalResolver;
  readonly #ranker: RetrievalRanker;
  readonly #validator: RetrievalValidator;

  constructor(
    filter: RetrievalFilter,
    resolver: RetrievalResolver,
    ranker: RetrievalRanker,
    validator: RetrievalValidator,
  ) {
    this.#filter = filter;
    this.#resolver = resolver;
    this.#ranker = ranker;
    this.#validator = validator;
  }

  /** Determine the validated knowledge set for a request over the registry, failing closed. */
  execute(
    request: RetrievalRequest,
    registry: RetrievalRegistry,
    strictPermission: boolean,
  ): Result<RetrievalResult, RetrievalError> {
    if (strictPermission && request.permitted === undefined) {
      return err(
        new RetrievalError(
          'RETRIEVAL.PERMISSION_REQUIRED',
          'A retrieval requires an explicit governance permission set.',
          { scope: request.scope },
        ),
      );
    }
    const discovered = this.#filter.discover(registry.list(), request.scope);
    if (discovered.length === 0) {
      return err(
        new RetrievalError(
          'RETRIEVAL.NO_CANDIDATES',
          `No candidate covers scope '${request.scope}'.`,
          { scope: request.scope },
        ),
      );
    }
    const selected = this.#filter.select(discovered, request.permitted);
    if (selected.length === 0) {
      return err(
        new RetrievalError(
          'RETRIEVAL.NONE_PERMITTED',
          `No candidate for scope '${request.scope}' is permitted.`,
          { scope: request.scope },
        ),
      );
    }
    const resolved = this.#resolver.resolve(selected, registry);
    if (isErr(resolved)) {
      return err(resolved.error);
    }
    const prioritized = this.#ranker.rank(resolved.value);
    const validation = this.#validator.validate(prioritized, request.permitted);
    if (isErr(validation)) {
      return err(validation.error);
    }
    const result: RetrievalResult = Object.freeze({
      scope: request.scope,
      candidates: Object.freeze(prioritized),
      validated: true,
    });
    return ok(result);
  }
}
