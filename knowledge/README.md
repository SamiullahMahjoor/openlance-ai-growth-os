---
title: Knowledge Repository Constitution
id: knowledge-readme
document: knowledge/README.md
document_type: normative
authority: Process
version: 1.0
status: Frozen
owner: Knowledge Architect
reviewed_by: Independent AI Architecture Reviewer
provenance: Executive Decision
last_updated: 2026-08-02
depends_on: []
used_by:
  - All human contributors
  - All AI contributors
loading_priority: Critical
---

# Knowledge Repository Constitution

This document governs the knowledge repository located at `knowledge/`. It defines how knowledge is organized, written, reviewed, versioned, referenced, and consumed by AI agents and human contributors.

It is a meta-document. It describes the knowledge system itself, not the organization the knowledge is about. Every other document in this repository is subordinate to the rules defined here. When any document conflicts with this constitution on a matter of structure, process, or governance, this constitution prevails.

The rules below are intended to be timeless. They should hold as the repository grows from a handful of documents to hundreds, and from one agent to many, without changing the underlying architecture.

# Purpose

The knowledge repository exists to be the single source of truth for every AI agent and human contributor in the system. Any durable fact, rule, or decision that agents rely on lives here, in exactly one authoritative place.

Agents must not depend on model memory, prompt-embedded text, or assumptions for durable knowledge. They depend on this repository. Prompts are transient and task-specific; the repository is durable and shared. Prompts point to the repository; the repository never depends on prompts.

The purpose of this design is to guarantee that every agent, regardless of its task, department, or underlying model, reasons from the same consistent, verified, and current knowledge. It exists to prevent drift, duplication, contradiction, and invented facts.

# Repository Philosophy

The repository is built on a small set of principles. Every document and every contribution should reflect them.

- One source of truth. Each fact is defined in exactly one document. That document is the authority for that fact.
- No duplicated knowledge. Knowledge is never copied between documents. Documents reference one another instead.
- Timeless knowledge over temporary information. Durable truth is captured in stable documents. Fast-changing or operational information lives in narrowly scoped documents that are expected to change, and is kept out of foundational documents.
- Modular documentation. Knowledge is split into small documents with a single responsibility each, rather than large documents that mix concerns.
- AI-first documentation. Documents are written to be parsed, loaded, and reasoned over by agents: declarative, unambiguous, and consistently structured.
- Human-readable and AI-readable. Plain Markdown, clear headings, and precise language serve both audiences at once. Nothing is encoded in a form only one audience can use.
- Repository before prompts. Knowledge belongs in the repository, not inside prompts. Prompts and agents load knowledge from here; they do not embed their own copies of it.

# Folder Structure

The repository is organized into top-level folders. Each folder has exactly one clearly defined responsibility. A document belongs to exactly one folder, chosen by its primary responsibility. When a document could fit in more than one place, it is placed by its single primary responsibility. Folder choice organizes documents; it never determines authority.

- `knowledge/company/`: Who the organization is. Identity, vision, mission, principles, and company-level governance. This folder contains many of the most foundational documents, but a document's authority is determined exclusively by its `authority` metadata field, not by its folder location.
- `knowledge/product/`: What the organization offers. The product model, capabilities, pricing, and commercial policies. Reference documents for anything the organization sells or delivers.
- `knowledge/brand/`: How the organization presents itself. Voice, tone, naming, verbal and visual identity, and messaging standards.
- `knowledge/customers/`: Who the organization serves. Audience segments, their needs and behaviors, and the language they use.
- `knowledge/competitors/`: The competitive landscape. Comparable offerings, their positioning, and factual points of differentiation.
- `knowledge/marketing/`: How the organization grows. Strategy, channels, campaigns, and content standards. The documents here are typically more operational and change faster than foundational documents.
- `knowledge/legal/`: The rules the organization must follow. Compliance requirements, terms, disclosures, and constraints that bound what other documents may say or do.
- `knowledge/processes/`: How repeatable work is done. Operating standards and procedures for agents and contributors.

