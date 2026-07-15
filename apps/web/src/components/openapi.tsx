import { useState } from "react";
import { Send, Loader2, ChevronDown } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import type { OpenApiEndpoint, OpenApiParam } from "@/data/openapi";
import { buildRequestUrl } from "@/lib/openapi-request-lib";
import { trackEvent } from "@/lib/analytics";
import {
  openApiAdvancedToggleAnalyticsData,
  openApiAdvancedToggleAnalyticsEvent,
  openApiCopyAnalyticsData,
  openApiCopyAnalyticsEvent,
  openApiSendAnalyticsData,
  openApiSendAnalyticsEvent,
} from "@/lib/openapi-cta-events";
import { cn } from "@/lib/utils";

const METHOD_STYLES: Record<OpenApiEndpoint["method"], string> = {
  GET: "bg-trust-trusted/15 text-trust-trusted border-trust-trusted/40",
  POST: "bg-accent/40 text-accent-ink dark:text-accent border-accent/60",
  PATCH: "bg-trust-review/15 text-trust-review border-trust-review/40",
};

export function MethodPill({ method }: { method: OpenApiEndpoint["method"] }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded border px-1.5 font-mono text-[10px] font-semibold",
        METHOD_STYLES[method],
      )}
    >
      {method}
    </span>
  );
}

