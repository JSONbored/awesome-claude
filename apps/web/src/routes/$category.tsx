import { createFileRoute, redirect } from "@tanstack/react-router";
import { CATEGORIES } from "@/types/registry";

const categoryIds = new Set(CATEGORIES.map((category) => category.id));

export const Route = createFileRoute("/$category")({
  loader: ({ params, location }) => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 1) return null;

    if (!categoryIds.has(params.category as never)) {
      throw redirect({ to: "/browse", replace: true, statusCode: 301 });
    }
    throw redirect({
      to: "/browse",
      search: { category: params.category },
      replace: true,
      statusCode: 301,
    });
  },
});
