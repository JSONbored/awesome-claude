import type { Entry } from "@/types/registry";
import {
  compareDossierShowCompareSection,
  compareDossierUiState,
  type CompareDossierUiState,
} from "@/lib/compare-dossier-ui-lib";

export type CompareDossierInteractiveUiState = CompareDossierUiState;

export function compareDossierInteractiveUiState(
  entry: Entry,
  alternatives: Entry[],
): CompareDossierInteractiveUiState {
  const ui = compareDossierUiState(entry, alternatives);
  return {
    ...ui,
    showCompareSection: compareDossierInteractiveShowCompareSection(entry, alternatives),
  };
}

export function compareDossierInteractiveShowCompareSection(
  _entry: Entry,
  alternatives: Entry[],
): boolean {
  return compareDossierShowCompareSection(alternatives);
}
