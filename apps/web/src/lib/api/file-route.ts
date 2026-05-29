import { createFileRoute } from "@tanstack/react-router";

type ApiRouteHandler = (args: { request: Request; params: Record<string, string> }) => unknown;

type ApiRouteOptions = {
  server: {
    handlers: Record<string, ApiRouteHandler>;
  };
};

// API route files are generated into routeTree at build time. This wrapper keeps
// the generated route registration local to API files without repeating
// routeTree-related TypeScript suppressions in every endpoint.
export function createApiFileRoute(path: string) {
  return (options: ApiRouteOptions) =>
    (
      createFileRoute as unknown as (
        routePath: string,
      ) => (routeOptions: ApiRouteOptions) => unknown
    )(path)(options);
}
