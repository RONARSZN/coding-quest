import { z } from "zod";
import { pack, curriculumPacks, questById, skills } from "./curriculum";
import { blankProgress, upgradePacks } from "./domain";
import type { Progress } from "./types";
export const STORAGE_KEY = "coding-quest:progress";
export const MAX_BYTES = 4 * 1024 * 1024;
const id = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-zA-Z0-9:-]+$/);
const words = z.string().max(30000);
const stamp = z.iso.datetime();
const day = z.iso.date();
const code = z.object({ html: words, css: words, js: words }).strict();
const result = z
  .object({
    id,
    label: z.string().max(500),
    passed: z.boolean(),
    detail: z.string().max(2000),
  })
  .strict();
const attempt = z
  .object({
    id,
    questId: id,
    contentVersion: z.number().int().positive(),
    code,
    prediction: words,
    reflection: words,
    bug: words,
    nextStep: words,
    explanation: words,
    hints: z.number().int().min(0).max(3),
    solution: z.boolean(),
    checks: z.array(result).max(30),
    checkedCode: z.string().max(200000),
    rubric: z.tuple([z.boolean(), z.boolean(), z.boolean(), z.boolean()]),
    assessment: z.enum(["self", "coach"]),
    reviewerNotes: words,
    updatedAt: stamp,
    completedAt: stamp.optional(),
    archived: z.boolean(),
  })
  .strict();
const schema = z
  .object({
    schemaVersion: z.literal(1),
    settings: z
      .object({
        onboarded: z.boolean(),
        coreTarget: z.literal(5),
        optionalTarget: z.literal(2),
        reviewDays: z
          .object({
            first: z.number().int().min(1).max(30),
            second: z.number().int().min(2).max(90),
          })
          .strict(),
        seasonStart: day,
      })
      .strict(),
    packs: z.record(id, z.number().int().positive()),
    attempts: z.array(attempt).max(2000),
    evidence: z
      .array(
        z
          .object({
            id,
            skillId: id,
            questId: id,
            attemptId: id,
            level: z.enum(["Guided", "With hints", "Independent", "Retained"]),
            source: z.enum(["practice", "self", "coach"]),
            date: stamp,
            notes: words,
          })
          .strict(),
      )
      .max(10000),
    awards: z
      .array(
        z
          .object({
            id,
            questId: id,
            attemptId: id,
            amount: z.number().int(),
            date: stamp,
          })
          .strict(),
      )
      .max(6000),
    reviews: z
      .array(
        z
          .object({
            id,
            skillId: id,
            due: day,
            phase: z.union([z.literal(7), z.literal(30), z.literal(60)]),
            gap: words,
            completedQuestIds: z.array(id).max(100),
          })
          .strict(),
      )
      .max(100),
    journal: z
      .array(
        z
          .object({
            id,
            attemptId: id,
            questId: id,
            date: stamp,
            explanation: words,
            reflection: words,
            bug: words,
            nextStep: words,
            hints: z.number().int().min(0).max(3),
            solution: z.boolean(),
          })
          .strict(),
      )
      .max(2000),
  })
  .strict();
