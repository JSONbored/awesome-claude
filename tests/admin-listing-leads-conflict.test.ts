import { beforeEach, describe, expect, it, vi } from "vitest";

const getSiteDbMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  getSiteDb: getSiteDbMock,
}));

function patchRequest(body: Record<string, unknown>) {
  return new Request("https://heyclau.de/api/admin/listing-leads", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      origin: "https://heyclau.de",
      authorization: "Bearer leads-admin-token",
    },
    body: JSON.stringify(body),
  });
}

function mockDb(options: {
  currentStatus: string;
  updateChanges: number;
  updateBinds?: unknown[][];
}) {
  const updateBinds = options.updateBinds ?? [];
  return {
    prepare: (sql: string) => ({
      bind: (...values: unknown[]) => {
        if (sql.startsWith("SELECT")) {
          return {
            first: async () => ({ id: 42, status: options.currentStatus }),
          };
        }
        updateBinds.push(values);
        return {
          run: async () => ({
            success: true,
            meta: { changes: options.updateChanges },
          }),
        };
      },
    }),
  };
}

describe("PATCH /api/admin/listing-leads concurrency", () => {
  beforeEach(() => {
    getSiteDbMock.mockReset();
    vi.stubEnv("LEADS_ADMIN_TOKEN", "leads-admin-token");
  });

  it("conditions the UPDATE on the read status and succeeds when unchanged", async () => {
    const updateBinds: unknown[][] = [];
    getSiteDbMock.mockReturnValue(
      mockDb({
        currentStatus: "pending_review",
        updateChanges: 1,
        updateBinds,
      }),
    );

    const { PATCH } = await import("@/routes/api/admin/listing-leads");
    const response = await PATCH(patchRequest({ id: 42, action: "approve" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      id: 42,
      status: "approved",
    });
    expect(updateBinds).toEqual([["approved", 42, "pending_review"]]);
  });

  it("returns 409 when a concurrent write changed status between read and update", async () => {
    getSiteDbMock.mockReturnValue(
      mockDb({
        currentStatus: "pending_review",
        updateChanges: 0,
      }),
    );

    const { PATCH } = await import("@/routes/api/admin/listing-leads");
    const response = await PATCH(patchRequest({ id: 42, action: "reject" }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "conflict" },
    });
  });
});
