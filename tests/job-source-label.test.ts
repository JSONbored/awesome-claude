import { describe, expect, it } from "vitest";

import { jobSourceLabel } from "@/lib/jobs";

type SourceInput = Parameters<typeof jobSourceLabel>[0];
const label = (source: string, sourceKind: string) =>
  jobSourceLabel({ source, sourceKind } as unknown as SourceInput);

describe("jobSourceLabel", () => {
  it("labels curated jobs first, regardless of sourceKind", () => {
    // `source === "curated"` is checked before sourceKind, so an editorially
    // curated listing keeps its label even if it also has an ATS source kind.
    expect(label("curated", "official_ats")).toBe("Editorially curated");
    expect(label("curated", "employer_careers")).toBe("Editorially curated");
  });

  it("distinguishes ATS and employer-careers source kinds for non-curated jobs", () => {
    expect(label("submitted", "official_ats")).toBe("Official ATS page");
    expect(label("submitted", "employer_careers")).toBe(
      "Employer careers page",
    );
  });

  it("falls back to 'Employer submitted' for any other source kind", () => {
    expect(label("submitted", "other")).toBe("Employer submitted");
    expect(label("submitted", "")).toBe("Employer submitted");
  });
});
