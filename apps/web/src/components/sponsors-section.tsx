import * as React from "react";
import { Plus, Mail, ArrowUpRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IntegrationMark } from "@/components/integration-marks";
import { PARTNER_ROLE_LABEL, PARTNERS, SPONSORS, type Partner } from "@/data/sponsors";
import { cn } from "@/lib/utils";

export function SponsorsSection() {
  const filled = PARTNERS.filter((p) => p.slotState === "filled");
  const open = PARTNERS.filter((p) => p.slotState === "open");

  return (
    <div className="flex flex-col gap-10">
      {/* Powered by — slim credits strip */}
      <div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="eyebrow">Powered by</div>
            <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
              Credits + infrastructure
            </h3>
          </div>
          <Link to="/legal" className="text-xs font-medium text-ink-muted hover:text-ink">
            Sponsorship policy →
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {SPONSORS.map((s) => (
            <li key={s.slug}>
              <a
                href={s.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                title={s.note}
                className="group flex h-full flex-col items-center justify-center gap-1.5 bg-surface px-3 py-5 text-center text-ink-muted transition-colors duration-200 ease-out hover:bg-surface-2 hover:text-ink"
              >
                {s.mark ? (
                  <IntegrationMark
                    name={s.mark}
                    size={20}
                    className="opacity-60 grayscale transition-[opacity,filter] duration-300 ease-out group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-ink-subtle">
                    {kindBadge(s.kind)}
                  </span>
                )}
                <span className="text-xs font-medium text-ink">{s.name}</span>
                <span className="line-clamp-1 text-[11px] text-ink-subtle">{s.tagline}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured partners + open slots */}
      <div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="eyebrow">Ecosystem partners</div>
            <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
              {filled.length > 0
                ? `${filled.length} active · ${open.length} open`
                : `${open.length} open partnership slots`}
            </h3>
          </div>
          <PartnerDrawer
            trigger={
              <Button variant="outline" size="sm" className="gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Become a partner
              </Button>
            }
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filled.map((p) => (
            <PartnerCard key={p.slug} partner={p} />
          ))}
          {open.map((p) => (
            <OpenSlotCard key={p.slug} partner={p} />
          ))}
        </div>
      </div>

      {/* Transparency disclosure */}
      <aside className="rounded-xl border border-border bg-surface p-5 text-sm text-ink-muted">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-trust-trusted" />
          <div className="space-y-1">
            <p className="font-medium text-ink">What sponsorship does and doesn't do</p>
            <ul className="ml-4 list-disc space-y-0.5 text-xs">
              <li>Sponsorships never affect ranking, trust badges, or registry inclusion.</li>
              <li>Source-backed entries remain free and reviewed identically.</li>
              <li>Every paid placement carries a visible "Sponsor" label.</li>
              <li>
                Paid featured listings and Brief sponsorships are handled separately on{" "}
                <Link to="/advertise" className="text-ink underline-offset-2 hover:underline">
                  /advertise
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {partner.mark ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2">
              <IntegrationMark name={partner.mark} size={16} />
            </span>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 font-display text-sm font-semibold text-ink">
              {partner.name.slice(0, 2)}
            </span>
          )}
          <div>
            <div className="font-display text-sm font-semibold text-ink">{partner.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-subtle">
              {PARTNER_ROLE_LABEL[partner.role]}
              {partner.since && ` · since ${partner.since}`}
            </div>
          </div>
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-ink-subtle transition-colors duration-200 ease-out group-hover:text-ink" />
      </div>
      <p className="text-sm text-ink-muted">{partner.valueExchange}</p>
      <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
        Sponsor
      </span>
    </a>
  );
}

function OpenSlotCard({ partner }: { partner: Partner }) {
  return (
    <PartnerDrawer
      defaultRole={PARTNER_ROLE_LABEL[partner.role]}
      trigger={
        <button
          type="button"
          className="group flex flex-col gap-3 rounded-xl border border-dashed border-border bg-surface/40 p-5 text-left transition-colors duration-200 ease-out hover:border-accent/40 hover:bg-surface"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-dashed border-border bg-background text-ink-subtle transition-colors duration-200 ease-out group-hover:border-accent/40 group-hover:text-ink">
                <Plus className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display text-sm font-semibold text-ink">Open slot</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-subtle">
                  {PARTNER_ROLE_LABEL[partner.role]}
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-ink-muted">{partner.valueExchange}</p>
          <span className="mt-auto inline-flex w-fit items-center gap-1 text-xs font-medium text-ink-muted group-hover:text-ink">
            Reach out →
          </span>
        </button>
      }
    />
  );
}

function PartnerDrawer({
  trigger,
  defaultRole,
}: {
  trigger: React.ReactNode;
  defaultRole?: string;
}) {
  const [submitting, setSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const company = String(data.get("company") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const role = String(data.get("role") ?? "").trim();
    const offer = String(data.get("offer") ?? "").trim();
    const notes = String(data.get("notes") ?? "").trim();

    try {
      const response = await fetch("/api/listing-leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "tool",
          tierInterest: "sponsored",
          contactName: company,
          contactEmail: email,
          companyName: company,
          listingTitle: offer || role || "Ecosystem partnership",
          websiteUrl: website,
          message: [role ? `Role: ${role}` : "", notes].filter(Boolean).join("\n\n"),
        }),
      });
      if (!response.ok) throw new Error(`Lead intake returned ${response.status}`);
      toast.success("Thanks — we'll reply within a week.", {
        description: `Logged ${company} · ${offer || "partnership"}`,
      });
      formRef.current?.reset();
      (document.querySelector("[data-partner-close]") as HTMLButtonElement | null)?.click();
    } catch {
      toast.error("Could not submit partner interest.", {
        description: "Use the contact or GitHub issue path if this keeps failing.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle>Become an ecosystem partner</DrawerTitle>
            <DrawerDescription>
              Credits, infrastructure, product, or services — tell us what you'd offer and we'll get
              back within a week. Sponsorships never affect registry ranking or trust badges.
            </DrawerDescription>
          </DrawerHeader>

          <form ref={formRef} onSubmit={onSubmit} className="px-4 pb-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Company" name="company" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <div className="mt-3">
              <Field
                label="Website"
                name="website"
                type="url"
                required
                placeholder="https://example.com"
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field
                label="Role"
                name="role"
                defaultValue={defaultRole}
                placeholder="e.g. Compute, AI, Tooling"
              />
              <Field
                label="What you'd offer"
                name="offer"
                placeholder="Credits, infra, product, cash"
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="notes" className="text-xs text-ink-muted">
                Notes
              </Label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Any context that helps us evaluate the fit."
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <DrawerFooter className="px-0">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-ink text-background hover:bg-ink/90"
              >
                {submitting ? "Sending…" : "Send inquiry"}
              </Button>
              <DrawerClose asChild>
                <Button data-partner-close type="button" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} className="text-xs text-ink-muted">
        {label}
        {required && <span className="ml-0.5 text-trust-review">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1"
      />
    </div>
  );
}

function kindBadge(kind: string) {
  return kind === "ai"
    ? "AI"
    : kind === "infra"
      ? "INFRA"
      : kind === "credits"
        ? "CREDITS"
        : "SERVICE";
}

// Silence unused warning for cn until used elsewhere in this file.
void cn;
