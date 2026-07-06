/**
 * Pure MCP submission policy envelope.
 *
 * Static maintainer review and artifact policy live here. Runtime handlers
 * stay in `registry.js`.
 */
import { MCP_PUBLIC_POLICY } from "./registry-tools-lib.js";

/**
 * Build the submission.policy tool envelope.
 *
 * @returns {{
 *   ok: true,
 *   publicPolicy: typeof MCP_PUBLIC_POLICY,
 *   reviewModel: Record<string, unknown>,
 *   artifactPolicy: Record<string, unknown>,
 *   submissionGuidance: string[],
 * }}
 */
export function buildSubmissionPolicyEnvelope() {
  return {
    ok: true,
    publicPolicy: MCP_PUBLIC_POLICY,
    reviewModel: {
      prFirst: true,
      maintainerReviewRequired: true,
      autoMerge: "content_only_private_gate",
      autoMergeRequires: [
        "single content file only",
        "validate-content",
        "Superagent Security Scan",
        "private maintainer-agent review",
      ],
      mutatingAutomationOwner: "private submission gate",
    },
    artifactPolicy: {
      communityHostedArchivesAllowed: false,
      communityZipHostingAllowed: false,
      communityMcpbHostingAllowed: false,
      maintainerBuiltDownloadsOnly: true,
      firstPartyDownloadsRequireVerification: true,
    },
    submissionGuidance: [
      "Use source-backed or copyable-content submissions for community content.",
      "Do not request public HeyClaude /downloads hosting for community ZIP/MCPB artifacts.",
      "Add safety_notes when a submission runs code, writes externally, uses permissions, or starts background workers.",
      "Add privacy_notes when a submission reads local files, logs, credentials, telemetry, or third-party user data.",
      "Commercial, affiliate, sponsored, or paid product listings go through maintainer review and disclosure, not the free content queue.",
    ],
  };
}

export const SUBMISSION_POLICY_ENVELOPE = buildSubmissionPolicyEnvelope();
