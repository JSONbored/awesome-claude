import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "generated") return [];
      return sourceFiles(fullPath);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [fullPath] : [];
  });
}

describe("web server/client boundary", () => {
  it("keeps Node builtins behind server-only modules", () => {
    const files = sourceFiles(path.join(repoRoot, "apps/web/src"));
    for (const file of files) {
      const relative = path.relative(repoRoot, file);
      if (relative.endsWith(".server.ts") || relative.endsWith(".server.tsx"))
        continue;
      const source = fs.readFileSync(file, "utf8");
      expect(source, relative).not.toMatch(/from\s+["']node:/);
    }
  });

  it("keeps content and Cloudflare runtime imports on explicit server modules", () => {
    const files = sourceFiles(path.join(repoRoot, "apps/web/src"));
    for (const file of files) {
      const relative = path.relative(repoRoot, file);
      const source = fs.readFileSync(file, "utf8");
      expect(source, relative).not.toMatch(/@\/lib\/content(?=["'])/);
      expect(source, relative).not.toMatch(/@\/lib\/cloudflare-env(?=["'])/);
      expect(source, relative).not.toMatch(
        /from\s+["']@heyclaude\/mcp\/server["']/,
      );
      expect(source, relative).not.toMatch(
        /from\s+["']@modelcontextprotocol\/sdk\/server\/stdio/,
      );
    }
  });
});
