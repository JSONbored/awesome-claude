import type { Entry } from "@/types/registry";
import { compareDossierUiState, type CompareDossierUiState } from "@/lib/compare-dossier-ui-lib";

export type CompareDossierInteractiveUiState = CompareDossierUiState;

export function compareDossierInteractiveUiState(
  entry: Entry,
  alternatives: Entry[],
): CompareDossierInteractiveUiState {
  return compareDossierUiState(entry, alternatives);
}
