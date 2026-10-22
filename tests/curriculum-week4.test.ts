import { describe, expect, it } from "vitest";
import { courseModules } from "../src/course-map";
import { computingQuests } from "../src/computing-quests";
import { blankProgress, completeAttempt, createAttempt, fingerprint, hasBossEvidence, unlocked } from "../src/domain";
import { quests, questById, skills, validateCurriculum } from "../src/curriculum";
import { instrument } from "../src/sandbox";
import { week3Quests } from "../src/week3-quests";
import { week4Quests } from "../src/week4-quests";
import type { Attempt, Progress, Quest } from "../src/types";

const date = "2026-10-21T04:00:00.000Z";
const q = (id: string) => questById(id)!;

function pass(p: Progress, quest: Quest, patch: Partial<Attempt> = {}) {
  const attempt: Attempt = {
    ...createAttempt(p, quest, date),
    code: { ...quest.solution },
    prediction: "Fixture prediction",
    reflection: "Fixture reflection",
    explanation: "Fixture explanation",
    bug: "Fixture diagnosis",
    rubric: [true, true, true, true],
    ...patch,
    checks: quest.checks.map((check) => ({
      id: check.id, label: check.label, passed: true, detail: "Fixture check",
    })),
  };
  attempt.checkedCode = fingerprint(attempt);
  return completeAttempt(p, attempt, quest, date);
}

function throughWeek3(solutionOnBoss03 = false) {
  let p = blankProgress();
  for (const id of ["q01", "q02", "q03", "q04", "boss01", "q06", "q07", "q08", "q09", "boss02", "q11", "q12", "q13", "q14", "boss03"])
    p = pass(p, q(id), id === "boss03" && solutionOnBoss03 ? { solution: true } : {});
  return p;
}

function outcomes(quest: Quest, source = quest.solution.js) {
  const document = { querySelector: () => ({ textContent: "Ready", addEventListener() {} }) };
  let steps = 0;
  const guard = () => { if (++steps > 25000) throw Error("Authored fixture exceeded its step limit"); };
  const calls = quest.checks.filter((check) => check.kind === "function")
    .map((check) => `${check.fn}(...${JSON.stringify(check.args)})`);
  return new Function("__testGuard", "document", instrument(source, "__testGuard") + `\nreturn [${calls.join(",")}];`)(guard, document) as unknown[];
}

describe("Module 04 curriculum and compatibility", () => {
  it("integrates both optional computing bridge lessons and all eight Week 4 activities", () => {
    validateCurriculum();
    expect(quests).toHaveLength(37);
    expect(computingQuests.map((quest) => quest.id)).toEqual(["pre01", "pre02"]);
    expect(week3Quests).toHaveLength(9);
    expect(week4Quests.map((quest) => quest.id)).toEqual([
      "q15", "q16", "q17", "q18", "boss04", "opt04-repair", "boss04-fresh", "review04",
    ]);
    expect(courseModules.map((module) => module.id)).toEqual([
      "orientation", "web", "behavior", "data", "reasoning", "workflow", "apis-react", "delivery",
    ]);
    expect(courseModules.flatMap((module) => module.questIds).every((id) => Boolean(q(id)))).toBe(true);
    expect(courseModules.filter((module) => module.status === "planned").every((module) => module.questIds.length === 0)).toBe(true);
    expect(skills.map((skill) => skill.id)).toEqual(expect.arrayContaining([
      "computing", "algorithms", "loops", "testing", "ai-review",
    ]));
  });

  it("keeps the computing bridge optional and gates q15 only on independent boss03 evidence", () => {
    const bridge = pass(blankProgress(), q("pre01"));
    expect(unlocked(bridge, q("q01"))).toBe(true);

    const guidedBoss = throughWeek3(true);
    expect(guidedBoss.attempts.some((attempt) => attempt.questId === "boss03" && attempt.completedAt)).toBe(true);
    expect(hasBossEvidence(guidedBoss, "boss03")).toBe(false);
    expect(unlocked(guidedBoss, q("q15"))).toBe(false);

    const independentBoss = pass(guidedBoss, q("boss03-fresh"));
    expect(hasBossEvidence(independentBoss, "boss03")).toBe(true);
    expect(unlocked(independentBoss, q("q15"))).toBe(true);

    const existingLearner = throughWeek3();
    expect(existingLearner.attempts.some((attempt) => attempt.questId.startsWith("pre"))).toBe(false);
    expect(unlocked(existingLearner, q("q15"))).toBe(true);
  });
});

describe("Week 4 JavaScript behavior", () => {
  it.each(week4Quests)("$id solution passes every authored function case; the starter does not", (quest) => {
    const expected = quest.checks.filter((check) => check.kind === "function")
      .map((check) => check.value ?? check.expected);
    expect(outcomes(quest)).toEqual(expected);
    expect(outcomes(quest, quest.starter.js)).not.toEqual(expected);
  });

  it("catches multiplication, loop, type, equality and fresh-rule mutations", () => {
    const plan = q("q15");
    const addition = plan.solution.js.replace("guests * seatsPerGuest", "guests + seatsPerGuest");
    expect(outcomes(plan, addition)).not.toEqual(outcomes(plan));

    const loop = q("q16");
    expect(outcomes(loop, loop.solution.js.replace("index < count", "index <= count"))).not.toEqual(outcomes(loop));
    const boundary = q("q17");
    expect(outcomes(boundary, boundary.solution.js.replace("index < count", "index <= count"))).not.toEqual(outcomes(boundary));

    const reviewAi = q("q18");
    expect(outcomes(reviewAi, reviewAi.solution.js.replace("requested > capacity", "requested >= capacity"))).not.toEqual(outcomes(reviewAi));
    const boss = q("boss04");
    expect(outcomes(boss, boss.solution.js.replace("seats >= minimum", "seats > minimum"))).not.toEqual(outcomes(boss));

    const fresh = q("boss04-fresh");
    expect(outcomes(fresh, fresh.solution.js.replace("goal - rooms[index].seats", "rooms[index].seats - goal"))).not.toEqual(outcomes(fresh));
    const review = q("review04");
    expect(outcomes(review, review.solution.js.replace("rooms[index].seats > target", "rooms[index].seats < target"))).not.toEqual(outcomes(review));
  });
});
