/**
 * Architectural regression suite (Constitutional Rule - Production Import Enforcement).
 *
 * This suite proves that Engineering Rule 2 (dependency graph) and Rule 1 (public API
 * boundary) fire against the EXACT import syntax production code uses -- bare workspace
 * specifiers such as `@openlance/aios-errors` -- and not only against relative filesystem
 * imports. It constructs each forbidden and each legal scenario, runs dependency-cruiser
 * with the real repository config, asserts the expected rule fires (or that a legal import
 * passes), and removes every probe afterward. It is wired into `pnpm run validate` and CI.
 *
 * A rule that cannot reject an illegal PRODUCTION import is considered non-functional
 * (ADR-0019). Adding a new architectural rule requires adding its scenarios here.
 *
 * It mutates the working tree transiently (probe files under real package `src/`), always
 * restoring it. It must run as its own step, never concurrently with build/test.
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROBE = '__arch_probe__';

const createdFiles = new Set();
const createdNamespaceSrc = new Set();

const place = (relPath, content) => {
  const abs = join(repoRoot, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  createdFiles.add(abs);
  const nsSrc = relPath.match(/^(packages\/namespaces\/[^/]+\/src)\//);
  if (nsSrc) createdNamespaceSrc.add(join(repoRoot, nsSrc[1]));
};

const cleanupScenario = () => {
  for (const file of createdFiles) rmSync(file, { force: true });
  createdFiles.clear();
  for (const dir of createdNamespaceSrc) rmSync(dir, { recursive: true, force: true });
  createdNamespaceSrc.clear();
};

/** Defensive sweep: remove any leftover probe files and any src under a reserved namespace. */
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
  const nsDir = join(repoRoot, 'packages', 'namespaces');
  for (const entry of readdirSync(nsDir, { withFileTypes: true })) {
    if (entry.isDirectory())
      rmSync(join(nsDir, entry.name, 'src'), { recursive: true, force: true });
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

const BARREL = 'export const value = 1;\n';

/**
 * Each scenario: name, the probe files to place, the cruise targets, the expected outcome
 * ('pass' = 0 violations; 'fail' = the named rule must fire), and the import style exercised.
 */
const scenarios = [
  // --- Legal imports must succeed ---
  {
    name: 'legal-substrate-bare-import',
    style: 'bare package',
    files: [['packages/config/src/__arch_probe__.ts', "import '@openlance/aios-kernel';\n"]],
    targets: 'packages/config packages/kernel',
    expect: 'pass',
  },
  {
    name: 'legal-namespace-bare-import',
    style: 'bare package (namespace)',
    files: [
      ['packages/namespaces/agents/src/index.ts', BARREL],
      [
        'packages/namespaces/runtime/src/index.ts',
        "import '@openlance/aios-agents';\nexport const value = 1;\n",
      ],
    ],
    targets: 'packages/namespaces/runtime packages/namespaces/agents',
    expect: 'pass',
  },
  // --- Forbidden imports must fail, using PRODUCTION bare specifiers ---
  {
    name: 'layer-inversion-bare-import',
    style: 'bare package',
    files: [['packages/kernel/src/__arch_probe__.ts', "import '@openlance/aios-errors';\n"]],
    targets: 'packages/kernel packages/errors',
    expect: 'fail',
    rule: 'substrate-layer-kernel',
  },
  {
    name: 'cycle-bare-import',
    style: 'bare package (mutual)',
    files: [
      [
        'packages/namespaces/governance/src/index.ts',
        "import '@openlance/aios-providers';\nexport const value = 1;\n",
      ],
      [
        'packages/namespaces/providers/src/index.ts',
        "import '@openlance/aios-governance';\nexport const value = 1;\n",
      ],
    ],
    targets: 'packages/namespaces/governance packages/namespaces/providers',
    expect: 'fail',
    rule: 'no-circular',
  },
  {
    name: 'substrate-to-namespace-bare-import',
    style: 'bare package',
    files: [
      ['packages/namespaces/governance/src/index.ts', BARREL],
      ['packages/errors/src/__arch_probe__.ts', "import '@openlance/aios-governance';\n"],
    ],
    targets: 'packages/errors packages/namespaces/governance',
    expect: 'fail',
    rule: 'substrate-not-to-namespace',
  },
  {
    name: 'illegal-namespace-edge-bare-import',
    style: 'bare package (namespace)',
    files: [
      ['packages/namespaces/memory/src/index.ts', BARREL],
      [
        'packages/namespaces/providers/src/index.ts',
        "import '@openlance/aios-memory';\nexport const value = 1;\n",
      ],
    ],
    targets: 'packages/namespaces/providers packages/namespaces/memory',
    expect: 'fail',
    rule: 'namespace-providers',
  },
  {
    name: 'runtime-to-forbidden-namespace-bare-import',
    style: 'bare package (namespace)',
    files: [
      ['packages/namespaces/safety/src/index.ts', BARREL],
      [
        'packages/namespaces/runtime/src/index.ts',
        "import '@openlance/aios-safety';\nexport const value = 1;\n",
      ],
    ],
    targets: 'packages/namespaces/runtime packages/namespaces/safety',
    expect: 'fail',
    rule: 'namespace-runtime',
  },
  {
    name: 'testing-as-runtime-dep-bare-import',
    style: 'bare package',
    files: [['packages/config/src/__arch_probe__.ts', "import '@openlance/aios-testing';\n"]],
    targets: 'packages/config packages/testing',
    expect: 'fail',
    rule: 'testing-not-a-runtime-dep',
  },
  // --- Relative and deep imports must continue to fail ---
  {
    name: 'forbidden-relative-import',
    style: 'relative',
    files: [['packages/kernel/src/__arch_probe__.ts', "import '../../errors/src/index.js';\n"]],
    targets: 'packages/kernel packages/errors',
    expect: 'fail',
    rule: 'substrate-layer-kernel',
  },
  {
    name: 'deep-import-relative',
    style: 'relative deep',
    files: [['packages/config/src/__arch_probe__.ts', "import '../../errors/src/base.js';\n"]],
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
