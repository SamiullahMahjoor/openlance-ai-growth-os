# Architecture Decision Records (ADR)

This directory is the permanent, immutable record of **implementation-level** engineering decisions, as required by Rule 3 of [../ENGINEERING-RULES.md](../ENGINEERING-RULES.md).

An ADR records a decision the constitution does not fix (tooling, package management, testing framework, build, performance strategy, implementation strategy). An ADR **never** redefines constitutional ownership. If a decision appears to require an architectural concept the constitution does not define, work stops and architectural clarification is requested (the "never invent architecture" gate); it is not resolved by an ADR.

## Process

1. Copy [`0000-template.md`](0000-template.md) to `NNNN-kebab-title.md` (next free number).
2. Fill every field. Open it as `Proposed`.
3. On review it becomes `Accepted`. An Accepted ADR is immutable.
4. To reverse a decision, write a new ADR that supersedes the old one and set the old one's status to `Superseded by ADR-NNNN`. Never edit an Accepted ADR's decision in place.

## Statuses

`Proposed` -> `Accepted` -> (`Superseded by ADR-NNNN` | `Deprecated`).

## Enforcement

`docs-check` (CI) validates that every ADR has the required front-matter fields and a valid status, and that any ADR referenced by a package or by `.dependency-cruiser.cjs` exists.

## Index

| ID | Title | Status |
|---|---|---|
| [0001](0001-language-and-runtime.md) | Implementation language and runtime | Accepted |
| [0002](0002-framework-posture.md) | Framework posture: custom framework-neutral core | Accepted |
| [0003](0003-monorepo-and-tooling.md) | Monorepo, package manager, and build tooling | Accepted |
| [0004](0004-test-framework.md) | Test framework | Accepted |
| [0005](0005-dependency-injection.md) | Custom dependency-injection container | Accepted |
| [0006](0006-result-error-handling.md) | Result pattern for domain error handling | Accepted |
| [0007](0007-design-first-cadence.md) | Design-first delivery cadence | Accepted |
| [0008](0008-kernel-combinator-exports.md) | Kernel combinator export strategy | Accepted |
| [0009](0009-declaration-build-under-composite.md) | Declaration bundling under TypeScript project references | Accepted |
| [0010](0010-config-di-token.md) | Configuration composition via a dependency-injection token | Accepted |
| [0011](0011-logging-abstractions-only.md) | Logging ships abstractions only; the development ConsoleSink is deferred | Accepted |
| [0012](0012-plugin-load-in-memory.md) | Plugins are loaded from an in-memory provided list | Accepted |
| [0013](0013-plugin-semver-subset.md) | Internal semver range subset for plugin compatibility | Accepted |
| [0014](0014-di-token-composition-root.md) | Cross-package services are exposed as DI tokens registered by the composition root | Accepted |
| [0015](0015-runtime-coverage-policy.md) | Runtime coverage policy - measure all source, exclude only barrels and type-only modules | Accepted |
| [0016](0016-realized-compilation-strategy.md) | Realized compilation and type-checking strategy | Accepted |
| [0017](0017-dev-harness-deferral.md) | Defer apps/dev-harness to the start of the Runtime phase | Superseded by ADR-0026 |
| [0018](0018-scaffold-and-golden-fixture-strategy.md) | Scaffold conventions and golden-fixture testing strategy | Accepted |
| [0019](0019-production-import-graph-enforcement.md) | Enforce the dependency graph against production bare-specifier imports | Accepted |
| [0020](0020-namespace-implementation-model.md) | Namespace implementation model - immutable stateless domain model | Accepted |
| [0021](0021-namespace-substrate-dependency-policy.md) | Namespace to substrate dependency policy | Accepted |
| [0022](0022-domain-model-quality-policy.md) | Domain-model namespace quality policy | Accepted |
| [0023](0023-namespace-development-lifecycle.md) | Namespace development lifecycle | Accepted |
| [0024](0024-namespace-purity-categories.md) | Namespace purity categories | Accepted |
| [0025](0025-constitutional-dimension-independence.md) | Constitutional dimension independence | Accepted |
| [0026](0026-application-composition-root.md) | Application composition root consumes the frozen DI mechanism; it is not a new container | Accepted |
| [0027](0027-namespace-manifest-layer.md) | The namespace manifest layer consumes frozen namespaces and defers the dependency topology to the constitution | Accepted |
| [0028](0028-di-integration-layer.md) | The DI-integration layer consumes the frozen DI, composition root, and namespace wiring; it registers nothing and activates nothing | Accepted |
| [0029](0029-runtime-lifecycle-plan.md) | The runtime lifecycle plan consumes the frozen runtime model and the DI integration; it references the model and carries nothing out | Accepted |
| [0030](0030-execution-pipeline-plan.md) | The execution pipeline plan composes the frozen runtime workflow with the lifecycle plan; it references the model and executes nothing | Accepted |
| [0031](0031-governance-enforcement-boundary.md) | The Phase 3 descriptive chain is complete at Stage 5; Governance Enforcement is an operational Phase 4 capability | Accepted |
