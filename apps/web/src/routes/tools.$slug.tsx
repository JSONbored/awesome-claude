import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getCommercialTool } from "@/data/tools";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getCommercialTool(params.slug);
    if (!tool) throw notFound();
    throw redirect({
      to: "/entry/$category/$slug",
      params: { category: "tools", slug: tool.slug },
      replace: true,
      statusCode: 301,
    });
  },
  head: () => ({ meta: [{ title: "HeyClaude tools" }] }),
  component: () => null,
});