New top-level folders may be added over time, but only when they represent a genuinely new single responsibility that no existing folder owns. Adding a folder follows the same one-responsibility rule.

# Knowledge Hierarchy

Documents are not equal in authority. Authority flows from the most durable, foundational knowledge down to the most operational and disposable.

```
Company
   |
Vision
   |
Mission
   |
Principles
   |
Legal
   |
Policies
   |
Processes
   |
Campaigns
   |
Outputs
```

- Company. The organization's identity and reason for existing.
- Vision. The long-term destination the organization is steering toward.
- Mission. The enduring purpose and the approach to achieving it.
- Principles. The non-negotiable rules and values that constrain every decision.
- Legal. The binding legal and regulatory constraints the organization must operate within. Legal sits above the operational layers: legal constraints override policies, processes, campaigns, and outputs. Where any operational document conflicts with a legal constraint, the legal constraint prevails.
- Policies. Standing decisions and rules derived from principles.
- Processes. How policies are carried out in repeatable ways.
- Campaigns. Time-bound initiatives that operate within processes.
- Outputs. The concrete artifacts produced, such as content, assets, and recommendations.

Higher levels change least and govern most. Lower levels change more often and govern nothing above them. Lower-level documents must never contradict higher-level documents. When a lower document is created or updated, it must be checked for consistency against every level above it. If a contradiction exists, the higher level is correct and the lower document must be corrected.

A document's authority is set by its `authority` metadata field, never by the folder it lives in. Folders organize documents by responsibility; the `authority` field places a document in this hierarchy and is what governs conflict resolution. Two documents in the same folder may hold different authority levels, and the same authority level may appear across different folders. When documents conflict, agents compare their declared `authority` levels, not their locations.

# Document Lifecycle

Every document moves through a defined lifecycle. A document is only authoritative once it has been frozen.

```
Draft
   |
Critical Review
   |
Targeted Fixes
   |
Freeze v1.0
   |
Versioned Updates (only when necessary)
```

- Draft. The document is created and grounded in verified sources. It may be incomplete. It is explicitly not authoritative, and agents should not rely on it for decisions yet.
- Critical Review. The draft is reviewed adversarially for accuracy, clarity, correct scope, consistency with higher-authority documents, and whether it can drive consistent agent decisions. Unknowns and weaknesses are surfaced here.
- Targeted Fixes. Only the specific corrections identified in review are applied. The document is not rewritten. Approved content is preserved.
- Freeze v1.0. The document becomes authoritative and stable. Agents may rely on it. Any further change now requires the versioning process rather than casual editing.
- Versioned Updates. After freezing, the document changes only when necessary, through the same review discipline, with a version increment and updated metadata.

# Document Standards

Every knowledge document must meet these standards.

- One responsibility per document. A document covers a single subject and does not mix concerns.
- No duplicated information. If a fact is owned by another document, reference it rather than restating it.
- Use canonical repository paths. All references to other documents use full repository paths.
- Use Markdown headings. Structure is expressed with a clear, consistent heading hierarchy.
- AI-friendly language. Declarative, unambiguous, and consistent. Terms are defined once and reused with the same meaning.
- Avoid marketing fluff. Say what is true and useful, not what is persuasive.
- Avoid assumptions. Do not assert what has not been established.
- Never invent facts. Unknown information is marked as requiring confirmation, never filled in by guessing.
- Cross-reference instead of copying. Linking preserves the single source of truth; copying destroys it.

# Metadata Standard

Every knowledge document carries structured metadata at its top, expressed as YAML front matter. Metadata is data about the document. It never contains the knowledge itself; it exists so agents can discover documents, resolve authority, track dependencies, and decide what to load.

Every document should describe the following metadata:

