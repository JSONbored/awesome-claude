import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  GITHUB_WEBHOOK_BODY_LIMIT_BYTES,
  handleGithubWebhookPost,
} from "../apps/web/src/routes/api/public/github/webhook";

const SECRET = "test-webhook-secret";
const WEBHOOK_URL = "https://heyclau.de/api/public/github/webhook";

const globalWithEnv = globalThis as typeof globalThis & { __env__?: unknown };

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signatureFor(body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  return `sha256=${toHex(digest)}`;
}

async function signedWebhookRequest(
  event: string,
  body: string,
  headers: HeadersInit = {},
) {
  return new Request(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "x-github-event": event,
      "x-hub-signature-256": await signatureFor(body),
      ...headers,
    },
    body,
  });
}

describe("public GitHub webhook route", () => {
  beforeEach(() => {
    globalWithEnv.__env__ = { GITHUB_WEBHOOK_SECRET: SECRET };
  });

  afterEach(() => {
    delete globalWithEnv.__env__;
  });

  it("handles signed ping events", async () => {
    const body = JSON.stringify({ zen: "keep payloads bounded" });

    const response = await handleGithubWebhookPost(
      await signedWebhookRequest("ping", body),
    );

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("pong");
  });

  it("rejects invalid signatures for bounded payloads", async () => {
    const response = await handleGithubWebhookPost(
      new Request(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "x-github-event": "ping",
          "x-hub-signature-256": "sha256=not-the-signature",
        },
        body: "{}",
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toBe("Invalid signature");
  });

  it("rejects oversized declared bodies before signature verification", async () => {
    const response = await handleGithubWebhookPost(
      new Request(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "content-length": String(GITHUB_WEBHOOK_BODY_LIMIT_BYTES + 1),
          "x-github-event": "push",
        },
        body: "{}",
      }),
    );

    expect(response.status).toBe(413);
    await expect(response.text()).resolves.toBe("Payload too large");
  });

  it("rejects oversized streamed bodies without a content-length header", async () => {
    const response = await handleGithubWebhookPost(
      new Request(WEBHOOK_URL, {
        method: "POST",
        headers: { "x-github-event": "push" },
        body: "x".repeat(GITHUB_WEBHOOK_BODY_LIMIT_BYTES + 1),
      }),
    );

    expect(response.status).toBe(413);
    await expect(response.text()).resolves.toBe("Payload too large");
  });

  it("accepts signed push events within the body limit", async () => {
    const body = JSON.stringify({
      ref: "refs/heads/main",
      commits: [
        {
          id: "abc123",
          timestamp: "2026-06-18T23:00:00.000Z",
          added: ["content/mcp/example.mdx"],
        },
      ],
    });

    const response = await handleGithubWebhookPost(
      await signedWebhookRequest("push", body),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, count: 1 });
  });
});
