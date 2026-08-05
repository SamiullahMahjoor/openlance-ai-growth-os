import type { ToolRequest } from '@openlance/aios-tool-engine';

import { SafetyNormalizer } from './normalizer.js';
import type { EffectivePolicy } from './policy.js';
import type { Hazard } from './types.js';

/**
 * Tool safety inspection: it inspects a tool step for a runtime tool hazard, applying the effective policy
 * deterministically and zero-trust. It detects an explicitly restricted tool capability (`REFUSE`), an unknown tool
 * capability that is not on the allowlist (fail closed, `UNSAFE`), a sandbox-required capability (`RESTRICT`, contained
 * by isolation), and a restricted instruction token embedded in a tool argument value (tool-argument abuse, `SANITIZE`).
 * Dangerous capability combinations across the whole plan are inspected separately. It reads the request; it selects,
 * clears, and executes no tool.
 */
export class ToolSafetyInspector {
  readonly #normalizer = new SafetyNormalizer();

  /** Identify the per-step tool hazards a tool request carries under the effective policy. */
  inspect(request: ToolRequest, source: string, policy: EffectivePolicy): readonly Hazard[] {
    const hazards: Hazard[] = [];
    const capability = this.#normalizer.normalize(request.capability);
    if (policy.restrictedToolCapabilities.includes(capability)) {
      hazards.push({
        category: 'capability',
        source,
        code: 'SAFETY.TOOL_RESTRICTED',
        response: 'REFUSE',
        detail: `The tool capability '${capability}' is restricted and may not be used.`,
      });
    } else if (!policy.knownToolCapabilities.includes(capability)) {
      hazards.push({
        category: 'capability',
        source,
        code: 'SAFETY.TOOL_UNKNOWN',
        response: 'UNSAFE',
        detail: `The tool capability '${capability}' is not on the known-safe allowlist; safety fails closed.`,
      });
    } else if (policy.sandboxedToolCapabilities.includes(capability)) {
      hazards.push({
        category: 'capability',
        source,
        code: 'SAFETY.TOOL_SANDBOX_REQUIRED',
        response: 'RESTRICT',
        detail: `The tool capability '${capability}' requires a sandbox; it is contained by isolation.`,
      });
    }
    for (const token of policy.restrictedPromptTokens) {
      if (this.#argumentsEmbed(request, token)) {
        hazards.push({
          category: 'capability',
          source,
          code: 'SAFETY.TOOL_ARGUMENT_TOKEN',
          response: 'SANITIZE',
          detail: `A tool argument embeds the restricted instruction token '${token}'.`,
        });
      }
    }
    return hazards;
  }

  #argumentsEmbed(request: ToolRequest, token: string): boolean {
    const args = request.arguments ?? {};
    for (const value of Object.values(args)) {
      if (this.#normalizer.normalize(value).includes(token)) {
        return true;
      }
    }
    return false;
  }
}
