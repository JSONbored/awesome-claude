import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GitHubApiError,
  addLabels,
  approvePullRequest,
  closeIssueOrPullRequest,
  createGitHubAppJwt,
  createUserForkContentPr,
  exchangeGitHubUserCode,
  getCommitValidationState,
  getInstallationToken,
  getPullRequest,
  getRepositoryBlobText,
  getRepositoryFileContent,
  getRepositoryInstallationId,
  getRepositoryTree,
  githubJson,
  githubRetryDelaySeconds,
  isGitHubRateLimitError,
  listIssueLabels,
  listOpenPullRequests,
  listPullRequestFiles,
  listPullRequestsForCommit,
  mergePullRequest,
  parseRepo,
  removeLabels,
  upsertMarkerComment,
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

describe("submission gate GitHub client", () => {
  it("parses repositories and GitHub API errors with retry metadata", async () => {
    expect(parseRepo(" JSONbored/awesome-claude ")).toEqual(repo);
    expect(() => parseRepo("bad")).toThrow("Expected owner/repo");

    const { calls } = mockFetchQueue([
      { body: { ok: true } },
      { text: "not-json" },
      {
        status: 403,
        body: { message: "rate limit exceeded" },
        headers: {
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": "1767225600",
          "retry-after": "120",
        },
      },
    ]);

    await expect(
      githubJson<{ ok: boolean }>("https://api.github.com/test", {
        token: "ghs",
      }),
    ).resolves.toEqual({ ok: true });
    expect(calls[0].init?.headers).toBeInstanceOf(Headers);
    expect((calls[0].init?.headers as Headers).get("authorization")).toBe(
      "Bearer ghs",
    );
    await expect(githubJson("https://api.github.com/bad-json")).rejects.toThrow(
      "GitHub API returned invalid JSON",
    );
    await expect(
      githubJson("https://api.github.com/rate-limited"),
    ).rejects.toMatchObject({
      status: 403,
      rateLimitRemaining: 0,
      retryAfterSeconds: 120,
    });

    const error = new GitHubApiError(403, "rate limit exceeded", {
      rateLimitRemaining: 0,
      retryAfterSeconds: 10,
    });
    expect(isGitHubRateLimitError(error)).toBe(true);
    expect(githubRetryDelaySeconds(error, 60)).toBe(60);
  });

  it("exercises OAuth exchange and GitHub app token wrapper branches", async () => {
    await expect(
      createGitHubAppJwt({
        appId: "123",
        privateKeyPem: [
          "-----BEGIN RSA ",
          "PRIVATE KEY-----\nQUJD\n-----END RSA ",
          "PRIVATE KEY-----",
        ].join(""),
      }),
    ).rejects.toThrow("PKCS#8 PEM block");
    await expect(
      createGitHubAppJwt({
        appId: "123",
        privateKeyPem: "not a pem block",
      }),
    ).rejects.toThrow("PKCS#8 PEM block");

    const importKey = vi
      .spyOn(crypto.subtle, "importKey")
      .mockResolvedValue({} as CryptoKey);
    const sign = vi
      .spyOn(crypto.subtle, "sign")
      .mockResolvedValue(Uint8Array.from([1, 2, 3]).buffer);
    const privateKeyPem = [
      "-----BEGIN ",
      "PRIVATE KEY-----\nQUJD\n-----END ",
      "PRIVATE KEY-----",
    ].join("");

    await expect(
      createGitHubAppJwt({
        appId: "123",
        privateKeyPem,
        now: Date.parse("2026-01-01T00:00:00Z"),
      }),
    ).resolves.toMatch(/^[^.]+\.[^.]+\.[^.]+$/);
    expect(importKey).toHaveBeenCalledWith(
      "pkcs8",
      expect.any(ArrayBuffer),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    expect(sign).toHaveBeenCalled();

    const { calls } = mockFetchQueue([
      { body: { access_token: "user-token" } },
      { status: 400, text: "oauth exploded" },
      { body: { token: "installation-token" } },
      { body: { id: 42 } },
    ]);

    await expect(
      exchangeGitHubUserCode({
        clientId: "client",
        clientSecret: "secret",
        code: "code",
        callbackUrl: "https://example.com/callback",
      }),
    ).resolves.toBe("user-token");
    await expect(
      exchangeGitHubUserCode({
        clientId: "client",
        clientSecret: "secret",
        code: "bad",
        callbackUrl: "https://example.com/callback",
      }),
    ).rejects.toThrow("oauth exploded");
    await expect(
      getInstallationToken({
        appId: "123",
        privateKeyPem,
        installationId: 99,
      }),
    ).resolves.toBe("installation-token");
    await expect(
      getRepositoryInstallationId({
        appId: "123",
        privateKeyPem,
        repo,
      }),
    ).resolves.toBe(42);

    expect(calls[0].url).toBe("https://github.com/login/oauth/access_token");
    expect(JSON.parse(String(calls[0].init?.body))).toMatchObject({
      client_id: "client",
      redirect_uri: "https://example.com/callback",
    });
    expect(calls[2].url).toContain("/app/installations/99/access_tokens");
    expect(calls[3].url).toContain(
      "/repos/JSONbored/awesome-claude/installation",
    );
  });

  it("classifies required check-runs and status contexts", async () => {
    mockFetchQueue([
      {
        body: {
          check_runs: [
            {
              name: "validate-web",
              status: "completed",
              conclusion: "success",
              completed_at: "2026-01-02T00:00:00Z",
            },
            {
              name: "Superagent Security Scan",
              status: "completed",
              conclusion: "neutral",
              completed_at: "2026-01-02T00:00:00Z",
            },
            {
              name: "coverage",
              status: "completed",
              conclusion: "failure",
              completed_at: "2026-01-02T00:00:00Z",
            },
          ],
        },
      },
      {
        body: {
          statuses: [
            {
              context: "Gittensory Gate",
              state: "success",
              updated_at: "2026-01-02T00:00:00Z",
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
        requiredChecks: [
          "validate-web",
          "Superagent Security Scan",
          "coverage",
        ],
        requiredStatusContexts: ["Gittensory Gate", "missing-context"],
      }),
    ).resolves.toMatchObject({
      state: "failed",
      checks: expect.arrayContaining([
        expect.objectContaining({ name: "validate-web", status: "passed" }),
        expect.objectContaining({
          name: "Superagent Security Scan",
          status: "failed",
          details: "concluded neutral",
        }),
        expect.objectContaining({
          name: "coverage",
          status: "failed",
          details: "concluded failure",
        }),
        expect.objectContaining({ name: "Gittensory Gate", status: "passed" }),
        expect.objectContaining({ name: "missing-context", status: "missing" }),
      ]),
    });

    mockFetchQueue([
      {
        body: {
          check_runs: [
            {
              name: "validate-content",
              status: "in_progress",
              started_at: "2026-01-02T00:00:00Z",
            },
          ],
        },
      },
    ]);
    await expect(
      getCommitValidationState({
        token: "ghs",
        repo,
        ref: "def456",
        requiredChecks: ["validate-content", "missing-check"],
      }),
    ).resolves.toMatchObject({
      state: "pending",
      checks: expect.arrayContaining([
        expect.objectContaining({
          name: "validate-content",
          status: "pending",
        }),
        expect.objectContaining({ name: "missing-check", status: "missing" }),
      ]),
    });
  });

  it("paginates pull request files and validates repository content payloads", async () => {
    const firstPage = Array.from({ length: 100 }, (_, index) => ({
      filename: `content/mcp/page-${index}.mdx`,
    }));
    const { calls } = mockFetchQueue([
      { body: firstPage },
      { body: [{ filename: "content/mcp/final.mdx" }] },
      {
        body: {
          tree: [{ path: "content/mcp/final.mdx", type: "blob", sha: "sha" }],
          truncated: false,
        },
      },
      { body: { tree: [], truncated: true } },
      { body: { type: "dir", encoding: "base64", content: "" } },
      { body: { encoding: "utf-8", content: "hello" } },
    ]);

    await expect(
      listPullRequestFiles({ token: "ghs", repo, number: 1 }),
    ).resolves.toHaveLength(101);
    await expect(
      getRepositoryTree({
        token: "ghs",
        repo,
        ref: "feature branch",
        recursive: true,
      }),
    ).resolves.toMatchObject({
      tree: [{ path: "content/mcp/final.mdx" }],
    });
    await expect(
      getRepositoryTree({ token: "ghs", repo, ref: "main" }),
    ).resolves.toMatchObject({ truncated: true });
    await expect(
      getRepositoryFileContent({
        token: "ghs",
        repo,
        path: "content/mcp/not a file.mdx",
        ref: "main",
      }),
    ).rejects.toThrow("base64 file blob");
    await expect(
      getRepositoryBlobText({ token: "ghs", repo, sha: "blob-sha" }),
    ).rejects.toThrow("base64 content");

    expect(calls[1].url).toContain("page=2");
    expect(calls[2].url).toContain("feature%20branch?recursive=1");
    expect(calls[3].url).not.toContain("?recursive=1");
    expect(calls[4].url).toContain("content/mcp/not%20a%20file.mdx");
  });

  it("wraps repository content, PR, label, review, and merge endpoints", async () => {
    const encoded = btoa("hello");
    const { calls } = mockFetchQueue([
      { body: { number: 1, title: "PR" } },
      { body: [{ name: "docs" }] },
      { body: { type: "file", encoding: "base64", content: encoded } },
      { body: { encoding: "base64", content: encoded } },
      { body: [{ number: 1 }] },
      { body: [{ number: 2 }] },
      { status: 422, body: { message: "already exists" } },
      { body: { ok: true } },
      { body: { ok: true } },
      { status: 404, body: { message: "not found" } },
      { body: { ok: true } },
      { body: { id: 10, html_url: "https://github.com/comment" } },
      { body: { sha: "merge-sha", merged: true } },
    ]);

    await expect(
      getPullRequest({ token: "ghs", repo, number: 1 }),
    ).resolves.toMatchObject({
      number: 1,
    });
    await expect(
      listIssueLabels({ token: "ghs", repo, issueNumber: 1 }),
    ).resolves.toEqual([{ name: "docs" }]);
    await expect(
      getRepositoryFileContent({
        token: "ghs",
        repo,
        path: "content/mcp/demo.mdx",
        ref: "main",
      }),
    ).resolves.toBe("hello");
    await expect(
      getRepositoryBlobText({ token: "ghs", repo, sha: "blob-sha" }),
    ).resolves.toBe("hello");
    await expect(
      listPullRequestsForCommit({ token: "ghs", repo, sha: "abc" }),
    ).resolves.toEqual([{ number: 1 }]);
    await expect(
      listOpenPullRequests({ token: "ghs", repo, baseRef: "main" }),
    ).resolves.toEqual([{ number: 2 }]);
    await addLabels({
      token: "ghs",
      repo,
      issueNumber: 1,
      labels: ["submission-manual-review"],
    });
    await removeLabels({
      token: "ghs",
      repo,
      issueNumber: 1,
      labels: ["missing-label"],
    });
    await closeIssueOrPullRequest({ token: "ghs", repo, issueNumber: 1 });
    await expect(
      approvePullRequest({
        token: "ghs",
        repo,
        number: 1,
        body: "Looks good.",
      }),
    ).resolves.toMatchObject({ id: 10 });
    await expect(
      mergePullRequest({
        token: "ghs",
        repo,
        number: 1,
        expectedHeadSha: "abc",
        commitTitle: "fix(content): accept submission",
        commitMessage: "Accept the source-backed submission.",
      }),
    ).resolves.toMatchObject({ merged: true });
    expect(
      calls.some((call) =>
        call.url.includes("/labels/submission-manual-review"),
      ),
    ).toBe(true);
    expect(calls.some((call) => call.url.includes("/pulls/1/merge"))).toBe(
      true,
    );
  });

  it("updates the latest bot marker comment and supersedes older bot comments", async () => {
    const { calls } = mockFetchQueue([
      {
        body: [
          {
            id: 1,
            body: "<!-- gate --> old",
            html_url: "https://github.com/comment/1",
            user: { type: "Bot" },
          },
          {
            id: 2,
            body: "<!-- gate --> newest",
            html_url: "https://github.com/comment/2",
            user: { type: "Bot" },
          },
          {
            id: 3,
            body: "<!-- gate --> human",
            user: { type: "User" },
          },
        ],
      },
      {
        body: {
          id: 2,
          html_url: "https://github.com/comment/2",
          user: { type: "Bot" },
        },
      },
      { body: { id: 1, html_url: "https://github.com/comment/1" } },
    ]);

    await expect(
      upsertMarkerComment({
        token: "ghs",
        repo,
        issueNumber: 1,
        marker: "<!-- gate -->",
        body: "<!-- gate --> updated",
      }),
    ).resolves.toEqual({
      id: 2,
      url: "https://github.com/comment/2",
      supersededIds: [1],
    });
    expect(calls[1].url).toContain("/issues/comments/2");
    expect(calls[1].init?.method).toBe("PATCH");
    expect(calls[2].url).toContain("/issues/comments/1");
  });

  it("handles unmanaged labels, non-404 label removal failures, and new marker comments", async () => {
    const { calls } = mockFetchQueue([
      { body: { ok: true } },
      { status: 500, body: { message: "label delete failed" } },
      { body: [] },
      { body: { id: 11 } },
    ]);

    await addLabels({
      token: "ghs",
      repo,
      issueNumber: 1,
      labels: ["custom-label"],
    });
    await expect(
      removeLabels({
        token: "ghs",
        repo,
        issueNumber: 1,
        labels: ["custom-label"],
      }),
    ).rejects.toMatchObject({ status: 500 });
    await expect(
      upsertMarkerComment({
        token: "ghs",
        repo,
        issueNumber: 1,
        marker: "<!-- gate -->",
        body: "<!-- gate --> first",
      }),
    ).resolves.toEqual({
      id: 11,
      url: "",
      supersededIds: [],
    });

    expect(calls[0].url).toContain("/issues/1/labels");
    expect(calls[0].url).not.toContain(
      "/repos/JSONbored/awesome-claude/labels",
    );
    expect(calls[1].init?.method).toBe("DELETE");
    expect(calls[3].init?.method).toBe("POST");
    expect(calls[3].url).toContain("/issues/1/comments");
  });

  it("creates a user-fork content PR when no matching PR or branch exists", async () => {
    const { calls } = mockFetchQueue([
      { body: { login: "octo" } },
      { status: 422, body: { message: "fork already exists" } },
      {
        body: {
          full_name: "octo/awesome-claude",
          name: "awesome-claude",
          default_branch: "main",
        },
      },
      { body: [] },
      { status: 404, body: { message: "missing fork base branch" } },
      { status: 404, body: { message: "merge upstream unsupported" } },
      { body: { object: { sha: "base-sha" } } },
      { status: 404, body: { message: "branch missing" } },
      { body: { ref: "refs/heads/heyclaude/submit-mcp-demo" } },
      { status: 404, body: { message: "file missing" } },
      { body: { content: { sha: "file-sha" } } },
      {
        body: {
          number: 77,
          html_url: "https://github.com/JSONbored/awesome-claude/pull/77",
        },
      },
    ]);

    await expect(
      createUserForkContentPr({
        userToken: "ghu",
        publicRepo: "JSONbored/awesome-claude",
        baseRef: "main",
        branchName: "heyclaude/submit-mcp-demo",
        targetPath: "content/mcp/demo.mdx",
        content: "---\ntitle: Demo\n---\n",
        title: "docs(content): add demo MCP server",
        body: "Source-backed submission.",
      }),
    ).resolves.toEqual({
      githubLogin: "octo",
      forkFullName: "octo/awesome-claude",
      pullRequestUrl: "https://github.com/JSONbored/awesome-claude/pull/77",
      pullRequestNumber: 77,
    });

    const putContentCall = calls.find((call) =>
      call.url.endsWith("/contents/content/mcp/demo.mdx"),
    );
    expect(putContentCall?.init?.method).toBe("PUT");
    expect(JSON.parse(String(putContentCall?.init?.body))).toMatchObject({
      message: "docs(content): add demo MCP server",
      branch: "heyclaude/submit-mcp-demo",
    });
  });
});
