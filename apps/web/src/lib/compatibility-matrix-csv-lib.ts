// Pure CSV serialization for the compatibility matrix, split out of
// compatibility-matrix.tsx so the header/row/label encoding can be unit-tested
// without the DOM Blob-download plumbing.

import { csvEscape } from "@/lib/csv";
import type { MatrixClient, MatrixRow, Support } from "@/components/compatibility-matrix";

/**
 * Serialize the compatibility matrix to CSV text: a
 * `Capability,Detail,<client label>…` header followed by one row per
 * capability. Header cells (including client labels) and the capability /
 * blurb data cells are escaped via `csvEscape`; each client cell is resolved
 * to its support label with `labelFor`. The result ends with a trailing
 * newline.
 */
export function buildCompatibilityCsv(
  clients: readonly MatrixClient[],
  rows: readonly MatrixRow[],
  labelFor: (support: Support) => string,
): string {
  const header = ["Capability", "Detail", ...clients.map((c) => c.label)].map(csvEscape).join(",");
  const body = rows
    .map((r) =>
      [
        csvEscape(r.capability),
        csvEscape(r.blurb),
        ...clients.map((c) => labelFor(r.cells[c.id])),
      ].join(","),
    )
    .join("\n");
  return `${header}\n${body}\n`;
}
