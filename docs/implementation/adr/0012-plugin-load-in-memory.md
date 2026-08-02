---
id: ADR-0012
title: Plugins are loaded from an in-memory provided list
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0012: Plugins are loaded from an in-memory provided list

## Status

Accepted

## Context

The plugin design (`docs/implementation/07-plugin-framework.md`, section 3) defines `PluginHost.load(manifest): Result<Plugin, PluginError>`, which turns a manifest into a `Plugin`, and `PluginSource.list(): Result<PluginManifest[], PluginError>`, which lists only manifests. Phase 2A forbids dynamic loading (no runtime loading, no dynamic imports, no filesystem or package scanning). There is therefore no specified path from a manifest to the actual `Plugin` object, and the design does not say where `load()` obtains it.

## Decision

The host is given the plugins it manages in memory at construction: `createPluginHost({ plugins, context, supportedApiVersion, clock })`. `load(manifest)` returns the provided `Plugin` whose manifest name matches, or a `PluginError` (`PLUGIN.NOT_AVAILABLE`) if none is available. `PluginSource` is unchanged from the design (it lists manifests, used by `discover`). No plugin is imported, scanned, or resolved dynamically.

## Rationale

This realizes `load(manifest) -> Plugin` without any dynamic loading, which the stage forbids, and without changing any designed interface: `PluginManifest`, `PluginSource`, `PluginHost`, and `Plugin` are all as designed. The plugins are the "provided list" the design's section 6.1 describes ("discovery over a provided list; no filesystem/network assumptions"). The alternative, extending `PluginSource` with a plugin-resolution method, would add a member to a designed interface; keeping the plugins on the host adds only a factory option, and the factory's construction is not fixed by the design (as with `createContainer`). This decision was raised and approved before implementation.

## Consequences

The composition root supplies the in-memory `Plugin[]`. `load()` is a lookup, not a loader; loading the same manifest twice activates the plugin once (deduplicated by name during ordering). When a later phase introduces real dynamic discovery or loading, it will be owned by another namespace and can supply plugins to the host without changing these interfaces.

## Related constitutional references

None. This is an engineering composition decision; it realizes no constitutional concept and changes no constitutional ownership. Dynamic discovery, provider/tool registration, and repository growth remain owned by the Providers, Tools, and Evolution namespaces.

## Related ADRs

Relates to subsystem 07 (Plugin Framework).
