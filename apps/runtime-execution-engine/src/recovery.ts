/**
 * The recovery manager: at the frozen `recovering` state, it decides whether a failed execution may recover and continue
 * (re-attempt the failed work) or must terminate to `failed`. Recovery is bounded: it continues only while the execution
 * has recoveries remaining within the configured budget, so a failing execution never loops without end (the frozen
 * `recovery-is-bounded` and `every-failure-resolves-to-retry-recovery-or-termination` invariants). It decides only; it
 * executes nothing and never continues against a governance decision to stop.
 */
export class RecoveryManager {
  /** Whether an execution that has used `recoveriesUsed` recoveries may recover again, given the bound. */
  decide(recoveriesUsed: number, maxRecoveries: number): 'continue' | 'terminate' {
    return recoveriesUsed < maxRecoveries ? 'continue' : 'terminate';
  }
}
