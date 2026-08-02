# Changesets

This directory holds [Changesets](https://github.com/changesets/changesets) for the OpenLance AIOS implementation monorepo.

Versioning follows Engineering Rule 4 (Stability Classification) and the constitutional generation model (`ai/evolution/evolution-versioning.md`): a package MAJOR corresponds to a constitutional generation. Add a changeset with `pnpm changeset` when a package's public surface changes.

Constitutional documents under `ai/` and `knowledge/` are not versioned here; they are immutable specifications.
