/**
 * docs-check (Engineering Rules 3 and 4; Definition of Done criteria 8 and 11).
 *
 * The engineering governance names a `docs-check` CI gate as the enforcement point for
 * ADR integrity (Rule 3) and stability metadata (Rule 4). This script implements it. It
 * validates, and fails (exit 1) on any violation of:
 *
 *   - ADR front matter (required fields, valid status) and contiguous numbering,
 *   - the ADR index (every ADR listed with matching status; no stale rows),
 *   - ADR references anywhere in the repo resolve to an existing ADR,
 *   - every workspace package has a complete `aios` metadata block,
 *   - `aios.stability` is a valid class and matches the authoritative Rule 4 table,
 *   - `aios.layer` matches the package's class (substrate / namespace / tools),
 *   - every `aios.constitution` id resolves to a real front-matter id under ai/ or knowledge/,
 *   - every package has a README.md,
 *   - no test or benchmark file contains a focused (.only) or skipped (.skip) case.
 *
 * It reads only; it changes nothing. Wired into `pnpm run validate` and CI.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const fail = (message) => problems.push(message);

const FIXTURES = new Set(['goldenfixture', 'goldennamespace']);
const STABILITY_CLASSES = new Set(['Very High', 'High', 'Medium', 'Low', 'Experimental']);
const ADR_STATUS = /^(Accepted|Proposed|Deprecated|Superseded by ADR-\d{4})$/;

/** Authoritative Rule 4 stability table (docs/implementation/ENGINEERING-RULES.md). */
const SUBSTRATE_STABILITY = {
  kernel: 'Very High',
  errors: 'Very High',
  di: 'High',
  config: 'High',
  logging: 'Medium',
  events: 'Medium',
  plugins: 'Medium',
  testing: 'Low',
};

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

const walk = (dir, predicate) => {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'coverage')
      continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, predicate));
    else if (predicate(entry.name)) files.push(full);
  }
  return files;
};

