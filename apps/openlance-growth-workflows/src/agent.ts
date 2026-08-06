import type { AgentCapability, AgentDefinitionInput } from '@openlance/aios-agent-engine';

/** The operational engines the growth-workflow agent composes; the agent performs none of their internal work. */
const CAPABILITIES: readonly AgentCapability[] = ['prompt', 'provider'];

/**
 * The growth-workflow agent, as a frozen Agent Engine `AgentDefinitionInput`. Its specialization is
 * `openlance-growth-workflows`, and it composes prompt and provider. Agent specialization is AI-owned
 * (ai/agents/agent-specialization.md); the agent owns none of the namespaces it composes, and this definition owns no
 * business truth.
 */
export const WORKFLOW_AGENT: AgentDefinitionInput = Object.freeze({
  id: 'openlance-growth-workflows',
  capabilities: CAPABILITIES,
  permissions: CAPABILITIES,
  specialization: 'openlance-growth-workflows',
});
