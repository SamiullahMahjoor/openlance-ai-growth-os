import { AGENT_LIFECYCLE_PHASES, agentPhaseAtOrAfter } from '@openlance/aios-agents';
import type { AgentLifecyclePhase } from '@openlance/aios-agents';

/**
 * Agent lifecycle evaluation over the frozen agent-lifecycle model. It consumes the frozen ordered
 * `AGENT_LIFECYCLE_PHASES` and the pure predicate `agentPhaseAtOrAfter`; it defines no phase and re-owns no ordering
 * (ai/agents/agent-lifecycle.md, ADR-0020). An agent is registered before it is discoverable, discoverable before it is
 * activated, and acts only while active (from activation, before retirement).
 */
export class AgentLifecycle {
  /** The frozen, ordered agent lifecycle phases. */
  phases(): readonly AgentLifecyclePhase[] {
    return AGENT_LIFECYCLE_PHASES;
  }

  /** Whether phase `a` is at or after phase `b` by the constitutional ordering. */
  atOrAfter(a: AgentLifecyclePhase, b: AgentLifecyclePhase): boolean {
    return agentPhaseAtOrAfter(a, b);
  }

  /** Whether a phase is within the active window: at or after activation and before retirement (an agent acts only then). */
  isActive(phase: AgentLifecyclePhase): boolean {
    return agentPhaseAtOrAfter(phase, 'activation') && !agentPhaseAtOrAfter(phase, 'retirement');
  }
}
