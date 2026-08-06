import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Permanent type-only import (erasure) guard (ADR-0056). Automation Intelligence frames three frozen app-to-app contracts
 * by reference: the Agent Engine `AgentRequest`, the Evaluation Engine `EvaluationRequest`, and the immediate-predecessor
 * Growth Workflows `GrowthWorkflow`. Each MUST be imported as `import type` so it erases at compile time (`verbatimModuleSyntax`)
 * and creates no runtime dependency edge; converting any to a value import would silently tighten the runtime graph without
 * failing the dependency-set guard (all three are already permitted runtime deps). This guard scans every source file under
 * `src/` and fails the build if any of the three framed contracts is ever value-imported, or if any `@openlance/aios-*`
 * package other than the runtime substrate (kernel, di, errors) is value-imported. It locks the declarative,
 * composition-only boundary in CI.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

/** The three framed app-to-app contracts: must be imported TYPE-ONLY (so they erase and add no runtime edge). */
const FRAMED_SPECIFIERS = [
  '@openlance/aios-agent-engine',
  '@openlance/aios-evaluation-engine',
  '@openlance/aios-openlance-growth-workflows',
];

/** The only `@openlance/aios-*` packages Automation Intelligence may import as VALUES (the runtime substrate). */
const SUBSTRATE_VALUE_SPECIFIERS = [
  '@openlance/aios-kernel',
  '@openlance/aios-di',
  '@openlance/aios-errors',
];

/** An `import ... from '@openlance/aios-<pkg>'` statement: capture the clause before `from` and the specifier. */
const AIOS_IMPORT = /import\b([^;]*?)from\s*['"](@openlance\/aios-[a-z0-9-]+)['"]/g;

interface ImportRecord {
  readonly file: string;
  readonly specifier: string;
  readonly typeOnly: boolean;
}

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

const aiosImports = (): ImportRecord[] => {
  const records: ImportRecord[] = [];
  for (const file of sourceFiles(srcDir)) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(AIOS_IMPORT)) {
      const clause = match[1] ?? '';
      const specifier = match[2] ?? '';
      records.push({ file, specifier, typeOnly: /^\s*type\b/.test(clause) });
    }
  }
  return records;
};

describe('type-only imports (erasure) guard (ADR-0056)', () => {
  it('every framed app-to-app contract (agent-engine, evaluation-engine, growth-workflows) is imported type-only', () => {
    const records = aiosImports();
    for (const specifier of FRAMED_SPECIFIERS) {
      const uses = records.filter((record) => record.specifier === specifier);
      // Non-vacuous: the contract is actually imported somewhere in src.
      expect(uses.length, `${specifier} must be imported in src`).toBeGreaterThan(0);
      for (const use of uses) {
        expect(
          use.typeOnly,
          `${use.file} imports ${specifier} as a value; it must be 'import type' so it erases`,
        ).toBe(true);
      }
    }
  });

  it('the only value imports are the runtime substrate (kernel, di, errors)', () => {
    const valueImports = aiosImports().filter((record) => !record.typeOnly);
    // Non-vacuous: the substrate is actually value-imported (err/ok, isErr, token, BaseError).
    expect(valueImports.length).toBeGreaterThan(0);
    for (const use of valueImports) {
      expect(
        SUBSTRATE_VALUE_SPECIFIERS.includes(use.specifier),
        `${use.file} value-imports ${use.specifier}; only kernel/di/errors may be value imports`,
      ).toBe(true);
    }
  });
});