export function migrate(value: unknown): unknown {
  if (
    value &&
    typeof value === "object" &&
    "schemaVersion" in value &&
    value.schemaVersion === 0
  ) {
    const old = value as Record<string, unknown>;
    return { ...old, schemaVersion: 1, packs: old.packs ?? { [pack.id]: 1 } };
  }
  return value;
}
export function parseProgress(raw: string): Progress {
  if (new TextEncoder().encode(raw).length > MAX_BYTES)
    throw Error("Backup is larger than 4 MB. Nothing was replaced.");
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    throw Error("This is not valid JSON. Nothing was replaced.");
  }
  const parsed = schema.safeParse(migrate(value));
  if (!parsed.success)
    throw Error(
      "Unsupported version or invalid progress fields. Nothing was replaced.",
    );
  const p = parsed.data as Progress;
  if (p.settings.reviewDays.second <= p.settings.reviewDays.first)
    throw Error("The second review gap must be longer than the first.");
  const distinct = (rows: { id: string }[], name: string) => {
    if (new Set(rows.map((r) => r.id)).size !== rows.length)
      throw Error(`Duplicate ${name} IDs.`);
  };
  distinct(p.attempts, "attempt");
  distinct(p.awards, "award");
  distinct(p.evidence, "evidence");
  distinct(p.reviews, "review");
  distinct(p.journal, "journal");
  const skillIds = new Set(skills.map((s) => s.id));
  if (
    Object.entries(p.packs).some(
      ([key, version]) =>
        !curriculumPacks.some(
          (item) => item.id === key && version <= item.version,
        ),
    )
  )
    throw Error("This backup requires an unavailable curriculum pack.");
  for (const a of p.attempts) {
    const q = questById(a.questId);
    if (
      !q ||
      a.contentVersion > q.version ||
      a.checks.some((r) => !q.checks.some((c) => c.id === r.id)) ||
      new Set(a.checks.map((r) => r.id)).size !== a.checks.length
    )
      throw Error("Unknown quest, content version or check ID.");
  }
  const getAttempt = (attemptId: string, questId: string) => {
    const a = p.attempts.find(
      (x) => x.id === attemptId && x.questId === questId,
    );
    if (!a) throw Error("Missing attempt reference.");
    return a;
  };
  for (const a of p.awards) {
    const attempt = getAttempt(a.attemptId, a.questId);
    const boss = questById(a.questId)!.kind === "boss";
    const expected: Record<string, number> = boss
      ? { boss: 50 }
      : { prediction: 5, modification: 10, reflection: 5 };
    const suffix = a.id.slice(a.questId.length + 1);
    if (
      !attempt.completedAt ||
      a.id !== `${a.questId}:${suffix}` ||
      expected[suffix] !== a.amount
    )
      throw Error("Invalid XP award.");
  }
  for (const e of p.evidence) {
    const a = getAttempt(e.attemptId, e.questId);
    if (
      !a.completedAt ||
      !skillIds.has(e.skillId) ||
      !questById(e.questId)!.skills.includes(e.skillId) ||
      e.id !== `${a.id}:${e.skillId}`
    )
      throw Error("Invalid skill evidence reference.");
    if (
      ["Independent", "Retained"].includes(e.level) &&
      (a.solution ||
        a.hints ||
        !questById(e.questId)!.fresh ||
        !a.explanation.trim() ||
        e.source === "practice" ||
        e.source !== a.assessment ||
        (e.source === "coach" && !a.reviewerNotes.trim()))
    )
      throw Error("Independence cannot come from solution-assisted practice.");
  }
  if (new Set(p.reviews.map((r) => r.skillId)).size !== p.reviews.length)
    throw Error("Duplicate due reviews for one skill.");
  for (const r of p.reviews)
    if (
      !skillIds.has(r.skillId) ||
      r.id !== `review:${r.skillId}` ||
      r.completedQuestIds.some(
        (q) => !questById(q) || questById(q)!.kind !== "review",
      )
    )
      throw Error("Unknown review reference.");
  for (const j of p.journal)
    if (!getAttempt(j.attemptId, j.questId).completedAt)
      throw Error("Journal references an unfinished attempt.");
  return upgradePacks(p);
}
export type Store = { read: () => string | null; write: (raw: string) => void };
export const browserStore: Store = {
  read: () => localStorage.getItem(STORAGE_KEY),
  write: (raw) => localStorage.setItem(STORAGE_KEY, raw),
};
export type Loaded = {
  progress: Progress;
  error: string;
  corrupt: string | null;
};
export function load(store: Store = browserStore): Loaded {
  let raw: string | null = null;
  try {
    raw = store.read();
    return {
      progress: raw !== null ? parseProgress(raw) : blankProgress(),
      error: "",
      corrupt: null,
    };
  } catch (e) {
    return {
      progress: blankProgress(),
      error:
        raw !== null
          ? "Stored progress is corrupt or unsupported. Export the raw data before an explicit reset."
          : `Browser storage is unavailable: ${e instanceof Error ? e.message : "access denied"}. Keep this tab open and export a backup.`,
      corrupt: raw,
    };
  }
}
export function save(p: Progress, store: Store = browserStore): string {
  try {
    const raw = JSON.stringify(p);
    if (new TextEncoder().encode(raw).length > MAX_BYTES)
      throw Error("Progress exceeds the 4 MB local limit. Export a backup.");
    if (!schema.safeParse(p).success)
      throw Error(
        "An input exceeded the supported progress limits. Keep this tab open and export your draft.",
      );
    store.write(raw);
    return "";
  } catch (e) {
    return `Unsaved — ${e instanceof Error ? e.message : "storage unavailable"}. Export a backup before closing.`;
  }
}
export function markdown(p: Progress) {
  return `# Coding Quest progress\n\nExported: ${new Date().toISOString()}\nXP: ${p.awards.reduce((sum, a) => sum + a.amount, 0)} (practice, not certification)\n\n${p.journal.map((j) => `## ${questById(j.questId)?.title}\n${j.date}\n\nExplanation: ${j.explanation}\nReflection: ${j.reflection}\nBug: ${j.bug}\nHints: ${j.hints}; solution: ${j.solution}\nNext step: ${j.nextStep}`).join("\n\n")}\n\n## Evidence\n${p.evidence.map((e) => `${e.skillId}: ${e.level} (${e.source}), ${e.date}, attempt ${e.attemptId}`).join("\n")}\n\n## Reviews\n${p.reviews.map((r) => `${r.skillId}: ${r.due} (phase ${r.phase}); gap ${r.gap}`).join("\n")}`;
}
