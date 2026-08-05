# @openlance/aios-application-host

The AIOS **application host** (Platform Completion, PC-3): the thin operational bootstrap that consumes the frozen composition root, composes the engine modules into one validated application, registers the provider adapters, and exposes a single governed application entrypoint. See [ADR-0048](../../docs/implementation/adr/0048-aios-bootstrap.md) and the [design doc](../../docs/implementation/45-aios-bootstrap.md).

This is the third and final item of the Platform Completion milestone (the prerequisite to Phase 5, AI Growth OS Features). It is not Phase 5.

## What it does

`bootstrapAios(options)` composes the supplied engine DI modules through the frozen `bootstrap` (composition root), registers each provider adapter through `ProviderManager.register`, and returns a governed `AiosApplication` handle: the composed `Application`, a `resolve(token)` that returns any registered engine manager from the frozen container, the registered provider ids, and `dispose()`. `options = { config, logging, modules?, providers? }`.

It is fail-closed and atomic: a composition failure yields an `AiosError` and no application; a failed adapter registration disposes the composed application and yields an `AiosError`, so no partially wired application is ever exposed. The public surface does not throw.

## What it never does

It constructs no engine itself (engine managers are supplied as DI modules), defines no container or composition mechanism (those are the composition root's and `di`'s), and drives no execution: it never invokes a provider, mints no governance clearance, and runs no pipeline. The entrypoint exposes only the governed engine APIs; a provider stays reachable only through the executor behind a real clearance. It owns no engine behavior, no execution, no vendor knowledge, and no composition mechanism, and it never modifies a frozen engine.

## Boundaries

Runtime dependencies: `composition-root` (bootstrap), `provider-engine` (`ProviderManager`, `ProviderDescriptor` types), `di`, `config`, `logging`, `kernel`, `errors`. Barrel-only, acyclic leaf: nothing depends on it. The concrete engines and the OpenAI adapter appear only as test-only devDependencies, to prove real wiring; they create no runtime edge.
