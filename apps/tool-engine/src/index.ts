/**
 * @packageDocumentation
 * `@openlance/aios-tool-engine`
 *
 * The AIOS Tool Engine (Phase 4, Stage 5): the Runtime's operational tool subsystem, the operational realization of the
 * frozen Tools namespace. It prepares a validated, governed tool execution over provided tools (register, discover,
 * select, resolve capability inheritance, validate through the four frozen ordered checks, normalize, prepare), driving
 * the frozen `@openlance/aios-tools` model, and produces a validated `ToolResponse`. It **prepares and stops**: it never
 * carries out a tool interaction, opens no network, and produces no outside effect.
 *
 * It is **foundational**: it consumes only the frozen tool model and the substrate, and depends on no operational
 * service. Per the frozen `tool-boundaries`, a tool is not a provider (an agent composes both) and a tool is carried out
 * by the runtime, so the engine reaches into no provider or prompt engine and composes a tool with neither; that
 * composition is the Agent Engine's (Stage 6). It contains no vendor knowledge and no vendor client library, and names
 * no provider (ADR-0039). This file is the single supported public API (Engineering Rule 1).
 */

export type {
  ToolId,
  ToolParameter,
  ToolCapability,
  ToolCapabilities,
  ToolDefinition,
  ToolDefinitionInput,
  ToolRequest,
  ToolExecution,
  ToolResponse,
  ToolStatistics,
  ToolDiagnostics,
} from './types.js';

export { ToolError } from './errors.js';
export { ToolNormalizer } from './normalizer.js';
export { ToolRegistry } from './registry.js';
export { ToolFactory } from './factory.js';
export { ToolLifecycle } from './lifecycle.js';
export { ToolSelector } from './selector.js';
export { ToolResolver } from './resolver.js';
export { ToolValidator, VALIDATION_ERROR_CODES } from './validator.js';
export { ToolExecutor } from './executor.js';
export { ToolMetrics } from './metrics.js';
export { ToolEvents, TOOL_EVENT_TYPES } from './events.js';
export { ToolConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { ToolEngineSettings } from './configuration.js';
export { ToolPluginBridge } from './plugin-bridge.js';
export type { ToolPlugin } from './plugin-bridge.js';
export { ToolManager } from './manager.js';
export type { ToolManagerOptions } from './manager.js';
export { toolEngineModule, TOOL_MANAGER } from './module.js';
