# 29. Plugin Loading implementation design (Phase 3, Stage 6)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 6).** Built after the design-review checkpoint and approval to
reopen Phase 3. [ADR-0032](adr/0032-plugin-loading-integration.md) is Accepted and **supersedes ADR-0031** (which
had closed Phase 3 at Stage 5); the approved roadmap reopens Phase 3 and continues through Stage 9 (Plugin Loading,
Error Propagation, Event Flow, Runtime Freeze). Package: `apps/plugin-loading` (`@openlance/aios-plugin-loading`).

## 1. Scope and ownership

Stage 6 builds the **application-level plugin integration** layer: an immutable `PluginLoadingPlan` that declares,
for the integrated application, which plugins are available, which are enabled, which are compatible, and which are
ready, and attaches that declaration to the runtime integration chain. It answers those four questions and nothing
more.

It **consumes, never recreates.** The plugin loading mechanism is owned, in full, by the frozen Phase 2A substrate
package `@openlance/aios-plugins` (subsystem 07, ADR-0012, ADR-0013): the `PluginHost`
(`discover`/`validateCompatibility`/`load`/`start`/`stop`), `createPluginHost`, the register -> init -> start /
stop -> dispose activation model, compatibility validation, and the contracts (`PluginManifest`, `PluginContext`,
`Plugin`, `LifecycleHooks`, `PluginSource`, `PluginError`). Stage 6 recreates none of them; it receives a frozen
`PluginHost` and consumes only its `validateCompatibility`. It also consumes the Stage 5 `ExecutionPipelinePlan`
(the runtime integration chain handle) and re-owns nothing from Stages 1 to 5 or the substrate.

It **executes nothing.** It does not discover, load, initialize, start, stop, or schedule plugins, and runs no
provider, tool, agent, or workflow. Those are Phase 4 operational concerns. It only validates compatibility (by
delegation) and produces an immutable descriptive plan.

## 2. Why this is not duplication (the checkpoint conclusion)

The prior checkpoint found that the plugin loading *mechanism* is frozen and that *actually* loading plugins is
execution. This stage owns neither: it owns the narrow, previously-unowned application concern of **which plugins
this application declares available and enabled, whether they are compatible, and how that declaration attaches to
the integration chain**, exactly parallel to how Namespace Wiring (Stage 2) declares which namespaces are wired to
the application without owning the namespace models. The frozen `@openlance/aios-plugins` owns the mechanism; the
composition root supplies the plugin set (ADR-0012); this stage owns the immutable declaration and its compatibility
validation, delegated to the frozen host. ADR-0032 records this and supersedes ADR-0031.

## 3. Public API and package layout

Package `apps/plugin-loading`, name `@openlance/aios-plugin-loading`, `aios.layer: "app"`. Single explicit barrel
(`src/index.ts`, no wildcard). Modules: `plugin-loading.ts` (types + functions), `errors.ts`
(`PluginLoadingError`).

```ts
// The application's declared plugin set: the available manifests, and which of them are enabled.
export interface PluginDeclaration {
  readonly manifests: readonly PluginManifest[]; // declared available plugins (empty today; zero plugins exist)
  readonly enabled?: readonly string[];           // names of enabled plugins; default: all available
}

// A read-only report over the plan.
export interface PluginLoadingDiagnostics {
  readonly availableCount: number;
  readonly enabledCount: number;
  readonly compatibleCount: number;
  readonly readyCount: number;
}

// The immutable plugin loading plan, attached to the runtime integration chain. Descriptive; executes nothing.
export interface PluginLoadingPlan {
  readonly pipeline: ExecutionPipelinePlan;         // the Stage 5 chain handle, consumed unchanged
  readonly available: readonly PluginManifest[];    // declared available
  readonly enabled: readonly PluginManifest[];      // the enabled subset
  readonly compatible: readonly PluginManifest[];   // the enabled set, validated compatible (delegated)
  readonly ready: readonly PluginManifest[];        // ready to hand to a Phase 4 loader (= compatible)
  readonly diagnostics: PluginLoadingDiagnostics;
  readonly validated: true;
}

// Validate a set of plugin manifests by delegating to the frozen PluginHost's validateCompatibility; fail closed.
export function validatePluginLoading(
  host: PluginHost,
  manifests: readonly PluginManifest[],
): Result<readonly PluginManifest[], PluginLoadingError[]>;

// Build the immutable plugin loading plan, attaching it to the chain, delegating compatibility; fail closed.
export function buildPluginLoadingPlan(
  pipeline: ExecutionPipelinePlan,
  host: PluginHost,
  declaration: PluginDeclaration,
): Result<PluginLoadingPlan, PluginLoadingError[]>;
```

