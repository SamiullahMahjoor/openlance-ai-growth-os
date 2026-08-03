/**
 * Permission governance (ai/governance/permission-governance.md,
 * OL-AI-GOVERNANCE-PERMISSION-GOVERNANCE).
 *
 * The named permission principles and mandates, as immutable rule definitions (ADR-0020). Unlike the
 * risk and autonomy dimensions, permission governance defines no classification and no executable
 * relationship the governance layer owns: its rules constrain "authority" (owned by the constitution
 * root, ai/README.md) and grants and specific permissions (owned by the Agents namespace,
 * ai/agents/). Per the Stage 3 boundary rule (ADR-0020, ADR-0025), this module exposes immutable
 * definitions ONLY - no grant, authority, delegation, or scope model, no schema, no predicate, and
 * no runtime logic. The runtime enforces these rules later; governance states them.
 */

/** A permission principle (ai/governance/permission-governance.md, "Principles"). */
export type PermissionPrinciple =
  'least-privilege' | 'granted-not-assumed' | 'delegated-not-invented' | 'bounded' | 'accountable';

/** The five permission principles, in constitutional order; frozen. */
export const PERMISSION_PRINCIPLES: readonly PermissionPrinciple[] = Object.freeze([
  'least-privilege',
  'granted-not-assumed',
  'delegated-not-invented',
  'bounded',
  'accountable',
]);

/** The statement each permission principle instantiates (ai/governance/permission-governance.md). */
export const PERMISSION_PRINCIPLE_DESCRIPTIONS: Readonly<Record<PermissionPrinciple, string>> =
  Object.freeze({
    'least-privilege': 'An agent holds the minimum authority its role requires, and no more.',
    'granted-not-assumed':
      'An agent acts only on authority it has been granted, never on authority it has not.',
    'delegated-not-invented':
      "Delegated authority flows from an accountable human and never exceeds the delegator's authority.",
    bounded:
      'No permission grants authority above the granting authority, and none crosses the AI or cross-layer boundary.',
    accountable: 'Every grant of authority traces to an accountable human owner.',
  });

/** A permission mandate (ai/governance/permission-governance.md, "Mandates"). */
export type PermissionMandate =
  | 'minimum-necessary'
  | 'explicit-grant'
  | 'bounded-delegation'
  | 'no-privilege-escalation'
  | 'boundary-respecting'
  | 'accountable-ownership'
  | 'revocable';

/**
 * The seven permission mandates, in constitutional order; frozen. Every mandate is absolute and
 * applies to every grant.
 */
export const PERMISSION_MANDATES: readonly PermissionMandate[] = Object.freeze([
  'minimum-necessary',
  'explicit-grant',
  'bounded-delegation',
  'no-privilege-escalation',
  'boundary-respecting',
  'accountable-ownership',
  'revocable',
]);

/** The rule each permission mandate states (ai/governance/permission-governance.md). */
export const PERMISSION_MANDATE_DESCRIPTIONS: Readonly<Record<PermissionMandate, string>> =
  Object.freeze({
    'minimum-necessary':
      'An agent is granted only the authority its role genuinely requires; unused authority is not granted.',
    'explicit-grant':
      'An agent exercises only authority explicitly granted; absence of a grant is a denial, not a default permission.',
    'bounded-delegation':
      "Delegated authority never exceeds the delegator's, and a delegate may not delegate authority it does not hold.",
    'no-privilege-escalation':
      "No permission, delegation, or runtime action raises an agent's authority above what an accountable human granted, and authority cannot be bypassed.",
    'boundary-respecting':
      'No permission grants the ability to own or write business truth, change ownership of a concern, or act outside the AI boundary.',
    'accountable-ownership':
      'Every grant of authority has an accountable human owner and is changed only through governed change.',
    revocable:
      'Any grant of authority can be withdrawn by an accountable human at any time, and the agent complies.',
  });
