/** A tool's stable identity within the engine. */
export type ToolId = string;

/** A declared parameter of a tool capability: its name, and whether it is required. */
export interface ToolParameter {
  readonly name: string;
  readonly required: boolean;
}

/**
 * A declared capability of a tool: a named ability plus the parameters it accepts. A capability names an ability; it
 * never performs the interaction, which occurs only when the runtime carries out a prepared execution.
 */
export interface ToolCapability {
  readonly name: string;
  readonly parameters: readonly ToolParameter[];
}

/** The set of capabilities a tool declares. */
export type ToolCapabilities = readonly ToolCapability[];

/**
 * A tool: a uniquely identified capability for external interaction, composed of its identity and its declared
 * capabilities. `basedOn` names a single base tool it inherits capabilities from (single and acyclic), and
 * `requiresClearance` marks an invocation as a significant action that needs a governance clearance before the runtime
 * carries it out. It is a capability, never an actor; it holds no permission and carries no intelligence.
 */
export interface ToolDefinition {
  readonly id: ToolId;
  readonly capabilities: ToolCapabilities;
  readonly basedOn?: ToolId;
  readonly requiresClearance: boolean;
}

/** A tool's registration input; the factory validates it, normalizes its names, and freezes it. */
export interface ToolDefinitionInput {
  readonly id: ToolId;
  readonly capabilities: ToolCapabilities;
  readonly basedOn?: ToolId;
  readonly requiresClearance?: boolean;
}

/**
 * A request to prepare a tool invocation: the `capability` need, the `arguments` to pass, and the governance inputs the
 * engine applies (`permitted`, the tool ids the acting agent may use; `cleared`, whether a governance clearance has
 * been granted for a significant action). The permission and clearance are applied, never restated.
 */
export interface ToolRequest {
  readonly capability: string;
  readonly arguments?: Readonly<Record<string, string>>;
  readonly permitted?: readonly ToolId[];
  readonly cleared?: boolean;
}

/**
 * A prepared tool execution: the model of a single, bounded interaction the runtime is to carry out. It names the
 * selected `tool`, the matched (normalized) `capability`, the invocation `arguments` (a copy, with their values
 * preserved), and whether a governance `clearanceRequired`. It is the model of the execution; it is never carried out
 * here, and produces no outside effect.
 */
export interface ToolExecution {
  readonly tool: ToolId;
  readonly capability: string;
  readonly arguments: Readonly<Record<string, string>>;
  readonly clearanceRequired: boolean;
}

/**
 * A validated preparation response: the prepared {@link ToolExecution} the runtime is to carry out. `validated: true`
 * marks that it passed every frozen validation check; it is never executed here.
 */
export interface ToolResponse {
  readonly execution: ToolExecution;
  readonly validated: true;
}

/** A read-only snapshot of the engine's operational counters. */
export interface ToolStatistics {
  readonly registrations: number;
  readonly preparations: number;
  readonly successes: number;
  readonly failures: number;
  readonly validationFailures: number;
}

/** A read-only operational view of the engine. */
export interface ToolDiagnostics {
  readonly toolCount: number;
  readonly statistics: ToolStatistics;
}