const frontMatter = (text) => {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  const fields = {};
  for (const line of block[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return fields;
};

const subdirs = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !FIXTURES.has(entry.name))
    .map((entry) => entry.name);

// ---------------------------------------------------------------------------
// 1. Valid constitution ids (front-matter ids under the frozen ai/ and knowledge/).
// ---------------------------------------------------------------------------
const constitutionIds = new Set();
for (const root of ['ai', 'knowledge']) {
  for (const md of walk(join(repoRoot, root), (name) => name.endsWith('.md'))) {
    const fm = frontMatter(readFileSync(md, 'utf8'));
    if (fm?.id) constitutionIds.add(fm.id);
  }
}
if (constitutionIds.size === 0)
  fail('Found no constitution front-matter ids under ai/ or knowledge/.');

// ---------------------------------------------------------------------------
// 2. Workspace packages: metadata, stability, layer, constitution, README.
// ---------------------------------------------------------------------------
const packageDirs = [];
for (const name of subdirs(join(repoRoot, 'packages'))) {
  if (name === 'namespaces') {
    for (const ns of subdirs(join(repoRoot, 'packages', 'namespaces'))) {
      packageDirs.push({
        dir: join(repoRoot, 'packages', 'namespaces', ns),
        name: ns,
        klass: 'namespace',
      });
    }
  } else {
    packageDirs.push({ dir: join(repoRoot, 'packages', name), name, klass: 'substrate' });
  }
}
for (const name of subdirs(join(repoRoot, 'tools'))) {
  packageDirs.push({ dir: join(repoRoot, 'tools', name), name, klass: 'tools' });
}
if (existsSync(join(repoRoot, 'apps'))) {
  for (const name of subdirs(join(repoRoot, 'apps'))) {
    packageDirs.push({ dir: join(repoRoot, 'apps', name), name, klass: 'app' });
  }
}

for (const pkg of packageDirs) {
  const label = `${pkg.klass}/${pkg.name}`;
  const manifestPath = join(pkg.dir, 'package.json');
  if (!existsSync(manifestPath)) {
    fail(`${label}: missing package.json`);
    continue;
  }
  if (!existsSync(join(pkg.dir, 'README.md')))
    fail(`${label}: missing README.md (DoD criterion 8)`);

  const aios = readJson(manifestPath).aios;
  if (!aios) {
    fail(`${label}: package.json has no "aios" metadata block (Rule 4)`);
    continue;
  }
  for (const field of ['layer', 'constitution', 'stability', 'apiVersion', 'generation']) {
    if (aios[field] === undefined) fail(`${label}: aios.${field} is missing`);
  }
  const expectedLayer =
    pkg.klass === 'substrate'
      ? 'substrate'
      : pkg.klass === 'namespace'
        ? 'namespace'
        : pkg.klass === 'app'
          ? 'app'
          : 'tools';
  if (aios.layer !== expectedLayer)
    fail(`${label}: aios.layer is "${aios.layer}", expected "${expectedLayer}"`);

  if (!STABILITY_CLASSES.has(aios.stability))
    fail(`${label}: aios.stability "${aios.stability}" is not a valid Rule 4 class`);
  const expectedStability =
    pkg.klass === 'namespace'
      ? 'Experimental'
      : pkg.klass === 'tools'
        ? 'Low'
        : SUBSTRATE_STABILITY[pkg.name];
  if (expectedStability && aios.stability !== expectedStability)
    fail(
      `${label}: aios.stability "${aios.stability}" does not match the Rule 4 table ("${expectedStability}")`,
    );

  if (!Array.isArray(aios.constitution)) {
    fail(`${label}: aios.constitution must be an array`);
  } else {
    for (const id of aios.constitution) {
      if (!constitutionIds.has(id))
        fail(`${label}: aios.constitution id "${id}" resolves to no ai/ or knowledge/ document`);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. ADRs: front matter, numbering, index, references.
// ---------------------------------------------------------------------------
const adrDir = join(repoRoot, 'docs', 'implementation', 'adr');
const adrFiles = readdirSync(adrDir).filter((f) => /^\d{4}-.*\.md$/.test(f));
const adrByNumber = new Map();
for (const file of adrFiles) {
  const number = file.slice(0, 4);
  const text = readFileSync(join(adrDir, file), 'utf8');
  const fm = frontMatter(text);
  if (number === '0000') continue; // template
  if (!fm) {
    fail(`ADR ${file}: missing front matter`);
    continue;
  }
  for (const field of ['id', 'title', 'status', 'date']) {
    if (!fm[field]) fail(`ADR ${file}: front matter field "${field}" is missing`);
  }
  if (fm.id !== `ADR-${number}`)
    fail(`ADR ${file}: front-matter id "${fm.id}" does not match file number ${number}`);
  if (fm.status && !ADR_STATUS.test(fm.status)) fail(`ADR ${file}: invalid status "${fm.status}"`);
  adrByNumber.set(number, { file, status: fm.status });
}

const numbers = [...adrByNumber.keys()].map(Number).sort((a, b) => a - b);
for (let i = 0; i < numbers.length; i += 1) {
  if (numbers[i] !== i + 1) {
    fail(
      `ADR numbering is not contiguous from 0001: gap or duplicate near ${String(numbers[i]).padStart(4, '0')}`,
    );
    break;
  }
}

// Index integrity.
const indexText = readFileSync(join(adrDir, 'README.md'), 'utf8');
const indexed = new Map();
for (const row of indexText.matchAll(/\|\s*\[(\d{4})\]\([^)]+\)\s*\|[^|]*\|\s*([^|]+?)\s*\|/g)) {
  indexed.set(row[1], row[2].trim());
}
for (const [number, adr] of adrByNumber) {
  if (!indexed.has(number)) fail(`ADR index: ADR-${number} (${adr.file}) is not listed`);
  else if (indexed.get(number) !== adr.status)
    fail(
      `ADR index: ADR-${number} status "${indexed.get(number)}" does not match the ADR file ("${adr.status}")`,
    );
}
for (const number of indexed.keys()) {
  if (!adrByNumber.has(number)) fail(`ADR index: lists ADR-${number}, which has no ADR file`);
}

// Referenced ADRs must exist (anywhere in source, docs, and tooling).
const referenceFiles = [
  ...walk(join(repoRoot, 'packages'), (n) => /\.(ts|md|json)$/.test(n)),
  ...walk(join(repoRoot, 'apps'), (n) => /\.(ts|md|json)$/.test(n)),
  ...walk(join(repoRoot, 'tools'), (n) => /\.(ts|md|json|js|cjs|mjs)$/.test(n)),
  ...walk(join(repoRoot, 'docs'), (n) => n.endsWith('.md')),
  ...walk(join(repoRoot, 'scripts'), (n) => /\.(mjs|js|cjs)$/.test(n)),
  join(repoRoot, '.dependency-cruiser.cjs'),
].filter((file) => basename(file) !== '0000-template.md');
for (const file of referenceFiles) {
  const text = readFileSync(file, 'utf8');
  for (const ref of text.matchAll(/ADR-(\d{4})/g)) {
    if (!adrByNumber.has(ref[1]))
      fail(`${basename(file)}: references ADR-${ref[1]}, which does not exist`);
  }
}

// ---------------------------------------------------------------------------
// 4. No focused (.only) or skipped (.skip) tests or benchmarks (DoD criterion 3).
// ---------------------------------------------------------------------------
for (const file of [
  ...walk(join(repoRoot, 'packages'), (n) => /\.(test|bench)\.ts$/.test(n)),
  ...walk(join(repoRoot, 'apps'), (n) => /\.(test|bench)\.ts$/.test(n)),
]) {
  const text = readFileSync(file, 'utf8');
  const focused = text.match(/\.(only|skip)\s*\(/);
  if (focused)
    fail(
      `${file.replace(repoRoot, '.')}: contains a focused/skipped case (${focused[0].trim()}); DoD forbids .only/.skip`,
    );
}

// ---------------------------------------------------------------------------
if (problems.length > 0) {
  console.error(`docs-check found ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(
  `docs-check passed: ${packageDirs.length} packages, ${adrByNumber.size} ADRs, ${constitutionIds.size} constitution ids.`,
);
