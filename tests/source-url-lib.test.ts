import { describe, expect, it } from "vitest";

import {
  canonicalizeSourceUrl,
  hasAffiliateParam,
  hasEmbeddedUrlUserinfo,
  isAffiliateParam,
  isPublicGitHubHostUrl,
  isPublicGitHubProfileUrl,
  isPublicHttpUrl,
  isPublicHttpsUrl,
  isTrackingParam,
  publicHttpUrlHref,
  publicUrlHostname,
  stripTrackingParams,
} from "../packages/registry/src/source-url-lib.js";
import { RESERVED_OWNERS } from "../packages/registry/src/source-repo-lib.js";

const AFFILIATE_PARAMS = [
  "aff",
  "affiliate",
  "affiliate_id",
  "campaign",
  "coupon",
  "irclickid",
  "partner",
  "ref",
  "referral",
  "referral_code",
  "via",
];

const ANALYTICS_PARAMS = [
  "_hsenc",
  "_hsmi",
  "fbclid",
  "gclid",
  "gclsrc",
  "igshid",
  "mc_cid",
  "mc_eid",
  "msclkid",
  "pk_campaign",
  "pk_kwd",
  "rb_clickid",
  "s_cid",
  "twclid",
  "yclid",
];

describe("isPublicHttpsUrl", () => {
  it("accepts clean https URLs and optional empty values", () => {
    expect(isPublicHttpsUrl("")).toBe(true);
    expect(isPublicHttpsUrl("https://github.com/example/repo")).toBe(true);
  });

  it("rejects http URLs and embedded userinfo credentials", () => {
    expect(isPublicHttpsUrl("http://example.com/repo")).toBe(false);
    expect(
      isPublicHttpsUrl("https://github.com@evil.example.com/owner/repo"),
    ).toBe(false);
    expect(isPublicHttpsUrl("https://token@github.com/owner/repo")).toBe(false);
    expect(isPublicHttpsUrl("https://user:pass@github.com/owner/repo")).toBe(
      false,
    );
    expect(
      isPublicHttpsUrl("https://user%40name:pass@github.com/owner/repo"),
    ).toBe(false);
  });
});

describe("public URL userinfo helpers", () => {
  it("detects embedded userinfo across common credential shapes", () => {
    expect(hasEmbeddedUrlUserinfo("https://token@github.com/owner/repo")).toBe(
      true,
    );
    expect(hasEmbeddedUrlUserinfo("https://user:pass@example.com/docs")).toBe(
      true,
    );
    expect(hasEmbeddedUrlUserinfo("https://github.com/owner/repo")).toBe(false);
    expect(hasEmbeddedUrlUserinfo("not a url")).toBe(false);
  });

  it("validates public http and https URLs without userinfo", () => {
    expect(isPublicHttpUrl("http://example.com/docs")).toBe(true);
    expect(isPublicHttpUrl("https://example.com/docs")).toBe(true);
    expect(isPublicHttpUrl("https://token@example.com/docs")).toBe(false);
    expect(isPublicHttpUrl("ftp://example.com/docs")).toBe(false);
    expect(isPublicHttpUrl("")).toBe(true);
  });

  it("extracts hostnames and hrefs only from credential-free URLs", () => {
    expect(publicUrlHostname("https://www.Example.com/path")).toBe(
      "example.com",
    );
    expect(publicUrlHostname("https://token@example.com/path")).toBe("");
    expect(publicHttpUrlHref("https://example.com/path")).toBe(
      "https://example.com/path",
    );
    expect(publicHttpUrlHref("https://token@example.com/path")).toBe("");
    expect(publicHttpUrlHref("ftp://example.com/path")).toBe("");
  });

  it("validates GitHub profile and host URLs without userinfo", () => {
    expect(isPublicGitHubProfileUrl("https://github.com/octocat")).toBe(true);
    expect(isPublicGitHubProfileUrl("https://token@github.com/octocat")).toBe(
      false,
    );
    expect(isPublicGitHubProfileUrl("https://github.com/octocat/repo")).toBe(
      false,
    );
    expect(isPublicGitHubHostUrl("https://github.com/octocat/repo")).toBe(true);
    expect(isPublicGitHubHostUrl("https://token@github.com/octocat/repo")).toBe(
      false,
    );
    expect(isPublicGitHubHostUrl("https://gist.github.com/octocat")).toBe(true);
  });

  it("treats http and www GitHub hosts as public", () => {
    expect(isPublicGitHubHostUrl("http://github.com/octocat")).toBe(true);
    expect(isPublicGitHubHostUrl("https://www.github.com/octocat")).toBe(true);
    expect(isPublicGitHubHostUrl("https://raw.githubusercontent.com/x")).toBe(
      false,
    );
  });

  it("rejects non-http(s) URLs even on a GitHub host", () => {
    // A GitHub hostname over ftp/ws is not a public GitHub web URL; the protocol
    // guard matches the sibling public-URL validators.
    expect(isPublicGitHubHostUrl("ftp://github.com/octocat")).toBe(false);
    expect(isPublicGitHubHostUrl("ws://raw.github.com/socket")).toBe(false);
    expect(isPublicGitHubHostUrl("ssh://git@github.com/owner/repo")).toBe(
      false,
    );
  });

  it("rejects reserved GitHub product surfaces as profiles", () => {
    // A single path segment that is a reserved GitHub page is not a user
    // profile, mirroring how the repo-URL parser rejects reserved owners.
    for (const surface of [
      "features",
      "sponsors",
      "about",
      "pricing",
      "settings",
      "marketplace",
      "explore",
      "security",
    ]) {
      expect(isPublicGitHubProfileUrl(`https://github.com/${surface}`)).toBe(
        false,
      );
    }
  });

  it("matches reserved surfaces case-insensitively", () => {
    expect(isPublicGitHubProfileUrl("https://github.com/Sponsors")).toBe(false);
    expect(isPublicGitHubProfileUrl("https://github.com/FEATURES")).toBe(false);
  });

  it("still accepts an ordinary account whose name is not reserved", () => {
    expect(isPublicGitHubProfileUrl("https://github.com/octocat")).toBe(true);
    // A name that merely contains a reserved word is a real account.
    expect(isPublicGitHubProfileUrl("https://github.com/features-bot")).toBe(
      true,
    );
  });

  it("rejects every reserved owner the repo parser knows about", () => {
    // Shared source of truth: the profile checker must not drift from the
    // repo-URL parser's reserved list.
    for (const owner of RESERVED_OWNERS) {
      expect(isPublicGitHubProfileUrl(`https://github.com/${owner}`)).toBe(
        false,
      );
    }
  });
});

