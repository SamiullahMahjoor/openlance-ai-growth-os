import type { MemoryRequest } from '@openlance/aios-memory-engine';

import { SafetyNormalizer } from './normalizer.js';
import { scopeMatches } from './policy.js';
import type { EffectivePolicy } from './policy.js';
import type { Hazard } from './types.js';

/**
 * Memory safety inspection: it inspects a memory step's recall scope for a runtime memory hazard, applying the effective
 * policy deterministically and zero-trust. It detects a restricted or cross-tenant memory scope (contained by a narrowed
 * boundary, `RESTRICT`) and a memory scope that is not on the allowlist (unknown scope, fail closed, `UNSAFE`). It reads
 * the scope; it recalls and retains nothing.
 */
export class MemorySafetyInspector {
  readonly #normalizer = new SafetyNormalizer();

  /** Identify the memory hazards a memory request carries under the effective policy. */
  inspect(request: MemoryRequest, source: string, policy: EffectivePolicy): readonly Hazard[] {
    const scope = this.#normalizer.normalize(request.scope);
    if (scopeMatches(scope, policy.restrictedMemoryScopes)) {
      return [
        {
          category: 'knowledge',
          source,
          code: 'SAFETY.MEMORY_RESTRICTED_SCOPE',
          response: 'RESTRICT',
          detail: `The memory scope '${scope}' is restricted (sensitive or cross-tenant); it is contained.`,
        },
      ];
    }
    if (!scopeMatches(scope, policy.allowedMemoryScopes)) {
      return [
        {
          category: 'knowledge',
          source,
          code: 'SAFETY.MEMORY_UNKNOWN_SCOPE',
          response: 'UNSAFE',
          detail: `The memory scope '${scope}' is not on the allowlist; safety fails closed.`,
        },
      ];
    }
    return [];
  }
}
