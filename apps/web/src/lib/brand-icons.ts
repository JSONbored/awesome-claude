import {
  isAllowedBrandAssetUrl,
  normalizeBrandDomain,
  shouldAutoResolveBrandAsset,
} from "@heyclaude/registry/brand-assets";

export type BrandIconTarget = {
  title?: string;
  name?: string;
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  brandAssetSource?: string;
  tags?: readonly string[];
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export function brandIconSourceLooksBrandfetch(value: unknown): boolean {
  const raw = clean(value);
  if (!raw) return false;
  if (raw.startsWith("/api/brand-assets/")) return true;

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase();
    return (
      host === "cdn.brandfetch.io" ||
      host === "asset.brandfetch.io" ||
      (host === "heyclau.de" && parsed.pathname.startsWith("/api/brand-assets/"))
    );
  } catch {
    return false;
  }
}

function brandAssetSource(target: BrandIconTarget): string {
  const source = clean(target.brandAssetSource).toLowerCase();
  if (source) return source;
  return brandIconSourceLooksBrandfetch(target.brandIconUrl) ? "brandfetch" : "";
}

export function brandDisplayName(target: BrandIconTarget): string {
  return (
    clean(target.brandName) ||
    clean(target.name) ||
    clean(target.title) ||
    clean(target.brandDomain) ||
    "Brand"
  );
}

export function hasDisplayableBrandIcon(target: BrandIconTarget | null | undefined): boolean {
  if (!target) return false;
  const iconUrl = clean(target.brandIconUrl);
  if (!iconUrl || !isAllowedBrandAssetUrl(iconUrl)) return false;

  const source = brandAssetSource(target);
  if (source === "none") return false;

  if (source === "brandfetch") {
    const domain = normalizeBrandDomain(target.brandDomain);
    if (!domain) return false;
    return shouldAutoResolveBrandAsset(domain, {
      brandName: clean(target.brandName) || clean(target.name),
      title: clean(target.title) || clean(target.name),
      tags: Array.isArray(target.tags) ? [...target.tags] : [],
    });
  }

  return true;
}

export function displayableBrandIconUrl(
  target: BrandIconTarget | null | undefined,
): string | undefined {
  if (!target || !hasDisplayableBrandIcon(target)) return undefined;
  return clean(target.brandIconUrl) || undefined;
}

export function brandIdentityLabel(target: BrandIconTarget | null | undefined): string {
  if (!target) return "";
  if (hasDisplayableBrandIcon(target)) return brandDisplayName(target);

  const source = brandAssetSource(target);
  if (source && source !== "brandfetch" && source !== "none") {
    return brandDisplayName(target);
  }

  return "";
}
