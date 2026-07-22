import {
  Action,
  ActionPanel,
  Cache,
  Detail,
  Icon,
  Toast,
  showToast,
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { type RaycastEntry } from "./feed";
import { entrySnippetKeyword } from "./raycast-ui";
import { loadEntryDetail } from "./runtime";

type SnippetKind = "install" | "config";

type CreateSnippetFromDetailProps = {
  entry: RaycastEntry;
  cache: Cache;
  feedUrl: string;
  kind: SnippetKind;
  onVisit?: () => void | Promise<void>;
};

function snippetCopy(kind: SnippetKind, entry: RaycastEntry, text: string) {
  if (kind === "install") {
    return {
      title: "Create Install Snippet",
      name: `${entry.title} install`,
      keyword: entrySnippetKeyword(entry),
      text,
      emptyError: "No install command is available for this entry.",
    };
  }
  return {
    title: "Create Config Snippet",
    name: `${entry.title} config`,
    keyword: `${entrySnippetKeyword(entry)}-config`.slice(0, 40),
    text,
    emptyError: "No config snippet is available for this entry.",
  };
}

function resolveSnippetText(
  kind: SnippetKind,
  entry: RaycastEntry,
  detail: { installCommand?: string; configSnippet?: string } | undefined,
) {
  if (kind === "install") {
    return String(detail?.installCommand || entry.installCommand || "").trim();
  }
  return String(detail?.configSnippet || entry.configSnippet || "").trim();
}

function CreateSnippetFromDetailView(props: CreateSnippetFromDetailProps) {
  const { entry, cache, feedUrl, kind, onVisit } = props;
  // Fresh Push target per entry — capture props in the closure; no arg deps needed.
  const { data, isLoading, error } = usePromise(() =>
    loadEntryDetail({ entry, cache, feedUrl }),
  );

  const text = resolveSnippetText(kind, entry, data);
  const copy = snippetCopy(kind, entry, text);

  return (
    <Detail
      isLoading={isLoading}
      markdown={
        error
          ? `Could not load entry detail:\n\n${error instanceof Error ? error.message : "Unknown error"}`
          : text
            ? `\`\`\`\n${text}\n\`\`\``
            : isLoading
              ? "Loading entry detail…"
              : copy.emptyError
      }
      actions={
        text ? (
          <ActionPanel>
            <Action.CreateSnippet
              title={copy.title}
              icon={Icon.Snippets}
              snippet={{
                name: copy.name,
                text: copy.text,
                keyword: copy.keyword,
              }}
            />
            <Action.CopyToClipboard
              title={
                kind === "install" ? "Copy Install Command" : "Copy Config"
              }
              content={text}
              onCopy={() => {
                void onVisit?.();
              }}
            />
          </ActionPanel>
        ) : error ? (
          <ActionPanel>
            <Action
              title="Show Error"
              icon={Icon.Warning}
              onAction={() =>
                void showToast({
                  style: Toast.Style.Failure,
                  title: copy.title,
                  message:
                    error instanceof Error ? error.message : "Unknown error",
                })
              }
            />
          </ActionPanel>
        ) : null
      }
    />
  );
}

export function CreateInstallSnippetAction(props: {
  entry: RaycastEntry;
  cache: Cache;
  feedUrl: string;
  onVisit?: () => void | Promise<void>;
}) {
  return (
    <Action.Push
      title="Create Install Snippet"
      icon={Icon.Snippets}
      target={
        <CreateSnippetFromDetailView
          entry={props.entry}
          cache={props.cache}
          feedUrl={props.feedUrl}
          kind="install"
          onVisit={props.onVisit}
        />
      }
    />
  );
}

export function CreateConfigSnippetAction(props: {
  entry: RaycastEntry;
  cache: Cache;
  feedUrl: string;
  onVisit?: () => void | Promise<void>;
}) {
  return (
    <Action.Push
      title="Create Config Snippet"
      icon={Icon.Snippets}
      target={
        <CreateSnippetFromDetailView
          entry={props.entry}
          cache={props.cache}
          feedUrl={props.feedUrl}
          kind="config"
          onVisit={props.onVisit}
        />
      }
    />
  );
}
