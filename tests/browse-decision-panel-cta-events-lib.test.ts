import { describe, expect, it } from "vitest";
import {
  BROWSE_ADOPTION_QUEUE_SURFACE,
  BROWSE_DECISION_CONFIDENCE_SURFACE,
  browseAdoptionQueueEntryAnalyticsData,
  browseAdoptionQueueEntryAnalyticsEvent,
  browseDecisionConfidenceEntryAnalyticsData,
  browseDecisionConfidenceEntryAnalyticsEvent,
  parseBrowseDecisionPanelEntryRef,
} from "@/lib/browse-decision-panel-cta-events-lib";

describe("browse decision panel cta events lib", () => {
  it("builds privacy-light browse decision panel analytics payloads", () => {
    expect(browseAdoptionQueueEntryAnalyticsEvent()).toBe(
      "browse_adoption_queue_entry_click",
    );
    expect(
      browseAdoptionQueueEntryAnalyticsData(
        "mcp/browser",
        "security-first",
        "caution",
        72,
        2,
      ),
    ).toEqual({
      surface: BROWSE_ADOPTION_QUEUE_SURFACE,
      entry: "mcp/browser",
      preset: "security-first",
      tier: "caution",
      readinessScore: 72,
      blockerCount: 2,
    });
    expect(browseDecisionConfidenceEntryAnalyticsEvent()).toBe(
      "browse_decision_confidence_entry_click",
    );
    expect(
      browseDecisionConfidenceEntryAnalyticsData(
        "agents/foo",
        "strict",
        "low",
        41,
        3,
      ),
    ).toEqual({
      surface: BROWSE_DECISION_CONFIDENCE_SURFACE,
      entry: "agents/foo",
      preset: "strict",
      band: "low",
      confidenceScore: 41,
      missingSignalCount: 3,
    });
    expect(parseBrowseDecisionPanelEntryRef("mcp/browser")).toEqual({
      category: "mcp",
      slug: "browser",
    });
    expect(parseBrowseDecisionPanelEntryRef("invalid")).toBeNull();
  });
});
