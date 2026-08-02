/**
 * A plugin's self-description. It is metadata only: a name, its own semantic
 * version, the host API contract version it targets, the other plugins it depends
 * on (by name and version range), and opaque capability identifiers it provides.
 * In Phase 2A `provides` entries are opaque strings; they name no concrete provider,
 * tool, or namespace.
 */
export interface PluginManifest {
  readonly name: string;
  readonly version: string;
  readonly apiVersion: string;
  readonly dependsOn?: readonly { readonly name: string; readonly range: string }[];
  readonly provides?: readonly string[];
}
