# @openlance/aios-scaffold

Plop templates for scaffolding OpenLance AIOS packages and reserved namespace packages.

- **Layer:** tools (build infrastructure, subsystem 09)
- **Stability:** Low (Engineering Rule 4) — dev infrastructure; iterates as conventions evolve.
- **Constitution:** none. This is engineering tooling; it realizes no constitutional concept and changes no constitutional ownership.

## Purpose

Generates new packages that match the hand-built substrate convention exactly, so a
package created by the generator is compiling, testable, benchmarked, and graph-valid
with no manual edits (design subsystem 09, acceptance criteria). The generator carries
the mandatory metadata: the constitution traceability field, the stability class
(Rule 4), and the public-barrel layout (Rule 1).

## Public surface

Two Plop generators (defined in the repo-root `plopfile.cjs`, templates under
`templates/`):

- `package` — a substrate package skeleton: `package.json` (with the ADR-0009 build
  script and `tsconfig.build.json`, coverage-enabled test, and `bench` scripts),
  `tsconfig.json` + `tsconfig.build.json`, a root-extending `vitest.config.ts`, a
  barrel plus a starter module, a test, a `benchmarks/` folder (stub + `baseline.md`),
  and a `README.md`.
- `namespace-package` — a reserved constitutional namespace package: `package.json` +
  `README.md` only, with no runtime code.

Run via `pnpm run scaffold` (or `pnpm exec plop <generator>`). The golden-file test in
`tests/` scaffolds both generators and asserts the output builds, type-checks, tests at
full coverage, benchmarks, and passes dependency-cruiser.

## Consumers

Engineers adding a new substrate package or reserving a namespace package. Not imported
at runtime by any package.

## Non-responsibilities

No runtime code, no compiler or lint policy (that is `@openlance/aios-tsconfig` and
`@openlance/aios-eslint-config`), and no AI or business concept. It only emits the
standard package skeleton.
