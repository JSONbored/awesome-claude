import { describe, expect, it } from "vitest";

import { renderErrorPage } from "@/lib/error-page";

describe("renderErrorPage", () => {
  const html = renderErrorPage();

  it("returns a complete, localized HTML document", () => {
    // The fallback page is served as a raw string, so it must be a full,
    // self-contained document (no framework/runtime available at this point).
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('name="viewport"');
  });

  it("communicates the failure and a title to the user", () => {
    expect(html).toContain("This page didn't load");
  });

  it("offers both recovery affordances: retry and go-home", () => {
    // The page has no client framework, so recovery relies on a plain reload
    // handler and a static home link.
    expect(html).toContain("location.reload()");
    expect(html).toContain('href="/"');
  });

  it("returns stable output across calls (pure render)", () => {
    expect(renderErrorPage()).toBe(html);
  });
});
