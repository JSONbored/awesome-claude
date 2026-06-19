import { describe, expect, it, vi } from "vitest";
import { runStdioServer } from "../packages/mcp/src/server.js";
const { Server } =
  await import("../packages/mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js");

describe("HeyClaude MCP stdio server wrapper", () => {
  it("connects the registry server to a stdio transport", async () => {
    const connect = vi
      .spyOn(Server.prototype, "connect")
      .mockResolvedValue(undefined);

    await runStdioServer({});

    expect(connect).toHaveBeenCalledWith(expect.any(Object));
    connect.mockRestore();
  });
});
