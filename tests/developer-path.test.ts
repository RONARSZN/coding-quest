import { describe, expect, it } from "vitest";
import { quests, questById, pack, validateCurriculum } from "../src/curriculum";
import { week3Quests } from "../src/week3-quests";
import { developerStages, stageEvidence } from "../src/developer-path";
import { blankProgress, completeAttempt, createAttempt, fingerprint, hasBossEvidence, mastery, recommendation, reviewQuest, unlocked, updateAttempt, xp } from "../src/domain";
import { parseProgress } from "../src/storage";
import { instrument } from "../src/sandbox";
import type { Attempt, Progress, Quest } from "../src/types";

const date = "2026-10-06T04:00:00.000Z";
const q = (id: string) => questById(id)!;
function pass(p: Progress, quest: Quest, patch: Partial<Attempt> = {}, time = date) {
  const a: Attempt = {
    ...createAttempt(p, quest, time), code: quest.solution,
    prediction: "Fixture prediction", reflection: "Fixture reflection",
    explanation: "Fixture explanation", bug: "Fixture diagnosis",
    rubric: [true, true, true, true], ...patch,
    checks: quest.checks.map((c) => ({ id: c.id, label: c.label, passed: true, detail: "Fixture" })),
  };
  a.checkedCode = fingerprint(a);
  return completeAttempt(p, a, quest, time);
}
function throughWeek2(guideBoss = false) {
  let p = blankProgress();
  for (const id of ["q01", "q02", "q03", "q04", "boss01", "q06", "q07", "q08", "q09", "boss02"])
    p = pass(p, q(id), id === "boss02" && guideBoss ? { solution: true } : {});
  return p;
}
function throughWeek3(guideBoss = false) {
  let p = throughWeek2();
  for (const id of ["q11", "q12", "q13", "q14", "boss03"])
    p = pass(p, q(id), id === "boss03" && guideBoss ? { solution: true } : {});
  return p;
}
function outcomes(quest: Quest, source = quest.solution.js) {
  const document = { querySelector: () => ({ textContent: "Ready", addEventListener() {} }) };
  let steps = 0;
  const guard = () => { if (++steps > 25000) throw Error("Authored fixture exceeded its step limit"); };
  const calls = quest.checks.filter((c) => c.kind === "function").map((c) => `${c.fn}(...${JSON.stringify(c.args)})`);
  return new Function("__testGuard", "document", instrument(source, "__testGuard") + `\nreturn [${calls.join(",")}];`)(guard, document) as unknown[];
}

describe("Week 3 authored behavior", () => {
  it("validates the expanded curriculum and preserves original identifiers", () => {
    validateCurriculum();
    expect(week3Quests).toHaveLength(9);
    expect(quests).toHaveLength(37);
    expect(pack.version).toBe(4);
  });
  it.each(week3Quests)("$id solution handles all authored function cases; starter remains incomplete", (quest) => {
    const expected = quest.checks.filter((c) => c.kind === "function").map((c) => c.value ?? c.expected);
    expect(outcomes(quest)).toEqual(expected);
    expect(outcomes(quest, quest.starter.js)).not.toEqual(expected);
  });
  it("accepts an alternative implementation by behavior", () => {
    const source = `function quantityMessage(quantity, stock) {
      return Number.isInteger(quantity)
        ? quantity < 1 ? "Use at least 1" : quantity <= stock ? "Quantity OK" : "Not enough stock"
        : "Use a whole number";
    }`;
    expect(outcomes(q("q13"), source)).toEqual(outcomes(q("q13")));
  });
  it("the cases expose per-item fee bugs and the changed fresh customer limit", () => {
    const original = q("q14");
    const values = outcomes(original, original.starter.js);
    expect(values[0]).toBe(outcomes(original)[0]);
    expect(values[1]).not.toBe(outcomes(original)[1]);
    const fresh = q("boss03-fresh");
    expect(outcomes(fresh, fresh.solution.js.replace("quantity > 3", "quantity > 4"))).not.toEqual(outcomes(fresh));
    expect(outcomes(q("boss03"), q("boss03").solution.js.replace("quantity >= 3", "quantity > 3"))).not.toEqual(outcomes(q("boss03")));
  });
});

