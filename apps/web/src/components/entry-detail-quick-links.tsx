import { Link } from "@tanstack/react-router";
import { BookOpen, Code2, ExternalLink, GitBranch } from "lucide-react";
import type { EntryQuickLink } from "@/lib/entry-detail-sidebar-lib";

const QUICK_LINK_ICONS = {
  docs: BookOpen,
  source: GitBranch,
  "registry-json": Code2,
} as const;

export function EntryDetailQuickLinks({
  links,
  className,
}: {
  links: EntryQuickLink[];
  className?: string;
}) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="Entry resource links"
      className={className ?? "mt-3 flex flex-col gap-1.5 text-xs"}
    >
      {links.map((link) => {
        const Icon = QUICK_LINK_ICONS[link.id as keyof typeof QUICK_LINK_ICONS] ?? Code2;
        if (link.href) {
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {link.label}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          );
        }
        if (link.to) {
          return (
            <Link
              key={link.id}
              to={link.to}
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {link.label}
            </Link>
          );
        }
        return null;
      })}
    </nav>
  );
}
