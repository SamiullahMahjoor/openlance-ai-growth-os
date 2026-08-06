import type { AgentCapability, AgentDefinitionInput } from '@openlance/aios-agent-engine';

/** The operational engines the SEO growth agent composes; the agent performs none of their internal work. */
const CAPABILITIES: readonly AgentCapability[] = ['prompt', 'provider'];

/**
 * The SEO growth agent, as a frozen Agent Engine `AgentDefinitionInput`. Its specialization is `seo-intelligence`, and it
 * composes prompt and provider. Agent specialization is AI-owned (ai/agents/agent-specialization.md); the agent owns none
 * of the namespaces it composes, and this definition owns no business truth.
 */
export const SEO_AGENT: AgentDefinitionInput = Object.freeze({
  id: 'seo-intelligence',
  capabilities: CAPABILITIES,
  permissions: CAPABILITIES,
  specialization: 'seo-intelligence',
});
