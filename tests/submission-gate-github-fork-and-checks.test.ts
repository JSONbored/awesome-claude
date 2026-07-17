import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createUserForkContentPr,
  getCommitValidationState,
} from "../apps/submission-gate/src/github";

type MockResponse = {
  status?: number;
  body?: unknown;
  text?: string;
  headers?: Record<string, string>;
};

function mockFetchQueue(responses: MockResponse[]) {
  const queue = [...responses];
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const next = queue.shift();
      if (!next) throw new Error(`Unexpected fetch call: ${String(input)}`);
      calls.push({ url: String(input), init });
      const body =
        next.text ?? (next.body === undefined ? "" : JSON.stringify(next.body));
      return new Response(body, {
        status: next.status ?? 200,
        headers: next.headers,
      });
    },
  );
  vi.stubGlobal("fetch", fetchMock);
  return { calls, fetchMock };
}

const repo = { owner: "JSONbored", repo: "awesome-claude" };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("submission-gate getCommitValidationState newest-run selection", () => {
  it("picks the newest of two trusted runs via the completed/updated/started fallback chain", async () => {
    mockFetchQueue([
      {
        body: {
          check_runs: [
            {
              name: "validate-web",
              status: "completed",
              conclusion: "success",
              app: { slug: "github-actions" },
              started_at: "2026-01-01T00:00:00Z",
              // No completed_at or updated_at: falls back to started_at.
            },
            {
              name: "validate-web",
              status: "completed",
              conclusion: "failure",
              app: { slug: "github-actions" },
              updated_at: "2026-01-02T00:00:00Z",
              // No completed_at: falls back to updated_at, which is newer.
            },
          ],
        },
      },
    ]);

    await expect(
      getCommitValidationState({
        token: "ghs",
        repo,
        ref: "abc123",
        requiredChecks: ["validate-web"],
      }),
    ).resolves.toMatchObject({
      state: "failed",
      checks: [
        {
          name: "validate-web",
          status: "failed",
          details: "concluded failure",
        },
      ],
    });
  });

  it("treats a run with no usable timestamp as older than one with a valid timestamp", async () => {
    mockFetchQueue([
      {
        body: {
          check_runs: [
            {
              name: "validate-web",
              status: "completed",
              conclusion: "failure",
              app: { slug: "github-actions" },
              // No timestamps at all: Date.parse("") is NaN, so this must
              // not incorrectly win the "newest" comparison.
            },
            {
              name: "validate-web",
              status: "completed",
              conclusion: "success",
              app: { slug: "github-actions" },
              completed_at: "2026-01-01T00:00:00Z",
            },
          ],
        },
      },
    ]);

    await expect(
      getCommitValidationState({
        token: "ghs",
        repo,
        ref: "abc123",
        requiredChecks: ["validate-web"],
      }),
    ).resolves.toMatchObject({
      state: "passed",
      checks: [{ name: "validate-web", status: "passed" }],
    });
  });
});

describe("submission-gate createUserForkContentPr existing-state branches", () => {
  const baseParams = {
    userToken: "ghu",
    publicRepo: "JSONbored/awesome-claude",
    baseRef: "main",
    branchName: "heyclaude/submit-mcp-demo",
    targetPath: "content/mcp/demo.mdx",
    content: "---\ntitle: Demo\n---\n",
    title: "docs(content): add demo MCP server",
    body: "Source-backed submission.",
  };

  it("returns the existing open PR without creating a new branch or PR", async () => {
    const { calls } = mockFetchQueue([
      { body: { login: "octo" } },
      {
        body: {
          full_name: "octo/awesome-claude",
          name: "awesome-claude",
          default_branch: "main",
        },
      },
      {
        body: {
          full_name: "octo/awesome-claude",
          name: "awesome-claude",
          default_branch: "main",
        },
      },
      {
        body: [
          {
            number: 99,
            html_url: "https://github.com/JSONbored/awesome-claude/pull/99",
          },
        ],
      },
    ]);

    await expect(createUserForkContentPr(baseParams)).resolves.toEqual({
      githubLogin: "octo",
      forkFullName: "octo/awesome-claude",
      pullRequestUrl: "https://github.com/JSONbored/awesome-claude/pull/99",
      pullRequestNumber: 99,
    });

    // Nothing beyond the existing-PR lookup should have been called: no file
    // write and no new pull request creation.
    expect(calls).toHaveLength(4);
    expect(calls.some((call) => call.init?.method === "PUT")).toBe(false);
    expect(
      calls.some(
        (call) => call.init?.method === "POST" && call.url.endsWith("/pulls"),
      ),
    ).toBe(false);
  });

  it("force-updates an existing branch ref instead of creating a new one", async () => {
    const { calls } = mockFetchQueue([
      { body: { login: "octo" } },
      {
        body: {
          full_name: "octo/awesome-claude",
          name: "awesome-claude",
          default_branch: "main",
        },
      },
      {
        body: {
          full_name: "octo/awesome-claude",
          name: "awesome-claude",
          default_branch: "main",
        },
      },
      { body: [] },
      { body: { object: { sha: "base-sha" } } },
      { body: { ref: "refs/heads/heyclaude/submit-mcp-demo" } }, // existing branch found
      {}, // PATCH ref
      { status: 404, body: { message: "file missing" } }, // existing file lookup
      {}, // PUT file content
      {
        body: {
          number: 100,
          html_url: "https://github.com/JSONbored/awesome-claude/pull/100",
        },
      },
    ]);

    await expect(createUserForkContentPr(baseParams)).resolves.toMatchObject({
      pullRequestNumber: 100,
    });

    const refCalls = calls.filter((call) =>
      call.url.includes("/git/refs/heads/heyclaude/submit-mcp-demo"),
    );
    expect(refCalls).toHaveLength(1);
    expect(refCalls[0].init?.method).toBe("PATCH");
    expect(JSON.parse(String(refCalls[0].init?.body))).toMatchObject({
      sha: "base-sha",
      force: true,
    });
  });
});
