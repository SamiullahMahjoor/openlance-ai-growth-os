/**
 * Safety content hashing: a deterministic, dependency-free FNV-1a 32-bit hash of a canonical string, producing the
 * reproducible audit identifier of a safety decision. It is pure and total: the same content always yields the same
 * hash, with no randomness and no cryptographic library. It is an audit identifier, not a security primitive; it makes a
 * decision reproducible and traceable, never confidential.
 */
export class SafetyHash {
  /** The FNV-1a 32-bit hash of the content, as a zero-padded lowercase hex string. */
  hash(content: string): string {
    let value = 0x811c9dc5;
    for (let index = 0; index < content.length; index += 1) {
      value ^= content.charCodeAt(index);
      value = Math.imul(value, 0x01000193);
    }
    return (value >>> 0).toString(16).padStart(8, '0');
  }
}
