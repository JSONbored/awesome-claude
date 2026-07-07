import type { ShellNavLink } from "@/lib/app-shell-nav-lib";

export type FooterColumn = {
  id: string;
  title: string;
  links: ShellNavLink[];
  span?: 2 | 3 | 4;
};

export const SHELL_FOOTER_BRAND_SPAN = 4;
export const SHELL_FOOTER_GRID_COLUMNS = 12;

export const SHELL_FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "product",
    title: "Product",
    span: 2,
    links: [
      { to: "/browse", label: "Browse" },
      { to: "/trending", label: "Trending" },
      { to: "/tags", label: "Tags" },
      { to: "/for", label: "Platforms" },
      { to: "/best", label: "Best lists" },
      { to: "/compare", label: "Compare" },
      { to: "/quality", label: "Quality" },
      { to: "/changelog", label: "Changelog" },
      { to: "/brief", label: "Weekly Brief" },
    ],
  },
  {
    id: "contribution",
    title: "Contribution",
    span: 2,
    links: [
      { to: "/submit", label: "Submit a resource" },
      { to: "/claim", label: "Claim a listing" },
      { to: "/contributors", label: "Contributors" },
      { to: "/validators", label: "Review coverage" },
      { to: "/advertise", label: "Advertise" },
    ],
  },
  {
    id: "api-mcp",
    title: "API & MCP",
    span: 2,
    links: [
      { to: "/integrations", label: "All integrations" },
      { to: "/integrations/mcp-server", label: "MCP server" },
      { to: "/ecosystem", label: "Ecosystem" },
      { to: "/api-docs", label: "API docs" },
      { to: "/feeds", label: "Feeds" },
      { to: "/subscriptions", label: "Subscriptions" },
    ],
  },
  {
    id: "community",
    title: "Community",
    span: 2,
    links: [
      { to: "/about", label: "About" },
      { to: "/jobs", label: "Jobs" },
      { to: "/state-of-claude-tooling", label: "State of tooling" },
    ],
  },
];

export function footerColumnSpanClass(span: FooterColumn["span"] = 2): string {
  if (span === 4) return "md:col-span-4";
  if (span === 3) return "md:col-span-3";
  return "md:col-span-2";
}

export function shellFooterBrandSpanClass(span: number = SHELL_FOOTER_BRAND_SPAN): string {
  if (span === 4) return "md:col-span-4";
  if (span === 3) return "md:col-span-3";
  return "md:col-span-2";
}

export function shellFooterColumnSpans(
  columns: FooterColumn[] = SHELL_FOOTER_COLUMNS,
  brandSpan: number = SHELL_FOOTER_BRAND_SPAN,
): { brandSpan: number; linkSpans: number[]; totalSpan: number } {
  const linkSpans = columns.map((column) => column.span ?? 2);
  const totalSpan = brandSpan + linkSpans.reduce((sum, value) => sum + value, 0);
  return { brandSpan, linkSpans, totalSpan };
}

export function shellFooterLayoutFitsGrid(
  columns: FooterColumn[] = SHELL_FOOTER_COLUMNS,
  gridColumns: number = SHELL_FOOTER_GRID_COLUMNS,
  brandSpan: number = SHELL_FOOTER_BRAND_SPAN,
): boolean {
  return shellFooterColumnSpans(columns, brandSpan).totalSpan === gridColumns;
}
