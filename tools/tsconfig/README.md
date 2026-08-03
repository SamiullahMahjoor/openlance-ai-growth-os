# @openlance/aios-tsconfig

Shared TypeScript compiler configuration for the OpenLance AIOS monorepo.

- **Layer:** tools (build infrastructure, subsystem 09)
- **Stability:** Low (Engineering Rule 4) — dev infrastructure; iterates as the toolchain evolves.
- **Constitution:** none. This is engineering tooling; it realizes no constitutional concept and changes no constitutional ownership.

## Purpose

Provides the strict, ESM, project-referenced TypeScript baseline that every package
extends, so compiler settings (strictness, determinism-relevant flags, module
resolution) are defined once and applied uniformly.

## Public surface

Two config presets, consumed via `extends`:

- `base.json` — the strict baseline: `strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `isolatedModules`,
  `composite`, `declaration`, `module`/`moduleResolution` `NodeNext`, ESM.
- `library.json` — extends `base.json` for a publishable library package (declaration
  output settings).

## Consumers

Every substrate package `tsconfig.json` (`"extends": "@openlance/aios-tsconfig/library.json"`),
its `tsconfig.build.json` (which overrides `composite: false` for the tsup declaration
build, ADR-0009), the scaffold template, and the root `tsconfig.base.json` used by
dependency-cruiser.

## Non-responsibilities

No runtime code, no build execution (that is tsup/turbo), no lint rules (that is
`@openlance/aios-eslint-config`), and no AI or business concept. It only declares
compiler options.
