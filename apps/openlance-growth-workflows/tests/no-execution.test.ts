import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0055 boundary, enforced structurally: OpenLance Growth Workflows frames governed workflow tasks and never
 * executes, schedules, automates, or orchestrates. It never invokes a provider, executes a plan, drives a pipeline,
 * schedules, or mints a governance clearance. This guard scans every source file under `src/` for execution and
 * clearance-minting tokens (call-shaped or identifier tokens, never English prose) and fails the build on any occurrence.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  '.invoke(',
  '.execute(',
  '.dispatch(',
  '.schedule(',
  '.run(',
  '.authorize(',
  '.decide(',
  'settimeout',
  'setinterval',
  'mintclearance',
  'selectprovider',
  'providermanager',
  'providerexecutor',
  'governancemanager',
  'safetymanager',
];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no execution (ADR-0055)', () => {
  it('the subsystem source frames only and drives no execution', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
