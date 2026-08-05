# APPLICATION HOST (AIOS Bootstrap) FREEZE (Platform Completion, PC-3)

**Status:** COMPLETE - VALIDATED - AUDITED - FROZEN
**Package:** `@openlance/aios-application-host` (`apps/application-host`)
**ADR:** [ADR-0048](adr/0048-aios-bootstrap.md) · **Design:** [45-aios-bootstrap.md](45-aios-bootstrap.md)
**Milestone:** Platform Completion, item PC-3 (prerequisite to Phase 5, AI Growth OS Features). This is not Phase 5.

The thin operational application host and the final Platform Completion item: it consumes the frozen composition root to compose the engine modules into one validated application, registers the provider adapters, and exposes a single governed application entrypoint. It makes the certified engines a runnable system.

## What it is

`bootstrapAios(options)` composes the supplied engine DI modules through the frozen `bootstrap` (composition root), registers each provider adapter through `ProviderManager.register`, and returns a governed `AiosApplication` handle: the composed immutable `Application`, a `resolve(token)` that returns any registered engine manager from the frozen container, the registered provider ids, and `dispose()`. `options = { config, logging, modules?, providers? }`.

It is fail-closed and atomic: a composition failure yields `AiosError('AIOS.COMPOSITION_FAILED')` and no application; a failed adapter registration disposes the composed application and yields `AiosError('AIOS.PROVIDER_REGISTRATION_FAILED')`, so no partially wired application is ever returned. The public surface does not throw.

## What it never does

It constructs no engine itself (engine managers are supplied as DI modules), defines no container or composition mechanism (the composition root's and `di`'s), and drives no execution: it never invokes a provider, mints no governance clearance, and runs no pipeline. The entrypoint exposes only the governed engine APIs; a provider stays reachable only through the executor behind a real clearance. It owns no engine behavior, no execution, no vendor knowledge, and no composition mechanism, and it never modifies a frozen engine.

## Ownership (no gate)

The composition root (ADR-0026) owns the generic composition mechanism and explicitly anticipates seam consumers; the application host owns the distinct, AIOS-specific assembly (which engine modules to compose, plus adapter registration and a governed handle) that no package owns. The responsibility is singular and unambiguous, so no Ambiguity Gate was raised (ADR-0048); both audits confirmed no ownership conflict.

## Dependency graph (leaf)

Runtime edges (7), from `dependency-graph.snapshot.json`: `{ composition-root, config, di, errors, kernel, logging, provider-engine }`. Barrel-only, acyclic leaf: nothing depends on it, and neither composition-root nor provider-engine depends on it. The concrete engines (`evaluation-engine`, `operations-engine`, `provider-engine`) and the OpenAI adapter appear only as test-only devDependencies, to prove real wiring; they create no runtime edge.

## Validation

`pnpm run validate` exits 0 (43 tasks). 100% coverage (ADR-0015): 5 tests, statements/branches/functions/lines all 100%, including a success path that composes the real Evaluation, Operations, and Provider engine modules and registers the OpenAI adapter (resolving each manager by identity), a composition-failure path, a provider-registration-failure path (with disposal), and the no-modules / no-providers paths. Benchmark recorded (substrate bootstrap). Guard test: `no-execution`.

## Audits

Two independent audits, both CLEAN (zero Tier 1, zero Tier 2):

- **Architecture / constitution / ownership / dependency:** confirmed thinness (consumes the frozen `bootstrap`, defines no container/composition mechanism, constructs no engine), no ownership conflict (no gate), the governed resolver-only entrypoint, fail-closed + atomic disposal, the 7-edge acyclic leaf with test-only engine deps excluded from the runtime graph, minimal public API, and additive regression.
- **Correctness / security:** confirmed fail-closed + atomicity (dispose runs before the error return; no partial application returned), correct ordering / id collection / delegation, never-throws on the public surface, the governed path (no invoke / execute / mint), no secret or environment handling, and behavioral tests.

Three Tier-3 findings were surfaced and **recorded as Repository Evolution Notes** (non-blocking; none actionable without disproportion): (1) the disposal-on-registration-failure is covered and correct by construction but not asserted via a dispose spy, and the observable atomicity (no handle returned on failure) is asserted; (2) a supplied collaborator whose promise rejected (a hostile manager, or a disposable that throws) could make the async function reject, which is the trusted-collaborator contract for a thin wrapper over the fail-closed frozen `ProviderManager.register` and `container.dispose`; (3) the handle's `resolve` delegates to `container.resolve`, whose synchronous `DI.UNREGISTERED_TOKEN` throw on an unknown token is the documented frozen DI contract, out of scope for the bootstrap.

## Regression

`git diff phase-4-frozen HEAD -- ai/ knowledge/ apps/composition-root apps/provider-engine` and every engine is empty: all byte-identical. The change set is additive only: the new `apps/application-host/`, the design doc, ADR-0048, one ADR index row, the graph snapshot edge, and the lockfile.

## Freeze statement

The application host (PC-3) is frozen. Its ownership (AIOS assembly + adapter registration + governed entrypoint, owning no engine behavior / execution / composition mechanism), its public contract (`bootstrapAios` and the immutable `AiosApplication`), and its 7-edge acyclic-leaf boundary are the canonical reference for Platform Completion and Phase 5. Changing them requires a superseding ADR and full validation.
