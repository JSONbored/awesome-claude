import { ENTRIES } from "@/data/entries";
import {
  HARNESSES,
  PLATFORM_LABEL,
  type Category,
  type Platform,
  type PlatformSupport,
} from "@/types/registry";

const PLATFORM_TAGLINES: Record<Platform, string> = {
  "claude-code": "Claude Code resources and compatible workflows",
  "claude-desktop": "MCP servers and desktop-compatible setup paths",
  codex: "Codex-compatible prompts, commands, MCP, and workflows",
  cursor: "Cursor-compatible rules, adapters, and MCP resources",
  windsurf: "Windsurf-compatible rules and manual-context workflows",
  gemini: "Gemini-compatible prompts and manual-context resources",
  vscode: "VS Code-compatible tools and extensions",
  raycast: "Raycast extension and command-surface resources",
  cli: "Command-line tools and scriptable workflows",
  aider: "Aider recipes and compatible context packs",
  zed: "Zed extensions and agent-context resources",
  continue: "Continue.dev configs and compatible context packs",
};

export const SUPPORTED_PLATFORMS: { id: Platform; label: string; tagline: string }[] =
  HARNESSES.map((harness) => ({
    id: harness.id,
    label: harness.label,
    tagline: PLATFORM_TAGLINES[harness.id] ?? PLATFORM_LABEL[harness.id],
  }));

export interface PlatformRowEntry {
  category: Category;
  slug: string;
  title: string;
  support: PlatformSupport;
  installPath?: string;
  adapterPath?: string;
  verifiedAt?: string;
}

function compatibilityFor(platform: Platform, entry: (typeof ENTRIES)[number]) {
  return entry.platformCompatibility?.find((item) => item.platform === platform);
}

function supportFor(platform: Platform, entry: (typeof ENTRIES)[number]): PlatformSupport {
  const compatibility = compatibilityFor(platform, entry);
  if (compatibility?.support) return compatibility.support;
  if (entry.harness?.includes(platform) || entry.platforms.includes(platform))
    return "manual-context";
  return "unsupported";
}

export const PLATFORM_MATRIX = Object.fromEntries(
  HARNESSES.map((platform) => {
    const rows = ENTRIES.filter(
      (entry) => entry.harness?.includes(platform.id) || entry.platforms.includes(platform.id),
    )
      .map((entry) => {
        const compatibility = compatibilityFor(platform.id, entry);
        return {
          category: entry.category,
          slug: entry.slug,
          title: entry.title,
          support: supportFor(platform.id, entry),
          installPath: compatibility?.installPath,
          adapterPath: compatibility?.adapterPath,
          verifiedAt: compatibility?.verifiedAt ?? entry.reviewedAt,
        } satisfies PlatformRowEntry;
      })
      .filter((row) => row.support !== "unsupported")
      .sort((left, right) => {
        const supportRank: Record<PlatformSupport, number> = {
          "native-skill": 0,
          adapter: 1,
          "manual-context": 2,
          unsupported: 3,
        };
        return (
          supportRank[left.support] - supportRank[right.support] ||
          String(right.verifiedAt ?? "").localeCompare(String(left.verifiedAt ?? "")) ||
          left.title.localeCompare(right.title)
        );
      })
      .slice(0, 8);
    return [platform.id, rows];
  }),
) as Record<Platform, PlatformRowEntry[]>;
