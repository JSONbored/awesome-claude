import { beforeEach, describe, expect, it, vi } from "vitest";

import { __aiSignalsTestHooks, logAiSignals } from "@/lib/ai-signals.server";

function analyticsEnv() {
  return {
    AI_SIGNALS: {
      writeDataPoint: vi.fn(),
    },
  };
}

function request(path: string, init: RequestInit = {}) {
  return new Request(`https://heyclau.de${path}`, init);
}

describe("logAiSignals", () => {
  beforeEach(() => {
    __aiSignalsTestHooks.reset();
    vi.useRealTimers();
  });

  it("requires Cloudflare verified bot metadata before logging crawler user agents", () => {
    const env = analyticsEnv();

    logAiSignals(
      request("/api/mcp", { headers: { "user-agent": "GPTBot" } }),
      env,
    );
    expect(env.AI_SIGNALS.writeDataPoint).not.toHaveBeenCalled();

    logAiSignals(
      Object.assign(
        request("/agents", { headers: { "user-agent": "GPTBot" } }),
        { cf: { botManagement: { verifiedBot: true } } },
      ),
      env,
    );
    expect(env.AI_SIGNALS.writeDataPoint).toHaveBeenCalledWith({
      blobs: ["crawler", "openai", "GPTBot", "train", "/agents"],
      doubles: [1],
      indexes: ["openai"],
    });
  });

  it("only logs AI referrals for page-like GET requests", () => {
    const env = analyticsEnv();
    const headers = { referer: "https://chatgpt.com/share/abc" };

    logAiSignals(request("/api/mcp", { headers }), env);
    logAiSignals(request("/assets/app.js", { headers }), env);
    logAiSignals(request("/agents", { method: "HEAD", headers }), env);
    logAiSignals(request("/agents", { method: "POST", headers }), env);
    expect(env.AI_SIGNALS.writeDataPoint).not.toHaveBeenCalled();

    logAiSignals(request("/agents", { headers }), env);
    expect(env.AI_SIGNALS.writeDataPoint).toHaveBeenCalledWith({
      blobs: ["referral", "chatgpt", "/agents"],
      doubles: [1],
      indexes: ["referral"],
    });
  });

  it("rate-limits spoofed AI referrals by source, client, and path", () => {
    vi.setSystemTime(new Date("2026-06-18T00:00:00Z"));
    const env = analyticsEnv();
    const headers = {
      "cf-connecting-ip": "198.51.100.10",
      referer: "https://chatgpt.com/",
    };

    for (let i = 0; i < 5; i += 1) {
      logAiSignals(request("/agents", { headers }), env);
    }

    expect(env.AI_SIGNALS.writeDataPoint).toHaveBeenCalledTimes(3);
  });

  it("does not shard referral quota by spoofable forwarded IPs", () => {
    vi.setSystemTime(new Date("2026-06-18T00:00:00Z"));
    const env = analyticsEnv();

    for (let i = 0; i < 5; i += 1) {
      logAiSignals(
        request("/agents", {
          headers: {
            "x-forwarded-for": `198.51.100.${i}`,
            referer: "https://chatgpt.com/",
          },
        }),
        env,
      );
    }

    expect(env.AI_SIGNALS.writeDataPoint).toHaveBeenCalledTimes(3);
  });
});
