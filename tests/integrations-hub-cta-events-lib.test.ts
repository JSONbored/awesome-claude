import { describe, expect, it } from "vitest";
import {
  INTEGRATIONS_DETAIL_SURFACE,
  INTEGRATIONS_INDEX_SURFACE,
  integrationsDetailActionAnalyticsData,
  integrationsDetailActionAnalyticsEvent,
  integrationsDetailIndexAnalyticsData,
  integrationsDetailIndexAnalyticsEvent,
  integrationsDetailInstallCopyAnalyticsData,
  integrationsDetailInstallCopyAnalyticsEvent,
  integrationsDetailRelatedAnalyticsData,
  integrationsDetailRelatedAnalyticsEvent,
  integrationsIndexApiDocsAnalyticsData,
  integrationsIndexApiDocsAnalyticsEvent,
  integrationsIndexCardAnalyticsData,
  integrationsIndexCardAnalyticsEvent,
  integrationsIndexEcosystemAnalyticsData,
  integrationsIndexEcosystemAnalyticsEvent,
  integrationsIndexCardDestination,
  integrationsIndexChromeDestination,
  integrationsDetailIndexDestination,
  integrationsDetailRelatedDestination,
} from "@/lib/integrations-hub-cta-events-lib";

describe("integrations hub cta events lib", () => {
  it("builds integrations index navigation analytics", () => {
    expect(integrationsIndexCardAnalyticsEvent()).toBe(
      "integrations_index_card_click",
    );
    expect(
      integrationsIndexCardAnalyticsData(
        "mcp-server",
        1,
        6,
        "live",
        "mcp-server",
      ),
    ).toEqual({
      surface: INTEGRATIONS_INDEX_SURFACE,
      integrationSlug: "mcp-server",
      rowIndex: 1,
      integrationCount: 6,
      status: "live",
      kind: "mcp-server",
    });
    expect(integrationsIndexEcosystemAnalyticsEvent()).toBe(
      "integrations_index_ecosystem_click",
    );
    expect(integrationsIndexEcosystemAnalyticsData(6)).toEqual({
      surface: INTEGRATIONS_INDEX_SURFACE,
      integrationCount: 6,
    });
    expect(integrationsIndexApiDocsAnalyticsEvent()).toBe(
      "integrations_index_api_docs_click",
    );
    expect(integrationsIndexApiDocsAnalyticsData(6)).toEqual({
      surface: INTEGRATIONS_INDEX_SURFACE,
      integrationCount: 6,
    });
  });

  it("builds integrations detail navigation analytics", () => {
    expect(integrationsDetailIndexAnalyticsEvent()).toBe(
      "integrations_detail_index_click",
    );
    expect(integrationsDetailIndexAnalyticsData("raycast", 3)).toEqual({
      surface: INTEGRATIONS_DETAIL_SURFACE,
      integrationSlug: "raycast",
      relatedCount: 3,
    });
    expect(integrationsDetailRelatedAnalyticsEvent()).toBe(
      "integrations_detail_related_click",
    );
    expect(
      integrationsDetailRelatedAnalyticsData("raycast", "mcp-server", 0, 3),
    ).toEqual({
      surface: INTEGRATIONS_DETAIL_SURFACE,
      integrationSlug: "raycast",
      relatedSlug: "mcp-server",
      rowIndex: 0,
      relatedCount: 3,
    });
    expect(integrationsDetailActionAnalyticsEvent()).toBe(
      "integrations_detail_action_click",
    );
    expect(
      integrationsDetailActionAnalyticsData(
        "raycast",
        "primary",
        "live",
        "extension",
      ),
    ).toEqual({
      surface: INTEGRATIONS_DETAIL_SURFACE,
      integrationSlug: "raycast",
      action: "primary",
      status: "live",
      kind: "extension",
    });
    expect(
      integrationsDetailActionAnalyticsData(
        "mcp-server",
        "secondary",
        "beta",
        "mcp-server",
      ),
    ).toEqual({
      surface: INTEGRATIONS_DETAIL_SURFACE,
      integrationSlug: "mcp-server",
      action: "secondary",
      status: "beta",
      kind: "mcp-server",
    });
    expect(integrationsDetailInstallCopyAnalyticsEvent()).toBe(
      "integrations_detail_install_copy_click",
    );
    expect(
      integrationsDetailInstallCopyAnalyticsData(
        "raycast",
        0,
        2,
        "live",
        "extension",
      ),
    ).toEqual({
      surface: INTEGRATIONS_DETAIL_SURFACE,
      integrationSlug: "raycast",
      installIndex: 0,
      installCount: 2,
      status: "live",
      kind: "extension",
    });
  });

  it("maps integrations hub destinations", () => {
    expect(integrationsIndexCardDestination("mcp-server")).toEqual({
      to: "/integrations/$slug",
      params: { slug: "mcp-server" },
    });
    expect(integrationsIndexCardDestination("")).toBeNull();
    expect(integrationsIndexChromeDestination("ecosystem")).toEqual({
      to: "/ecosystem",
    });
    expect(integrationsIndexChromeDestination("api-docs")).toEqual({
      to: "/api-docs",
    });
    expect(integrationsIndexChromeDestination("unknown")).toBeNull();
    expect(integrationsDetailIndexDestination("integrations")).toEqual({
      to: "/integrations",
    });
    expect(integrationsDetailRelatedDestination("raycast")).toEqual({
      to: "/integrations/$slug",
      params: { slug: "raycast" },
    });
  });
});
