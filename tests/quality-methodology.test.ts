import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function readRepoFile(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function qualityRouteIds(source: string) {
  return new Set(
    [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
  );
}

function trustDocAnchors(source: string) {
  return new Set(
    [...source.matchAll(/docHref:\s*"\/quality#([^"]+)"/g)].map(
      (match) => match[1],
    ),
  );
}

describe("quality methodology page", () => {
  const qualitySource = readRepoFile("apps/web/src/routes/quality.tsx");

  it("defines every /quality anchor used by entry trust drilldowns", () => {
    const ids = qualityRouteIds(qualitySource);
    const anchors = trustDocAnchors(
      readRepoFile("apps/web/src/lib/trust-lib.ts"),
    );

    expect(anchors.size).toBeGreaterThan(0);
    for (const anchor of anchors) {
      expect(ids, anchor).toContain(anchor);
    }
  });

  it("keeps trust methodology citable without overclaiming security guarantees", () => {
    expect(qualitySource).toContain('id="methodology"');
    expect(qualitySource).toContain('id="source-provenance"');
    expect(qualitySource).toContain('id="integrity"');
    expect(qualitySource).toContain("not malware scans");
    expect(qualitySource).toContain("not a code audit");
    expect(qualitySource).toContain("not a guarantee");
    expect(qualitySource).toContain(
      "Community PRs cannot mark packages as verified",
    );
  });

  it("links entry trust and citation surfaces to the methodology anchors", () => {
    const trustDrilldownSource = readRepoFile(
      "apps/web/src/components/trust-drilldown.tsx",
    );
    const trustDrilldownDestinations = readRepoFile(
      "apps/web/src/lib/trust-drilldown-cta-events-lib.ts",
    );
    const sourceCitationsDestinations = readRepoFile(
      "apps/web/src/lib/source-citations-cta-events-lib.ts",
    );
    const registryFeedSource = readRepoFile(
      "apps/web/src/routes/api/registry/feed.ts",
    );

    expect(trustDrilldownDestinations).toContain('hash: "methodology"');
    expect(trustDrilldownDestinations).not.toContain('hash: "preflight"');
    expect(trustDrilldownSource).toContain(
      "trustDrilldownMethodologyDestination",
    );
    expect(sourceCitationsDestinations).toContain('hash: "source-provenance"');
    expect(registryFeedSource).toContain(
      'const QUALITY_METHODOLOGY_PATH = "/quality#methodology";',
    );
    expect(
      registryFeedSource.match(
        /qualityMethodology:\s*QUALITY_METHODOLOGY_PATH/g,
      ),
    ).toHaveLength(2);
  });
});
