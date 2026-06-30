import * as React from "react";
import type { Entry } from "@/types/registry";
import { EntryAttributionLabel } from "./entry-attribution-label";

const LinkedAttribution = React.lazy(async () => {
  const module = await import("./contributor-attribution");
  return { default: module.EntryAuthorAttribution };
});

const LinkedSourceCitations = React.lazy(async () => {
  const [{ SourceCitations }, { findContributorForIdentity }] = await Promise.all([
    import("./source-citations"),
    import("@/data/contributors"),
  ]);
  return {
    default: function LinkedSourceCitationsInner({ entry }: { entry: Entry }) {
      return (
        <SourceCitations
          entry={entry}
          resolveContributorSlug={(name, profileUrl) =>
            findContributorForIdentity(name, profileUrl)?.slug
          }
        />
      );
    },
  };
});

export function LazyEntryAuthorAttribution({
  entry,
  className,
}: {
  entry: Entry;
  className?: string;
}) {
  return (
    <React.Suspense fallback={<EntryAttributionLabel entry={entry} className={className} />}>
      <LinkedAttribution entry={entry} className={className} />
    </React.Suspense>
  );
}

export function LazyLinkedSourceCitations({ entry }: { entry: Entry }) {
  return (
    <React.Suspense fallback={<p className="text-sm text-ink-subtle">Loading source citations…</p>}>
      <LinkedSourceCitations entry={entry} />
    </React.Suspense>
  );
}
