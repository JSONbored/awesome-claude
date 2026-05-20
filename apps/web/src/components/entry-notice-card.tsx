import type { ComponentType } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

type EntryNoticeCardProps = {
  title: string;
  eyebrow: string;
  description?: string;
  items: Array<string | null | undefined>;
  tone?: "safety" | "privacy";
};

const icons: Record<
  NonNullable<EntryNoticeCardProps["tone"]>,
  ComponentType<{ className?: string }>
> = {
  safety: AlertTriangle,
  privacy: ShieldAlert,
};

export function EntryNoticeCard({
  title,
  eyebrow,
  description,
  items,
  tone = "safety",
}: EntryNoticeCardProps) {
  const normalizedItems = items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

  if (!normalizedItems.length) return null;
  const Icon = icons[tone];

  return (
    <section className={`entry-notice-card entry-notice-card-${tone}`}>
      <div className="flex items-start gap-3">
        <span className="entry-notice-card-icon">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {normalizedItems.map((item, index) => (
              <li
                key={`${index}-${item}`}
                className="rounded-2xl border border-border/80 bg-background/88 px-4 py-3 text-sm leading-7 text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
