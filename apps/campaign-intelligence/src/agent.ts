import type { AgentCapability, AgentDefinitionInput } from '@openlance/aios-agent-engine';

/** The operational engines the campaign growth agent composes; the agent performs none of their internal work. */
const CAPABILITIES: readonly AgentCapability[] = ['prompt', 'provider'];

/**
 * The campaign growth agent, as a frozen Agent Engine `AgentDefinitionInput`. Its specialization is
 * `campaign-intelligence`, and it composes prompt and provider. Agent specialization is AI-owned
 * (ai/agents/agent-specialization.md); the agent owns none of the namespaces it composes, and this definition owns no
 * business truth.
 */
export const CAMPAIGN_AGENT: AgentDefinitionInput = Object.freeze({
  id: 'campaign-intelligence',
  capabilities: CAPABILITIES,
  permissions: CAPABILITIES,
  specialization: 'campaign-intelligence',
});
