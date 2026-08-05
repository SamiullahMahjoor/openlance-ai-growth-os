/**
 * The retry manager: the bounded per-step retry policy. A step may be retried only while its attempts are below the
 * configured bound, so retries are bounded and never run without end (the frozen `recovery-is-bounded` principle). The
 * backoff is a deterministic exponential of the attempt number; the engine reports it and never derives a delay from a
 * clock or randomness. It decides only; it executes nothing.
 */
export class RetryManager {
  /** Whether a step on its `attempts`-th try may be retried, given the bound. */
  mayRetry(attempts: number, maxAttempts: number): boolean {
    return attempts < maxAttempts;
  }

  /** The deterministic exponential backoff (ms) for the next attempt after `attempts` tries. */
  backoff(attempts: number, baseMillis: number): number {
    return baseMillis * 2 ** Math.max(0, attempts - 1);
  }
}
