# 29. Plugin Loading ownership analysis (design checkpoint)

**Status: RESOLVED (Ambiguity Gate confirmed; Option A approved).** Per the Stage 6 (Plugin Loading) mandate ("If
Plugin Loading already belongs to an existing frozen package: STOP. Do not implement. Produce only: ownership
analysis, constitutional references, proposed options. Wait for approval") and ADR-0007 (design-first), this was an
analysis-only checkpoint. The gate was confirmed: Plugin Loading is already owned, in full, by the frozen
`@openlance/aios-plugins` substrate package, and a new Phase 3 package would recreate frozen logic, execute, or wrap
a frozen mechanism over an empty set, and would conflict with ADR-0031. **Option A was approved: no Stage 6 package
is built; ADR-0031 (Phase 3 complete at Stage 5) stands; Plugin Loading (and, on the same reasoning, Error
Propagation and Event Flow) are Phase 4 operational concerns that drive the frozen substrate mechanisms when real
plugins, error flows, and event flows exist.** No code was written. The analysis below is retained as the record.

## 1. The two gate triggers

1. **Plugin Loading already belongs to an existing frozen package.** The plugin loading mechanism is owned, in
   full, by the frozen Phase 2A substrate package `@openlance/aios-plugins` (subsystem 07). This is the mandate's
   explicit STOP condition.
2. **Conflict with an Accepted ADR.** ADR-0031 (Accepted, committed) records that the Phase 3 descriptive
   runtime-integration chain is **complete at Stage 5**. A new Phase 3 Stage 6 conflicts with it. The revised
   roadmap in the request (Stage 6 Plugin Loading, Stage 7 Error Propagation, Stage 8 Event Flow, Stage 9 Runtime
   Freeze) reopens Phase 3 and would require ADR-0031 to be superseded.

## 2. Reading performed (from source, this session)

`@openlance/aios-plugins` source (`index.ts`, `host.ts`, `lifecycle.ts`, `source.ts`, and the manifest/plugin/
context/compatibility modules by reference); `docs/implementation/07-plugin-framework.md`; ADR-0012
(plugin-load-in-memory) and ADR-0013 (plugin-semver-subset); the composition root design (23) and freeze docs; the
runtime, operations, governance, and safety documents (this session); and a grep of `ai/` confirming there is **no
`ai/` plugin document**. Ownership was reconstructed from these sources, not from memory.

## 3. Ownership analysis

### What owns Plugin Loading today (frozen)

`@openlance/aios-plugins` is "the plugin framework: the seam through which self-contained modules are validated for
compatibility, wired into the DI container, and driven through a lifecycle ... It is a module loader and nothing
more." It owns, and freezes, the complete plugin loading mechanism:

- `PluginHost` with `discover(source)`, `validateCompatibility(manifests)`, `load(manifest)`, `start()`, `stop()`,
  and the factory `createPluginHost({ plugins, context, supportedApiVersion, clock })` (`host.ts`);
- the activation model: register -> init -> start in dependency order, reverse stop -> dispose, emitting
  `framework.plugin.*` events (`lifecycle.ts`);
- compatibility validation (apiVersion ranges, `dependsOn` presence and range, acyclic dependency graph;
  ADR-0013's internal semver subset);
- the contracts `PluginManifest`, `PluginContext` (the narrowed DI surface), `Plugin`, `LifecycleHooks`,
  `PluginSource`, and `PluginError`.

It is an **engineering substrate mechanism** (subsystem 07, "Owns no AI concept"); there is no constitutional
`ai/` plugin namespace assigning plugin ownership elsewhere.

### What Plugin Loading owns, consumes, must never recreate, and defers

- **Owns (new, at the app layer): nothing.** The loading mechanism is frozen substrate. There is no unowned plugin
  loading concern for a new package to take.
- **Consumes:** a future operational stage consumes `createPluginHost(...)` and the composition root's supplied
  `Plugin[]`. ADR-0012 fixes this: "The composition root supplies the in-memory `Plugin[]`."
- **Must never recreate:** the plugin host, the plugin registry, the loader, the compatibility validator, the
  lifecycle/activation model (all frozen in `@openlance/aios-plugins`), and the DI container, runtime lifecycle,
  execution pipeline, namespace wiring, and composition root (all frozen in Stages 1 to 5 and the substrate).
- **Deferred to later phases:**
  - **Actually loading/activating plugins** (`createPluginHost(...).start()`) is execution and activation: it
    runs plugin `register`/`onInit`/`onStart` hooks, mutates the DI container, and emits events. The mandate
    forbids "zero runtime execution beyond approved ownership" and activation; this is operational (Phase 4).
  - **There are zero plugins to load.** Design 07: "In Phase 2A only the mechanism exists; no runtime, provider,
    or tool module is written ... 2A ships zero plugins." The namespaces are pure ADR-0020 models; no provider or
    tool plugin implementation exists.
  - **Dynamic discovery/loading is constitutionally deferred to the Providers, Tools, and Evolution namespaces**
    (ADR-0012 Consequences; design 07), which have no operational implementations yet.

### The consequence

A new Phase 3 "Plugin Loading" package could only either (a) **recreate** the frozen plugin host/registry/loader/
lifecycle (duplication, the mandate's forbidden "plugin registry" and "recreate frozen logic"), or (b) **actually
load/activate plugins** (execution/activation, forbidden and dependent on plugins that do not exist), or (c) be a
**thin descriptive "plugin loading plan"** that consumes the composition root and references the frozen
`PluginHost` over an empty plugin set (near-vacuous, still re-owning the frozen plugin package's surface, and
conflicting with ADR-0031). None introduces genuinely new constitutional ownership.

## 4. Relationship to ADR-0031 and the revised roadmap

ADR-0031 already found that Phase 3's descriptive chain is complete at Stage 5 because Stages 1 to 5 each bound a
genuinely new frozen model into the chain and further stages would only wrap frozen models. Plugin Loading fits
that finding exactly, and more strongly: it has a **dedicated frozen owner** (`@openlance/aios-plugins`). The same
is likely true of the other proposed stages: **Error Propagation** maps to the frozen `@openlance/aios-errors`
substrate package (the `BaseError` taxonomy and `Result` channel, ADR-0006), and **Event Flow** maps to the frozen
`@openlance/aios-events` substrate package (the `EventBus`). Each is an already-frozen mechanism; actually
propagating errors or flowing events at runtime is execution (Phase 4). This suggests the revised roadmap's Stages
6 to 8 are, like Governance Enforcement, already-owned mechanisms whose real use is operational (Phase 4), not new
descriptive Phase 3 layers.

## 5. Constitutional and frozen references

- `docs/implementation/07-plugin-framework.md` (subsystem 07, the plugin framework design; "module loader and
  nothing more").
- ADR-0012 (plugins loaded from an in-memory provided list; "The composition root supplies the in-memory
  `Plugin[]`"), ADR-0013 (internal semver subset).
- `@openlance/aios-plugins` barrel (`packages/plugins/src/index.ts`) and `host.ts`/`lifecycle.ts` (the frozen
  mechanism).
- ADR-0026 and COMPOSITION-ROOT-FREEZE.md (the composition root "performs registration only: no ... plugin
  loading"; plugin loading was explicitly out of Stage 1 scope).
- ADR-0031 and PHASE-3-COMPLETE.md (Phase 3 complete at Stage 5).
- ADR-0020 (namespaces own no execution/orchestration/services), ADR-0005 (frozen DI).

## 6. Proposed options

### Option A (recommended): confirm the gate; no new package; Plugin Loading is Phase 4 operational

Confirm that Plugin Loading is already owned by the frozen `@openlance/aios-plugins` package and that actually
loading/activating plugins is operational execution. Build no Stage 6 package. Keep ADR-0031 intact (Phase 3
complete at Stage 5). Plugin loading becomes a Phase 4 operational concern: when provider/tool plugin
implementations exist, the composition root supplies the `Plugin[]` and a Phase 4 stage drives
`createPluginHost(...).start()`. Reassess Error Propagation and Event Flow the same way (they map to the frozen
`@openlance/aios-errors` and `@openlance/aios-events` packages), which likely confirms the whole remaining roadmap
is Phase 4.

### Option B: reopen Phase 3 per the revised roadmap; supersede ADR-0031

Accept the revised roadmap (Stage 6 Plugin Loading, Stage 7 Error Propagation, Stage 8 Event Flow, Stage 9
consolidated Runtime Freeze) and supersede ADR-0031 with a new ADR reopening Phase 3. Build a thin descriptive
"plugin loading plan" as Stage 6 that consumes the composition root `Application` and references the frozen
`PluginHost` contract over the (empty today) plugin set, validating compatibility by delegating to the frozen
`validateCompatibility` and executing nothing. Honest caveat: this is a near-vacuous wrapper over the frozen plugin
package (zero plugins, dedicated frozen owner) and re-owns part of its surface; it is the weakest of the Phase 3
descriptive layers.

### Option C: build only the thin plugin-loading plan (Stage 6), without committing to the 7/8/9 roadmap

As Option B's package, but decide Error Propagation and Event Flow separately later. Still requires superseding
ADR-0031 and carries the same duplication/vacuity caveat.

## 7. Recommendation

**Option A.** Plugin Loading is unambiguously owned by the frozen `@openlance/aios-plugins` substrate package; a
new Phase 3 package would recreate frozen logic, execute, or wrap a frozen mechanism over an empty set, and would
conflict with ADR-0031. The constitutionally clean path is to treat Plugin Loading (and, on the same reasoning,
Error Propagation and Event Flow) as Phase 4 operational concerns that consume the frozen substrate mechanisms when
real plugins, error flows, and event flows exist. Please choose a direction before any code is written.
