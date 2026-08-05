import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0039 Decision 2 boundary, enforced structurally: the Tool Engine is foundational and reaches into no
 * operational service and no sibling namespace. Per the frozen `tool-boundaries`, a tool is not a provider (an agent
 * composes both) and a tool is carried out by the runtime, so the engine never imports a provider, prompt, memory,
 * retrieval, agent, reasoning, or runtime package. This guard scans every source file under `src/` for the forbidden
 * package specifiers and fails the build on any occurrence. (The legal edges are tools, di, events, errors, plugins,
 * kernel.)
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN_SPECIFIERS = [
  '@openlance/aios-provider',
  '@openlance/aios-prompt',
  '@openlance/aios-memory',
  '@openlance/aios-retrieval',
  '@openlance/aios-agents',
  '@openlance/aios-reasoning',
  '@openlance/aios-runtime',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no cross-boundary dependency (ADR-0039 Decision 2)', () => {
  it('the engine source imports no provider, prompt, memory, retrieval, agent, reasoning, or runtime package', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8');
      for (const specifier of FORBIDDEN_SPECIFIERS) {
        expect(
          text.includes(specifier),
          `${file} references the forbidden package '${specifier}'`,
        ).toBe(false);
      }
    }
  });
});
