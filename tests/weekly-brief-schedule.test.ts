import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const repoRoot = join(__dirname, "..");
const sundaySendCron = "0 16 * * SUN";

describe("weekly brief schedule", () => {
  it("runs the send branch at the configured Sunday 16:00 UTC send slot", () => {
    const plugin = readFileSync(
      join(repoRoot, "apps/web/plugins/newsletter-digest-scheduled.ts"),
      "utf8",
    );
    const wranglerConfig = readFileSync(
      join(repoRoot, "apps/web/wrangler.jsonc"),
      "utf8",
    );

    expect(plugin).toContain(sundaySendCron);
    expect(wranglerConfig).toContain(sundaySendCron);
  });
});
