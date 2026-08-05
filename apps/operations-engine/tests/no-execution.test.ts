import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0045 boundary, enforced structurally: the Operations Engine observes and supervises and never executes,
 * orchestrates, schedules, or drives the runtime. It reads the immutable runtime outputs and never invokes an executing
 * runtime manager, a scheduler, a retry / checkpoint / cancellation / recovery manager, or a provider, and never mints a
 * clearance. This guard scans every source file under `src/` for execution, scheduling, and runtime-internal tokens and
 * fails the build on any occurrence. (The engine's own managers and the DI `registry.register` are not execution.)
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  '.execute(',
  '.invoke(',
  '.dispatch(',
  '.schedule(',
  '.run(',
  'settimeout',
  'setinterval',
  'runtimeexecutionmanager',
  'executioncoordinator',
  'retrymanager',
  'checkpointmanager',
  'cancellationmanager',
  'recoverymanager',
  'parallelexecutioncoordinator',
  'providermanager',
  'selectprovider',
  'mintclearance',
  'governancemanager',
  'safetymanager',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no execution or runtime orchestration (ADR-0045)', () => {
  it('the engine source issues no execution, scheduling, or runtime-internal call', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(
          text.includes(term),
          `${file} contains the forbidden execution token '${term}'`,
        ).toBe(false);
      }
    }
  });
});
