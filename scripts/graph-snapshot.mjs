/**
 * Dependency graph snapshot (Engineering Rule 2, "graph snapshot").
 *
 * Rule 2 requires a committed snapshot of the resolved dependency graph so that any
 * new package-level edge produces a reviewable diff and graph changes are never
 * silent. This script derives the package-level runtime graph from the source import
 * specifiers (`@openlance/aios-*`) under each package's `src/` -- the same edges
 * dependency-cruiser resolves and enforces -- and writes it to
 * `dependency-graph.snapshot.json`.
 *
 *   node scripts/graph-snapshot.mjs           # regenerate and write the snapshot
 *   node scripts/graph-snapshot.mjs --check   # fail if the committed snapshot is stale
 *
 * The snapshot is package-level and source-derived, so it is deterministic and
 * machine-independent: build output, module ordering, and absolute paths do not
 * affect it. Substrate and reserved namespace packages are both listed, so a future
 * namespace edge appears as a reviewable diff. `--check` is wired into
 * `pnpm run validate` and CI.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const snapshotPath = join(repoRoot, 'dependency-graph.snapshot.json');
const packagesDir = join(repoRoot, 'packages');
const SOURCE = /\.(ts|mts|cts|js|mjs|cjs)$/;
const SPECIFIER = /['"]@openlance\/aios-([a-z0-9-]+)['"]/g;

const walk = (dir) => {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (SOURCE.test(entry.name)) files.push(full);
  }
  return files;
};

// Transient scaffold golden-file fixtures; never part of the committed graph.
const FIXTURES = new Set(['goldenfixture', 'goldennamespace']);

const subdirectories = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !FIXTURES.has(entry.name))
    .map((entry) => entry.name);

/** The substrate and reserved namespace packages, each mapped to its `src/` directory. */
const packageRoots = () => {
  const roots = [];
  for (const name of subdirectories(packagesDir)) {
    if (name === 'namespaces') {
      const namespacesDir = join(packagesDir, 'namespaces');
      for (const ns of subdirectories(namespacesDir)) {
        roots.push([`@openlance/aios-${ns}`, join(namespacesDir, ns, 'src')]);
      }
    } else {
      roots.push([`@openlance/aios-${name}`, join(packagesDir, name, 'src')]);
    }
  }
  return roots;
};

const buildGraph = () => {
  const graph = {};
  for (const [pkg, srcDir] of packageRoots()) {
    const dependencies = new Set();
    for (const file of walk(srcDir)) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(SPECIFIER)) {
        const target = `@openlance/aios-${match[1]}`;
        if (target !== pkg) dependencies.add(target);
      }
    }
    graph[pkg] = [...dependencies].sort();
  }
  const ordered = {};
  for (const key of Object.keys(graph).sort()) ordered[key] = graph[key];
  return ordered;
};

const generated = `${JSON.stringify(buildGraph(), null, 2)}\n`;

if (process.argv.includes('--check')) {
  let committed = '';
  try {
    committed = readFileSync(snapshotPath, 'utf8');
  } catch {
    console.error(
      'Dependency graph snapshot is missing. Run `pnpm run graph:snapshot` and commit dependency-graph.snapshot.json.',
    );
    process.exit(1);
  }
  if (committed !== generated) {
    console.error(
      'Dependency graph snapshot is stale: the resolved package graph changed.\n' +
        'Review the edge change, then run `pnpm run graph:snapshot` and commit the result.\n\n' +
        `--- committed\n${committed}\n+++ resolved\n${generated}`,
    );
    process.exit(1);
  }
  console.log('Dependency graph snapshot is up to date.');
} else {
  writeFileSync(snapshotPath, generated);
  console.log(`Wrote ${snapshotPath}`);
}