export function OpenApiEndpointCard({ endpoint }: { endpoint: OpenApiEndpoint }) {
  return (
    <article id={endpoint.id} className="scroll-mt-24 rounded-xl border border-border bg-surface">
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        <MethodPill method={endpoint.method} />
        <code className="font-mono text-sm text-ink">{endpoint.path}</code>
        <span className="ml-auto text-xs text-ink-muted">{endpoint.summary}</span>
      </header>
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="space-y-4 border-b border-border p-5 text-sm text-ink-muted lg:border-b-0 lg:border-r">
          <p>{endpoint.description}</p>
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div>
              <div className="eyebrow mb-2">Parameters</div>
              <div className="overflow-hidden rounded-md border border-border">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-border">
                    {endpoint.parameters.map((p) => (
                      <tr key={p.name} className="bg-background">
                        <td className="w-32 px-3 py-2 align-top">
                          <code className="font-mono text-ink">{p.name}</code>
                          {p.required && <span className="ml-1 text-trust-blocked">*</span>}
                          <div className="text-[10px] uppercase tracking-wider text-ink-subtle">
                            {p.in}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-ink">{p.type}</div>
                          {p.description && <div className="text-ink-muted">{p.description}</div>}
                          {p.enumValues && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {p.enumValues.map((v) => (
                                <code
                                  key={v}
                                  className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[10px]"
                                >
                                  {v}
                                </code>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {endpoint.body && (
            <div>
              <div className="eyebrow mb-2">Request body</div>
              <pre className="overflow-auto rounded-md bg-background p-3 font-mono text-[11px] text-ink">
                <code>{endpoint.body.example}</code>
              </pre>
            </div>
          )}
          <div>
            <div className="eyebrow mb-2">Response</div>
            <pre className="overflow-auto rounded-md bg-background p-3 font-mono text-[11px] text-ink">
              <code>{endpoint.responseExample}</code>
            </pre>
          </div>
          <CurlBlock endpoint={endpoint} />
        </div>
        <OpenApiPlayground endpoint={endpoint} />
      </div>
    </article>
  );
}

function CurlBlock({ endpoint }: { endpoint: OpenApiEndpoint }) {
  const base = "https://heyclau.de";
  const params =
    endpoint.parameters
      ?.filter((p) => p.in === "query" && p.example)
      .map((p) => `${p.name}=${p.example}`)
      .join("&") ?? "";
  const url = endpoint.path.replace(/\{(\w+)\}/g, (_m, name) => {
    const ex = endpoint.parameters?.find((p) => p.in === "path" && p.name === name)?.example;
    return ex ?? `:${name}`;
  });
  const fullUrl = `${base}${url}${params ? `?${params}` : ""}`;
  const curl =
    endpoint.method === "GET"
      ? `curl '${fullUrl}'`
      : `curl -X ${endpoint.method} '${fullUrl}' \\\n  -H 'content-type: application/json' \\\n  -d '${endpoint.body?.example.replace(/\n/g, "") ?? ""}'`;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="eyebrow">curl</div>
        <CopyButton
          value={curl}
          label="Copy"
          event={openApiCopyAnalyticsEvent()}
          eventData={openApiCopyAnalyticsData(endpoint.id, endpoint.method, "curl")}
        />
      </div>
      <pre className="overflow-auto rounded-md bg-background p-3 font-mono text-[11px] text-ink">
        <code>{curl}</code>
      </pre>
    </div>
  );
}

export function OpenApiPlayground({ endpoint }: { endpoint: OpenApiEndpoint }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    endpoint.parameters?.forEach((p) => (init[p.name] = p.example ?? ""));
    return init;
  });
  const [body, setBody] = useState(endpoint.body?.example ?? "");
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const send = async () => {
    trackEvent(
      openApiSendAnalyticsEvent(),
      openApiSendAnalyticsData(endpoint.id, endpoint.method, Boolean(endpoint.liveRequest)),
    );
    setSending(true);
    setResponse(null);
    setError(null);
    try {
      if (!endpoint.liveRequest) {
        setResponse(JSON.stringify(endpoint.sampleResponse, null, 2));
        return;
      }

      const url = buildRequestUrl(endpoint, values);
      const result = await fetch(url, { headers: { accept: "*/*" } });
      const contentType = result.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? JSON.stringify(await result.json(), null, 2)
        : await result.text();
      setResponse(`${result.status} ${result.statusText}\n${payload}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : String(requestError));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 bg-surface-2 p-5">
      <div className="flex items-center justify-between">
        <div className="eyebrow">{endpoint.liveRequest ? "Live request" : "Example"}</div>
        <span className="text-[10px] text-ink-subtle">
          {endpoint.liveRequest ? "Read-only GET" : "Sample response only"}
        </span>
      </div>
      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="space-y-3">
          {endpoint.parameters.map((p) => (
            <ParamInput
              key={p.name}
              param={p}
              value={values[p.name] ?? ""}
              onChange={(v) => setValues({ ...values, [p.name]: v })}
            />
          ))}
        </div>
      )}
      {endpoint.body && (
        <div>
          <div className="eyebrow mb-1.5">Body</div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full rounded-md border border-border bg-background p-3 font-mono text-[11px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
      )}
      <button
        type="button"
        onClick={send}
        disabled={sending}
        className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90 disabled:opacity-50"
      >
        {sending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Send className="h-3.5 w-3.5" />
        )}
        {endpoint.liveRequest ? "Send read-only request" : "Show sample"}
      </button>
      {error && (
        <div className="rounded-md border border-trust-blocked/30 bg-trust-blocked/10 p-3 text-xs text-trust-blocked">
          {error}
        </div>
      )}
      {response && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <div className="eyebrow">Response</div>
            <CopyButton
              value={response}
              label="Copy"
              event={openApiCopyAnalyticsEvent()}
              eventData={openApiCopyAnalyticsData(endpoint.id, endpoint.method, "response")}
            />
          </div>
          <pre className="overflow-auto rounded-md border border-border bg-background p-3 font-mono text-[11px] text-ink">
            <code>{response}</code>
          </pre>
        </div>
      )}
      {endpoint.clientExamples && endpoint.clientExamples.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => {
              const next = !showAdvanced;
              trackEvent(
                openApiAdvancedToggleAnalyticsEvent(),
                openApiAdvancedToggleAnalyticsData(
                  endpoint.id,
                  endpoint.method,
                  next,
                  endpoint.clientExamples?.length ?? 0,
                ),
              );
              setShowAdvanced(next);
            }}
            className="inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink"
          >
            <ChevronDown
              className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")}
            />
            Tested client paths
          </button>
          {showAdvanced && (
            <div className="space-y-2 rounded-md border border-border bg-background p-3">
              {endpoint.clientExamples.map((example) => (
                <div key={example.label}>
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-ink-subtle">
                    {example.label}
                  </div>
                  <pre className="overflow-auto font-mono text-[11px] text-ink">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ParamInput({
  param,
  value,
  onChange,
}: {
  param: OpenApiParam;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-ink-subtle">
        <code className="font-mono text-ink">{param.name}</code>
        <span>· {param.in}</span>
        {param.required && <span className="text-trust-blocked">required</span>}
      </div>
      {param.enumValues ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="">—</option>
          {param.enumValues.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={param.example}
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      )}
    </label>
  );
}
