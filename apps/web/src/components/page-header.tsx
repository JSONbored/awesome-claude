import * as React from "react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { cn } from "@/lib/utils";

/**
 * Standard page header: ancestor breadcrumbs + eyebrow + h1 + description.
 *
 * `breadcrumbs` lists ANCESTORS ONLY — never the current page. The `<h1>` is the
 * "you are here", so repeating it as the last crumb directly above itself is the
 * redundancy this component removes. The route's `head()` still emits the full
 * `BreadcrumbList` JSON-LD (including the current page) for SEO, independent of
 * this visual trail. Top-level pages (whose only ancestor is Home) omit
 * `breadcrumbs` entirely and just show the heading.
 */
export function PageHeader({
  breadcrumbs,
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  /** Ancestor crumbs only (Home is added automatically). Omit for top-level pages. */
  breadcrumbs?: Crumb[];
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs home items={breadcrumbs} markLastAsCurrent={false} className="mb-6" />
      )}
      <SectionHeader
        as="h1"
        size="lg"
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={actions}
      />
    </div>
  );
}
