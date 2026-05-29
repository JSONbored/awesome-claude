import atlasRegistry from "@/generated/atlas-registry.json";
import type {
  ArtifactContract,
  Category,
  ChangeKind,
  ChangelogDiff,
  ChangelogEntry,
} from "@/types/registry";

type AtlasChange = {
  category: string;
  slug: string;
  title: string;
  dateAdded?: string;
  type?: string;
  artifactHash?: string;
};

const registryChanges = ((atlasRegistry.changelog ?? []) as AtlasChange[]).filter(
  (entry) => entry.category && entry.slug,
);

function changeKind(value: string | undefined): ChangeKind {
  if (value === "updated" || value === "removed") return value;
  return "added";
}

function shortHash(value?: string) {
  return value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "generated";
}

export const CHANGELOG: ChangelogEntry[] = registryChanges.map((entry) => ({
  date: entry.dateAdded || String(atlasRegistry.generatedAt).slice(0, 10),
  kind: changeKind(entry.type),
  ref: `${entry.category}/${entry.slug}`,
  title: entry.title,
  category: entry.category as Category,
  hash: shortHash(entry.artifactHash),
}));

const generatedAt = String(atlasRegistry.generatedAt);
const rawArtifactContracts =
  (
    atlasRegistry as {
      artifactContracts?: ArtifactContract[];
    }
  ).artifactContracts ?? [];

export const ARTIFACT_CONTRACTS: ArtifactContract[] = (
  rawArtifactContracts.length
    ? rawArtifactContracts
    : [
        {
          path: "/data/registry-manifest.json",
          bytes: 0,
          sha256: "generated",
          builtAt: generatedAt,
        },
      ]
).slice(0, 12);

export type ReleaseStream = "release" | "policy" | "security";

export interface ReleaseNote {
  date: string;
  stream: ReleaseStream;
  version?: string;
  title: string;
  body: string;
  href?: string;
  counts?: { added?: number; updated?: number; removed?: number };
  hash?: string;
  prevHash?: string;
  diff?: ChangelogDiff;
}

function emptyDiff(): ChangelogDiff {
  return { added: [], updated: [], removed: [] };
}

export const RELEASE_NOTES: ReleaseNote[] = (() => {
  const grouped = new Map<
    string,
    { counts: NonNullable<ReleaseNote["counts"]>; diff: ChangelogDiff }
  >();

  for (const change of registryChanges) {
    const date = change.dateAdded || String(atlasRegistry.generatedAt).slice(0, 10);
    const kind = changeKind(change.type);
    const bucket = grouped.get(date) ?? { counts: {}, diff: emptyDiff() };
    bucket.counts[kind] = (bucket.counts[kind] ?? 0) + 1;
    bucket.diff[kind].push({
      category: change.category as Category,
      slug: change.slug,
      title: change.title,
      artifactHash: change.artifactHash,
    });
    grouped.set(date, bucket);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .slice(0, 8)
    .map(([date, bucket]) => {
      const total =
        (bucket.counts.added ?? 0) + (bucket.counts.updated ?? 0) + (bucket.counts.removed ?? 0);
      return {
        date,
        stream: "release",
        version: `registry@${date}`,
        title: `${total} registry ${total === 1 ? "entry" : "entries"} changed`,
        body: "Generated from the current registry changelog artifact.",
        counts: bucket.counts,
        hash: shortHash(`${date}-${total}`),
        diff: bucket.diff,
      } satisfies ReleaseNote;
    });
})();
