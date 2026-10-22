import type { Check, Result } from "./types";
export function acceptMessage(
  event: MessageEvent,
  source: Window | null,
  runId: string,
  checks: Check[],
): { results: Result[]; error: string } | null {
  const d = event.data;
  if (
    !source ||
    event.source !== source ||
    !d ||
    typeof d !== "object" ||
    d.type !== "quest-result" ||
    d.runId !== runId ||
    typeof d.error !== "string" ||
    d.error.length > 20000 ||
    !Array.isArray(d.results) ||
    d.results.length > checks.length
  )
    return null;
  const ids = new Set<string>();
  for (const r of d.results) {
    if (
      !r ||
      typeof r !== "object" ||
      typeof r.id !== "string" ||
      ids.has(r.id) ||
      !checks.some((c) => c.id === r.id) ||
      typeof r.label !== "string" ||
      r.label.length > 500 ||
      typeof r.passed !== "boolean" ||
      typeof r.detail !== "string" ||
      r.detail.length > 2000
    )
      return null;
    ids.add(r.id);
  }
  return { results: d.results, error: d.error };
}
