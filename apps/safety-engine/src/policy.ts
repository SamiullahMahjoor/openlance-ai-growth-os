import type { SafetyOutcome } from './types.js';
import type { SafetyPolicy } from './configuration.js';
import { SafetyNormalizer } from './normalizer.js';
import type { SafetyRule } from './types.js';

/**
 * The resolved, normalized effective policy the evaluation runs against: the base policy merged with every registered
 * rule. Allowlists come only from the base policy (a rule never widens what is allowed); denylist overlays are the union
 * of the base policy and all rules (a rule only ever adds protection). Every entry is normalized so matching is
 * deterministic and case-insensitive.
 */
export interface EffectivePolicy {
  readonly knownToolCapabilities: readonly string[];
  readonly sandboxedToolCapabilities: readonly string[];
  readonly restrictedToolCapabilities: readonly string[];
  readonly dangerousToolCombinations: readonly (readonly string[])[];
  readonly restrictedPromptTokens: readonly string[];
  readonly allowedMemoryScopes: readonly string[];
  readonly restrictedMemoryScopes: readonly string[];
  readonly allowedRetrievalScopes: readonly string[];
  readonly restrictedRetrievalScopes: readonly string[];
  readonly restrictedStepCapabilities: readonly string[];
  readonly maxSteps: number;
  readonly maxCoordinationLinks: number;
  readonly maxContextReferences: number;
}

const normalizer = new SafetyNormalizer();

const normalizeAll = (values: readonly string[]): string[] => {
  const seen = new Set<string>();
  for (const value of values) {
    seen.add(normalizer.normalize(value));
  }
  return [...seen].sort();
};

/** Resolve the base policy and the registered rules into one normalized effective policy (denylists are unioned). */
export const resolveEffectivePolicy = (
  policy: SafetyPolicy,
  rules: readonly SafetyRule[],
): EffectivePolicy => {
  const restrictedTools = [...policy.restrictedToolCapabilities];
  const sandboxedTools = [...policy.sandboxedToolCapabilities];
  const combinations = [...policy.dangerousToolCombinations];
  const promptTokens = [...policy.restrictedPromptTokens];
  const restrictedMemory = [...policy.restrictedMemoryScopes];
  const restrictedRetrieval = [...policy.restrictedRetrievalScopes];
  for (const rule of rules) {
    restrictedTools.push(...rule.restrictedToolCapabilities);
    sandboxedTools.push(...rule.sandboxedToolCapabilities);
    combinations.push(...rule.dangerousToolCombinations);
    promptTokens.push(...rule.restrictedPromptTokens);
    restrictedMemory.push(...rule.restrictedMemoryScopes);
    restrictedRetrieval.push(...rule.restrictedRetrievalScopes);
  }
  return Object.freeze({
    knownToolCapabilities: normalizeAll(policy.knownToolCapabilities),
    sandboxedToolCapabilities: normalizeAll(sandboxedTools),
    restrictedToolCapabilities: normalizeAll(restrictedTools),
    dangerousToolCombinations: Object.freeze(
      combinations.map((combination) => Object.freeze(normalizeAll(combination))),
    ),
    restrictedPromptTokens: normalizeAll(promptTokens),
    allowedMemoryScopes: normalizeAll(policy.allowedMemoryScopes),
    restrictedMemoryScopes: normalizeAll(restrictedMemory),
    allowedRetrievalScopes: normalizeAll(policy.allowedRetrievalScopes),
    restrictedRetrievalScopes: normalizeAll(restrictedRetrieval),
    restrictedStepCapabilities: normalizeAll(policy.restrictedStepCapabilities),
    maxSteps: policy.maxSteps,
    maxCoordinationLinks: policy.maxCoordinationLinks,
    maxContextReferences: policy.maxContextReferences,
  });
};

/**
 * Whether a normalized `scope` matches any of the `prefixes` under the ':' scope hierarchy convention: a scope matches a
 * prefix when it equals the prefix or is a descendant of it (`prefix` followed by ':'). The boundary is explicit, so a
 * prefix never over-matches an unrelated sibling scope.
 */
export const scopeMatches = (scope: string, prefixes: readonly string[]): boolean => {
  for (const prefix of prefixes) {
    if (scope === prefix || scope.startsWith(`${prefix}:`)) {
      return true;
    }
  }
  return false;
};

/**
 * The protection rank of each safety outcome, from least protective (`SAFE`) to strongest (`UNSAFE`). Defense in depth
 * combines protections by taking the strongest, so protection is never lowered.
 */
export const PROTECTION_RANK: Readonly<Record<SafetyOutcome, number>> = Object.freeze({
  SAFE: 0,
  SANITIZE: 1,
  RESTRICT: 2,
  DEGRADE: 3,
  ESCALATE: 4,
  REFUSE: 5,
  UNSAFE: 6,
});

/** The stronger of two outcomes (defense in depth: protection never lowers). */
export const strongest = (left: SafetyOutcome, right: SafetyOutcome): SafetyOutcome =>
  PROTECTION_RANK[right] > PROTECTION_RANK[left] ? right : left;

/** Whether an outcome still executes (a reduced or protected execution), as opposed to a non-executing stop. */
export const isExecuting = (outcome: SafetyOutcome): boolean =>
  PROTECTION_RANK[outcome] <= PROTECTION_RANK.DEGRADE;
