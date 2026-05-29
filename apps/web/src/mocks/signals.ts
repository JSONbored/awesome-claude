import type { SignalCounts } from "@/types/registry";

const SEED: Record<string, SignalCounts> = {
  "mcp:postgres-mcp": { upvotes: 612, used: 1820, works: 980, broken: 18, weeklyInstalls: 4810 },
  "mcp:github-mcp": { upvotes: 488, used: 1200, works: 740, broken: 12, weeklyInstalls: 3120 },
  "mcp:filesystem-mcp": { upvotes: 322, used: 880, works: 510, broken: 22, weeklyInstalls: 2210 },
};

export function getSignals(key: string): SignalCounts {
  return (
    SEED[key] ?? {
      upvotes: Math.floor(50 + (hash(key) % 400)),
      used: Math.floor(100 + (hash(key + "u") % 900)),
      works: Math.floor(40 + (hash(key + "w") % 500)),
      broken: Math.floor(hash(key + "b") % 25),
      weeklyInstalls: Math.floor(200 + (hash(key + "i") % 2500)),
    }
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
