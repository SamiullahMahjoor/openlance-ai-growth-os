import { bench, describe } from 'vitest';

import {
  AutonomyEvaluator,
  ConstitutionalValidator,
  GovernanceEvaluator,
  GovernanceFactory,
  GovernanceHash,
  GovernanceNormalizer,
  GovernanceRegistry,
  OversightEvaluator,
  PermissionEvaluator,
} from '../src/index';

/**
 * Observational micro-baselines for the Governance Enforcement Engine's public operations (Engineering Rule 5,
 * ADR-0022): registration, evaluation (decision), permission, constitutional validation, normalization, and hashing.
 * Measurement only; deterministic over fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const factory = new GovernanceFactory();
const permission = new PermissionEvaluator();
const constitutional = new ConstitutionalValidator();
const normalizer = new GovernanceNormalizer();
const hash = new GovernanceHash();
const evaluator = new GovernanceEvaluator(
  permission,
  constitutional,
  new AutonomyEvaluator(),
  new OversightEvaluator(),
  hash,
);

const built = factory.create({ subject: 'a', permissions: ['reasoning'], autonomy: 'governed' });
const grant = built.ok ? built.value : undefined;
const registry = new GovernanceRegistry();
if (grant) registry.register(grant);
const plan = Object.freeze({
  agent: 'a',
  task: 't',
  steps: [{ capability: 'reasoning', request: {} }],
  coordination: [],
  validated: true,
});
const request = { plan, trust: 'low' };

describe('governance-engine', () => {
  bench('registration', () => {
    const g = factory.create({ subject: 'a', permissions: ['reasoning'], autonomy: 'governed' });
    if (g.ok) new GovernanceRegistry().register(g.value);
  });
  bench('evaluation', () => {
    evaluator.evaluate(request, registry, false);
  });
  bench('permission', () => {
    if (grant) permission.evaluate(grant, plan);
  });
  bench('constitutional-validation', () => {
    constitutional.isValidated(plan);
  });
  bench('normalization', () => {
    normalizer.normalize('  a   subject  ');
  });
  bench('hashing', () => {
    hash.hash('a|AUTHORIZE|low|standing-rules||reasoning');
  });
});
