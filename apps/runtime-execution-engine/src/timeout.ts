/**
 * The timeout manager: the deadline policy. A step may run only while the execution's absolute deadline has not passed;
 * once the deadline is reached, the step is failed rather than run, so an execution never runs unbounded past its
 * deadline. A `null` deadline means no deadline. It reads the injected clock's time and decides only; it executes
 * nothing and starts no timer.
 */
export class TimeoutManager {
  /** Whether the deadline (absolute ms, or `null` for none) has passed at time `now`. */
  expired(deadline: number | null, now: number): boolean {
    return deadline !== null && now >= deadline;
  }
}
