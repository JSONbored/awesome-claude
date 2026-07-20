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

  // A silent early return on the send path means an approved brief never
  // reaches the audience, with nothing in the Worker logs to explain why.
  it("logs a named reason on both silent-skip paths", () => {
    const plugin = readFileSync(
      join(repoRoot, "apps/web/plugins/newsletter-digest-scheduled.ts"),
      "utf8",
    );

    expect(plugin).toContain("[brief-send] skipped: missing ");
    expect(plugin).toContain("[brief-generate] preview skipped: ");
    for (const secret of [
      "RESEND_API_KEY",
      "RESEND_SEGMENT_ID",
      "RESEND_FROM",
    ]) {
      expect(plugin, secret).toContain(`${secret}: `);
    }
    // The skip must still return without sending - logging-only change.
    expect(plugin).toMatch(/\[brief-send\] skipped[\s\S]{0,400}?return;/);
  });
});
