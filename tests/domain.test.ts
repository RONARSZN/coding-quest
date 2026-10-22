import { describe, expect, it } from "vitest";
import {
  blankProgress,
  completeAttempt,
  createAttempt,
  deferReview,
  fingerprint,
  hasBossEvidence,
  localDate,
  mastery,
  recommendation,
  rhythm,
  unlocked,
  updateAttempt,
  weekStart,
  xp,
} from "../src/domain";
import {
  pack,
  curriculumPacks,
  quests,
  questById,
  validateCurriculum,
} from "../src/curriculum";
import { load, migrate, parseProgress, save } from "../src/storage";
import type { Progress, Quest } from "../src/types";
const date = "2026-10-04T02:00:00.000Z";
const q = (id: string) => questById(id)!;
function pass(
  p: Progress,
  quest: Quest,
  options: Record<string, unknown> = {},
  time = date,
) {
  const a = {
    ...createAttempt(p, quest, time),
    code: quest.solution,
    prediction: "My prediction",
    reflection: "I changed and checked it",
    explanation: "The variable sets the displayed value.",
    bug: "The selector needs # for an id.",
    rubric: [true, true, true, true],
    ...options,
  };
  a.checks = quest.checks.map((c) => ({
    id: c.id,
    label: c.label,
    passed: true,
    detail: "Matched expected output",
  }));
  a.checkedCode = fingerprint(a);
  return completeAttempt(p, a, quest, time);
}
function week1() {
  let p = blankProgress();
  for (const id of ["q01", "q02", "q03", "q04", "boss01"]) p = pass(p, q(id));
  return p;
}
describe("curriculum and unique scoring", () => {
  it("has 20 core/boss, 9 optional, 4 review and 4 fresh variation activities", () => {
    validateCurriculum();
    expect(
      quests.filter((q) => ["core", "boss"].includes(q.kind)),
    ).toHaveLength(20);
    expect(quests.filter((q) => q.kind === "optional")).toHaveLength(9);
    expect(quests.filter((q) => q.kind === "review")).toHaveLength(4);
    expect(quests.filter((q) => q.kind === "variation")).toHaveLength(4);
    expect(quests).toHaveLength(37);
  });
  it("rejects duplicate content IDs and invalid prerequisites", () => {
    expect(() => validateCurriculum([...quests, quests[0]])).toThrow(
      "Duplicate",
    );
    expect(() =>
      validateCurriculum([{ ...quests[0], prerequisites: ["missing"] }]),
    ).toThrow("Unknown");
  });
  it("awards 20 once for a regular quest, despite new attempts, reload and content updates", () => {
    let p = pass(blankProgress(), q("q01"));
    expect(xp(p)).toBe(20);
    p = parseProgress(JSON.stringify(p));
    p = pass(p, { ...q("q01"), version: 2 });
    expect(xp(p)).toBe(20);
    expect(p.awards).toHaveLength(3);
  });
  it("repeated completion of the same attempt does not add evidence or awards", () => {
    const p = pass(blankProgress(), q("q01"));
    expect(completeAttempt(p, p.attempts[0], q("q01"))).toBe(p);
  });
  it("boss gives 50 instead of 20", () => {
    const p = week1();
    expect(xp(p)).toBe(130);
    expect(p.awards.filter((a) => a.questId === "boss01")).toHaveLength(1);
  });
  it("each separately authored review awards 20 only once", () => {
    let p = week1();
    p = pass(p, q("review01"), {}, "2026-10-11T02:00:00.000Z");
    const earned = xp(p);
    p = pass(p, q("review01"), {}, "2026-11-03T02:00:00.000Z");
    expect(xp(p)).toBe(earned);
  });
  it("rejects stale checks after an edit", () => {
    const p = pass(blankProgress(), q("q01"));
    const a = {
      ...createAttempt(p, q("q01")),
      checks: p.attempts[0].checks,
      checkedCode: "old",
      prediction: "text",
      reflection: "text",
    };
    expect(() => completeAttempt(p, a, q("q01"))).toThrow("current code");
  });
});
describe("mastery and boss gates", () => {
  it("XP and guided boss do not unlock week 2", () => {
    let p = blankProgress();
    for (const id of ["q01", "q02", "q03", "q04", "boss01"])
      p = pass(p, q(id), { solution: true });
    expect(xp(p)).toBe(130);
    expect(unlocked(p, q("q06"))).toBe(false);
    expect(hasBossEvidence(p, "boss01")).toBe(false);
    expect(recommendation(p, date).quest?.id).toBe("boss01-fresh");
  });
  it("independent fresh boss evidence unlocks week 2 and identifies self assessment", () => {
    const p = week1();
    expect(unlocked(p, q("q06"))).toBe(true);
    expect(mastery(p, "html")?.source).toBe("self");
  });
  it("solution reveal taints a reset for the same quest", () => {
    let p = week1();
    const guided = { ...createAttempt(p, q("boss01-fresh")), solution: true };
    p = updateAttempt(p, guided);
    expect(createAttempt(p, q("boss01-fresh")).solution).toBe(true);
  });
  it("hints are recorded without an XP penalty", () => {
    const p = pass(week1(), q("review01"), { hints: 1 });
    expect(p.evidence.at(-1)?.level).toBe("With hints");
    expect(
      p.awards
        .filter((a) => a.questId === "review01")
        .reduce((s, a) => s + a.amount, 0),
    ).toBe(20);
  });
  it("worked regular activities do not claim independence", () => {
    const p = pass(blankProgress(), q("q01"));
    expect(mastery(p, "roles")?.level).toBe("Guided");
  });
  it("retained needs a later different variation after the configured gap", () => {
    const p = pass(week1(), q("review01"), {}, "2026-10-11T02:00:00.000Z");
    expect(mastery(p, "html")?.level).toBe("Retained");
    const early = pass(week1(), q("review01"), {}, "2026-10-05T02:00:00.000Z");
    expect(mastery(early, "html")?.level).toBe("Independent");
  });
  it("cannot fabricate a coach review without notes", () => {
    expect(() => pass(week1(), q("review01"), { assessment: "coach" })).toThrow(
      "real coach",
    );
  });
  it("cannot complete a locked quest", () => {
    expect(() => pass(blankProgress(), q("q06"))).toThrow("prerequisites");
  });
});
describe("Manila calendar and reviews", () => {
  it("converts UTC midnight boundary in Manila", () => {
    expect(localDate("2026-10-04T15:59:59Z")).toBe("2026-10-04");
    expect(localDate("2026-10-04T16:00:00Z")).toBe("2026-10-05");
  });
  it("uses Monday to Sunday local weeks", () => {
    expect(weekStart("2026-10-04T15:59:59Z")).toBe("2026-09-28");
    expect(weekStart("2026-10-04T16:00:00Z")).toBe("2026-10-05");
  });
  it("schedules 7 days and advances to 30 days from initial success", () => {
    let p = week1();
    expect(p.reviews.find((r) => r.skillId === "html")?.due).toBe("2026-10-11");
    p = pass(p, q("review01"), {}, "2026-10-11T02:00:00.000Z");
    expect(p.reviews.find((r) => r.skillId === "html")?.due).toBe("2026-11-03");
  });
  it("does not duplicate due items for the same skill", () => {
    const p = week1();
    expect(p.reviews.filter((r) => r.skillId === "html")).toHaveLength(1);
  });
  it("selects a due review exactly on the boundary", () => {
    const p = week1();
    expect(recommendation(p, "2026-10-10T15:59:59Z").quest?.id).toBe("q06");
    expect(recommendation(p, "2026-10-10T16:00:00Z").quest?.id).toBe(
      "review01",
    );
  });
  it("defers a difficult review while preserving evidence and XP", () => {
    const p = week1();
    const next = deferReview(
      p,
      "review:html",
      1,
      "Needs recall",
      "2026-10-11T02:00:00.000Z",
    );
    expect(next.reviews.find((r) => r.skillId === "html")?.due).toBe(
      "2026-10-12",
    );
    expect(next.evidence).toEqual(p.evidence);
    expect(xp(next)).toBe(xp(p));
  });
  it("optional sessions do not increase the five-core target", () => {
    const p = pass(week1(), q("opt01-recall"));
    expect(rhythm(p, date)).toMatchObject({ core: 5, optional: 1 });
    expect(p.settings.coreTarget).toBe(5);
  });
  it("finishing available core content offers reviews and describes planned modules", () => {
    let p = week1();
    for (const id of ["q06", "q07", "q08", "q09", "boss02"]) p = pass(p, q(id));
    for (const id of ["q11", "q12", "q13", "q14", "boss03"]) p = pass(p, q(id));
    for (const id of ["q15", "q16", "q17", "q18", "boss04"]) p = pass(p, q(id));
    expect(recommendation(p, date).quest).toBeUndefined();
    expect(recommendation(p, date).reason).toContain("planned");
  });
});
describe("storage, migration and import validation", () => {
  it("preserves progress and unique XP when an additional pack is registered", () => {
    const p = week1();
    curriculumPacks.push({
      ...pack,
      id: "season-02-fixture",
      title: "Test pack",
    });
    try {
      const loaded = parseProgress(JSON.stringify(p));
      expect(loaded.packs["season-02-fixture"]).toBe(pack.version);
      expect(loaded.attempts).toEqual(p.attempts);
      expect(loaded.evidence).toEqual(p.evidence);
      expect(xp(loaded)).toBe(xp(p));
      expect(parseProgress(JSON.stringify(loaded)).awards).toEqual(p.awards);
    } finally {
      curriculumPacks.pop();
    }
  });
  it("preserves version 1 work when beginner teaching is updated", () => {
    const old = week1();
    old.packs[pack.id] = 1;
    old.attempts = old.attempts.map((a) => ({ ...a, contentVersion: 1 }));
    const draft = {
      ...createAttempt(old, q("q06"), date),
      contentVersion: 1,
      prediction: "I am not sure yet",
      code: { ...q("q06").starter, js: "const price = 125;" },
      hints: 1,
    };
    const before = updateAttempt(old, draft);
    const loaded = parseProgress(JSON.stringify(before));
    expect(loaded.packs[pack.id]).toBe(pack.version);
    expect(loaded.attempts).toEqual(before.attempts);
    expect(loaded.evidence).toEqual(before.evidence);
    expect(loaded.awards).toEqual(before.awards);
    expect(loaded.reviews).toEqual(before.reviews);
    expect(loaded.journal).toEqual(before.journal);
    expect(xp(loaded)).toBe(xp(before));
  });
  it("rejects unsupported content versions and mismatched coach sources", () => {
    const p = week1();
    expect(() =>
      parseProgress(JSON.stringify({ ...p, packs: { [pack.id]: 999 } })),
    ).toThrow("unavailable");
    expect(() =>
      parseProgress(
        JSON.stringify({
          ...p,
          evidence: p.evidence.map((e) =>
            e.level === "Independent" ? { ...e, source: "coach" } : e,
          ),
        }),
      ),
    ).toThrow("Independence");
  });
  it("treats an empty stored record as corrupt and never writes during load", () => {
    const loaded = load({
      read: () => "",
      write: () => {
        throw Error("must not write");
      },
    });
    expect(loaded.corrupt).toBe("");
    expect(loaded.error).toContain("corrupt");
  });
  it("refuses to save a draft that would fail schema validation on reload", () => {
    let written = false;
    const p = updateAttempt(blankProgress(), {
      ...createAttempt(blankProgress(), q("q01")),
      prediction: "x".repeat(30001),
    });
    expect(
      save(p, {
        read: () => null,
        write: () => {
          written = true;
        },
      }),
    ).toContain("Unsaved");
    expect(written).toBe(false);
  });
  it("export/import preserves all records", () => {
    const p = pass(week1(), q("review01"), {}, "2026-10-11T02:00:00.000Z");
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
  });
  it("migrates v0 missing packs without resetting attempts", () => {
    const p = week1();
    const old = { ...p, schemaVersion: 0, packs: undefined };
    expect(parseProgress(JSON.stringify(old))).toEqual(p);
    expect((migrate(old) as Progress).schemaVersion).toBe(1);
  });
  it.each([
    "{}",
    "not json",
    JSON.stringify({ ...blankProgress(), schemaVersion: 99 }),
  ])("rejects malformed/unsupported import %s", (raw) => {
    expect(() => parseProgress(raw)).toThrow();
  });
  it("rejects oversized input", () => {
    expect(() => parseProgress(" ".repeat(4 * 1024 * 1024 + 1))).toThrow(
      "4 MB",
    );
  });
  it("rejects unknown IDs and duplicate awards", () => {
    const p = week1();
    expect(() =>
      parseProgress(
        JSON.stringify({ ...p, awards: [...p.awards, p.awards[0]] }),
      ),
    ).toThrow("Duplicate");
    expect(() =>
      parseProgress(
        JSON.stringify({
          ...p,
          attempts: p.attempts.map((a) => ({ ...a, questId: "unknown" })),
        }),
      ),
    ).toThrow("Unknown");
  });
  it("rejects impossible XP amounts and invalid evidence", () => {
    const p = week1();
    expect(() =>
      parseProgress(
        JSON.stringify({
          ...p,
          awards: p.awards.map((a) => ({ ...a, amount: 999 })),
        }),
      ),
    ).toThrow("XP");
    const guided = pass(blankProgress(), q("q01"), { solution: true });
    expect(() =>
      parseProgress(
        JSON.stringify({
          ...guided,
          evidence: guided.evidence.map((e) => ({
            ...e,
            level: "Independent",
            source: "self",
          })),
        }),
      ),
    ).toThrow("Independence");
  });
  it("reports denied storage without a saved claim", () => {
    const store = {
      read: () => {
        throw Error("denied");
      },
      write: () => {
        throw Error("quota exceeded");
      },
    };
    expect(load(store).error).toContain("unavailable");
    expect(save(blankProgress(), store)).toContain("Unsaved");
  });
  it("preserves corrupt raw data until explicit recovery", () => {
    const loaded = load({
      read: () => "{broken",
      write: () => {
        throw Error("must not write");
      },
    });
    expect(loaded.corrupt).toBe("{broken");
    expect(loaded.error).toContain("corrupt");
  });
  it("round-trips an unfinished draft and hints", () => {
    let raw: string | null = null;
    const store = {
      read: () => raw,
      write: (value: string) => {
        raw = value;
      },
    };
    const p = blankProgress();
    const a = {
      ...createAttempt(p, q("q01")),
      prediction: "Maybe",
      hints: 2,
      code: { ...q("q01").starter, html: "<p>My unfinished draft</p>" },
    };
    expect(save(updateAttempt(p, a), store)).toBe("");
    expect(load(store).progress.attempts[0]).toEqual(a);
  });
});
