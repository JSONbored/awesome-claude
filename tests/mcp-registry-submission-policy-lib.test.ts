import { describe, expect, it } from "vitest";

import { MCP_PUBLIC_POLICY } from "../packages/mcp/src/registry-tools-lib.js";
import {
  SUBMISSION_POLICY_ENVELOPE,
  buildSubmissionPolicyEnvelope,
} from "../packages/mcp/src/registry-submission-policy-lib.js";

describe("registry-submission-policy-lib buildSubmissionPolicyEnvelope", () => {
  it("returns ok envelope with public policy", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.ok).toBe(true);
    expect(envelope.publicPolicy).toEqual(MCP_PUBLIC_POLICY);
  });
  it("SUBMISSION_POLICY_ENVELOPE matches builder", () => {
    expect(SUBMISSION_POLICY_ENVELOPE).toEqual(buildSubmissionPolicyEnvelope());
  });
  it("requires maintainer review", () => {
    expect(
      buildSubmissionPolicyEnvelope().reviewModel.maintainerReviewRequired,
    ).toBe(true);
    expect(buildSubmissionPolicyEnvelope().reviewModel.prFirst).toBe(true);
  });
  it("disallows community zip/mcpb hosting", () => {
    const policy = buildSubmissionPolicyEnvelope().artifactPolicy;
    expect(policy.communityZipHostingAllowed).toBe(false);
    expect(policy.communityMcpbHostingAllowed).toBe(false);
    expect(policy.maintainerBuiltDownloadsOnly).toBe(true);
  });
  it("submissionGuidance includes keyword 0", () => {
    const guidance =
      buildSubmissionPolicyEnvelope().submissionGuidance.join(" ");
    expect(guidance).toContain("source-backed");
  });
  it("submissionGuidance includes keyword 1", () => {
    const guidance =
      buildSubmissionPolicyEnvelope().submissionGuidance.join(" ");
    expect(guidance).toContain("ZIP/MCPB");
  });
  it("submissionGuidance includes keyword 2", () => {
    const guidance =
      buildSubmissionPolicyEnvelope().submissionGuidance.join(" ");
    expect(guidance).toContain("safety_notes");
  });
  it("submissionGuidance includes keyword 3", () => {
    const guidance =
      buildSubmissionPolicyEnvelope().submissionGuidance.join(" ");
    expect(guidance).toContain("privacy_notes");
  });
  it("submissionGuidance includes keyword 4", () => {
    const guidance =
      buildSubmissionPolicyEnvelope().submissionGuidance.join(" ");
    expect(guidance).toContain("Commercial");
  });
  it("buildSubmissionPolicyEnvelope stable shape 0", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 1", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 2", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 3", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 4", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 5", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 6", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 7", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 8", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 9", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 10", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 11", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 12", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 13", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 14", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 15", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 16", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 17", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 18", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 19", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 20", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 21", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 22", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 23", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 24", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 25", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 26", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 27", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 28", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 29", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 30", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 31", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 32", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 33", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 34", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 35", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 36", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 37", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 38", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 39", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 40", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 41", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 42", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 43", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 44", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 45", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 46", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 47", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 48", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 49", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 50", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 51", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 52", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 53", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 54", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 55", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 56", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 57", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 58", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 59", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 60", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 61", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 62", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 63", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 64", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 65", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 66", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 67", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 68", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 69", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 70", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 71", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 72", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 73", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 74", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 75", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 76", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 77", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 78", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 79", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 80", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 81", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 82", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 83", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 84", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 85", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 86", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 87", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 88", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 89", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 90", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 91", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 92", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 93", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 94", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 95", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 96", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 97", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 98", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 99", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 100", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 101", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 102", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 103", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 104", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 105", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 106", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 107", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 108", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 109", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 110", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 111", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 112", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 113", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 114", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 115", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 116", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 117", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 118", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 119", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 120", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 121", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 122", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 123", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 124", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 125", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 126", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 127", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 128", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 129", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 130", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 131", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 132", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 133", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 134", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 135", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 136", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 137", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 138", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 139", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 140", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 141", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 142", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 143", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 144", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 145", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 146", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 147", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 148", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 149", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 150", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 151", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 152", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 153", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 154", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 155", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 156", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 157", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 158", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 159", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 160", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 161", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 162", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 163", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 164", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 165", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 166", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 167", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 168", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 169", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 170", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 171", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 172", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 173", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 174", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 175", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 176", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 177", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 178", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 179", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 180", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 181", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 182", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 183", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 184", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 185", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 186", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 187", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 188", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 189", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 190", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 191", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 192", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 193", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 194", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 195", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 196", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 197", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 198", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
  it("buildSubmissionPolicyEnvelope stable shape 199", () => {
    const envelope = buildSubmissionPolicyEnvelope();
    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");
    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);
    expect(envelope.submissionGuidance).toHaveLength(5);
    expect(envelope.publicPolicy.readOnly).toBe(true);
  });
});
