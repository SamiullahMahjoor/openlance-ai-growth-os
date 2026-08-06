import { isErr, isOk } from '@openlance/aios-kernel';
import { OpenLanceGrowthWorkflows } from '@openlance/aios-openlance-growth-workflows';
import { describe, expect, it } from 'vitest';

import {
  AUTOMATION_AGENT,
  AUTOMATION_CAPABILITIES,
  AutomationFramer,
  AutomationHash,
  AutomationIntelligence,
  AutomationNormalizer,
  automationEvaluationRequest,
  automationRequestFromWorkflow,
  isAutomationCapability,
} from '../src/index';
import type { AutomationPlan, AutomationRequest } from '../src/index';

const request = (over: Partial<AutomationRequest> = {}): AutomationRequest => ({
  capability: 'workflow-automation-planning',
  objective: 'automate the freelancer onboarding workflow',
  agent: 'automation-intelligence',
  workflow: 'growth-workflow-1',
  knowledge: ['knowledge/processes/onboarding.md'],
  ...over,
});

const plan = (): AutomationPlan => {
  const result = new AutomationFramer(new AutomationHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

const growthWorkflow = () => {
  const framed = new OpenLanceGrowthWorkflows().plan({
    type: 'freelancer-acquisition',
    objective: 'grow supply',
    agent: 'openlance-growth-workflows',
    marketing: 'marketing-brief-1',
    content: 'content-plan-1',
    seo: 'seo-plan-1',
    social: 'social-plan-1',
    analytics: 'analytics-plan-1',
    campaign: 'campaign-plan-1',
  });
  if (!isOk(framed)) throw new Error('expected growth workflow ok');
  return framed.value;
};

describe('AutomationIntelligence.plan / AutomationFramer', () => {
  it('frames a governed automation AgentRequest grounded in the growth workflow and knowledge', () => {
    const result = new AutomationIntelligence().plan(request());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.capability).toBe('workflow-automation-planning');
    expect(value.workflow).toBe('growth-workflow-1');
    expect(value.knowledge).toEqual(['knowledge/processes/onboarding.md']);
    expect(value.deliverable).toBe(
      "automation workflow-automation-planning deliverable for 'automate the freelancer onboarding workflow'",
    );
    expect(value.request.agent).toBe('automation-intelligence');
    expect(value.request.task).toBe(
      'workflow-automation-planning: automate the freelancer onboarding workflow',
    );
    expect(value.request.steps.map((step) => step.capability)).toEqual(['prompt', 'provider']);
    expect(value.request.steps[0]?.request).toEqual({
      variables: {
        objective: 'automate the freelancer onboarding workflow',
        automationTask: 'workflow-automation-planning',
      },
      contextReferences: ['growth-workflow-1', 'knowledge/processes/onboarding.md'],
    });
    expect(value.request.steps[1]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('accepts a request with no extra knowledge references', () => {
    const result = new AutomationFramer(new AutomationHash()).frame(
      request({ knowledge: undefined }),
    );
    expect(isOk(result) && result.value.knowledge).toEqual([]);
    if (isOk(result))
      expect(result.value.request.steps[0]?.request).toEqual({
        variables: {
          objective: 'automate the freelancer onboarding workflow',
          automationTask: 'workflow-automation-planning',
        },
        contextReferences: ['growth-workflow-1'],
      });
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new AutomationFramer(new AutomationHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('produces a different id when the workflow reference changes', () => {
    const framer = new AutomationFramer(new AutomationHash());
    const a = framer.frame(request());
    const b = framer.frame(request({ workflow: 'growth-workflow-2' }));
    expect(isOk(a) && isOk(b) && a.value.id !== b.value.id).toBe(true);
  });

  it('fails closed on an unknown capability', () => {
    expect(
      codeOf(
        new AutomationIntelligence().plan(request({ capability: 'campaign-planning' as never })),
      ),
    ).toBe('AUTOMATION.UNKNOWN_CAPABILITY');
    expect(codeOf(new AutomationIntelligence().plan(request({ capability: 5 as never })))).toBe(
      'AUTOMATION.UNKNOWN_CAPABILITY',
    );
  });

  it('fails closed on a blank objective, agent, or workflow reference', () => {
    expect(codeOf(new AutomationIntelligence().plan(request({ objective: '  ' })))).toBe(
      'AUTOMATION.BLANK_OBJECTIVE',
    );
    expect(codeOf(new AutomationIntelligence().plan(request({ agent: '' })))).toBe(
      'AUTOMATION.BLANK_AGENT',
    );
    expect(codeOf(new AutomationIntelligence().plan(request({ workflow: '   ' })))).toBe(
      'AUTOMATION.MISSING_WORKFLOW',
    );
  });

  it('fails closed on a non-canonical, bare, non-document, or traversal knowledge reference', () => {
    for (const knowledge of [
      ['not/canonical'],
      [''] as string[],
      [123] as never,
      ['knowledge/processes/'],
      ['knowledge/processes/onboarding'],
      ['knowledge/../secret.md'],
      ['knowledge/./x.md'],
    ]) {
      expect(codeOf(new AutomationIntelligence().plan(request({ knowledge })))).toBe(
        'AUTOMATION.INVALID_REFERENCE',
      );
    }
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new AutomationFramer(new AutomationHash());
    const refs = [
      'knowledge/processes/onboarding.md',
      'knowledge/product/workflows.md',
      'knowledge/company/vision.md',
    ];
    const a = framer.frame(request({ knowledge: refs }));
    const b = framer.frame(request({ knowledge: [...refs].reverse() }));
    const c = framer.frame(
      request({ knowledge: [refs[2], refs[0], refs[1], refs[2]] as string[] }),
    );
    expect(isOk(a) && isOk(b) && isOk(c)).toBe(true);
    if (isOk(a) && isOk(b) && isOk(c)) {
      expect(a.value.id).toBe(b.value.id);
      expect(a.value.id).toBe(c.value.id);
    }
  });

  it('never throws on a structurally malformed request and fails closed', () => {
    const result = new AutomationIntelligence().plan({
      capability: undefined,
      objective: undefined,
      agent: undefined,
      workflow: undefined,
    } as unknown as AutomationRequest);
    expect(isErr(result)).toBe(true);
  });

  it('never throws on a null request and fails closed, and deduplicates knowledge references', () => {
    expect(isErr(new AutomationIntelligence().plan(null as never))).toBe(true);
    const deduped = new AutomationFramer(new AutomationHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });

  it('produces an immutable, frozen plan', () => {
    const value = plan();
    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(value.request)).toBe(true);
    expect(Object.isFrozen(value.request.steps)).toBe(true);
  });
});

describe('Growth Workflows to Automation integration', () => {
  it('builds an automation request from a Growth Workflows output, referencing the workflow id', () => {
    const workflow = growthWorkflow();
    const automationRequest = automationRequestFromWorkflow(workflow, {
      capability: 'automation-opportunity-analysis',
      objective: 'find automatable steps',
      agent: 'automation-intelligence',
      knowledge: ['knowledge/product/workflows.md'],
    });
    expect(automationRequest.workflow).toBe(workflow.id);
    const result = new AutomationIntelligence().plan(automationRequest);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.workflow).toBe(workflow.id);
      expect(result.value.request.steps[0]?.request).toMatchObject({
        contextReferences: [workflow.id, 'knowledge/product/workflows.md'],
      });
    }
  });

  it('omits knowledge when the workflow framing supplies none', () => {
    const automationRequest = automationRequestFromWorkflow(growthWorkflow(), {
      capability: 'automation-roadmap-planning',
      objective: 'sequence the opportunities',
      agent: 'automation-intelligence',
    });
    expect(automationRequest.knowledge).toBeUndefined();
  });
});

describe('AutomationIntelligence facade', () => {
  it('counts framed and rejected requests, exposes the agent, and frames an automation-quality evaluation', () => {
    const engine = new AutomationIntelligence();
    engine.plan(request());
    engine.plan(request({ capability: 'campaign-planning' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
    expect(engine.agentDefinition()).toBe(AUTOMATION_AGENT);
    const evaluation = engine.evaluationRequest(plan(), [
      { metric: 'grounding', value: 0.9, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`automation:${plan().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: plan().id });
  });

  it('exposes a frozen statistics snapshot', () => {
    expect(Object.isFrozen(new AutomationIntelligence().statistics())).toBe(true);
  });
});

describe('helpers', () => {
  it('recognizes known automation capabilities only, and not any planner or workflow identifier', () => {
    expect(isAutomationCapability('workflow-automation-planning')).toBe(true);
    expect(isAutomationCapability('automation-evaluation')).toBe(true);
    expect(AUTOMATION_CAPABILITIES).toContain('trigger-recommendation');
    // Foreign identifiers (planner capabilities / workflow types) are NOT automation capabilities.
    for (const foreign of [
      'campaign-planning',
      'campaign-orchestration-planning',
      'kpi-planning',
      'positioning',
      'freelancer-acquisition',
      'conversion-optimization',
    ]) {
      expect(isAutomationCapability(foreign)).toBe(false);
    }
  });

  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new AutomationNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(42)).toBe('');
  });

  it('the automation agent composes prompt and provider', () => {
    expect(AUTOMATION_AGENT.specialization).toBe('automation-intelligence');
    expect(AUTOMATION_AGENT.capabilities).toEqual(['prompt', 'provider']);
    expect(AUTOMATION_AGENT.permissions).toEqual(['prompt', 'provider']);
  });

  it('automationEvaluationRequest frames the subject as the automation output', () => {
    const evaluation = automationEvaluationRequest(plan(), []);
    expect(evaluation.subject.kind).toBe('agent');
    expect(Object.isFrozen(evaluation)).toBe(true);
  });
});

function codeOf(result: ReturnType<AutomationIntelligence['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
