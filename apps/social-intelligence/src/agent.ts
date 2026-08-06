import type { AgentCapability, AgentDefinitionInput } from '@openlance/aios-agent-engine';

/** The operational engines the social growth agent composes; the agent performs none of their internal work. */
const CAPABILITIES: readonly AgentCapability[] = ['prompt', 'provider'];

/**
 * The social growth agent, as a frozen Agent Engine `AgentDefinitionInput`. Its specialization is `social-intelligence`,
 * and it composes prompt and provider. Agent specialization is AI-owned (ai/agents/agent-specialization.md); the agent
 * owns none of the namespaces it composes, and this definition owns no business truth.
 */
export const SOCIAL_AGENT: AgentDefinitionInput = Object.freeze({
  id: 'social-intelligence',
  capabilities: CAPABILITIES,
  permissions: CAPABILITIES,
  specialization: 'social-intelligence',
});
