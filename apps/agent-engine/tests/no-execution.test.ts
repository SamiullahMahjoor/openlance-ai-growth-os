import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0041 Decision 3 boundary, enforced structurally: the Agent Engine composes a static plan and never executes,
 * orchestrates, schedules, combines results, or invokes an engine. Per the frozen `agent-boundaries` `execution`
 * boundary, "an agent never orchestrates, schedules, or executes." So the engine consumes each engine's public request
 * contract (a type), never its executing manager, executor, module, or token, and issues no execution or scheduling
 * call. This guard scans every source file under `src/` for execution-call and engine-invocation tokens and fails the
 * build on any occurrence. (The agent's own `AgentManager` / `AGENT_MANAGER` and the DI `registry.register` are not
 * execution and are not forbidden.)
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
  // the six engines' executing managers, executors, modules, and tokens (the agent consumes only their request types)
  'providermanager',
  'promptmanager',
  'memorymanager',
  'retrievalmanager',
  'toolmanager',
  'reasoningmanager',
  'provider_manager',
  'prompt_manager',
  'memory_manager',
  'retrieval_manager',
  'tool_manager',
  'reasoning_manager',
  'providerexecutor',
  'retrievalexecutor',
  'toolexecutor',
  'providerenginemodule',
  'promptenginemodule',
  'memoryenginemodule',
  'retrievalenginemodule',
  'toolenginemodule',
  'reasoningenginemodule',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no execution (ADR-0041 Decision 3)', () => {
  it('the engine source issues no execution or scheduling call and imports no engine manager, executor, module, or token', () => {
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
