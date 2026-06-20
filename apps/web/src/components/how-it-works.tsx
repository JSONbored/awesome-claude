import { Search, ShieldCheck, ClipboardCopy } from "lucide-react";

const STEPS = [
  {
    n: "01",
    Icon: Search,
    title: "Search by intent",
    body: 'Find resources by what they do — "postgres mcp", "release notes", "safe hook". No category-hunting.',
  },
  {
    n: "02",
    Icon: ShieldCheck,
    title: "Inspect before installing",
    body: "See trust level, source, safety notes, privacy notes, and prerequisites — surfaced before the install button.",
  },
  {
    n: "03",
    Icon: ClipboardCopy,
    title: "Copy what you need",
    body: "Install command, MCP config, or full asset. One click. Configs are pinned to verified package versions.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-page px-4 py-12 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow">How it works</div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            Search, inspect, install — in that order
          </h2>
        </div>
      </div>
      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {STEPS.map(({ n, Icon, title, body }) => (
          <div
            key={n}
            className="group relative flex flex-col gap-3 bg-surface p-6 transition-colors duration-200 ease-out hover:bg-surface-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-wider text-ink-subtle">{n}</span>
              <Icon className="h-4 w-4 text-ink-muted transition-colors duration-200 ease-out group-hover:text-ink-hover" />
            </div>
            <div className="font-display text-base font-semibold text-ink">{title}</div>
            <p className="text-sm text-ink-muted">{body}</p>
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