- title. A human-readable name for the document.
- id. A globally unique, immutable identifier for the document. It is assigned once, when the document is created, and never changes, even if the document is later renamed, moved to a different folder, or re-versioned. References and dependencies may be expressed against this identifier so they survive reorganization. No two documents share an id, and an id is never reused after a document is retired.
- document. The canonical repository path to the document itself, so it is self-identifying wherever it is loaded.
- document_type. Exactly one of `normative` or `reference`. A normative document sets rules, decisions, or constraints that other work must obey, such as vision, mission, principles, legal constraints, policies, and processes. A reference document records facts about the world, such as customers, competitors, product details, and market information. Agents treat the two differently: normative documents are subject to the authority hierarchy and can override or be overridden in a conflict, while reference documents are judged by correctness and provenance, not authority, and are never used to override a normative rule. Applying authority precedence to a reference document, or treating a normative rule as a mere fact, is an error.
- authority. Exactly one authority level from the Knowledge Hierarchy: Company, Vision, Mission, Principles, Legal, Policy, Process, Campaign, Output, or Reference. Every knowledge document must declare exactly one authority level. This field, not the document's folder, determines the document's authority in conflict resolution. Reference documents declare the Reference level, which carries no precedence over normative documents.
- version. The current version, expressed as a major and minor number.
- status. The lifecycle state, such as Draft, In Review, Frozen, or Deprecated.
- owner. The single role accountable for the document's accuracy and review.
- provenance. The authoritative source of the document's content. A reference (factual) document must identify where its facts come from, so any claim can be traced back to its source and verified rather than trusted blindly. A normative document records the source of the decision it encodes, which may be an authority such as "Founder" or "Executive Decision." Provenance is what makes the standard "never invent facts" verifiable.
- reviewed_by. Who performed the critical review that qualified the document to be frozen.
- last_updated. The date of the most recent change.
- depends_on. The higher-authority or prerequisite documents this document must remain consistent with.
- used_by. The agent roles or departments that consume this document.
- loading priority. How agents should prioritize loading the document, using the tiers defined in the AI Loading Strategy. This may be optional and may vary by consuming role.

A document may add fields when a genuine need arises, but it should never move knowledge into metadata or omit the fields above.

# Cross-Reference Rules

Documents reference one another; they never copy one another. A reference names the owning document, and the reader consults that document for the current content.

- Use canonical repository paths. Every reference points to a full path from the repository root, such as `knowledge/company/vision.md`.
- Avoid relative links. Do not reference documents by relative path or by fragile markdown links.
- Reference, do not duplicate. When another document owns a fact, link to it. Restating the fact creates a second source of truth that will eventually drift.

Canonical paths are required because a document may be read, loaded, reordered, or concatenated in many contexts and by many different agents and models. A relative link assumes a fixed location and breaks when that assumption fails. A canonical path always resolves to the same target regardless of where or how the referencing document is used.

Forward references to documents that are planned but not yet created are permitted and intentional. They express the planned architecture of the knowledge system. Such references still use canonical paths and are not to be removed simply because the target does not exist yet.

# Versioning Policy

- When documents may change. A frozen document changes only through the versioning process: when the durable truth it describes genuinely changes, or when a defect such as an inaccuracy, ambiguity, or contradiction is found. Every change goes through review and updates the document's metadata.
- What qualifies as a major update. A change to the meaning, authority, or scope of a document, or to any higher-level truth that other documents depend on, is a major update. It requires re-review, a major version increment, and consistency checks for every document that depends on it.
- What qualifies as a minor update. A clarification, correction, or addition that does not change meaning, authority, or scope is a minor update.
- What should never trigger a version change. Operational churn, temporary data, campaign specifics, metrics, and any other fast-changing information must never force a change to a foundational document. If such information is repeatedly causing version changes, it is stored in the wrong place and belongs in a lower or more specialized document.

# AI Loading Strategy

