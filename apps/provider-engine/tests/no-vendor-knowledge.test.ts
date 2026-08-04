import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0035 constitutional invariant, enforced structurally: the Provider Engine never contains
 * vendor knowledge. This guard scans every source file under `src/` and fails the build if it names a
 * vendor, references an SDK, embeds an API URL, or carries authentication material. Concrete adapters
 * live in separate later sub-stages, never in the engine core.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  'openai',
  'anthropic',
  'gemini',
  'grok',
  'deepseek',
  'ollama',
  'claude',
  'gpt',
  'https://',
  'http://',
  'api_key',
  'apikey',
  'x-api-key',
  'authorization',
  'bearer',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no vendor knowledge (ADR-0035 invariant)', () => {
  it('the engine source names no vendor, SDK, URL, or authentication material', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
