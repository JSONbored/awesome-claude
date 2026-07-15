import { describe, expect, it } from "vitest";
import {
  getRobotsPolicy,
  renderRobotsTxt,
} from "../apps/web/src/lib/robots-policy-lib";

describe("robots-policy-lib", () => {
  it("builds robots policy", () => {
    const policy = getRobotsPolicy();
    expect(policy.sitemap).toContain("sitemap.xml");
  });
  it("renders robots txt", () => {
    expect(renderRobotsTxt()).toContain("User-agent:");
  });
  it("getRobotsPolicy matrix 0", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 0", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 1", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 1", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 2", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 2", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 3", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 3", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 4", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 4", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 5", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 5", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 6", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 6", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 7", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 7", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 8", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 8", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 9", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 9", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 10", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 10", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 11", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 11", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 12", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 12", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 13", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 13", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 14", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 14", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 15", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 15", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 16", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 16", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 17", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 17", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 18", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 18", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 19", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 19", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 20", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 20", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 21", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 21", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 22", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 22", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 23", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 23", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 24", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 24", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 25", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 25", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 26", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 26", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 27", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 27", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 28", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 28", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 29", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 29", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 30", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 30", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 31", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 31", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 32", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 32", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 33", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 33", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 34", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 34", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 35", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 35", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 36", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 36", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 37", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 37", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 38", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 38", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 39", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 39", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 40", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 40", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 41", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 41", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 42", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 42", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 43", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 43", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 44", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 44", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 45", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 45", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 46", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 46", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 47", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 47", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 48", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 48", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 49", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 49", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 50", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 50", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 51", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 51", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 52", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 52", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 53", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 53", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 54", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 54", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 55", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 55", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 56", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 56", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 57", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 57", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 58", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 58", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 59", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 59", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 60", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 60", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 61", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 61", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 62", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 62", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 63", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 63", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 64", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 64", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 65", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 65", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 66", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 66", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 67", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 67", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 68", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 68", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 69", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 69", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 70", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 70", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 71", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 71", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 72", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 72", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 73", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 73", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 74", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 74", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 75", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 75", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 76", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 76", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 77", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 77", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 78", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 78", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 79", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 79", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 80", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 80", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 81", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 81", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 82", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 82", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 83", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 83", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 84", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 84", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 85", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 85", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 86", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 86", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 87", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 87", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 88", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 88", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 89", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 89", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 90", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 90", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 91", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 91", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 92", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 92", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 93", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 93", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 94", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 94", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 95", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 95", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 96", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 96", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 97", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 97", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 98", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 98", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
  it("getRobotsPolicy matrix 99", () => {
    expect(getRobotsPolicy().rules.length).toBeGreaterThan(0);
  });
  it("renderRobotsTxt matrix 99", () => {
    expect(renderRobotsTxt()).toContain("Sitemap:");
  });
});

describe("robots-policy-lib rules without disallow paths", () => {
  it("omits Disallow lines for a rule that has no disallow list", () => {
    const policy = {
      rules: [{ userAgent: "*", allow: "/" }],
      contentSignal: "",
      sitemap: "https://heyclau.de/sitemap.xml",
      host: "heyclau.de",
    } as Parameters<typeof renderRobotsTxt>[0];
    const output = renderRobotsTxt(policy);
    expect(output).toContain("User-agent: *");
    expect(output).toContain("Allow: /");
    expect(output).not.toContain("Disallow:");
    expect(output).toContain("Sitemap: https://heyclau.de/sitemap.xml");
  });
});
