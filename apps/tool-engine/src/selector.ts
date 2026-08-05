import type { ToolDefinition } from './types.js';

/**
 * Tool selection: the `discover` and `select` steps. `discover` finds the tools whose declared capabilities include the
 * needed capability (capability matching, over declared capabilities only). `select` chooses one deterministically,
 * settling any tie by the lowest id in UTF-16 lexicographic (code-unit) order, so the same need and the same tools yield
 * the same choice, identically in every environment. Both are deterministic and structural over the provided tools;
 * selection matches a need to a tool and never reasons about the task.
 */
export class ToolSelector {
  /** Discover the tools whose declared capabilities include the needed capability, in registration order. */
  discover(tools: readonly ToolDefinition[], capability: string): readonly ToolDefinition[] {
    return tools.filter((tool) =>
      tool.capabilities.some((declared) => declared.name === capability),
    );
  }

  /**
   * Select one tool deterministically from the candidates, by the lowest id in UTF-16 lexicographic (code-unit) order.
   * Returns `undefined` when there is no candidate, so selection is never ambiguous or random.
   */
  select(candidates: readonly ToolDefinition[]): ToolDefinition | undefined {
    let chosen: ToolDefinition | undefined;
    for (const candidate of candidates) {
      if (chosen === undefined || candidate.id < chosen.id) {
        chosen = candidate;
      }
    }
    return chosen;
  }
}
