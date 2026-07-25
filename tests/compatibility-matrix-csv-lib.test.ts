import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import type {
  MatrixClient,
  MatrixRow,
  Support,
} from "../apps/web/src/components/compatibility-matrix";
import { buildCompatibilityCsv } from "../apps/web/src/lib/compatibility-matrix-csv-lib";
import { repoRoot } from "./helpers/registry-fixtures";

const clients: MatrixClient[] = [
  { id: "claude-code", label: "Claude Code" },
  { id: "desktop", label: "Desktop" },
];

const label = (support: Support) =>
  ({
    native: "Native",
    adapter: "Adapter",
    manual: "Manual",
    none: "Unsupported",
  })[support];

describe("buildCompatibilityCsv", () => {
  it("emits a header of Capability, Detail, then each client label", () => {
    const csv = buildCompatibilityCsv(clients, [], label);
    expect(csv.split("\n")[0]).toBe("Capability,Detail,Claude Code,Desktop");
  });

  it("resolves each client cell through labelFor", () => {
    const rows: MatrixRow[] = [
      {
        capability: "Tools",
        blurb: "Call tools",
        cells: { "claude-code": "native", desktop: "adapter" },
      },
    ];
    const csv = buildCompatibilityCsv(clients, rows, label);
    expect(csv).toBe(
      "Capability,Detail,Claude Code,Desktop\nTools,Call tools,Native,Adapter\n",
    );
  });

  it("escapes commas and quotes in capability and blurb cells", () => {
    const rows: MatrixRow[] = [
      {
        capability: 'MCP, "stdio"',
        blurb: "one, two",
        cells: { "claude-code": "manual", desktop: "none" },
      },
    ];
    const csv = buildCompatibilityCsv(clients, rows, label);
    const dataLine = csv.split("\n")[1];
    expect(dataLine).toBe('"MCP, ""stdio""","one, two",Manual,Unsupported');
  });

  it("emits one line per row and always ends with a trailing newline", () => {
    const rows: MatrixRow[] = [
      {
        capability: "A",
        blurb: "a",
        cells: { "claude-code": "native", desktop: "native" },
      },
      {
        capability: "B",
        blurb: "b",
        cells: { "claude-code": "none", desktop: "none" },
      },
    ];
    const csv = buildCompatibilityCsv(clients, rows, label);
    expect(csv.endsWith("\n")).toBe(true);
    expect(csv.trimEnd().split("\n")).toHaveLength(3); // header + 2 rows
  });

  it("produces a header-only document (with trailing newlines) for no rows", () => {
    expect(buildCompatibilityCsv(clients, [], label)).toBe(
      "Capability,Detail,Claude Code,Desktop\n\n",
    );
  });
});

describe("CompatibilityMatrix downloadCsv wiring", () => {
  // The component itself is not covered by the node test suite, so pin the CSV export
  // to the search-filtered row set at the source level: `downloadCsv` must build the
  // CSV (and report its analytics count) from `filtered`, never the unfiltered `rows`
  // prop, so the export always matches what the table currently renders (#5505).
  it("builds the CSV and analytics count from the filtered rows", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/components/compatibility-matrix.tsx"),
      "utf8",
    );
    const downloadCsvBody = source.slice(
      source.indexOf("const downloadCsv"),
      source.indexOf("return ("),
    );
    expect(downloadCsvBody).toContain(
      "buildCompatibilityCsv(clients, filtered,",
    );
    expect(downloadCsvBody).toContain(
      "onCsvDownloadClick?.(filtered.length, clients.length)",
    );
    expect(downloadCsvBody).not.toContain(
      "buildCompatibilityCsv(clients, rows,",
    );
    expect(downloadCsvBody).not.toContain("onCsvDownloadClick?.(rows.length");
  });
});
