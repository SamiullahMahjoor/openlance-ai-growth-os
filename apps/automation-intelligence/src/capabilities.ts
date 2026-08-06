import type { AutomationCapability } from './types.js';

/**
 * The automation capabilities, as behaviors the subsystem frames. Each names a governed-automation-opportunity planning
 * behavior the AI performs by consuming a completed growth workflow and knowledge; none is a Growth Workflows behavior, a
 * planner behavior, or business truth, and none executes, schedules, triggers, orchestrates, or governs an automation
 * (`trigger-recommendation` recommends a triggering condition and is deferred to the runtime; it is never an executable
 * trigger). Frozen, closed.
 */
export const AUTOMATION_CAPABILITIES: readonly AutomationCapability[] = Object.freeze([
  'automation-opportunity-analysis',
  'workflow-automation-planning',
  'task-automation-planning',
  'trigger-recommendation',
  'handoff-planning',
  'guardrail-recommendation',
  'escalation-recommendation',
  'monitoring-recommendation',
  'rollout-planning',
  'automation-roadmap-planning',
  'automation-evaluation',
]);

/** Whether a value names a known automation capability. Zero-trust: an unrecognized capability is never framed. */
export const isAutomationCapability = (value: string): value is AutomationCapability =>
  (AUTOMATION_CAPABILITIES as readonly string[]).includes(value);
