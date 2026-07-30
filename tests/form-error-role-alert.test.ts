import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

function routeSource(file: string) {
  return fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes", file),
    "utf8",
  );
}

describe("form submission errors use Alert live regions (#5713)", () => {
  // jobs.post / submit already wrap errors in <Alert variant="destructive">
  // (role="alert" via alert.tsx). advertise + tools.submit used bare <p>
  // with no live-region semantics — pin the shared Alert wrapper at source.
  it("advertise waitlist form renders errors via Alert/AlertDescription", () => {
    const source = routeSource("advertise.tsx");
    expect(source).toContain(
      'import { Alert, AlertDescription } from "@/components/ui/alert"',
    );
    expect(source).toContain('<Alert variant="destructive">');
    expect(source).toContain("<AlertDescription>{error}</AlertDescription>");
    expect(source).not.toMatch(
      /\{error && <p className="text-sm text-trust-blocked">\{error\}<\/p>\}/,
    );
  });

  it("tools.submit listing and review forms render errors via Alert/AlertDescription", () => {
    const source = routeSource("tools.submit.tsx");
    expect(source).toContain(
      'import { Alert, AlertDescription } from "@/components/ui/alert"',
    );
    const alertBlocks = source.match(/<Alert variant="destructive">/g) ?? [];
    expect(alertBlocks.length).toBe(2);
    expect(source).not.toMatch(
      /\{error && <p className="text-sm text-trust-blocked">\{error\}<\/p>\}/,
    );
  });

  it("jobs.post remains the reference Alert pattern", () => {
    const source = routeSource("jobs.post.tsx");
    expect(source).toContain('<Alert variant="destructive">');
    expect(source).toContain("<AlertDescription>{error}</AlertDescription>");
  });
});
