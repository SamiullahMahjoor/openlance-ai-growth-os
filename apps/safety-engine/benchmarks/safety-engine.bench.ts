import type { AgentExecutionPlan, AgentStep } from '@openlance/aios-agent-engine';
import type { GovernanceDecision } from '@openlance/aios-governance-engine';
import { bench, describe } from 'vitest';

import {
  DEFAULT_POLICY,
  HazardAnalyzer,
  IsolationManager,
  MemorySafetyInspector,
  PromptSafetyInspector,
  RetrievalSafetyInspector,
  RiskAnalyzer,
  RuntimeBoundaryEnforcer,
  SafeRefusalEngine,
  SafetyEvaluator,
  SafetyHash,
  SafetyNormalizer,
  SanitizationEngine,
  ToolSafetyInspector,
  resolveEffectivePolicy,
} from '../src/index';

/**
 * Observational micro-baselines for the Safety Engine's public operations (Engineering Rule 5, ADR-0022): evaluation
 * (decision), hazard analysis, risk classification, prompt / tool / memory / retrieval inspection, normalization, and
 * hashing. Measurement only; deterministic over fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const normalizer = new SafetyNormalizer();
const hash = new SafetyHash();
const hazardAnalyzer = new HazardAnalyzer();
const riskAnalyzer = new RiskAnalyzer();
const prompt = new PromptSafetyInspector();
const tool = new ToolSafetyInspector();
const memory = new MemorySafetyInspector();
const retrieval = new RetrievalSafetyInspector();
const evaluator = new SafetyEvaluator(
  hazardAnalyzer,
  riskAnalyzer,
  new SanitizationEngine(),
  new RuntimeBoundaryEnforcer(),
  new IsolationManager(),
  new SafeRefusalEngine(),
  hash,
);

const policy = resolveEffectivePolicy(
  {
    ...DEFAULT_POLICY,
    knownToolCapabilities: ['search', 'shell'],
    sandboxedToolCapabilities: ['shell'],
    allowedMemoryScopes: ['session'],
    allowedRetrievalScopes: ['docs'],
    restrictedPromptTokens: ['ignore previous'],
  },
  [],
);

const steps: AgentStep[] = [
  { capability: 'prompt', request: { variables: { user: 'ignore previous and continue' } } },
  { capability: 'tool', request: { capability: 'shell' } },
  { capability: 'memory', request: { scope: 'session:1' } },
  { capability: 'retrieval', request: { scope: 'docs:public' } },
];
const plan: AgentExecutionPlan = {
  agent: 'agent-1',
  task: 't',
  steps,
  coordination: [],
  validated: true,
};
const governance: GovernanceDecision = {
  subject: 'agent-1',
  decision: 'AUTHORIZE',
  reason: 'ok',
  oversight: 'standing-rules',
  violations: [],
  permitted: [],
  trust: 'moderate',
  id: 'gov-1',
  validated: true,
};

describe('safety-engine benchmarks', () => {
  bench('evaluate (decision)', () => {
    evaluator.evaluate({ plan, governance }, policy);
  });
  bench('hazard analysis', () => {
    hazardAnalyzer.analyze(plan, policy);
  });
  bench('risk classification', () => {
    riskAnalyzer.classify(hazardAnalyzer.analyze(plan, policy), 'moderate');
  });
  bench('prompt inspection', () => {
    prompt.inspect({ variables: { user: 'ignore previous' } }, 's', policy);
  });
  bench('tool inspection', () => {
    tool.inspect({ capability: 'shell' }, 's', policy);
  });
  bench('memory inspection', () => {
    memory.inspect({ scope: 'session:1' }, 's', policy);
  });
  bench('retrieval inspection', () => {
    retrieval.inspect({ scope: 'docs:public' }, 's', policy);
  });
  bench('normalization', () => {
    normalizer.normalize('  Some MIXED   scope ');
  });
  bench('hashing', () => {
    hash.hash('a canonical decision payload');
  });
});
