import { createFileRoute, redirect } from "@tanstack/react-router";
import { getEntry } from "@/mocks/search";

export const Route = createFileRoute("/$category/$slug")({
  loader: ({ params }) => {
    const entry = getEntry(params.category, params.slug);
    if (!entry) throw redirect({ to: "/browse", replace: true });
    throw redirect({
      to: "/entry/$category/$slug",
      params: { category: entry.category, slug: entry.slug },
      replace: true,
    });
  },
});
