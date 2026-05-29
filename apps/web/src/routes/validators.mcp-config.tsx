import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/validators/mcp-config")({
  loader: () => {
    throw redirect({ to: "/validators", replace: true });
  },
});