describe("isAffiliateParam", () => {
  it.each(AFFILIATE_PARAMS)("treats %s as an affiliate param", (name) => {
    expect(isAffiliateParam(name)).toBe(true);
    expect(isAffiliateParam(name.toUpperCase())).toBe(true);
    expect(isAffiliateParam(`  ${name}  `)).toBe(true);
  });

  it("treats every utm_* prefix as affiliate noise", () => {
    for (const name of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "utm_id",
    ]) {
      expect(isAffiliateParam(name), name).toBe(true);
    }
  });

  it("rejects meaningful query params", () => {
    expect(isAffiliateParam("version")).toBe(false);
    expect(isAffiliateParam("tab")).toBe(false);
    expect(isAffiliateParam("ref-page")).toBe(false);
  });

  it("normalizes nullish and blank names to non-affiliate", () => {
    expect(isAffiliateParam(null)).toBe(false);
    expect(isAffiliateParam(undefined)).toBe(false);
    expect(isAffiliateParam("")).toBe(false);
    expect(isAffiliateParam("   ")).toBe(false);
  });
});

describe("isTrackingParam", () => {
  it.each(ANALYTICS_PARAMS)("treats %s as a tracking param", (name) => {
    expect(isTrackingParam(name)).toBe(true);
    expect(isTrackingParam(name.toUpperCase())).toBe(true);
  });

  it("includes affiliate params in the tracking set", () => {
    expect(isTrackingParam("ref")).toBe(true);
    expect(isTrackingParam("utm_source")).toBe(true);
    expect(isTrackingParam("via")).toBe(true);
  });

  it("rejects meaningful params that are not promotional noise", () => {
    expect(isTrackingParam("version")).toBe(false);
    expect(isTrackingParam("page")).toBe(false);
    expect(isTrackingParam("install")).toBe(false);
  });
});

