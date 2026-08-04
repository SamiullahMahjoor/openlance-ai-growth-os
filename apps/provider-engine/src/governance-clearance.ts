import { VALIDATION_STAGES } from '@openlance/aios-runtime';
import type { ValidationStage } from '@openlance/aios-runtime';

/**
 * The non-forgeable brand of a governance clearance. It is module-private: it is never exported, so no
 * code outside this module can construct a value that satisfies {@link GovernanceClearance}. This is
 * the structural gate that makes "governance precedes execution" hold by construction.
 */
const CLEARANCE_BRAND: unique symbol = Symbol('aios.provider-engine.governance-clearance');

/**
 * Proof that a specific provider invocation was validated against governance before it runs
 * (ai/runtime "Governance precedes execution"; ai/providers "used only within the rules governance
 * sets"). It carries the request capability it clears and the frozen runtime `VALIDATION_STAGES` it
 * asserts were passed. Its brand is module-private, so only {@link mintClearance} (this module) can
 * produce one, and the public barrel never re-exports the minter.
 */
export interface GovernanceClearance {
  readonly [CLEARANCE_BRAND]: true;
  readonly capability: string;
  readonly clearedStages: readonly ValidationStage[];
}

/**
 * TEST AND FUTURE-MINTER SEAM. Not re-exported from the public barrel, so in Stage 1 only this
 * package's own tests and benchmarks reach it; production has no way to mint a clearance and thus no
 * ungoverned-execution path. When the runtime validation pipeline / governance enforcement engine (a
 * later Phase 4 stage) is built, it becomes the sole minter, with no change to the
 * `ProviderExecutor.execute` contract (ADR-0035). It asserts the frozen runtime `VALIDATION_STAGES`
 * were passed for the given capability.
 */
export const mintClearance = (capability: string): GovernanceClearance => {
  const clearance: GovernanceClearance = {
    [CLEARANCE_BRAND]: true,
    capability,
    clearedStages: VALIDATION_STAGES,
  };
  return Object.freeze(clearance);
};

/**
 * Whether a value is a genuine governance clearance (carries the module-private brand). The executor
 * calls this to refuse any invocation not accompanied by a real clearance.
 */
export const isClearance = (value: unknown): value is GovernanceClearance =>
  typeof value === 'object' &&
  value !== null &&
  (value as Record<PropertyKey, unknown>)[CLEARANCE_BRAND] === true;
