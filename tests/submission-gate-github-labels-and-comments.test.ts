import { afterEach, describe, expect, it, vi } from "vitest";

import {
  addLabels,
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

describe("submission-gate addLabels managed-label creation failures", () => {
  it("rethrows a non-422 failure instead of falling back to PATCH", async () => {
    const { calls } = mockFetchQueue([
      { status: 500, body: { message: "label service unavailable" } },
    ]);

    await expect(
      addLabels({
        token: "ghs",
        repo,
        issueNumber: 1,
        labels: ["category:mcp"],
      }),
    ).rejects.toMatchObject({ status: 500 });

    // Only the failed create-label call should have happened: no PATCH
    // fallback, and no call to attach labels to the issue.
    expect(calls).toHaveLength(1);
    expect(calls[0].init?.method).toBe("POST");
  });
});

describe("submission-gate upsertMarkerComment pagination and supersession", () => {
  it("keeps fetching comment pages while a page is full", async () => {
    const fullPage = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      body: "unrelated comment",
      user: { type: "User" },
    }));
    const { calls } = mockFetchQueue([
      { body: fullPage },
      {
        body: [
          {
            id: 500,
            body: "<!-- gate --> stale",
            html_url: "https://github.com/comment/500",
            user: { type: "Bot" },
          },
        ],
      },
      { body: { id: 500, html_url: "https://github.com/comment/500" } },
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
      id: 500,
      url: "https://github.com/comment/500",
      supersededIds: [],
    });

    const commentListCalls = calls.filter((call) =>
      call.url.includes("/issues/1/comments?"),
    );
    expect(commentListCalls).toHaveLength(2);
    expect(commentListCalls[0].url).toContain("page=1");
    expect(commentListCalls[1].url).toContain("page=2");
  });

  it("supersedes every older bot marker comment except the canonical one", async () => {
    const { calls } = mockFetchQueue([
      {
        body: [
          {
            id: 1,
            body: "<!-- gate --> first",
            html_url: "https://github.com/comment/1",
            user: { type: "Bot" },
          },
          {
            id: 2,
            body: "<!-- gate --> second",
            html_url: "https://github.com/comment/2",
            user: { type: "Bot" },
          },
        ],
      },
      // PATCH response for the canonical (most recent) comment omits
      // html_url, so the result must fall back to the pre-update value.
      { body: { id: 2 } },
      { body: { ok: true } }, // PATCH superseding comment 1
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

    const supersedeCall = calls.find((call) =>
      call.url.endsWith("/issues/comments/1"),
    );
    expect(supersedeCall?.init?.method).toBe("PATCH");
  });
});