describe("hasAffiliateParam", () => {
  it.each(AFFILIATE_PARAMS)("detects %s on a URL", (name) => {
    expect(hasAffiliateParam(`https://example.com/docs?${name}=creator`)).toBe(
      true,
    );
  });

  it("detects utm params on a URL", () => {
    expect(
      hasAffiliateParam("https://example.com/docs?utm_source=newsletter"),
    ).toBe(true);
  });

  it("returns false when only meaningful params are present", () => {
    expect(hasAffiliateParam("https://example.com/docs?version=1")).toBe(false);
    expect(hasAffiliateParam("https://example.com/docs?tab=readme")).toBe(
      false,
    );
  });

  it("returns false for empty, invalid, and non-URL input", () => {
    expect(hasAffiliateParam("")).toBe(false);
    expect(hasAffiliateParam("   ")).toBe(false);
    expect(hasAffiliateParam(null)).toBe(false);
    expect(hasAffiliateParam("not a url")).toBe(false);
  });

  it("detects affiliate params among other query keys", () => {
    expect(
      hasAffiliateParam(
        "https://example.com/docs?version=2&ref=creator&tab=install",
      ),
    ).toBe(true);
  });
});

describe("stripTrackingParams", () => {
  it("strips affiliate and analytics params while preserving meaningful params", () => {
    expect(
      stripTrackingParams(
        "https://example.com/docs?utm_source=newsletter&version=1&fbclid=abc",
      ),
    ).toBe("https://example.com/docs?version=1");
  });

  it.each([...AFFILIATE_PARAMS, ...ANALYTICS_PARAMS])(
    "removes %s but keeps meaningful params",
    (name) => {
      expect(
        stripTrackingParams(
          `https://example.com/docs?${name}=noise&version=beta`,
        ),
      ).toBe("https://example.com/docs?version=beta");
    },
  );

  it("preserves multiple meaningful params in insertion order", () => {
    expect(
      stripTrackingParams(
        "https://example.com/docs?gclid=abc&version=1&tab=install&ref=noise",
      ),
    ).toBe("https://example.com/docs?version=1&tab=install");
  });

  it("returns an empty string for blank input", () => {
    expect(stripTrackingParams("")).toBe("");
    expect(stripTrackingParams("   ")).toBe("");
    expect(stripTrackingParams(null)).toBe("");
  });

  it("returns the original text for invalid URLs", () => {
    expect(stripTrackingParams("not a url")).toBe("not a url");
  });

  it("leaves URLs without query params unchanged", () => {
    expect(stripTrackingParams("https://example.com/docs/install")).toBe(
      "https://example.com/docs/install",
    );
  });
});

describe("canonicalizeSourceUrl", () => {
  it("strips tracking params, hashes, www, and trailing slashes", () => {
    expect(
      canonicalizeSourceUrl(
        "https://www.Example.com/docs/?utm_source=newsletter&b=2&a=1#install",
      ),
    ).toBe("https://example.com/docs?a=1&b=2");
  });

  it("strips embedded userinfo so duplicate keys ignore credential noise", () => {
    const canonical = "https://github.com/example/demo";
    expect(canonicalizeSourceUrl("https://token@github.com/example/demo")).toBe(
      canonical,
    );
    expect(
      canonicalizeSourceUrl("https://user:pass@github.com/example/demo"),
    ).toBe(canonical);
    expect(
      canonicalizeSourceUrl("https://github.com@evil.example.com/example/demo"),
    ).not.toBe(canonical);
  });

  it("sorts query params lexicographically", () => {
    expect(canonicalizeSourceUrl("https://example.com/docs?z=9&m=1&a=2")).toBe(
      "https://example.com/docs?a=2&m=1&z=9",
    );
  });

  it("lowercases the hostname and protocol while preserving path case", () => {
    expect(
      canonicalizeSourceUrl(
        "https://www.Example.com/Docs/Install?Version=Beta#intro",
      ),
    ).toBe("https://example.com/Docs/Install?Version=Beta");
  });

  it("treats path case as significant for duplicate comparison", () => {
    expect(canonicalizeSourceUrl("https://example.com/Docs")).not.toBe(
      canonicalizeSourceUrl("https://example.com/docs"),
    );
  });

  it("removes only the root trailing slash", () => {
    expect(canonicalizeSourceUrl("https://example.com/docs/")).toBe(
      "https://example.com/docs",
    );
    expect(canonicalizeSourceUrl("https://example.com/")).toBe(
      "https://example.com/",
    );
  });

  it("returns an empty string for blank input", () => {
    expect(canonicalizeSourceUrl("")).toBe("");
    expect(canonicalizeSourceUrl("   ")).toBe("");
    expect(canonicalizeSourceUrl(null)).toBe("");
  });

  it("lowercases invalid URL text after stripping tracking params", () => {
    expect(canonicalizeSourceUrl("not a url")).toBe("not a url");
    expect(canonicalizeSourceUrl("HTTPS://NOT-A-URL")).toBe(
      "https://not-a-url/",
    );
  });

  it("canonicalizes http URLs and strips mixed tracking noise", () => {
    expect(
      canonicalizeSourceUrl(
        "http://www.example.com/path/?fbclid=abc&version=1&ref=creator",
      ),
    ).toBe("http://example.com/path?version=1");
  });

  it("preserves duplicate meaningful params in sorted order", () => {
    expect(canonicalizeSourceUrl("https://example.com/docs?b=2&a=1&b=3")).toBe(
      "https://example.com/docs?a=1&b=2&b=3",
    );
  });
});

