/**
 * Plop generators for the OpenLance AIOS monorepo (Developer Tooling, subsystem 09).
 *
 * `package`           scaffolds a standard substrate package skeleton.
 * `namespace-package` reserves a constitutional namespace package (metadata only, no src).
 *
 * Generated packages carry the mandatory metadata: the constitution traceability
 * field, stability class (Rule 4), and public-barrel layout (Rule 1). Templates
 * live under tools/scaffold/templates.
 */
module.exports = function plopConfig(plop) {
  plop.setHelper('jsonArray', (value) =>
    JSON.stringify(
      String(value || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );

  plop.setGenerator('package', {
    description: 'Create a new substrate package under packages/',
    prompts: [
      { type: 'input', name: 'name', message: 'Package short name (for example: kernel):' },
      { type: 'input', name: 'description', message: 'One-line description:' },
      {
        type: 'input',
        name: 'constitution',
        message: 'Constitution doc ids realized (comma-separated), or blank:',
      },
      {
        type: 'list',
        name: 'stability',
        message: 'Stability classification (Rule 4):',
        choices: ['Experimental', 'Low', 'Medium', 'High', 'Very High'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/package.json',
        templateFile: 'tools/scaffold/templates/package/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/tsconfig.json',
        templateFile: 'tools/scaffold/templates/package/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/tsconfig.build.json',
        templateFile: 'tools/scaffold/templates/package/tsconfig.build.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/vitest.config.ts',
        templateFile: 'tools/scaffold/templates/package/vitest.config.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/index.ts',
        templateFile: 'tools/scaffold/templates/package/src/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/{{kebabCase name}}.ts',
        templateFile: 'tools/scaffold/templates/package/src/module.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/tests/{{kebabCase name}}.test.ts',
        templateFile: 'tools/scaffold/templates/package/tests/module.test.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/benchmarks/{{kebabCase name}}.bench.ts',
        templateFile: 'tools/scaffold/templates/package/benchmarks/module.bench.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/benchmarks/baseline.md',
        templateFile: 'tools/scaffold/templates/package/benchmarks/baseline.md.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/README.md',
        templateFile: 'tools/scaffold/templates/package/README.md.hbs',
      },
    ],
  });

  plop.setGenerator('namespace-package', {
    description: 'Reserve a constitutional namespace package (metadata only, no source)',
    prompts: [
      { type: 'input', name: 'name', message: 'Namespace short name (for example: runtime):' },
      { type: 'input', name: 'constitution', message: 'Constitution doc ids (comma-separated):' },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/namespaces/{{kebabCase name}}/package.json',
        templateFile: 'tools/scaffold/templates/namespace/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/namespaces/{{kebabCase name}}/README.md',
        templateFile: 'tools/scaffold/templates/namespace/README.md.hbs',
      },
    ],
  });
};
