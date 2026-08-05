import type { RetrievalRequest } from '@openlance/aios-retrieval-engine';

import { SafetyNormalizer } from './normalizer.js';
import { scopeMatches } from './policy.js';
import type { EffectivePolicy } from './policy.js';
import type { Hazard } from './types.js';

/**
 * Retrieval safety inspection: it inspects a retrieval step's knowledge scope for a runtime retrieval hazard, applying
 * the effective policy deterministically and zero-trust. It detects a restricted knowledge scope (classification
 * enforcement; a protective refusal, `REFUSE`) and a retrieval scope that is not on the allowlist (unknown scope, fail
 * closed, `UNSAFE`). It reads the scope; it retrieves and loads nothing.
 */
export class RetrievalSafetyInspector {
  readonly #normalizer = new SafetyNormalizer();

  /** Identify the retrieval hazards a retrieval request carries under the effective policy. */
  inspect(request: RetrievalRequest, source: string, policy: EffectivePolicy): readonly Hazard[] {
    const scope = this.#normalizer.normalize(request.scope);
    if (scopeMatches(scope, policy.restrictedRetrievalScopes)) {
      return [
        {
          category: 'knowledge',
          source,
          code: 'SAFETY.RETRIEVAL_RESTRICTED_SCOPE',
          response: 'REFUSE',
          detail: `The retrieval scope '${scope}' is restricted knowledge; access is refused.`,
        },
      ];
    }
    if (!scopeMatches(scope, policy.allowedRetrievalScopes)) {
      return [
        {
          category: 'knowledge',
          source,
          code: 'SAFETY.RETRIEVAL_UNKNOWN_SCOPE',
          response: 'UNSAFE',
          detail: `The retrieval scope '${scope}' is not on the allowlist; safety fails closed.`,
        },
      ];
    }
    return [];
  }
}
