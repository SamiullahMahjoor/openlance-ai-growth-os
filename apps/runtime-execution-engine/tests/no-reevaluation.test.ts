import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0044 boundary, enforced structurally: the Runtime Execution Engine executes an already-authorized and
 * already-safe plan and never re-evaluates or overrides an upstream decision. It reads the immutable `GovernanceDecision`
 * and `SafetyDecision` (their `decision` / `outcome` fields) and never invokes a governance or safety engine, evaluator,
 * or clearance minter, and never re-decides authorization or safety. This guard scans every source file under `src/` for
 * re-evaluation, authorization, and clearance tokens and fails the build on any occurrence. (Reading a decision field is
 * not re-evaluation; invoking a governance/safety manager or evaluator is.)
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  'governancemanager',
  'governance_manager',
  'governanceevaluator',
  'safetymanager',
  'safety_manager',
  'safetyevaluator',
  'permissionevaluator',
  'oversightevaluator',
  'hazardanalyzer',
  'riskanalyzer',
  'mintclearance',
  'governanceclearance',
  'providerclearance',
  'selectprovider',
  '.authorize(',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no re-evaluation or override (ADR-0044)', () => {
  it('the engine source re-evaluates no governance or safety and mints no clearance', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
