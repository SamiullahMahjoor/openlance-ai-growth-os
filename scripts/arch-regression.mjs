/**
 * Architectural regression suite (Constitutional Rule - Production Import Enforcement, ADR-0019).
 *
 * Proves that Engineering Rule 2 (dependency graph) and Rule 1 (public API boundary) fire against
 * the exact import syntax production code uses -- bare workspace specifiers such as
 * `@openlance/aios-errors` -- and not only against relative imports. It constructs each forbidden
 * and each legal scenario, runs dependency-cruiser with the real repository config, asserts the
 * expected rule fires (or that a legal import passes), and removes every probe afterward.
 *
 * SAFETY (critical, since Phase 2B namespaces now carry real source): every artifact this suite
 * creates carries the `__arch_probe__` marker (probe files by name, temporary namespace barrels by
 * a leading marker comment). Cleanup removes only marker-carrying files and only the `src`
 * directories this suite created; it never touches a package that already had source. Namespace
 * fixtures write scratch barrels only into namespaces that are still reserved; a legal fixture may
 * reference an implemented namespace by import without writing to its source.
 *
 * It mutates the working tree transiently and must run as its own step, never concurrently with
 * build/test. Wired into `pnpm run validate` and CI as `arch:check`.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROBE = '__arch_probe__';
const namespacesDir = join(repoRoot, 'packages', 'namespaces');

const createdFiles = new Set();
const createdDirs = new Set();

/** A temporary namespace barrel; carries the marker so cleanup can recognise it. */
const barrel = (importLine = '') =>
  `// ${PROBE}\n${importLine}${importLine ? '\n' : ''}export const value = 1;\n`;
/** A probe file added alongside a package's real source; carries the marker. */
const probe = (importLine) => `// ${PROBE}\n${importLine}\n`;

const place = (relPath, content) => {
  const abs = join(repoRoot, relPath);
  const dir = dirname(abs);
  if (!existsSync(dir)) createdDirs.add(dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(abs, content);
  createdFiles.add(abs);
};

const cleanupScenario = () => {
  for (const file of createdFiles) rmSync(file, { force: true });
  createdFiles.clear();
  for (const dir of createdDirs) rmSync(dir, { recursive: true, force: true });
  createdDirs.clear();
};

/** Remove any marker-carrying artifact and any now-empty namespace src dir; never touch real code. */
const sweep = () => {
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.includes(PROBE)) rmSync(full, { force: true });
    }
  };
  walk(join(repoRoot, 'packages'));
  for (const ns of readdirSync(namespacesDir, { withFileTypes: true })) {
    if (!ns.isDirectory()) continue;
    const src = join(namespacesDir, ns.name, 'src');
    if (!existsSync(src)) continue;
    for (const entry of readdirSync(src, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const full = join(src, entry.name);
      if (readFileSync(full, 'utf8').startsWith(`// ${PROBE}`)) rmSync(full, { force: true });
    }
    if (readdirSync(src).length === 0) rmSync(src, { recursive: true, force: true });
  }
};

