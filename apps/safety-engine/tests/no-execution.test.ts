import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0043 boundary, enforced structurally: the Safety Engine protects and stops. It authorizes nothing, executes
 * nothing, invokes no engine, schedules nothing, selects and invokes no provider, and mints no clearance. Its protective
 * components are inert (they describe protection; they never perform it). This guard scans every source file under
 * `src/` for execution, scheduling, engine-invocation, and provider-selection tokens and fails the build on any
 * occurrence. (The engine's own `SafetyManager` / `SAFETY_MANAGER` and the DI `registry.register` are not execution and
 * are not forbidden.)
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  // execution and scheduling calls
  '.execute(',
  '.invoke(',
  '.dispatch(',
  '.schedule(',
  '.run(',
  'settimeout',
  'setinterval',
  // the engines' executing managers and the provider clearance minter (safety consumes only contracts, never a manager)
  'agentmanager',
  'agent_manager',
  'governancemanager',
  'providermanager',
  'promptmanager',
  'memorymanager',
  'retrievalmanager',
  'toolmanager',
  'reasoningmanager',
  'selectprovider',
  'mintclearance',
  'governanceclearance',
  'providerclearance',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no execution (ADR-0043)', () => {
  it('the engine source issues no execution, scheduling, engine-invocation, or provider-selection call', () => {
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
