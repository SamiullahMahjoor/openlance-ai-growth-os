import { TOOL_LIFECYCLE_PHASES, toolPhaseAtOrAfter } from '@openlance/aios-tools';
import type { ToolLifecyclePhase } from '@openlance/aios-tools';

/**
 * Tool lifecycle evaluation over the frozen tool-lifecycle model. It consumes the frozen ordered
 * `TOOL_LIFECYCLE_PHASES` and the pure predicate `toolPhaseAtOrAfter`; it defines no phase and re-owns no ordering
 * (ai/tools/tool-lifecycle.md, ADR-0020). A tool is registered before it is discoverable, discoverable before it is
 * activated, and is used only while active.
 */
export class ToolLifecycle {
  /** The frozen, ordered tool lifecycle phases. */
  phases(): readonly ToolLifecyclePhase[] {
    return TOOL_LIFECYCLE_PHASES;
  }

  /** Whether phase `a` is at or after phase `b` by the constitutional ordering. */
  atOrAfter(a: ToolLifecyclePhase, b: ToolLifecyclePhase): boolean {
    return toolPhaseAtOrAfter(a, b);
  }

  /** Whether a phase is within the active window: at or after activation and before retirement (a tool is used only then). */
  isActive(phase: ToolLifecyclePhase): boolean {
    return toolPhaseAtOrAfter(phase, 'activation') && !toolPhaseAtOrAfter(phase, 'retirement');
  }
}