const runCruise = (targets) => {
  const command = `pnpm exec depcruise ${targets} --config .dependency-cruiser.cjs`;
  try {
    const out = execSync(command, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out };
  } catch (error) {
    return { code: error.status ?? 1, out: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  }
};

// Only the evolution namespace remains reserved, so namespace fixtures write a scratch barrel into
// evolution/src/index.ts and, where a second namespace or an implemented target is needed, add a marker
// probe file (__arch_probe__.ts) into an implemented namespace's src -- which never clobbers its real
// barrel and is swept afterward, the same pattern the substrate scenarios use. Relationships come from the
// frozen ai/architecture/dependency-map.md: operations may depend on runtime (allowed); operations may not
// depend on evolution (forbidden); evolution may not depend on operations (evolution deps: none, forbidden).
const scenarios = [
  // --- Legal imports must succeed ---
  {
    name: 'legal-substrate-bare-import',
    style: 'bare package',
    files: [['packages/config/src/__arch_probe__.ts', probe("import '@openlance/aios-kernel';")]],
    targets: 'packages/config packages/kernel',
    expect: 'pass',
  },
  {
    name: 'legal-namespace-bare-import',
    style: 'bare package (namespace)',
    // operations -> runtime is an allowed edge; both are implemented, so the fixture adds a marker probe
    // file to operations importing the real runtime and writes no scratch barrel.
    files: [
      [
        'packages/namespaces/operations/src/__arch_probe__.ts',
        probe("import '@openlance/aios-runtime';"),
      ],
    ],
    targets: 'packages/namespaces/operations packages/namespaces/runtime',
    expect: 'pass',
  },
  // --- Forbidden imports must fail, using PRODUCTION bare specifiers ---
  {
    name: 'layer-inversion-bare-import',
    style: 'bare package',
    files: [['packages/kernel/src/__arch_probe__.ts', probe("import '@openlance/aios-errors';")]],
    targets: 'packages/kernel packages/errors',
    expect: 'fail',
    rule: 'substrate-layer-kernel',
  },
  {
    name: 'cycle-bare-import',
    style: 'bare package (cycle)',
    // Only evolution is still reserved, so a two-namespace package cycle cannot be built without writing
    // an implemented namespace's real barrel (a marker probe is never the package entry, so it cannot close
    // a package-level cycle). The cycle is therefore formed inside the reserved evolution namespace, with the
    // closing edge a production bare workspace import (@openlance/aios-evolution): the barrel imports a marker
    // sibling, and the sibling imports the package back, so no-circular fires against a bare specifier.
    files: [
      ['packages/namespaces/evolution/src/index.ts', barrel("import './__arch_probe__cycle.js';")],
      [
        'packages/namespaces/evolution/src/__arch_probe__cycle.ts',
        barrel("import '@openlance/aios-evolution';"),
      ],
    ],
    targets: 'packages/namespaces/evolution',
    expect: 'fail',
    rule: 'no-circular',
  },
  {
    name: 'substrate-to-namespace-bare-import',
    style: 'bare package',
    files: [
      ['packages/namespaces/evolution/src/index.ts', barrel()],
      ['packages/errors/src/__arch_probe__.ts', probe("import '@openlance/aios-evolution';")],
    ],
    targets: 'packages/errors packages/namespaces/evolution',
    expect: 'fail',
    rule: 'substrate-not-to-namespace',
  },
  {
    name: 'illegal-namespace-edge-bare-import',
    style: 'bare package (namespace)',
    // operations (deps: governance, runtime) may not import evolution; evolution is still reserved and
    // operations is implemented, so the forbidden edge is a marker probe in operations importing the
    // reserved evolution barrel.
    files: [
      ['packages/namespaces/evolution/src/index.ts', barrel()],
      [
        'packages/namespaces/operations/src/__arch_probe__.ts',
        probe("import '@openlance/aios-evolution';"),
      ],
    ],
    targets: 'packages/namespaces/operations packages/namespaces/evolution',
    expect: 'fail',
    rule: 'namespace-operations',
  },
  {
    name: 'reserved-namespace-forbidden-edge-bare-import',
    style: 'bare package (namespace)',
    // evolution (deps: none) may not import operations; evolution is still reserved and operations is
    // implemented, so the reserved evolution barrel imports the real operations package and needs no
    // scratch barrel written into operations.
    files: [
      [
        'packages/namespaces/evolution/src/index.ts',
        barrel("import '@openlance/aios-operations';"),
      ],
    ],
    targets: 'packages/namespaces/evolution packages/namespaces/operations',
    expect: 'fail',
    rule: 'namespace-evolution',
  },
  {
    name: 'testing-as-runtime-dep-bare-import',
    style: 'bare package',
    files: [['packages/config/src/__arch_probe__.ts', probe("import '@openlance/aios-testing';")]],
    targets: 'packages/config packages/testing',
    expect: 'fail',
    rule: 'testing-not-a-runtime-dep',
  },
  // --- Relative and deep imports must continue to fail ---
  {
    name: 'forbidden-relative-import',
    style: 'relative',
    files: [
      ['packages/kernel/src/__arch_probe__.ts', probe("import '../../errors/src/index.js';")],
    ],
    targets: 'packages/kernel packages/errors',
    expect: 'fail',
    rule: 'substrate-layer-kernel',
  },
  {
    name: 'deep-import-relative',
    style: 'relative deep',
    files: [['packages/config/src/__arch_probe__.ts', probe("import '../../errors/src/base.js';")]],
    targets: 'packages/config packages/errors',
    expect: 'fail',
    rule: 'not-to-deep-import',
  },
];

const results = [];
sweep();
try {
  for (const scenario of scenarios) {
    for (const [rel, content] of scenario.files) place(rel, content);
    const { code, out } = runCruise(scenario.targets);
    let ok;
    let detail;
    if (scenario.expect === 'pass') {
      ok = code === 0;
      detail = ok
        ? 'legal import accepted (0 violations)'
        : `expected pass but cruise failed:\n${out}`;
    } else {
      const fired = out.includes(scenario.rule);
      ok = code !== 0 && fired;
      detail = ok
        ? `rejected by rule '${scenario.rule}'`
        : `expected rule '${scenario.rule}' to fire (code=${code}); got:\n${out}`;
    }
    results.push({ scenario, ok, detail });
    cleanupScenario();
  }
} finally {
  cleanupScenario();
  sweep();
}

let failed = 0;
console.log('Architectural regression suite (production import enforcement):\n');
for (const { scenario, ok, detail } of results) {
  const verdict = scenario.expect === 'pass' ? 'must PASS' : `must FAIL (${scenario.rule})`;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${scenario.name}  [${scenario.style}, ${verdict}]`);
  if (!ok) {
    failed += 1;
    console.log(`        ${detail.replace(/\n/g, '\n        ')}`);
  }
}
console.log('');
if (failed > 0) {
  console.error(`Architectural regression suite: ${failed} of ${results.length} scenarios failed.`);
  process.exit(1);
}
console.log(`Architectural regression suite: all ${results.length} scenarios passed.`);
