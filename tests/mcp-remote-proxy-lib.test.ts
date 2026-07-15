import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createRemoteMcpProxyServerFromClient,
  createTimeoutFetch,
} from "../packages/mcp/src/remote-proxy-lib.js";
import { createTimeoutFetch as createTimeoutFetchFromWrapper } from "../packages/mcp/src/remote-proxy.js";
import {
  LOCAL_DRAFT_TOOL_NAMES,
  READ_ONLY_TOOL_NAMES,
} from "../packages/mcp/src/registry.js";

describe("remote-proxy-lib timeout fetch", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("wraps fetch with redirect error and abort propagation", async () => {
    const removeEventListener = vi.fn();
    const callerSignal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener,
    } as unknown as AbortSignal;
    const fetchMock = vi.fn(async (_url: URL | string, init?: RequestInit) => {
      expect(init?.redirect).toBe("error");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return new Response("ok", { status: 200 });
    }) as typeof fetch;
    globalThis.fetch = fetchMock;

    await expect(
      createTimeoutFetch(50)("https://example.com/mcp", {
        signal: callerSignal,
      }),
    ).resolves.toMatchObject({ status: 200 });
    expect(removeEventListener).toHaveBeenCalled();
  });

  it("aborts immediately when the caller signal is already aborted", async () => {
    const fetchMock = vi.fn(async (_url: URL | string, init?: RequestInit) => {
      expect(init?.signal).toMatchObject({ aborted: true });
      return new Response("ok", { status: 200 });
    }) as typeof fetch;
    globalThis.fetch = fetchMock;

    const abortedSignal = {
      aborted: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as AbortSignal;
    await createTimeoutFetch(50)("https://example.com/mcp", {
      signal: abortedSignal,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("remote-proxy re-export compatibility", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("keeps the public wrapper wired to the extracted lib", async () => {
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    globalThis.fetch = fetchMock as typeof fetch;

    await createTimeoutFetchFromWrapper(50)("https://example.com/mcp");
    await createTimeoutFetch(50)("https://example.com/mcp");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[1]?.redirect).toBe("error");
    expect(fetchMock.mock.calls[1]?.[1]?.redirect).toBe("error");
  });
});

describe("remote-proxy-lib proxy server wiring", () => {
  const readOnlyA = READ_ONLY_TOOL_NAMES[0];
  const readOnlyB = READ_ONLY_TOOL_NAMES[1];
  const localDraft = LOCAL_DRAFT_TOOL_NAMES[0];

  function makeClient(overrides = {}) {
    return {
      getServerCapabilities: () => ({ resources: {}, prompts: {} }),
      listTools: async () => ({
        tools: [
          { name: readOnlyA },
          { name: readOnlyB, annotations: { title: "B" } },
          { name: localDraft },
          { name: "totally.unsupported.tool" },
        ],
      }),
      callTool: async () => ({ structuredContent: { ok: true } }),
      listResources: async () => ({ resources: [] }),
      listResourceTemplates: async () => ({ resourceTemplates: [] }),
      readResource: async () => ({ contents: [] }),
      listPrompts: async () => ({ prompts: [] }),
      getPrompt: async () => ({ messages: [] }),
      close: async () => {},
      ...overrides,
    };
  }

  function handler(server, method) {
    const fn = server._requestHandlers.get(method);
    if (!fn) throw new Error(`no handler for ${method}`);
    return (params = {}) => fn({ method, params }, {});
  }

  it("keeps only read-only tools and annotates them", async () => {
    const { server } = await createRemoteMcpProxyServerFromClient(
      makeClient(),
      {
        url: "https://example.com/api/mcp",
      },
    );
    const tools = (await handler(server, "tools/list")()).tools;
    expect(tools.map((tool) => tool.name).sort()).toEqual(
      [readOnlyA, readOnlyB].sort(),
    );
    expect(tools.every((tool) => tool.annotations.readOnlyHint)).toBe(true);
  });

  it("blocks local-draft and unsupported tool calls", async () => {
    const { server } = await createRemoteMcpProxyServerFromClient(makeClient());
    const call = handler(server, "tools/call");
    const draft = await call({ name: localDraft, arguments: {} });
    expect(draft.structuredContent.error.code).toBe("local_only_tool");
    const unknown = await call({ name: "totally.unsupported.tool" });
    expect(unknown.structuredContent.error.code).toBe("invalid_request");
  });

  it("forwards structuredContent and attaches the public policy", async () => {
    const { server } = await createRemoteMcpProxyServerFromClient(
      makeClient({
        callTool: async () => ({ structuredContent: { ok: true } }),
      }),
    );
    const result = await handler(server, "tools/call")({ name: readOnlyA });
    expect(result.structuredContent.policy).toBeDefined();
  });

  it("preserves an already-present policy on structuredContent", async () => {
    const { server } = await createRemoteMcpProxyServerFromClient(
      makeClient({
        callTool: async () => ({
          structuredContent: { ok: true, policy: { custom: true } },
        }),
      }),
    );
    const result = await handler(server, "tools/call")({ name: readOnlyA });
    expect(result.structuredContent.policy).toEqual({ custom: true });
  });

  it("parses JSON text payloads into structuredContent", async () => {
    const { server } = await createRemoteMcpProxyServerFromClient(
      makeClient({
        callTool: async () => ({
          content: [{ type: "text", text: JSON.stringify({ a: 1 }) }],
        }),
      }),
    );
    const result = await handler(server, "tools/call")({ name: readOnlyA });
    expect(result.structuredContent.a).toBe(1);
    expect(result.structuredContent.policy).toBeDefined();
  });

  it("falls back to a synthetic envelope for non-object text payloads", async () => {
    const notJson = await createRemoteMcpProxyServerFromClient(
      makeClient({
        callTool: async () => ({ content: [{ type: "text", text: "nope" }] }),
      }),
    );
    expect(
      (await handler(notJson.server, "tools/call")({ name: readOnlyA }))
        .structuredContent,
    ).toEqual({ ok: true, policy: expect.any(Object) });

    const arrayJson = await createRemoteMcpProxyServerFromClient(
      makeClient({
        callTool: async () => ({
          content: [{ type: "text", text: JSON.stringify([1]) }],
          isError: true,
        }),
      }),
    );
    expect(
      (await handler(arrayJson.server, "tools/call")({ name: readOnlyA }))
        .structuredContent,
    ).toEqual({ ok: false, policy: expect.any(Object) });
  });

  it("wraps thrown errors from the upstream client", async () => {
    const asError = await createRemoteMcpProxyServerFromClient(
      makeClient({
        callTool: async () => {
          throw new Error("boom");
        },
      }),
    );
    const errResult = await handler(
      asError.server,
      "tools/call",
    )({
      name: readOnlyA,
    });
    expect(errResult.structuredContent.error.message).toBe("boom");

    const asString = await createRemoteMcpProxyServerFromClient(
      makeClient({
        callTool: async () => {
          throw "raw failure";
        },
      }),
    );
    expect(
      (await handler(asString.server, "tools/call")({ name: readOnlyA }))
        .structuredContent.error.message,
    ).toBe("raw failure");
  });

  it("wires resource and prompt handlers when the remote advertises them", async () => {
    const client = makeClient();
    const { server } = await createRemoteMcpProxyServerFromClient(client);
    await handler(server, "resources/list")();
    await handler(server, "resources/templates/list")();
    await handler(server, "resources/read")({ uri: "heyclaude://x" });
    await handler(server, "prompts/list")();
    await handler(server, "prompts/get")({ name: "p" });
    expect(client.listResources).toBeDefined();
    server.onclose();
  });

  it("omits resource/prompt handlers and capabilities when unadvertised", async () => {
    const { server } = await createRemoteMcpProxyServerFromClient(
      makeClient({ getServerCapabilities: () => undefined }),
    );
    expect(server._requestHandlers.has("resources/list")).toBe(false);
    expect(server._requestHandlers.has("prompts/list")).toBe(false);
  });
});