`buildPluginLoadingPlan` computes `enabled` from the declaration (all available, or the named subset), validates
the enabled set through `validatePluginLoading` (which delegates to the frozen `host.validateCompatibility`), and
on success returns an immutable plan whose `compatible` and `ready` are the validated enabled set. Because the
frozen compatibility check is all-or-nothing and fails closed, a built plan's enabled set is wholly compatible;
any incompatibility returns `PluginLoadingError[]` and no partial plan. `PluginLoadingError` is an
`@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `PLUGIN_LOADING.*` codes, wrapping the frozen
`PluginError` as its cause; failures ride the `Result` channel (ADR-0006).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 6 disposition |
|---|---|---|
| PluginHost, PluginRegistry, PluginLoader, lifecycle, activation | `@openlance/aios-plugins` | receive/consume; never recreate |
| Compatibility validation (apiVersion, deps, acyclicity) | `@openlance/aios-plugins` `validateCompatibility` | delegate via `host.validateCompatibility` |
| PluginManifest, PluginContext, Plugin, PluginSource, PluginError | `@openlance/aios-plugins` | consume the types; never redefine |
| The runtime integration chain | Stages 1 to 5 (frozen) | consume the `ExecutionPipelinePlan`; recreate nothing |
| DI container, composition, wiring, lifecycle, pipeline | Stages 1 to 5 + substrate | consume; recreate nothing |

## 5. What it must not do

No discovery, loading, initialization, start, stop, or scheduling of plugins; no provider/tool/agent/workflow
execution; no runtime execution, orchestration, or event emission; no mutable or runtime state; no plugin
implementation. Those are Phase 4. It only validates compatibility (delegated) and builds an immutable plan.

## 6. Dependency graph and layer wiring

`@openlance/aios-plugin-loading -> { @openlance/aios-execution-pipeline, @openlance/aios-plugins, kernel, errors }`
(its `src/` edges, recorded in `dependency-graph.snapshot.json`; composition-root, namespace-wiring, di-integration,
runtime-lifecycle, config, logging, events are test-only devDependencies used to build the chain and a host). The
`app -> app` (execution-pipeline) and `app -> substrate` (plugins) edges are legal; no dependency-cruiser rule or
namespace edge changes. `@openlance/aios-plugins` is the terminal substrate package, so an app depending on it is a
legal substrate edge.

## 7. Testing strategy (ADR-0022 / Rule 6)

100% statements/branches/functions/lines. `validatePluginLoading` is tested with a compatible set (ok, frozen
manifests), an empty set (ok), and an incompatible set (an `apiVersion` outside the host's supported range -> err,
delegated `PLUGIN_LOADING.INCOMPATIBLE`). `buildPluginLoadingPlan` is tested with the default enabled set
(undefined -> all), an explicit enabled subset (filtered), a compatible declaration (ok plan with correct
available/enabled/compatible/ready and diagnostics), and an incompatible declaration (err, no partial plan).
Immutability (`Object.isFrozen`) is asserted on the plan, its arrays, and its diagnostics. Benchmark: the
`buildPluginLoadingPlan` path (Rule 5 baseline).

## 8. Acceptance criteria (met)

- Consumes the frozen `@openlance/aios-plugins` mechanism and the Stage 5 `ExecutionPipelinePlan`; recreates no
  host/registry/loader/lifecycle/compatibility and no chain handle.
- `buildPluginLoadingPlan` returns an immutable, validated `PluginLoadingPlan` or a `Result` error, failing closed
  with no partial plan; it executes nothing.
- Full validation green; 100% coverage; benchmark recorded; two independent source audits CLEAN.
- Zero regression: `ai/`, `knowledge/`, the frozen substrate (including `packages/plugins`), all 13 namespaces, and
  the five frozen Phase 3 packages unchanged; only ADR-0031's status changes (superseded), and ADR-0032 is added.
