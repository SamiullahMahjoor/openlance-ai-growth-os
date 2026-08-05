import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0046 / ADR-0035 invariant, enforced structurally: the Evaluation Engine holds no vendor knowledge and names no
 * provider, model, client library, or SDK (the frozen evaluation model is technology-neutral). This guard scans every
 * source file under `src/` and fails the build if it names a vendor, a model, a client library or SDK, an API URL, or
 * authentication material.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  'openai',
  'anthropic',
  'gemini',
  'claude',
  'gpt',
  'grok',
  'deepseek',
  'ollama',
  'mistral',
  'llama',
  'https://',
  'http://',
  'api_key',
  'apikey',
  'x-api-key',
  'bearer',
  'sdk',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no vendor knowledge (ADR-0046 / ADR-0035 invariant)', () => {
  it('the engine source names no vendor, model, SDK, URL, or authentication material', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
