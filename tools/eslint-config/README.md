# @openlance/aios-eslint-config

Shared ESLint flat configuration for the OpenLance AIOS monorepo.

- **Layer:** tools (build infrastructure, subsystem 09)
- **Stability:** Low (Engineering Rule 4) — dev infrastructure; iterates as lint policy evolves.
- **Constitution:** none. This is engineering tooling; it realizes no constitutional concept and changes no constitutional ownership.

## Purpose

Encodes the repository's static-analysis policy once: strict TypeScript style, the
determinism seams (banned `Date.now` / `Math.random` / `process.env` outside sanctioned
edges), and the public-API boundary (no deep imports into another package's internals).
It is one of the enforcement points for Engineering Rule 1, alongside the package
`exports` map and the dependency-cruiser `not-to-deep-import` rule.

## Public surface

A single default export (`index.js`): the ESLint flat-config array. Consumers import it
from the root `eslint.config.mjs`. It also carries the sanctioned-edge overrides (kernel
clock/id, config env-provider/secret, testing) and the CommonJS (`.cjs`) allowances.

## Consumers

The root `eslint.config.mjs`, which the `lint` task runs across the whole repo.

## Non-responsibilities

No type checking (that is `tsc` via `@openlance/aios-tsconfig`), no dependency-graph
enforcement (that is `.dependency-cruiser.cjs`), no formatting (that is Prettier), and
no runtime or AI concept. It only declares lint rules.
