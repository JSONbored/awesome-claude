import { ArrowBigUp, Check, AlertTriangle, Eye } from "lucide-react";
import { useState } from "react";
import type { SignalCounts } from "@/types/registry";
import { cn } from "@/lib/utils";

export function SignalsStrip({ initial }: { initial: SignalCounts }) {
  const [counts, setCounts] = useState(initial);
  const [voted, setVoted] = useState<{ up?: boolean; works?: boolean; broken?: boolean }>({});

  const toggle = (key: "up" | "works" | "broken") => {
    const active = !voted[key];
    setVoted({ ...voted, [key]: active });
    setCounts((c) => {
      const delta = active ? 1 : -1;
      if (key === "up") return { ...c, upvotes: (c.upvotes ?? 0) + delta };
      if (key === "works") return { ...c, works: (c.works ?? 0) + delta };
      return { ...c, broken: (c.broken ?? 0) + delta };
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SignalButton
        active={voted.up}
        onClick={() => toggle("up")}
        icon={ArrowBigUp}
        label="Upvote"
        count={counts.upvotes}
        tone="accent"
      />
      <SignalButton
        active={voted.works}
        onClick={() => toggle("works")}
        icon={Check}
        label="Works"
        count={counts.works}
        tone="trusted"
      />
      <SignalButton
        active={voted.broken}
        onClick={() => toggle("broken")}
        icon={AlertTriangle}
        label="Broken"
        count={counts.broken}
        tone="warn"
      />
      <div className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-xs text-ink-muted">
        <Eye className="h-3 w-3" />
        {(counts.used ?? 0).toLocaleString()} used
      </div>
    </div>
  );
}

function SignalButton({
  icon: Icon,
  label,
  count,
  active,
  onClick,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
  tone: "accent" | "trusted" | "warn";
}) {
  const toneClass =
    tone === "accent"
      ? "data-[active=true]:bg-accent data-[active=true]:text-accent-ink data-[active=true]:border-accent"
      : tone === "trusted"
        ? "data-[active=true]:bg-trust-trusted/10 data-[active=true]:border-trust-trusted/50 data-[active=true]:text-trust-trusted"
        : "data-[active=true]:bg-trust-review/10 data-[active=true]:border-trust-review/50 data-[active=true]:text-trust-review";
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active || undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors duration-200 ease-out hover:text-ink",
        toneClass,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
      <span className="font-mono text-ink">{(count ?? 0).toLocaleString()}</span>
    </button>
  );
}
