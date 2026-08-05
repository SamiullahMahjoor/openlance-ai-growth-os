import type { AgentCapability, AgentDefinitionInput } from '@openlance/aios-agent-engine';

/** The operational engines the marketing growth agent composes; the agent performs none of their internal work. */
const CAPABILITIES: readonly AgentCapability[] = ['retrieval', 'prompt', 'provider'];

/**
 * The marketing growth agent, as a frozen Agent Engine `AgentDefinitionInput`. Its specialization is `marketing-intelligence`,
 * and it composes retrieval, prompt, and provider. Agent specialization is AI-owned (ai/agents/agent-specialization.md);
 * the agent owns none of the namespaces it composes, and this definition owns no business truth.
 */
export const MARKETING_AGENT: AgentDefinitionInput = Object.freeze({
  id: 'marketing-intelligence',
  capabilities: CAPABILITIES,
  permissions: CAPABILITIES,
  specialization: 'marketing-intelligence',
});
