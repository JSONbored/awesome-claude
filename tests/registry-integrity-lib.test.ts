import { describe, expect, it } from "vitest";

import {
  determineIntegrityStatus,
  normalizeArtifact,
  type ArtifactContract,
} from "../apps/web/src/lib/registry-integrity-lib";

describe("normalizeArtifact", () => {
  it("decodes %2f, strips leading slashes and a data/ prefix", () => {
    expect(normalizeArtifact("data/agents%2Findex.json")).toBe(
      "agents/index.json",
    );
    expect(normalizeArtifact("///data/x.json")).toBe("x.json");
    expect(normalizeArtifact("agents/index.json")).toBe("agents/index.json");
  });
});

describe("determineIntegrityStatus", () => {
  const contract: ArtifactContract = {
    name: "agents",
    path: "data/agents/index.json",
    type: "json",
    sha256: "abc",
  };

  it("is 'snapshot' when no artifact is requested", () => {
    expect(determineIntegrityStatus("", null, "abc")).toBe("snapshot");
  });

  it("is 'unknown' when the artifact is not in the manifest", () => {
    expect(determineIntegrityStatus("agents", null, "abc")).toBe("unknown");
  });

  it("is 'match' / 'mismatch' by hash equality", () => {
    expect(determineIntegrityStatus("agents", contract, "abc")).toBe("match");
    expect(determineIntegrityStatus("agents", contract, "zzz")).toBe(
      "mismatch",
    );
  });
});
