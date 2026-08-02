/**
 * Clock: the injectable time seam.
 *
 * The determinism invariant requires that ambient time enter the system through a
 * single, replaceable interface, so logic that reads "now" is reproducible when
 * given the same inputs (docs/implementation/01-core-framework.md; the determinism
 * invariant expressed across ai/reasoning, ai/memory, and ai/providers). Every
 * package receives a `Clock` by injection; only `SystemClock` reads real time.
 */

export interface Clock {
  /** Milliseconds elapsed since the Unix epoch. */
  now(): number;
  /** The current instant as an ISO-8601 string. */
  nowIso(): string;
}

/**
 * The single sanctioned wrapper around the platform clock. It is constructed only
 * at a composition edge and injected as a `Clock`; tests inject a fixed clock
 * instead (subsystem 08). This is the one place in the kernel permitted to read
 * ambient time.
 */
export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }

  nowIso(): string {
    return new Date().toISOString();
  }
}
