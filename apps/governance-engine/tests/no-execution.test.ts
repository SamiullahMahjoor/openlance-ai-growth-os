import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0042 boundary, enforced structurally: the Governance Enforcement Engine authorizes and stops. It executes
 * nothing, invokes no engine, and mints no provider clearance. Per ADR-0020, governance provides truth and the runtime
 * performs enforcement; this engine performs the authorization decision only, never the execution. It consumes the Agent
 * Engine's `AgentExecutionPlan` type but never its manager or any engine's executing manager, and it never touches the
 * frozen provider-engine clearance minter. This guard scans every source file under `src/` for execution and
 * engine-invocation tokens and fails the build on any occurrence. (The engine's own `GovernanceManager` /
 * `GOVERNANCE_MANAGER` and the DI `registry.register` are not execution and are not forbidden.)
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
  // the engines' executing managers and the provider clearance minter (governance consumes only the plan type)
  'agentmanager',
  'agent_manager',
  'providermanager',
  'promptmanager',
  'memorymanager',
  'retrievalmanager',
  'toolmanager',
  'reasoningmanager',
  'mintclearance',
  'governanceclearance',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no execution (ADR-0042)', () => {
  it('the engine source issues no execution or scheduling call, invokes no engine, and mints no clearance', () => {
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
