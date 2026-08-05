import { isErr, isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { SafetyPluginBridge, SafetyRuleRegistry } from '../src/index';
import type { SafetyPlugin } from '../src/index';

const manifest = { name: 'source', version: '1.0.0', apiVersion: '1.0.0' };
const plugin = (name: string, restrictedToolCapabilities: string[] = []): SafetyPlugin => ({
  manifest,
  rule: { name, restrictedToolCapabilities },
});

describe('SafetyPluginBridge (atomic adoption)', () => {
  it('adopts a batch of valid rule plugins into the registry', () => {
    const registry = new SafetyRuleRegistry();
    const adopted = new SafetyPluginBridge(registry).adopt([plugin('a'), plugin('b')]);
    expect(isOk(adopted)).toBe(true);
    if (isOk(adopted)) expect(adopted.value).toEqual(['a', 'b']);
    expect(registry.list()).toHaveLength(2);
  });

  it('rejects an invalid rule and registers nothing', () => {
    const registry = new SafetyRuleRegistry();
    const result = new SafetyPluginBridge(registry).adopt([plugin('a'), plugin('  ')]);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.code).toBe('SAFETY.BLANK_RULE_NAME');
    expect(registry.list()).toHaveLength(0);
  });

  it('rejects a duplicate within the batch atomically', () => {
    const registry = new SafetyRuleRegistry();
    const result = new SafetyPluginBridge(registry).adopt([plugin('dup'), plugin('dup')]);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.code).toBe('SAFETY.DUPLICATE_RULE');
    expect(registry.list()).toHaveLength(0);
  });

  it('rejects a duplicate of an already-registered rule', () => {
    const registry = new SafetyRuleRegistry();
    expect(isOk(new SafetyPluginBridge(registry).adopt([plugin('a')]))).toBe(true);
    const result = new SafetyPluginBridge(registry).adopt([plugin('a')]);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.code).toBe('SAFETY.DUPLICATE_RULE');
    expect(registry.list()).toHaveLength(1);
  });
});
