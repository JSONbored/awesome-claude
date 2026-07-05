import { describe, expect, it } from "vitest";

import {
  SUBMISSION_RISK_SCHEMA_VERSION,
  analyzeDirectContentRisk,
} from "@heyclaude/registry/submission-risk";

describe("registry submission-risk re-export", () => {
  it("re-exports schema version from submission-risk-lib", () => {
    expect(SUBMISSION_RISK_SCHEMA_VERSION).toBe(1);
  });

  it("re-exports analyzeDirectContentRisk through the public registry surface", () => {
    const report = analyzeDirectContentRisk({ files: [] });
    expect(report.schemaVersion).toBe(1);
    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "no_content_mdx_files",
    );
  });
});
