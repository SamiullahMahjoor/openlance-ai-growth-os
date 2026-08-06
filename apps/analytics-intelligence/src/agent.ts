import type { AgentCapability, AgentDefinitionInput } from '@openlance/aios-agent-engine';

/** The operational engines the analytics growth agent composes; the agent performs none of their internal work. */
const CAPABILITIES: readonly AgentCapability[] = ['prompt', 'provider'];

/**
 * The analytics growth agent, as a frozen Agent Engine `AgentDefinitionInput`. Its specialization is
 * `analytics-intelligence`, and it composes prompt and provider. Agent specialization is AI-owned
 * (ai/agents/agent-specialization.md); the agent owns none of the namespaces it composes, and this definition owns no
 * business truth.
 */
export const ANALYTICS_AGENT: AgentDefinitionInput = Object.freeze({
  id: 'analytics-intelligence',
  capabilities: CAPABILITIES,
  permissions: CAPABILITIES,
  specialization: 'analytics-intelligence',
});
