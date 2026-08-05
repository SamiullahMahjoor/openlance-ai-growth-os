import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0038 `technology` boundary, enforced structurally: a retrieval is a model of determination,
 * never a search engine, embedding, vector search, semantic ranking, or algorithmic search technology
 * (ai/retrieval/retrieval-boundaries.md). The engine's discovery, selection, prioritization, and
 * validation are deterministic and structural. This guard scans every source file under `src/` and fails
 * the build if any search-technology token appears.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  'embedding',
  'vector',
  'semantic',
  'cosine',
  'neural',
  'knn',
  'tf-idf',
  'word2vec',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no search technology (ADR-0038 retrieval technology boundary)', () => {
  it('the engine source applies no search technology', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(
          text.includes(term),
          `${file} contains the forbidden search-technology token '${term}'`,
        ).toBe(false);
      }
    }
  });
});