describe("canonicalizeSourceUrl affiliate stripping integration", () => {
  it.each(AFFILIATE_PARAMS)(
    "ignores %s when canonicalizing duplicate keys",
    (name) => {
      expect(
        canonicalizeSourceUrl(
          `https://example.com/docs?${name}=creator&version=1`,
        ),
      ).toBe("https://example.com/docs?version=1");
    },
  );

  it.each(ANALYTICS_PARAMS)(
    "ignores analytics param %s during canonicalization",
    (name) => {
      expect(
        canonicalizeSourceUrl(`https://example.com/docs?${name}=abc&tab=main`),
      ).toBe("https://example.com/docs?tab=main");
    },
  );
});

describe("source URL helper stability", () => {
  it("returns stable canonical output across repeated calls", () => {
    const input = "https://www.Example.com/docs/?utm_source=x&b=2&a=1#install";
    expect(canonicalizeSourceUrl(input)).toBe(canonicalizeSourceUrl(input));
  });

  it("returns stable stripped output across repeated calls", () => {
    const input = "https://example.com/docs?utm_source=x&version=1";
    expect(stripTrackingParams(input)).toBe(stripTrackingParams(input));
  });
});

describe("stripTrackingParams advanced cases", () => {
  it("preserves ports and paths while stripping only tracking keys", () => {
    expect(
      stripTrackingParams(
        "https://example.com:8443/docs/install?gclid=abc&version=1",
      ),
    ).toBe("https://example.com:8443/docs/install?version=1");
  });

  it("preserves hash fragments while stripping tracking query params", () => {
    expect(
      stripTrackingParams("https://example.com/docs?ref=creator#install"),
    ).toBe("https://example.com/docs#install");
  });

  it("keeps encoded meaningful params untouched", () => {
    expect(
      stripTrackingParams(
        "https://example.com/docs?utm_campaign=x&q=claude%20code",
      ),
    ).toBe("https://example.com/docs?q=claude+code");
  });

  it("removes only tracking keys from a long mixed query string", () => {
    const stripped = stripTrackingParams(
      [
        "https://example.com/docs?",
        "utm_source=newsletter",
        "&fbclid=abc",
        "&version=2",
        "&tab=install",
        "&ref=creator",
        "&gclid=tracking",
      ].join(""),
    );
    expect(stripped).toBe("https://example.com/docs?version=2&tab=install");
  });
});

describe("canonicalizeSourceUrl advanced normalization", () => {
  it("canonicalizes URLs with explicit ports", () => {
    expect(
      canonicalizeSourceUrl(
        "https://www.Example.com:8443/docs/?utm_source=x&z=1&a=2",
      ),
    ).toBe("https://example.com:8443/docs?a=2&z=1");
  });

  it("treats equivalent tracking-stripped URLs as duplicates", () => {
    const left = canonicalizeSourceUrl(
      "https://example.com/docs?version=1&utm_source=newsletter",
    );
    const right = canonicalizeSourceUrl(
      "https://www.example.com/docs/?fbclid=abc&version=1",
    );
    expect(left).toBe(right);
  });

  it("keeps distinct meaningful params from collapsing into duplicates", () => {
    expect(
      canonicalizeSourceUrl("https://example.com/docs?version=1"),
    ).not.toBe(canonicalizeSourceUrl("https://example.com/docs?version=2"));
  });

  it("canonicalizes nested paths without stripping interior slashes", () => {
    expect(
      canonicalizeSourceUrl(
        "https://example.com/org/repo/tree/main/src/?gclid=abc",
      ),
    ).toBe("https://example.com/org/repo/tree/main/src");
  });

  it("preserves percent-encoded meaningful params after sorting", () => {
    expect(
      canonicalizeSourceUrl(
        "https://example.com/docs?z=last&q=claude%20code&a=first",
      ),
    ).toBe("https://example.com/docs?a=first&q=claude+code&z=last");
  });
});

