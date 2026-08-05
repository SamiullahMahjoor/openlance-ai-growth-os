import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0048 boundary, enforced structurally: the application host composes and registers only; it drives no
 * execution. It never invokes a provider, executes a plan, drives a pipeline, or mints a governance clearance. This guard
 * scans every source file under `src/` for execution and clearance-minting tokens (call-shaped or identifier tokens,
 * never English prose) and fails the build on any occurrence. Registration (`register`) and resolution (`resolve`) are
 * composition, not execution, and are not forbidden.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  '.invoke(',
  '.execute(',
  '.dispatch(',
  '.schedule(',
  '.run(',
  'settimeout',
  'setinterval',
  'mintclearance',
  'selectprovider',
  'providerexecutor',
];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no execution (ADR-0048)', () => {
  it('the application host source drives no execution and mints no clearance', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
