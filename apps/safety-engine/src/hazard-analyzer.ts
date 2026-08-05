import type { AgentCapability, AgentExecutionPlan } from '@openlance/aios-agent-engine';
import type { HazardCategory } from '@openlance/aios-safety';

import { MemorySafetyInspector } from './memory-safety-inspector.js';
import { SafetyNormalizer } from './normalizer.js';
import type { EffectivePolicy } from './policy.js';
import { PromptSafetyInspector } from './prompt-safety-inspector.js';
import { RetrievalSafetyInspector } from './retrieval-safety-inspector.js';
import { ToolSafetyInspector } from './tool-safety-inspector.js';
import type { Hazard } from './types.js';

/** The hazard category a step of each agent capability is categorized under (frozen `HazardCategory`). */
const CATEGORY_BY_CAPABILITY: Readonly<Record<AgentCapability, HazardCategory>> = Object.freeze({
  provider: 'capability',
  tool: 'capability',
  reasoning: 'reasoning',
  prompt: 'prompt',
  memory: 'knowledge',
  retrieval: 'knowledge',
});

/**
 * Hazard identification (applying the frozen `hazard-identification` model): it iterates the plan's steps and
 * coordination, routes each step to its safety inspector by capability, and identifies the runtime, agent, capability,
 * and compound hazards it owns directly. It categorizes each hazard into exactly one frozen `HazardCategory`; it
 * classifies no risk and enforces no boundary (`categorizes-not-classifies`), and identifying a hazard is inert.
 */
export class HazardAnalyzer {
  readonly #prompt = new PromptSafetyInspector();
  readonly #tool = new ToolSafetyInspector();
  readonly #memory = new MemorySafetyInspector();
  readonly #retrieval = new RetrievalSafetyInspector();
  readonly #normalizer = new SafetyNormalizer();

  /** Identify every hazard the plan carries under the effective policy. */
  analyze(plan: AgentExecutionPlan, policy: EffectivePolicy): readonly Hazard[] {
    const hazards: Hazard[] = [];
    if (plan.steps.length > policy.maxSteps) {
      hazards.push({
        category: 'runtime',
        source: 'plan',
        code: 'SAFETY.PLAN_OVERSIZE',
        response: 'UNSAFE',
        detail: `The plan has ${plan.steps.length} steps, beyond the bound of ${policy.maxSteps}.`,
      });
    }
    if (plan.coordination.length > policy.maxCoordinationLinks) {
      hazards.push({
        category: 'agent',
        source: 'coordination',
        code: 'SAFETY.COORDINATION_OVERSIZE',
        response: 'UNSAFE',
        detail: `The coordination has ${plan.coordination.length} links, beyond the bound of ${policy.maxCoordinationLinks}.`,
      });
    }
    const toolCapabilities: string[] = [];
    plan.steps.forEach((step, index) => {
      const source = `step[${index}]:${step.capability}`;
      if (policy.restrictedStepCapabilities.includes(step.capability)) {
        hazards.push({
          category: CATEGORY_BY_CAPABILITY[step.capability],
          source,
          code: 'SAFETY.CAPABILITY_RESTRICTED',
          response: 'DEGRADE',
          detail: `The '${step.capability}' capability is restricted; the step is reduced to a safe mode.`,
        });
      }
      if (step.capability === 'prompt') {
        hazards.push(...this.#prompt.inspect(step.request, source, policy));
      } else if (step.capability === 'tool') {
        toolCapabilities.push(this.#normalizer.normalize(step.request.capability));
        hazards.push(...this.#tool.inspect(step.request, source, policy));
      } else if (step.capability === 'memory') {
        hazards.push(...this.#memory.inspect(step.request, source, policy));
      } else if (step.capability === 'retrieval') {
        hazards.push(...this.#retrieval.inspect(step.request, source, policy));
      }
    });
    hazards.push(...this.#combinations(toolCapabilities, policy));
    return hazards;
  }

  /** The compound hazards formed by a dangerous tool combination fully present across the plan. */
  #combinations(toolCapabilities: readonly string[], policy: EffectivePolicy): readonly Hazard[] {
    const present = new Set(toolCapabilities);
    const hazards: Hazard[] = [];
    for (const combination of policy.dangerousToolCombinations) {
      if (combination.length > 0 && combination.every((capability) => present.has(capability))) {
        hazards.push({
          category: 'compound',
          source: 'plan',
          code: 'SAFETY.TOOL_DANGEROUS_COMBINATION',
          response: 'REFUSE',
          detail: `The plan combines the dangerous tool capabilities [${combination.join(', ')}].`,
        });
      }
    }
    return hazards;
  }
}
