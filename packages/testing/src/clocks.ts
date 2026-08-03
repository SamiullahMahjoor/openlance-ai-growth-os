import type { Clock } from '@openlance/aios-kernel';

/**
 * A deterministic `Clock` for tests. Time does not advance on its own: `now`
 * returns the current fixed instant, and `advance` moves it forward explicitly, so
 * time-dependent logic is reproducible.
 */
export class FixedClock implements Clock {
  #currentMs: number;

  constructor(startMs: number) {
    this.#currentMs = startMs;
  }

  now(): number {
    return this.#currentMs;
  }

  nowIso(): string {
    return new Date(this.#currentMs).toISOString();
  }

  advance(ms: number): void {
    this.#currentMs += ms;
  }
}
