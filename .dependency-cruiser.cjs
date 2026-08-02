/**
 * dependency-cruiser configuration.
 *
 * This file is the automated guardian of Engineering Rule 2 (Dependency Graph
 * Enforcement) and Rule 1 (Public API Boundary). Its rules are derived from the
 * frozen constitutional dependency map at ai/architecture/dependency-map.md and
 * from the approved substrate layering in docs/implementation/00-repository-architecture.md.
 *
 * It adds no architectural concept; it only refuses violations of the frozen graph.
 */

// Substrate layering, from most foundational to most operational.
// A package may depend only on packages earlier in this list.
const SUBSTRATE = ['kernel', 'errors', 'di', 'config', 'logging', 'events', 'plugins'];

/** A `to` matcher that catches both the workspace real path and the symlinked node_modules path. */
const pkgTo = (names) => `(^packages/(${names.join('|')})/|/@openlance/aios-(${names.join('|')})/)`;

const substrateLayering = SUBSTRATE.flatMap((name, i) => {
  const forbiddenTargets = SUBSTRATE.slice(i + 1);
  if (forbiddenTargets.length === 0) return [];
  return [
    {
      name: `substrate-layer-${name}`,
      severity: 'error',
      comment: `Rule 2: '${name}' must not depend on a less-foundational substrate package.`,
      from: { path: `^packages/${name}/` },
      to: { path: pkgTo(forbiddenTargets) },
    },
  ];
});

module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Rule 2: the dependency graph is acyclic (mirrors the frozen constitutional graph).',
      from: {},
      to: { circular: true },
    },
    {
      name: 'not-to-deep-import',
      severity: 'error',
      comment:
        'Rule 1: a package may be imported only through its public barrel, never a nested module.',
      from: { path: '^packages/([^/]+)/.+' },
      to: {
        path: '^packages/([^/]+)/src/(?!index\\.ts$).+',
        pathNot: ['^packages/$1/'],
      },
    },
    {
      name: 'testing-not-a-runtime-dep',
      severity: 'error',
      comment:
        'Rule 4/Rule 2: the testing package is a dev dependency only, never a runtime import.',
      from: { path: '^packages/(?!testing/)', pathNot: ['\\.test\\.ts$', '/tests/'] },
      to: { path: pkgTo(['testing']) },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'A module reachable by nothing is likely dead code (barrels and configs excepted).',
      from: {
        orphan: true,
        pathNot: ['\\.d\\.ts$', '(^|/)index\\.ts$', '\\.config\\.(ts|js|mjs|cjs)$', '(^|/)tests?/'],
      },
      to: {},
    },
    ...substrateLayering,
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.base.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json'],
    },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)' },
    },
  },
};
