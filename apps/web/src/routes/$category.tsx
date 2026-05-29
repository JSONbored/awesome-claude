import { createFileRoute, redirect } from "@tanstack/react-router";
import { CATEGORIES } from "@/types/registry";

const categoryIds = new Set(CATEGORIES.map((category) => category.id));

export const Route = createFileRoute("/$category")({
  loader: ({ params }) => {
    if (!categoryIds.has(params.category as never)) {
      throw redirect({ to: "/browse", replace: true });
    }
    throw redirect({
      to: "/browse",
      search: { category: params.category },
      replace: true,
    });
  },
});
