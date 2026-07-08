// Pure FAQ builder for a category landing page, split out of the $category route
// so the question set and description/usage fallbacks can be unit-tested.

import { categoryDescriptions, categoryUsageHints } from "@/lib/site";

export function faqFor(id: string, label: string): Array<{ q: string; a: string }> {
  return [
    {
      q: `What are Claude ${label}?`,
      a:
        categoryDescriptions[id] ??
        `Claude ${label} are community-submitted resources curated in the HeyClaude directory.`,
    },
    {
      q: `How do I use ${label} from HeyClaude?`,
      a:
        categoryUsageHints[id] ??
        `Open any entry to see install or usage details, copy the snippet or config, and review the linked source before adding it to your Claude setup.`,
    },
    {
      q: `Are HeyClaude ${label} reviewed before they are listed?`,
      a: "Each entry is metadata-reviewed for source, trust, and safety/privacy signals before it appears. HeyClaude does not scan for malware, so always review the linked source before installing anything that touches your filesystem, network, or credentials.",
    },
  ];
}
