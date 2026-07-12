// Pure SQL helpers behind scripts/sync-votes-to-d1.mjs: quoting a string as a
// SQL literal and building the chunked `entry_key NOT IN (...)` predicate used to
// prune vote rows whose content entry no longer exists. Split out so the
// quoting and chunking can be unit-tested without a wrangler/D1 connection.

/** Quote a value as a single-quoted SQL string literal, escaping embedded quotes. */
export function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

/**
 * Build a WHERE predicate matching rows whose entry_key is NOT in the expected
 * key set. Keys are sorted for deterministic output and split into chunks of 200
 * so no single `IN (...)` list grows unbounded; the chunk predicates are ANDed
 * together. Throws on an empty set to avoid accidentally pruning every row.
 */
export function expectedKeyExclusionPredicate(keys) {
  const chunkSize = 200;
  const sortedKeys = [...keys].sort();
  if (sortedKeys.length === 0) {
    throw new Error(
      "Refusing to build prune predicate for empty content key set",
    );
  }

  const clauses = [];
  for (let index = 0; index < sortedKeys.length; index += chunkSize) {
    const inList = sortedKeys
      .slice(index, index + chunkSize)
      .map(sqlString)
      .join(", ");
    clauses.push(`entry_key NOT IN (${inList})`);
  }
  return clauses.join(" AND ");
}
