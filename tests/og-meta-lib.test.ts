import { describe, expect, it } from "vitest";

import { OG_HEIGHT, OG_WIDTH } from "../apps/web/src/lib/og-image";
import { ogImageMetaTags } from "../apps/web/src/lib/og-meta-lib";

describe("ogImageMetaTags", () => {
  it("emits the og:image tags and the twitter card, in order", () => {
    expect(ogImageMetaTags("https://heyclau.de/og/agents/a")).toEqual([
      { property: "og:image", content: "https://heyclau.de/og/agents/a" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: String(OG_WIDTH) },
      { property: "og:image:height", content: String(OG_HEIGHT) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://heyclau.de/og/agents/a" },
    ]);
  });

  it("declares the same dimensions the card is rendered at", () => {
    const tags = ogImageMetaTags("https://x.dev/card.png");
    expect(tags[2]).toEqual({
      property: "og:image:width",
      content: String(OG_WIDTH),
    });
    expect(tags[3]).toEqual({
      property: "og:image:height",
      content: String(OG_HEIGHT),
    });
    expect(OG_WIDTH).toBe(1200);
    expect(OG_HEIGHT).toBe(630);
  });

  it("inserts og:type between the image tags and the twitter card when given", () => {
    const tags = ogImageMetaTags("https://x.dev/card.png", "article");
    expect(tags).toHaveLength(7);
    expect(tags[4]).toEqual({ property: "og:type", content: "article" });
    expect(tags[5]).toEqual({
      name: "twitter:card",
      content: "summary_large_image",
    });
  });

  it("omits og:type when not given", () => {
    const tags = ogImageMetaTags("https://x.dev/card.png");
    expect(tags).toHaveLength(6);
    expect(tags.some((t) => "property" in t && t.property === "og:type")).toBe(
      false,
    );
  });

  it("uses the same image url for og:image and twitter:image", () => {
    const tags = ogImageMetaTags("https://x.dev/card.png");
    const urls = tags
      .filter((t) => "content" in t && t.content.startsWith("https://x.dev"))
      .map((t) => t.content);
    expect(urls).toEqual(["https://x.dev/card.png", "https://x.dev/card.png"]);
  });
});