describe("hasAffiliateParam advanced detection", () => {
  it("detects affiliate params on URLs with ports and fragments", () => {
    expect(
      hasAffiliateParam("https://example.com:8443/docs?ref=creator#install"),
    ).toBe(true);
  });

  it("returns false when only analytics params are present", () => {
    expect(hasAffiliateParam("https://example.com/docs?fbclid=abc")).toBe(
      false,
    );
  });

  it("detects utm params on http URLs", () => {
    expect(hasAffiliateParam("http://example.com/docs?utm_medium=email")).toBe(
      true,
    );
  });
});

describe("isAffiliateParam and isTrackingParam alias behavior", () => {
  it("treats referral_code and affiliate_id as affiliate params", () => {
    expect(isAffiliateParam("referral_code")).toBe(true);
    expect(isAffiliateParam("affiliate_id")).toBe(true);
    expect(isTrackingParam("referral_code")).toBe(true);
  });

  it("treats underscore-prefixed analytics keys as tracking-only", () => {
    expect(isAffiliateParam("_hsenc")).toBe(false);
    expect(isTrackingParam("_hsenc")).toBe(true);
    expect(isAffiliateParam("_hsmi")).toBe(false);
    expect(isTrackingParam("_hsmi")).toBe(true);
  });
});

describe("canonicalizeSourceUrl duplicate comparison matrix", () => {
  const canonical = "https://example.com/docs/install?a=1&b=2";

  it.each([
    "https://www.example.com/docs/install?b=2&a=1&utm_source=x",
    "https://EXAMPLE.com/docs/install/?fbclid=abc&a=1&b=2#section",
    "HTTPS://www.Example.com/docs/install?gclid=tracking&b=2&a=1",
  ])("normalizes %s to the same canonical key", (input) => {
    expect(canonicalizeSourceUrl(input)).toBe(canonical);
  });

  it.each([
    "https://example.com/docs/install?a=1&b=3",
    "https://example.com/docs/install-other?a=1&b=2",
    "https://example.org/docs/install?a=1&b=2",
  ])("keeps %s distinct from the canonical key", (input) => {
    expect(canonicalizeSourceUrl(input)).not.toBe(canonical);
  });
});

describe("stripTrackingParams duplicate preservation matrix", () => {
  it.each([
    ["https://example.com/a?ref=x&keep=1", "https://example.com/a?keep=1"],
    ["https://example.com/a?fbclid=x&keep=1", "https://example.com/a?keep=1"],
    [
      "https://example.com/a?utm_medium=email&keep=1",
      "https://example.com/a?keep=1",
    ],
    [
      "https://example.com/a?msclkid=x&partner=y&keep=1",
      "https://example.com/a?keep=1",
    ],
  ])("strips tracking noise from %s", (input, expected) => {
    expect(stripTrackingParams(input)).toBe(expected);
  });
});

describe("isAffiliateParam exhaustive utm coverage", () => {
  it.each([
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "utm_reader",
    "utm_custom_field",
  ])("treats %s as affiliate noise", (name) => {
    expect(isAffiliateParam(name)).toBe(true);
    expect(isTrackingParam(name)).toBe(true);
    expect(hasAffiliateParam(`https://example.com/docs?${name}=value`)).toBe(
      true,
    );
  });
});

describe("isTrackingParam exhaustive analytics coverage", () => {
  it.each(ANALYTICS_PARAMS)("marks %s as tracking-only noise", (name) => {
    expect(isTrackingParam(name)).toBe(true);
    expect(
      stripTrackingParams(`https://example.com/docs?${name}=abc&keep=1`),
    ).toBe("https://example.com/docs?keep=1");
  });
});

describe("hasAffiliateParam partner and coupon campaigns", () => {
  it.each(["partner", "coupon", "campaign", "via", "aff", "affiliate"])(
    "detects %s on marketing URLs",
    (name) => {
      const url = `https://docs.example.com/start?${name}=spring-sale&page=1`;
      expect(hasAffiliateParam(url)).toBe(true);
      expect(stripTrackingParams(url)).toBe(
        "https://docs.example.com/start?page=1",
      );
      expect(canonicalizeSourceUrl(url)).toBe(
        "https://docs.example.com/start?page=1",
      );
    },
  );
});

