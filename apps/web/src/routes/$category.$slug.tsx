import { createFileRoute, redirect } from "@tanstack/react-router";
import { getEntry } from "@/data/search";
import { getEntryRedirectTarget } from "@/lib/entry-redirects";

export const Route = createFileRoute("/$category/$slug")({
  loader: ({ params, location }) => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 2) return null;

    // Consolidated/removed entries 301 straight to their surviving canonical page.
    const consolidated = getEntryRedirectTarget(params.category, params.slug);
    if (consolidated) {
      throw redirect({
        to: "/entry/$category/$slug",
        params: consolidated,
        replace: true,
        statusCode: 301,
      });
    }

    const entry = getEntry(params.category, params.slug);
    if (!entry) throw redirect({ to: "/browse", replace: true, statusCode: 301 });
    throw redirect({
      to: "/entry/$category/$slug",
      params: { category: entry.category, slug: entry.slug },
      replace: true,
      statusCode: 301,
    });
  },
});
