import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("PageHeader ancestor breadcrumbs", () => {
  it("opts out of marking the last crumb current for ancestor-only trails", () => {
    const pageHeaderSource = readFileSync(
      "apps/web/src/components/page-header.tsx",
      "utf8",
    );
    const breadcrumbsSource = readFileSync(
      "apps/web/src/components/breadcrumbs.tsx",
      "utf8",
    );

    expect(pageHeaderSource).toContain("markLastAsCurrent={false}");
    expect(breadcrumbsSource).toContain("markLastAsCurrent = true");
    expect(breadcrumbsSource).toContain(
      "const isCurrent = markLastAsCurrent && isLast",
    );
    expect(breadcrumbsSource).toContain("c.to && !isCurrent");
    expect(breadcrumbsSource).toContain(
      'aria-current={isCurrent ? "page" : undefined}',
    );
  });
});
