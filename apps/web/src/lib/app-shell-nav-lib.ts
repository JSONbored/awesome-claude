export type ShellNavLink = {
  to: string;
  label: string;
  external?: boolean;
};

export type ShellNavSection = {
  id: string;
  label: string;
  links: ShellNavLink[];
};

/** Primary desktop navigation — high-traffic discovery paths. */
export const SHELL_PRIMARY_NAV: ShellNavLink[] = [
  { to: "/browse", label: "Browse" },
  { to: "/trending", label: "Trending" },
  { to: "/best", label: "Best" },
  { to: "/quality", label: "Quality" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/jobs", label: "Jobs" },
];

/** Grouped mobile navigation aligned with Technical Atlas shell paths. */
export const SHELL_MOBILE_NAV_SECTIONS: ShellNavSection[] = [
  {
    id: "explore",
    label: "Explore",
    links: [
      { to: "/browse", label: "Browse directory" },
      { to: "/trending", label: "Trending" },
      { to: "/best", label: "Best lists" },
      { to: "/tags", label: "Tags" },
      { to: "/for", label: "Platforms" },
      { to: "/compare", label: "Compare" },
    ],
  },
  {
    id: "trust",
    label: "Trust & quality",
    links: [
      { to: "/quality", label: "Quality signals" },
      { to: "/validators", label: "Review coverage" },
      { to: "/state-of-claude-tooling", label: "State of tooling" },
    ],
  },
  {
    id: "api-mcp",
    label: "API & MCP",
    links: [
      { to: "/integrations", label: "Integrations" },
      { to: "/integrations/mcp-server", label: "MCP server" },
      { to: "/api-docs", label: "API docs" },
      { to: "/feeds", label: "Feeds" },
    ],
  },
  {
    id: "community",
    label: "Community",
    links: [
      { to: "/submit", label: "Submit a resource" },
      { to: "/claim", label: "Claim a listing" },
      { to: "/contributors", label: "Contributors" },
      { to: "/about", label: "About HeyClaude" },
    ],
  },
];

export function shellNavItemActive(pathname: string, to: string): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function flattenShellMobileNav(): ShellNavLink[] {
  return SHELL_MOBILE_NAV_SECTIONS.flatMap((section) => section.links);
}
