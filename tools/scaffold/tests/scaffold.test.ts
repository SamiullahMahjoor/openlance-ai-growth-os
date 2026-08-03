import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const PKG_NAME = 'goldenfixture';
const pkgDir = join(repoRoot, 'packages', PKG_NAME);

const NS_NAME = 'goldennamespace';
const nsDir = join(repoRoot, 'packages', 'namespaces', NS_NAME);

const run = (command: string): void => {
  execSync(command, { cwd: repoRoot, stdio: 'pipe' });
};

afterAll(() => {
  rmSync(pkgDir, { recursive: true, force: true });
  rmSync(nsDir, { recursive: true, force: true });
});

describe('scaffold golden-file (generators)', () => {
  it('scaffolds a package that compiles, passes depcruise, and needs no manual edits', () => {
    rmSync(pkgDir, { recursive: true, force: true });

    run(
      `pnpm exec plop package ${PKG_NAME} "golden fixture" OL-AI-ARCHITECTURE-DEPENDENCY-MAP Experimental`,
    );

    for (const file of [
      'package.json',
      'tsconfig.json',
      'vitest.config.ts',
      'src/index.ts',
      'README.md',
    ]) {
      expect(existsSync(join(pkgDir, file))).toBe(true);
    }

    const manifest = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')) as {
      name: string;
      aios: { layer: string; constitution: string[]; stability: string };
    };
    expect(manifest.name).toBe(`@openlance/aios-${PKG_NAME}`);
    expect(manifest.aios.layer).toBe('substrate');
    expect(manifest.aios.constitution).toEqual(['OL-AI-ARCHITECTURE-DEPENDENCY-MAP']);
    expect(manifest.aios.stability).toBe('Experimental');

    // Compiles with no manual edits.
    expect(() => run(`pnpm exec tsc --noEmit -p packages/${PKG_NAME}/tsconfig.json`)).not.toThrow();
    // Passes the dependency graph (no cycles, no boundary or deep-import violations). Uses the
    // scaffold-local cruise config, which reuses the root rules but does not exclude the fixture.
    expect(() =>
      run(
        `pnpm exec depcruise packages/${PKG_NAME} --config tools/scaffold/tests/scaffold.dependency-cruiser.cjs`,
      ),
    ).not.toThrow();
  });

  it('reserves a namespace package with only package.json and README.md (no runtime code)', () => {
    rmSync(nsDir, { recursive: true, force: true });

    run(`pnpm exec plop namespace-package ${NS_NAME} OL-AI-RUNTIME-README`);

    // A reserved namespace is metadata only: exactly these two files, no src / tests / configs.
    expect(readdirSync(nsDir).sort()).toEqual(['README.md', 'package.json']);

    const manifest = JSON.parse(readFileSync(join(nsDir, 'package.json'), 'utf8')) as {
      name: string;
      aios: { layer: string; constitution: string[] };
    };
    expect(manifest.name).toBe(`@openlance/aios-${NS_NAME}`);
    expect(manifest.aios.layer).toBe('namespace');
    expect(manifest.aios.constitution).toEqual(['OL-AI-RUNTIME-README']);
  });
});
