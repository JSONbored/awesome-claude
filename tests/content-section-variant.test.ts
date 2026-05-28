import { describe, expect, it } from "vitest";

import {
  getSectionEyebrow,
  getSectionVariant,
  isEssentialVariant,
  shouldOpenSection,
} from "../apps/web/src/lib/content-section-variant";

describe("getSectionVariant", () => {
  it("classifies setup and installation titles as prerequisites", () => {
    expect(getSectionVariant("Prerequisites")).toBe("prerequisites");
    expect(getSectionVariant("Installation")).toBe("prerequisites");
    expect(getSectionVariant("Getting Started")).toBe("prerequisites");
    expect(getSectionVariant("Before you begin")).toBe("prerequisites");
  });

  it("classifies safety and privacy titles as warning", () => {
    expect(getSectionVariant("Warning")).toBe("warning");
    expect(getSectionVariant("Security notes")).toBe("warning");
    expect(getSectionVariant("Safety considerations")).toBe("warning");
    expect(getSectionVariant("Privacy")).toBe("warning");
  });

  it("prioritizes warning over prerequisites so safety content is never demoted", () => {
    expect(getSectionVariant("Security prerequisites")).toBe("warning");
  });

  it("classifies troubleshooting titles", () => {
    expect(getSectionVariant("Troubleshooting")).toBe("troubleshooting");
    expect(getSectionVariant("Common issues")).toBe("troubleshooting");
    expect(getSectionVariant("FAQ")).toBe("troubleshooting");
  });

  it("falls back to default for ordinary titles", () => {
    expect(getSectionVariant("Overview")).toBe("default");
    expect(getSectionVariant("How it works")).toBe("default");
  });

  it("does not match keywords glued inside longer words", () => {
    expect(getSectionVariant("Uninstall")).toBe("default");
    expect(getSectionVariant("Reinstall steps")).toBe("default");
  });
});

describe("isEssentialVariant", () => {
  it("treats setup and safety variants as essential", () => {
    expect(isEssentialVariant("warning")).toBe(true);
    expect(isEssentialVariant("prerequisites")).toBe(true);
  });

  it("does not treat ordinary variants as essential", () => {
    expect(isEssentialVariant("default")).toBe(false);
    expect(isEssentialVariant("troubleshooting")).toBe(false);
  });
});

describe("shouldOpenSection", () => {
  it("opens the first two sections regardless of variant", () => {
    expect(shouldOpenSection({ index: 0, variant: "default" })).toBe(true);
    expect(shouldOpenSection({ index: 1, variant: "default" })).toBe(true);
  });

  it("keeps ordinary later sections collapsed", () => {
    expect(shouldOpenSection({ index: 4, variant: "default" })).toBe(false);
    expect(shouldOpenSection({ index: 4, variant: "troubleshooting" })).toBe(
      false,
    );
  });

  it("always opens essential setup/safety sections even when deep in the page", () => {
    expect(shouldOpenSection({ index: 7, variant: "warning" })).toBe(true);
    expect(shouldOpenSection({ index: 7, variant: "prerequisites" })).toBe(true);
  });

  it("still opens quick reference sections", () => {
    expect(shouldOpenSection({ index: 9, variant: "quick_reference" })).toBe(
      true,
    );
  });
});

describe("getSectionEyebrow", () => {
  it("returns scan-friendly labels per variant", () => {
    expect(getSectionEyebrow("prerequisites")).toBe("Setup");
    expect(getSectionEyebrow("warning")).toBe("Important");
    expect(getSectionEyebrow("troubleshooting")).toBe("Troubleshooting");
    expect(getSectionEyebrow("quick_reference")).toBe("Reference");
    expect(getSectionEyebrow("related_content")).toBe("Related");
    expect(getSectionEyebrow("default")).toBe("Section");
    expect(getSectionEyebrow("anything-else")).toBe("Section");
  });
});
