import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The provider-neutrality invariant, enforced structurally: SEO Intelligence holds no vendor knowledge and names no
 * provider, model, client library, or SDK. It frames a provider-neutral `text-generation` need and never a vendor. This
 * guard scans every source file under `src/` and fails the build on a vendor, model, SDK, URL, or auth token.
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

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no vendor knowledge (provider neutrality)', () => {
  it('the subsystem source names no vendor, model, SDK, URL, or authentication material', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
