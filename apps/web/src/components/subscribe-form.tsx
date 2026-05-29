import * as React from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/api/newsletter";
import { useRecents } from "@/lib/recents";
import { cn } from "@/lib/utils";

interface SubscribeFormProps {
  /** Follow IDs to add to (e.g. ["category:mcp"]). The server resolves them. */
  segments?: string[];
  source?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  /** Human-readable label for the local follow record. */
  followLabel?: string;
}

export function SubscribeForm({
  segments,
  source,
  label = "Subscribe",
  placeholder = "you@domain.com",
  className,
  followLabel,
}: SubscribeFormProps) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = React.useState<string | null>(null);
  const recents = useRecents();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setMessage(null);
    const res = await subscribeToNewsletter({ email, segments, source });
    if (res.ok) {
      setState("ok");
      setMessage("You're on the list. Check your inbox.");
      toast.success("Subscribed", { description: "Check your inbox to confirm." });
      // Record locally so /subscriptions can list it.
      const list = segments && segments.length > 0 ? segments : ["all"];
      for (const seg of list) {
        recents.addFollow({
          label: followLabel ?? seg,
          followId: seg,
          source,
          email,
        });
        recents.addSegment({ id: seg, label: followLabel ?? seg, email });
      }
      setEmail("");
    } else {
      setState("error");
      setMessage(res.error);
      toast.error("Subscription failed", { description: res.error });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-surface p-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-border bg-background px-2.5 focus-within:ring-2 focus-within:ring-accent/40">
          <Mail className="h-3.5 w-3.5 text-ink-muted" />
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            aria-label="Email address"
            className="h-9 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
            disabled={state === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-60"
        >
          {state === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : state === "ok" ? (
            <Check className="h-3.5 w-3.5" />
          ) : null}
          {label}
        </button>
      </div>
      {message && (
        <p
          className={cn("text-xs", state === "ok" ? "text-trust-trusted" : "text-trust-blocked")}
          role="status"
        >
          {message}
        </p>
      )}
      <p className="text-[11px] text-ink-subtle">
        One-tap unsubscribe in every email. Powered by Resend.
      </p>
    </form>
  );
}
