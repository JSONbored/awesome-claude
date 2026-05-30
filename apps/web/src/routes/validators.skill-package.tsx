import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/validators/skill-package")({
  loader: () => {
    throw redirect({ to: "/validators", replace: true });
  },
});