describe("canonicalizeSourceUrl registry comparison scenarios", () => {
  it("normalizes common GitHub source URL variants", () => {
    const canonical = "https://github.com/org/repo/tree/main/docs";
    expect(
      canonicalizeSourceUrl(
        "https://www.github.com/org/repo/tree/main/docs/?utm_source=newsletter",
      ),
    ).toBe(canonical);
    expect(
      canonicalizeSourceUrl(
        "https://github.com/org/repo/tree/main/docs?fbclid=abc",
      ),
    ).toBe(canonical);
  });

  it("normalizes npm package doc URLs with tracking stripped", () => {
    expect(
      canonicalizeSourceUrl(
        "https://www.npmjs.com/package/example?activeTab=readme&ref=creator",
      ),
    ).toBe("https://npmjs.com/package/example?activeTab=readme");
  });

  it("normalizes documentation URLs with multiple meaningful params", () => {
    expect(
      canonicalizeSourceUrl(
        "https://docs.example.com/guide?lang=en&utm_campaign=x&section=install",
      ),
    ).toBe("https://docs.example.com/guide?lang=en&section=install");
  });

  it("keeps subdomain hosts distinct from apex hosts", () => {
    expect(canonicalizeSourceUrl("https://docs.example.com/guide")).not.toBe(
      canonicalizeSourceUrl("https://example.com/guide"),
    );
  });
});

describe("stripTrackingParams registry comparison scenarios", () => {
  it("strips mixed affiliate and analytics params from registry doc URLs", () => {
    expect(
      stripTrackingParams(
        "https://registry.example.com/entry/demo?utm_source=email&fbclid=abc&version=2",
      ),
    ).toBe("https://registry.example.com/entry/demo?version=2");
  });

  it("preserves install/version params used for source matching", () => {
    expect(
      stripTrackingParams(
        "https://example.com/install?version=3&platform=mac&ref=affiliate",
      ),
    ).toBe("https://example.com/install?version=3&platform=mac");
  });
});

describe("source URL lib edge inputs", () => {
  it("handles numeric and object inputs via string coercion", () => {
    expect(isAffiliateParam(0)).toBe(false);
    expect(hasAffiliateParam(0)).toBe(false);
    expect(stripTrackingParams(0)).toBe("0");
    expect(canonicalizeSourceUrl(0)).toBe("0");
  });

  it("handles tab and language params as meaningful during canonicalization", () => {
    expect(isTrackingParam("lang")).toBe(false);
    expect(isTrackingParam("tab")).toBe(false);
    expect(
      canonicalizeSourceUrl("https://example.com/docs?tab=readme&lang=en"),
    ).toBe("https://example.com/docs?lang=en&tab=readme");
  });
});

describe("AFFILIATE_PARAMS direct classification table", () => {
  it.each(AFFILIATE_PARAMS)(
    "classifies %s consistently across helpers",
    (name) => {
      expect(isAffiliateParam(name)).toBe(true);
      expect(isTrackingParam(name)).toBe(true);
      expect(
        stripTrackingParams(`https://example.com/x?${name}=1&keep=yes`),
      ).toBe("https://example.com/x?keep=yes");
      expect(
        canonicalizeSourceUrl(`https://example.com/x?${name}=1&keep=yes`),
      ).toBe("https://example.com/x?keep=yes");
      expect(hasAffiliateParam(`https://example.com/x?${name}=1`)).toBe(true);
    },
  );
});

describe("ANALYTICS_PARAMS direct classification table", () => {
  it.each(ANALYTICS_PARAMS)("classifies %s as tracking-only noise", (name) => {
    expect(isAffiliateParam(name)).toBe(false);
    expect(isTrackingParam(name)).toBe(true);
    expect(
      stripTrackingParams(`https://example.com/x?${name}=1&keep=yes`),
    ).toBe("https://example.com/x?keep=yes");
  });
});

describe("canonicalizeSourceUrl path normalization table", () => {
  it.each([
    ["https://example.com/docs/", "https://example.com/docs"],
    ["https://example.com/docs/install/", "https://example.com/docs/install"],
    ["https://example.com/", "https://example.com/"],
    ["https://example.com/a/b/c/", "https://example.com/a/b/c"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(canonicalizeSourceUrl(input)).toBe(expected);
  });
});