Agents do not load the entire repository for every task. They load what a task requires, always including the higher-authority documents that govern it. Each document declares a loading tier in its metadata, and that tier may differ by consuming role.

- Critical. Foundational, highest-authority documents that shape all reasoning. Loaded before any strategic work.
- Required. Documents necessary for the specific task or domain at hand.
- Optional. Documents that improve quality but are not strictly necessary. Loaded when capacity allows.
- Contextual. Documents loaded only when the situation triggers them, such as a specific topic, department, or edge case.

Agents load from the top of the hierarchy downward and never act on a lower-level document without the higher-level documents that govern it. When durable knowledge is needed, agents prefer loading the canonical source over relying on memory or prompt-embedded text. This section defines intent only. It does not prescribe a specific loading algorithm, ordering implementation, or capacity budget.

# Governance

- Ownership. Every document has a single accountable owner role, declared in its metadata. The repository as a whole is stewarded by a designated human authority. Ownership means accountability for accuracy, review, and lifecycle, not exclusive authorship.
- Conflict resolution. When two documents conflict, the higher-authority document in the Knowledge Hierarchy prevails and the lower document is corrected. Between documents of equal authority, the more specific and more recently reviewed document is preferred. If a conflict still cannot be resolved with confidence, it is escalated to the owner or a human authority.
- Obsolete knowledge. Superseded knowledge is marked Deprecated in its status and points to the document that replaces it. It is not silently deleted, and it is fully removed only after every dependent document has been updated. The repository must never carry two live documents that contradict each other.
- Agent behavior when information conflicts. An agent that detects a contradiction must not guess or silently choose. It resolves the conflict using the hierarchy. If the conflict cannot be resolved confidently, the agent halts and escalates to a human rather than acting on ambiguous knowledge. Agents never invent facts to fill a gap; missing knowledge is flagged as requiring confirmation.

# Future Expansion

The architecture is designed to scale without being redesigned. Growth is always additive and follows the same rules.

- Hundreds of documents. Strict one-responsibility modularity and canonical paths let the repository grow by adding small documents and folders rather than by enlarging existing ones.
- Dozens of agents. Metadata such as used_by and loading tiers lets any agent discover and load exactly the documents it needs, without coordination with other agents.
- Multiple departments. Top-level folders with single responsibilities absorb new departments as new folders under the same structure.
- Multiple AI models. Model-agnostic, plain-Markdown, canonical-path documentation ties nothing to a specific model, prompt format, or runtime, so new models consume the same knowledge unchanged.

The hierarchy, lifecycle, standards, metadata, cross-reference rules, and governance defined here remain constant as the repository grows. If a proposed change would require altering these rules rather than adding to the repository within them, it must be treated as a change to this constitution and reviewed as such, not worked around.

# Future Architecture Roadmap

The following capabilities are deliberately out of scope for the current architecture. They are recorded here as future evolution points, to be designed and adopted only through a reviewed change to this constitution, never improvised. Listing them keeps the present architecture simple and prevents them from being silently reinvented.

- Namespaces. A scheme for qualifying identifiers and paths so that multiple repositories or knowledge domains can coexist without collision.
- Knowledge graph. Typed relationships between documents, such as supersedes, references, constrains, or contradicts, beyond the current dependency links.
- Repository indexing. A generated catalog or manifest that lets agents enumerate and discover documents without scanning the whole tree.
- Multi-tenancy. Separation of shared framework knowledge from organization-specific knowledge, so one architecture can serve multiple organizations.
- Dependency versioning. Pinning references to specific versions of the documents they depend on, so a downstream document can detect when an upstream document has changed in meaning.
- Repository health. Systematic integrity checks, such as detecting orphaned documents, broken references, cyclic dependencies, and stale content.
- Role manifests. A reverse index mapping each agent role to the exact set of documents it must load for a given task.

Until each capability is adopted through this constitution, agents and contributors operate within the architecture defined above and must not assume these capabilities exist.