describe("Week 3 progression, evidence and compatibility", () => {
  it("requires independent Week 2 boss evidence, then recommends q11 without optional work", () => {
    const guided = throughWeek2(true);
    expect(unlocked(guided, q("q11"))).toBe(false);
    expect(recommendation(guided, date).quest?.id).toBe("boss02-fresh");
    const fresh = pass(guided, q("boss02-fresh"));
    expect(unlocked(fresh, q("q11"))).toBe(true);
    expect(recommendation(fresh, date).quest?.id).toBe("q11");
    expect(fresh.attempts.some((a) => q(a.questId).kind === "optional")).toBe(false);
  });
  it("requires a fresh Week 3 checkpoint after solution exposure, including resets", () => {
    const guided = throughWeek3(true);
    expect(hasBossEvidence(guided, "boss03")).toBe(false);
    expect(recommendation(guided, date).quest?.id).toBe("boss03-fresh");
    expect(createAttempt(guided, q("boss03")).solution).toBe(true);
    const fresh = pass(guided, q("boss03-fresh"));
    expect(hasBossEvidence(fresh, "boss03")).toBe(true);
    expect(mastery(fresh, "validation")?.source).toBe("self");
    expect(recommendation(fresh, date).quest?.id).toBe("q15");
  });
  it("schedules and selects the new review, and records retained evidence only after the saved gap", () => {
    const p = throughWeek3();
    const r = p.reviews.find((item) => item.skillId === "validation")!;
    expect(r.due).toBe("2026-10-13");
    expect(reviewQuest(p, r)?.id).toBe("review03");
    expect(p.reviews.filter((item) => item.skillId === "validation")).toHaveLength(1);
    const early = pass(p, q("review03"), {}, "2026-10-07T04:00:00.000Z");
    expect(mastery(early, "validation")?.level).toBe("Independent");
    const later = pass(p, q("review03"), {}, "2026-10-13T04:00:00.000Z");
    expect(mastery(later, "validation")?.level).toBe("Retained");
    expect(later.reviews.find((item) => item.skillId === "validation")?.due).toBe("2026-11-05");
    expect(xp(pass(later, q("review03"), {}, "2026-11-06T04:00:00.000Z"))).toBe(xp(later));
  });
  it("imports an older v2 backup with all unfinished code, evidence, XP, dates and notes preserved", () => {
    let old = throughWeek2();
    old.packs[pack.id] = 2;
    old.settings.reviewDays = { first: 9, second: 35 };
    old = updateAttempt(old, { ...createAttempt(old, q("q09")), code: { ...q("q09").starter, js: "// unfinished private draft" }, prediction: "Keep this note", hints: 1 });
    const restored = parseProgress(JSON.stringify(old));
    expect(restored.schemaVersion).toBe(1);
    expect(restored.packs[pack.id]).toBe(4);
    for (const key of ["attempts", "evidence", "awards", "reviews", "journal", "settings"] as const)
      expect(restored[key]).toEqual(old[key]);
    expect(parseProgress(JSON.stringify(restored)).awards).toEqual(old.awards);
    expect(xp(restored)).toBe(xp(old));
  });
  it("derives path results from saved checks and distinguishes self, coach and practice records", () => {
    let p = pass(blankProgress(), q("q01"));
    const stage = developerStages[0];
    expect(stageEvidence(p, stage).checked).toBe(1);
    expect(stageEvidence(p, stage).records[0].source).toBe("practice");
    p.attempts[0].code.html += "changed after checks";
    expect(stageEvidence(p, stage).checked).toBe(0);
    p = throughWeek3();
    p = pass(p, q("boss03-fresh"), { assessment: "coach", reviewerNotes: "Actual reviewer fixture" });
    const records = stageEvidence(p, developerStages[1]).records;
    expect(records.some((e) => e.source === "self")).toBe(true);
    expect(records.some((e) => e.source === "coach")).toBe(true);
    for (const planned of developerStages.filter((s) => s.availability === "Planned")) {
      expect(stageEvidence(p, planned).checked).toBe(0);
      expect(stageEvidence(p, planned).records).toEqual([]);
    }
  });
});
