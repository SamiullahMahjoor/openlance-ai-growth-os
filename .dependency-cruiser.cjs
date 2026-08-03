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

// Reserved AI-namespace graph, pre-registered from the frozen ai/architecture/dependency-map.md
// so a future cross-boundary import fails CI even before the namespace packages have code. The
// constitution and the knowledge repository are not packages, so only the inter-namespace-package
// edges are encoded here. Each namespace may depend only on the namespaces listed for it.
const NAMESPACES = [
  'governance',
  'providers',
  'memory',
  'retrieval',
  'safety',
  'reasoning',
  'prompts',
  'tools',
  'agents',
  'runtime',
  'evaluation',
  'operations',
  'evolution',
];

const NAMESPACE_DEPS = {
  governance: [],
  providers: ['governance'],
  memory: ['governance'],
  retrieval: ['governance'],
  safety: ['governance'],
  reasoning: ['governance', 'retrieval'],
  prompts: ['governance', 'retrieval'],
  tools: ['governance', 'safety'],
  agents: ['governance', 'reasoning', 'retrieval', 'memory', 'prompts', 'tools', 'providers'],
  runtime: ['governance', 'agents', 'reasoning', 'retrieval'],
  evaluation: ['governance'],
  operations: ['governance', 'runtime'],
  evolution: [],
};

/** A `to` matcher for namespace packages (real workspace path or symlinked node_modules path). */
const nsTo = (names) =>
  `(^packages/namespaces/(${names.join('|')})/|/@openlance/aios-(${names.join('|')})/)`;

const namespaceGraph = NAMESPACES.flatMap((name) => {
  const allowed = new Set([name, ...NAMESPACE_DEPS[name]]);
  const forbidden = NAMESPACES.filter((other) => !allowed.has(other));
  if (forbidden.length === 0) return [];
  return [
    {
      name: `namespace-${name}`,
      severity: 'error',
      comment: `Rule 2: namespace '${name}' may depend only on [${NAMESPACE_DEPS[name].join(', ') || 'none'}] (frozen ai/architecture/dependency-map.md).`,
      from: { path: `^packages/namespaces/${name}/` },
      to: { path: nsTo(forbidden) },
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
        'Rule 1: a package may be imported only through its public barrel, never a nested module. ' +
        'Covers both the flat substrate layout (packages/<pkg>/src) and the nested namespace ' +
        'layout (packages/namespaces/<ns>/src); the same-package back-reference exempts a ' +
        "package's own internal imports.",
      from: { path: '^(packages/namespaces/[^/]+|packages/[^/]+)/.+' },
      to: {
        path: '^(?:packages/namespaces/[^/]+|packages/[^/]+)/src/(?!index\\.ts$).+',
        pathNot: ['^$1/'],
      },
    },
    {
      name: 'substrate-not-to-namespace',
      severity: 'error',
      comment:
        'Rule 2 (defense in depth): substrate packages are namespace-agnostic. No substrate -> ' +
        'namespace edge exists in the frozen graph, so a substrate package must never depend on ' +
        'an AI namespace package.',
      from: { path: '^packages/(kernel|errors|di|config|logging|events|plugins|testing)/' },
      to: { path: nsTo(NAMESPACES) },
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
    ...namespaceGraph,
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    // The graph is a property of source, not of build output: excluding generated directories
    // keeps `turbo run build docs test` artifacts from being cruised as orphan modules. The
    // scaffold golden-file test creates and removes packages/goldenfixture/ during a run, so it
    // is excluded here to keep the whole-repo cruise from racing that transient package; the
    // golden test cruises the fixture with its own config (tools/scaffold/tests) instead.
    exclude: { path: '(^|/)(dist|docs-api|coverage|\\.turbo|goldenfixture|goldennamespace)/' },
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
