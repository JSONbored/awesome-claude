// Pure per-category facet derivation for the entry-facets panel, split out of
// entry-facets.tsx so the category → facet mapping can be unit-tested without
// rendering React.

import type { ElementType } from "react";
import { Layers, ShieldCheck, Sparkles, Terminal, Zap } from "lucide-react";

import { type Entry } from "@/types/registry";

export interface Facet {
  label: string;
  value: string;
  detail?: string;
  icon?: ElementType;
  tone?: "default" | "accent" | "trust";
  mono?: boolean;
}

/**
 * Category-specific metadata rows the generic card otherwise hides: hook
 * trigger, command syntax, statusline language, skill level/type/verification,
 * and collection bundle size. Returns `[]` when the category has no facet or the
 * relevant field is absent.
 */
export function facetsFor(e: Entry): Facet[] {
  switch (e.category) {
    case "hooks":
      return e.trigger
        ? [
            {
              label: "Trigger",
              value: e.trigger,
              icon: Zap,
              tone: "accent",
              detail: "Runs at this lifecycle event. Keep idempotent.",
            },
          ]
        : [];
    case "commands":
      return e.commandSyntax
        ? [
            {
              label: "Invocation",
              value: e.commandSyntax,
              icon: Terminal,
              mono: true,
            },
          ]
        : [];
    case "statuslines":
      return e.scriptLanguage
        ? [
            {
              label: "Language",
              value: e.scriptLanguage,
              icon: Terminal,
              detail: "Runs on every prompt render — keep fast and side-effect free.",
            },
          ]
        : [];
    case "skills": {
      const out: Facet[] = [];
      if (e.skillLevel) out.push({ label: "Level", value: e.skillLevel, icon: Sparkles });
      if (e.skillType) out.push({ label: "Type", value: e.skillType });
      if (e.verificationStatus)
        out.push({
          label: "Verified",
          value: e.verificationStatus,
          icon: ShieldCheck,
        });
      return out;
    }
    case "collections":
      return e.items && e.items.length > 0
        ? [
            {
              label: "Bundle",
              value: `${e.items.length} item${e.items.length === 1 ? "" : "s"}`,
              icon: Layers,
              detail: e.installationOrder
                ? `Install order: ${e.installationOrder.slice(0, 3).join(" → ")}`
                : undefined,
            },
          ]
        : [];
    default:
      return [];
  }
}
