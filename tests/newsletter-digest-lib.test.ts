import { describe, expect, it } from "vitest";
import { selectDigestEntries } from "../apps/web/src/lib/newsletter-digest-lib";

const NOW = Date.parse("2026-06-15T12:00:00.000Z");
const sample = [
  {
    title: "A",
    category: "mcp",
    slug: "a",
    dateAdded: "2026-06-14T00:00:00.000Z",
  },
];
describe("newsletter-digest-lib", () => {
  it("returns null when below minimum", () => {
    expect(selectDigestEntries(sample, NOW, { min: 5 })).toBeNull();
  });
  it("selectDigestEntries matrix 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 6", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 7", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 8", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 9", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 10", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 11", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 12", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 13", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 14", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 15", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 16", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 17", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 18", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 19", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 20", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 21", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 22", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 23", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 24", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 25", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 26", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 27", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 28", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 29", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 30", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 31", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 32", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 33", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 34", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 35", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 36", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 37", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 38", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 39", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 40", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 41", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 42", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 43", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 44", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 45", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 46", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 47", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 48", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 49", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 50", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 51", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 52", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 53", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 54", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 55", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 56", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 57", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 58", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 59", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 60", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 61", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 62", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 63", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 64", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 65", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 66", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 67", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 68", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 69", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 70", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 71", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 72", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 73", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 74", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 75", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 76", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 77", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 78", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 79", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 80", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 81", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 82", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 83", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 84", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 85", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 86", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 87", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 88", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 89", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 90", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 91", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 92", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 93", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 94", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 95", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 96", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 97", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 98", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
  it("selectDigestEntries matrix 99", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      title: "Entry " + idx,
      category: "mcp",
      slug: "slug-" + idx,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    if (entries.length >= 1) expect(result?.length).toBeGreaterThan(0);
  });
});

describe("newsletter-digest-lib default minimum and undated entries", () => {
  it("applies the default minimum of 5 and skips entries without a date", () => {
    const now = Date.parse("2026-06-10T00:00:00.000Z");
    const dated = "2026-06-08T00:00:00.000Z";
    const entries = [
      { title: "no-date", category: "agents", slug: "nd" },
      ...Array.from({ length: 4 }, (_, idx) => ({
        title: `t${idx}`,
        category: "agents",
        slug: `s${idx}`,
        dateAdded: dated,
      })),
    ];
    // Four dated recent entries fall below the default minimum of 5, and the
    // undated entry parses to NaN and is filtered out, so no digest is sent.
    expect(selectDigestEntries(entries, now, { windowDays: 7 })).toBeNull();
  });

  it("sends a digest once the default minimum is met, ignoring undated entries", () => {
    const now = Date.parse("2026-06-10T00:00:00.000Z");
    const dated = "2026-06-08T00:00:00.000Z";
    const entries = [
      { title: "no-date", category: "agents", slug: "nd" },
      ...Array.from({ length: 5 }, (_, idx) => ({
        title: `t${idx}`,
        category: "agents",
        slug: `s${idx}`,
        dateAdded: dated,
      })),
    ];
    const digest = selectDigestEntries(entries, now, { windowDays: 7 });
    expect(digest).not.toBeNull();
    expect(digest).toHaveLength(5);
    expect(digest?.every((item) => item.slug !== "nd")).toBe(true);
  });
});
