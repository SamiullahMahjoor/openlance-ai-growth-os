# PROVIDER ADAPTER (OpenAI) FREEZE (Platform Completion, PC-2)

**Status:** COMPLETE - VALIDATED - AUDITED - FROZEN
**Package:** `@openlance/aios-provider-adapter-openai` (`apps/provider-adapter-openai`)
**ADR:** [ADR-0047](adr/0047-provider-adapters.md) · **Design:** [44-provider-adapters.md](44-provider-adapters.md)
**Milestone:** Platform Completion, item PC-2 (prerequisite to Phase 5, AI Growth OS Features). This is not Phase 5.

The first concrete provider adapter and the definition of the adapter architecture: a separate leaf package implemented against the frozen Provider Engine seam (ADR-0035), isolating all vendor knowledge so every engine stays vendor-neutral. It makes the AIOS able to call a real model without teaching any engine about a vendor.

## What it is

`createOpenAIProvider(options)` returns a frozen-seam `ProviderDescriptor` the Provider Engine's `ProviderFactory` validates into a `Provider`. Its `invoke(clearance, request)` maps a neutral text-generation request (`{ prompt }`) to the OpenAI chat-completions request body, calls the injected transport, and maps the response back to a neutral `{ text, model, id }` output. Its `probe()` reports `healthy` or `unhealthy` from a lightweight models request. `options = { transport, apiKey, model, baseUrl?, capability? }`.

## Adapter architecture (ADR-0047)

- A concrete adapter is a separate `apps/*` package implementing the frozen `ProviderDescriptor`, depending only on `@openlance/aios-provider-engine` (the seam types plus the `ProviderError` value) and `@openlance/aios-kernel`. It never depends on an engine in reverse and is an acyclic leaf.
- All vendor knowledge (vendor name, model ids, endpoint paths, authorization scheme, request and response mapping) lives only in the adapter; no engine imports it, so no engine gains vendor knowledge transitively, and the frozen Provider Engine is never modified.
- No I/O of its own: it calls an injected `Transport` seam and imports no HTTP client and no SDK, so it is deterministic under a supplied transport and performs no network call during validation.
- No embedded credential: the API key and base URL are injected as options; a `no-embedded-credential` guard test scans the source.
- Fail-closed and never throws: `invoke` returns `err(ProviderError)` on an unsupported capability, a malformed payload, a non-success status, a transport rejection or contract violation, or an unparseable body, with stable `PROVIDER.ADAPTER_*` codes.
- Governed path preserved: the adapter accepts a `GovernanceClearance` and never inspects or mints one (the minter is unexported); the Provider Engine's executor enforces the clearance before ever calling `invoke`.

## Dependency graph (leaf)

Outbound edges (2), from `dependency-graph.snapshot.json`: `{ provider-engine, kernel }`. Barrel-only, acyclic leaf: nothing depends on it, and `provider-engine` does not depend on it. The composition root (PC-3) constructs the adapter with a concrete transport and credential and registers it with the Provider Engine's manager.

## Validation

`pnpm run validate` exits 0 (42 tasks). 100% coverage (ADR-0015): 20 tests, statements/branches/functions/lines all 100%, via an injected fake transport. Benchmarks recorded (invoke, toChatBody, fromChatResponse). Guard test: `no-embedded-credential`.

## Audits

Two independent audits, both CLEAN (zero Tier 1, zero Tier 2):

- **Architecture / constitution / ownership / dependency / isolation:** confirmed exact seam conformance (ProviderFactory accepts the descriptor), all vendor knowledge isolated in the adapter, no engine imports it, no SDK / HTTP client / env read / embedded credential, the governed path preserved, the 2-edge acyclic leaf, and additive regression (Provider Engine and every Phase 4 engine plus `ai/` and `knowledge/` byte-identical).
- **Correctness / security:** confirmed never-throws / fail-closed on every failure mode with distinct codes, zero-trust mapping (no malformed vendor body throws or yields a spurious ok), correct request/response mapping and status-range logic, no credential leak in error messages, and determinism.

Three Tier-3 findings were surfaced; the actionable ones were **resolved**:

1. `invoke` read the response outside the try, asymmetric with `probe`, so a transport violating its typed contract could reject rather than fail closed. **Fixed:** the post-send handling is now inside the try, so a contract-violating transport yields `PROVIDER.ADAPTER_TRANSPORT_FAILED` and `invoke` never throws (`src/provider.ts`).
2. Test-honesty gaps (empty assistant content, and non-string id/model defaulting) not distinctly pinned. **Fixed:** added assertions pinning both.

One recorded Repository Evolution Note (non-blocking, not applied): `invoke` reads `request.capability` without a guard; the `ProviderRequest` is an engine-guaranteed contract, so this is outside the ADR-0047 zero-trust boundary (which is the vendor response body and the request payload, both fully guarded).

## Regression

`git diff phase-4-frozen HEAD -- ai/ knowledge/ apps/provider-engine` is empty; the Provider Engine and every Phase 4 engine are byte-identical. The change set is additive only: the new `apps/provider-adapter-openai/`, the design doc, ADR-0047, one ADR index row, the graph snapshot edge, and the lockfile.

## Freeze statement

The OpenAI provider adapter and the adapter architecture (PC-2) are frozen. The adapter pattern (separate leaf package, injected transport, isolated vendor knowledge, no embedded credential, clearance pass-through, permanent adapter-to-engine dependency direction) is the canonical reference for every future concrete adapter. Changing it requires a superseding ADR and full validation.
