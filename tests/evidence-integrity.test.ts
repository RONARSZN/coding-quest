import { describe, expect, it } from "vitest";
import {
  blankProgress,
  completeAttempt,
  createAttempt,
  fingerprint,
  independentEligibility,
  updateAttempt,
} from "../src/domain";
import { questById } from "../src/curriculum";
import { parseProgress } from "../src/storage";
import type { Attempt, Progress, Quest } from "../src/types";

const dayOne = "2026-10-04T02:00:00.000Z";
const q = (id: string) => questById(id)!;

function readyAttempt(
  progress: Progress,
  quest: Quest,
  date = dayOne,
  patch: Partial<Attempt> = {},
): Attempt {
  const attempt: Attempt = {
    ...createAttempt(progress, quest, date),
    code: { ...quest.solution },
    prediction: "Fixture prediction",
    reflection: "Fixture reflection",
    explanation: "Fixture explanation",
    bug: "Fixture diagnosis",
    rubric: [true, true, true, true],
    ...patch,
    checks: quest.checks.map((check) => ({
      id: check.id,
      label: check.label,
      passed: true,
      detail: "Fixture check",
    })),
  };
  attempt.checkedCode = fingerprint(attempt);
  return attempt;
}

function pass(
  progress: Progress,
  quest: Quest,
  date = dayOne,
  patch: Partial<Attempt> = {},
): Progress {
  return completeAttempt(progress, readyAttempt(progress, quest, date, patch), quest, date);
}

function throughWeekOne(): Progress {
  let progress = blankProgress();
  for (const id of ["q01", "q02", "q03", "q04", "boss01"])
    progress = pass(progress, q(id));
  return progress;
}

describe("independent evidence integrity", () => {
  it("keeps a reset attempt guided after an earlier hint", () => {
    const quest = q("boss01-fresh");
    let progress = throughWeekOne();
    const hintedAttempt = readyAttempt(progress, quest, dayOne, { hints: 1 });
    progress = updateAttempt(progress, hintedAttempt);
    const reset = readyAttempt(
      progress,
      quest,
      "2026-10-05T02:00:00.000Z",
    );

    expect(independentEligibility(progress, reset, quest)).toMatchObject({
      eligible: false,
    });
    const completed = completeAttempt(
      progress,
      reset,
      quest,
      "2026-10-05T02:00:00.000Z",
    );
    const evidence = completed.evidence.filter(
      (item) => item.attemptId === reset.id,
    );

    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every((item) => item.level === "Guided")).toBe(true);
    expect(evidence.every((item) => item.source === "practice")).toBe(true);
    expect(progress.attempts.find((item) => item.id === hintedAttempt.id)).toEqual(
      hintedAttempt,
    );
  });

  it("records a repeat of a completed fresh quest as practice after the retention gap", () => {
    const quest = q("boss01-fresh");
    const first = pass(throughWeekOne(), quest, dayOne);
    const importedFirst = parseProgress(JSON.stringify(first));

    expect(importedFirst).toEqual(first);

    const repeatDate = "2026-10-20T02:00:00.000Z";
    const repeat = readyAttempt(importedFirst, quest, repeatDate);
    expect(independentEligibility(importedFirst, repeat, quest)).toMatchObject({
      eligible: false,
    });
    const completed = completeAttempt(importedFirst, repeat, quest, repeatDate);
    const newEvidence = completed.evidence.filter(
      (item) => item.attemptId === repeat.id,
    );

    expect(newEvidence.length).toBeGreaterThan(0);
    expect(newEvidence.every((item) => item.level === "Guided")).toBe(true);
    expect(newEvidence.every((item) => item.source === "practice")).toBe(true);
    expect(completed.attempts.slice(0, importedFirst.attempts.length)).toEqual(
      importedFirst.attempts,
    );
    expect(completed.evidence.slice(0, importedFirst.evidence.length)).toEqual(
      importedFirst.evidence,
    );
    expect(completed.awards).toEqual(importedFirst.awards);
    expect(parseProgress(JSON.stringify(completed))).toEqual(completed);
  });

  it("allows a different fresh challenge to establish independent evidence", () => {
    let progress = pass(
      throughWeekOne(),
      q("boss01-fresh"),
      dayOne,
    );
    for (const id of ["q06", "q07", "q08", "q09", "boss02"])
      progress = pass(progress, q(id), dayOne);

    const quest = q("boss02-fresh");
    const attempt = readyAttempt(progress, quest, dayOne);
    expect(independentEligibility(progress, attempt, quest)).toMatchObject({
      eligible: true,
    });

    const completed = completeAttempt(progress, attempt, quest, dayOne);
    const evidence = completed.evidence.filter(
      (item) => item.attemptId === attempt.id,
    );
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every((item) => item.level === "Independent")).toBe(true);
    expect(evidence.every((item) => item.source === "self")).toBe(true);
  });

  it("keeps an unassisted failed attempt from tainting a later solution", () => {
    const quest = q("boss01-fresh");
    let progress = throughWeekOne();
    const failed = createAttempt(progress, quest, dayOne);
    failed.checks = quest.checks.map((check) => ({
      id: check.id,
      label: check.label,
      passed: false,
      detail: "Needs another try",
    }));
    failed.checkedCode = fingerprint(failed);
    progress = updateAttempt(progress, failed);

    const clean = readyAttempt(progress, quest, "2026-10-05T02:00:00.000Z");
    expect(independentEligibility(progress, clean, quest).eligible).toBe(true);
    const completed = completeAttempt(
      progress,
      clean,
      quest,
      "2026-10-05T02:00:00.000Z",
    );
    expect(
      completed.evidence
        .filter((item) => item.attemptId === clean.id)
        .every((item) => item.level === "Independent"),
    ).toBe(true);
  });

  it("marks a different review as retained after the configured gap", () => {
    const progress = throughWeekOne();
    const review = q("review01");
    const date = "2026-10-11T02:00:00.000Z";
    const attempt = readyAttempt(progress, review, date);

    expect(independentEligibility(progress, attempt, review).eligible).toBe(true);
    const completed = completeAttempt(progress, attempt, review, date);
    const evidence = completed.evidence.filter(
      (item) => item.attemptId === attempt.id,
    );

    expect(evidence.length).toBeGreaterThan(0);
    expect(
      evidence
        .filter((item) => ["html", "css", "values"].includes(item.skillId))
        .every((item) => item.level === "Retained"),
    ).toBe(true);
  });
});
