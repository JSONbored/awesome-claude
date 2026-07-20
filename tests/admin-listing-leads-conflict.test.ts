import { beforeEach, describe, expect, it, vi } from "vitest";

const getSiteDbMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({ getSiteDb: getSiteDbMock }));
vi.mock("@/lib/admin-auth", () => ({ isLeadsAdminAuthorized: () => true }));

function patchRequest(body: Record<string, unknown>) {
  return new Request("https://heyclau.de/api/admin/listing-leads", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      origin: "https://heyclau.de",
    },
    body: JSON.stringify(body),
  });
}

// Minimal D1 stub: the SELECT resolves to `current`; the conditional UPDATE
// reports `updateChanges` rows affected (1 = applied, 0 = the row's status
// changed between read and write, i.e. a lost-update race).
function dbStub({
  current,
  updateChanges,
}: {
  current: { id: number; status: string } | null;
  updateChanges: number;
}) {
  return {
    prepare() {
      return {
        bind() {
          return {
            first: async () => current,
            run: async () => ({
              success: true,
              meta: { changes: updateChanges },
            }),
          };
        },
      };
    },
  };
}

describe("admin listing-leads PATCH lost-update conflict", () => {
  beforeEach(() => {
    getSiteDbMock.mockReset();
  });

  it("returns 409 when the lead's status changed between read and the conditional write", async () => {
    getSiteDbMock.mockReturnValue(
      dbStub({ current: { id: 1, status: "new" }, updateChanges: 0 }),
    );
    const { PATCH } = await import("@/routes/api/admin/listing-leads");

    const response = await PATCH(patchRequest({ id: 1, action: "review" }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "status_conflict" },
    });
  });

  it("returns 200 with the next status when the conditional write applies", async () => {
    getSiteDbMock.mockReturnValue(
      dbStub({ current: { id: 1, status: "new" }, updateChanges: 1 }),
    );
    const { PATCH } = await import("@/routes/api/admin/listing-leads");

    const response = await PATCH(patchRequest({ id: 1, action: "review" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      id: 1,
      status: "pending_review",
    });
  });

  it("still returns 404 when the lead does not exist", async () => {
    getSiteDbMock.mockReturnValue(dbStub({ current: null, updateChanges: 0 }));
    const { PATCH } = await import("@/routes/api/admin/listing-leads");

    const response = await PATCH(patchRequest({ id: 999, action: "review" }));

    expect(response.status).toBe(404);
  });
});
