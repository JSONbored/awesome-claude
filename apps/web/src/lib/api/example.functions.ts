import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

// Example createServerFn. Server-side handler invoked from the client:
//   const result = await getGreeting({ data: { name: "Ada" } })
// The .handler body runs server-only — imports used only inside it (like
// .server.ts modules) are tree-shaken from the client bundle. Module-level
// code here still ships to the client; for truly server-only helpers, put
// them in a .server.ts file. Use this pattern instead of Supabase Edge
// Functions for server logic.

export const getGreeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    const config = getServerConfig();
    return {
      greeting: `Hello, ${data.name}!`,
      mode: config.nodeEnv ?? "unknown",
    };
  });
