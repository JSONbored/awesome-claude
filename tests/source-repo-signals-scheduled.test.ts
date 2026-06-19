import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDirectoryEntries: vi.fn(),
  refreshSourceRepoSignalsForEntries: vi.fn(),
  runWithCloudflareRuntime: vi.fn(async (_request, _env, _context, callback) =>
    callback(),
  ),
}));

vi.mock("nitro", () => ({
  definePlugin: (setup: unknown) => setup,
}));

vi.mock("@/lib/cloudflare-env.server", () => ({
  runWithCloudflareRuntime: mocks.runWithCloudflareRuntime,
}));

vi.mock("@/lib/content.server", () => ({
  getDirectoryEntries: mocks.getDirectoryEntries,
}));

vi.mock("@/lib/source-repo-signals.server", () => ({
  refreshSourceRepoSignalsForEntries: mocks.refreshSourceRepoSignalsForEntries,
}));

import setupSourceRepoSignalsScheduled from "../apps/web/plugins/source-repo-signals-scheduled";

type ScheduledHandler = (payload: {
  controller?: { cron?: string };
  env: unknown;
  context: unknown;
}) => Promise<void>;

function getScheduledHandler() {
  let handler: ScheduledHandler | undefined;
  setupSourceRepoSignalsScheduled({
    hooks: {
      hook(name: string, callback: ScheduledHandler) {
        if (name === "cloudflare:scheduled") handler = callback;
      },
    },
  });
  expect(handler).toBeDefined();
  return handler as ScheduledHandler;
}

describe("source repo signals scheduled plugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDirectoryEntries.mockResolvedValue([
      { repoUrl: "https://github.com/example/tool" },
    ]);
    mocks.refreshSourceRepoSignalsForEntries.mockResolvedValue({
      available: true,
      totalRepos: 1,
      refreshed: 1,
      failed: 0,
    });
  });

  it("ignores scheduled events for other cron triggers", async () => {
    const handler = getScheduledHandler();

    await handler({
      controller: { cron: "0 14 * * FRI" },
      env: {},
      context: {},
    });

    expect(mocks.runWithCloudflareRuntime).not.toHaveBeenCalled();
    expect(mocks.getDirectoryEntries).not.toHaveBeenCalled();
    expect(mocks.refreshSourceRepoSignalsForEntries).not.toHaveBeenCalled();
  });

  it("refreshes source repo signals on the configured source cron", async () => {
    const handler = getScheduledHandler();

    await handler({
      controller: { cron: "17 */6 * * *" },
      env: {},
      context: {},
    });

    expect(mocks.runWithCloudflareRuntime).toHaveBeenCalledOnce();
    expect(mocks.getDirectoryEntries).toHaveBeenCalledOnce();
    expect(mocks.refreshSourceRepoSignalsForEntries).toHaveBeenCalledWith([
      { repoUrl: "https://github.com/example/tool" },
    ]);
  });
});
