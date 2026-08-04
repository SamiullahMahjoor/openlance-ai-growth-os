import { err, isOk, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';

import { ProviderError } from './errors.js';
import { isClearance } from './governance-clearance.js';
import type { GovernanceClearance } from './governance-clearance.js';
import type { ProviderMetrics } from './metrics.js';
import type { ProviderResponseNormalizer } from './normalizer.js';
import type { ProviderRouter } from './routing.js';
import type {
  ExecutionOptions,
  Provider,
  ProviderNeed,
  ProviderRequest,
  ProviderResponse,
} from './types.js';

/**
 * The governed executor: the single path by which a provider is invoked. It requires a
 * {@link GovernanceClearance} for the request (ai/runtime "Governance precedes execution"; ai/providers
 * "used only within the rules governance sets"); there is no path to invoke an unvalidated request,
 * and the engine never mints a clearance. Given a valid clearance, it routes the need to the eligible
 * providers and invokes them with a bounded per-provider retry, a clock-based deadline, a cancellation
 * signal, and bounded failover to the next provider, returning the normalized response or a `Result`
 * error. It executes over the `Provider` abstraction only and holds no vendor knowledge; a
 * transport-level timeout is a concrete adapter's concern.
 */
export class ProviderExecutor {
  readonly #router: ProviderRouter;
  readonly #normalizer: ProviderResponseNormalizer;
  readonly #metrics: ProviderMetrics;
  readonly #clock: Clock;

  constructor(
    router: ProviderRouter,
    normalizer: ProviderResponseNormalizer,
    metrics: ProviderMetrics,
    clock: Clock,
  ) {
    this.#router = router;
    this.#normalizer = normalizer;
    this.#metrics = metrics;
    this.#clock = clock;
  }

  /**
   * Invoke a provider for a governed request, failing closed. It refuses without a valid clearance
   * (`PROVIDER.NO_CLEARANCE`) or when the clearance does not match the request capability
   * (`PROVIDER.CLEARANCE_MISMATCH`); refuses when no provider is eligible (`PROVIDER.NO_PROVIDER`);
   * refuses on cancellation (`PROVIDER.CANCELLED`) or a passed deadline (`PROVIDER.TIMEOUT`).
   * Otherwise it invokes with bounded retry and failover, returning the normalized response or the
   * last error.
   */
  async execute(
    clearance: GovernanceClearance,
    need: ProviderNeed,
    request: ProviderRequest,
    providers: readonly Provider[],
    options: ExecutionOptions,
  ): Promise<Result<ProviderResponse, ProviderError>> {
    this.#metrics.recordInvocation();
    if (!isClearance(clearance)) {
      this.#metrics.recordFailure();
      return err(
        new ProviderError(
          'PROVIDER.NO_CLEARANCE',
          'A provider invocation requires a governance clearance; none was supplied.',
          { capability: request.capability },
        ),
      );
    }
    if (clearance.capability !== request.capability) {
      this.#metrics.recordFailure();
      return err(
        new ProviderError(
          'PROVIDER.CLEARANCE_MISMATCH',
          `The governance clearance is for capability '${clearance.capability}', not '${request.capability}'.`,
          { cleared: clearance.capability, requested: request.capability },
        ),
      );
    }
    if (need.capability !== request.capability) {
      this.#metrics.recordFailure();
      return err(
        new ProviderError(
          'PROVIDER.CAPABILITY_MISMATCH',
          `The routing need capability '${need.capability}' does not match the request capability '${request.capability}'.`,
          { need: need.capability, request: request.capability },
        ),
      );
    }
    if (!Number.isInteger(options.maxAttempts) || options.maxAttempts < 1) {
      this.#metrics.recordFailure();
      return err(
        new ProviderError(
          'PROVIDER.INVALID_ATTEMPTS',
          `The attempt bound must be a positive integer; received ${options.maxAttempts}.`,
          { maxAttempts: options.maxAttempts },
        ),
      );
    }
    const ordered = this.#router.route(need, providers);
    if (ordered.length === 0) {
      this.#metrics.recordFailure();
      return err(
        new ProviderError(
          'PROVIDER.NO_PROVIDER',
          `No eligible provider can serve capability '${request.capability}'.`,
          { capability: request.capability },
        ),
      );
    }
    // Definitely assigned before the final `return err(lastError)`: reaching that return means the
    // outer loop completed, and with a positive-integer maxAttempts (guarded above) and
    // ordered.length >= 1 each provider's inner loop ran at least once and recorded its error. No
    // dead placeholder value.
    let lastError!: ProviderError;
    for (const [index, provider] of ordered.entries()) {
      if (options.signal !== null && options.signal.aborted) {
        this.#metrics.recordFailure();
        return err(
          new ProviderError('PROVIDER.CANCELLED', 'The provider invocation was cancelled.', {
            capability: request.capability,
          }),
        );
      }
      if (options.deadline !== null && this.#clock.now() > options.deadline) {
        this.#metrics.recordFailure();
        return err(
          new ProviderError('PROVIDER.TIMEOUT', 'The provider invocation deadline passed.', {
            capability: request.capability,
          }),
        );
      }
      for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
        const result = await provider.invoke(clearance, request);
        if (isOk(result)) {
          this.#metrics.recordSuccess();
          return ok(this.#normalizer.normalize(provider.id, request.capability, result.value));
        }
        lastError = result.error;
      }
      if (index < ordered.length - 1) {
        this.#metrics.recordFailover();
      }
    }
    this.#metrics.recordFailure();
    return err(lastError);
  }
}
