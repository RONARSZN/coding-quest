import { curriculumPacks, quests, questById } from "./curriculum";
import type { Attempt, Progress, Quest, Review } from "./types";
export const now = () => new Date().toISOString();
export function localDate(stamp: string | Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(stamp));
}
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function weekStart(stamp: string | Date = new Date()): string {
  const day = localDate(stamp);
  const d = new Date(`${day}T00:00:00Z`);
  return addDays(day, -((d.getUTCDay() + 6) % 7));
}
export const fingerprint = (a: Attempt) => JSON.stringify(a.code);
export const isBoss = (q: Quest) => q.kind === "boss" || q.kind === "variation";
export function blankProgress(): Progress {
  return {
    schemaVersion: 1,
    settings: {
      onboarded: false,
      coreTarget: 5,
      optionalTarget: 2,
      reviewDays: { first: 7, second: 30 },
      seasonStart: weekStart(),
    },
    packs: Object.fromEntries(
      curriculumPacks.map((item) => [item.id, item.version]),
    ),
    attempts: [],
    evidence: [],
    awards: [],
    reviews: [],
    journal: [],
  };
}
export function upgradePacks(p: Progress): Progress {
  return {
    ...p,
    packs: {
      ...p.packs,
      ...Object.fromEntries(
        curriculumPacks.map((item) => [
          item.id,
          Math.max(p.packs[item.id] || 0, item.version),
        ]),
      ),
    },
  };
}
export function latest(p: Progress, id: string) {
  return p.attempts.filter((a) => a.questId === id && !a.archived).at(-1);
}
export const completed = (p: Progress, id: string) =>
  p.attempts.some((a) => a.questId === id && a.completedAt);
export function hasBossEvidence(p: Progress, id: string): boolean {
  return p.evidence.some(
    (e) =>
      (e.questId === id || e.questId === `${id}-fresh`) &&
      ["Independent", "Retained"].includes(e.level),
  );
}
export function unlocked(p: Progress, q: Quest): boolean {
  return (
    q.prerequisites.every((id) => completed(p, id)) &&
    (!q.gate || hasBossEvidence(p, q.gate))
  );
}
export function createAttempt(p: Progress, q: Quest, date = now()): Attempt {
  return {
    id: crypto.randomUUID(),
    questId: q.id,
    contentVersion: q.version,
    code: { ...q.starter },
    prediction: "",
    reflection: "",
    explanation: "",
    bug: "",
    nextStep: "",
    hints: 0,
    solution: p.attempts.some((a) => a.questId === q.id && a.solution),
    checks: [],
    checkedCode: "",
    rubric: [false, false, false, false],
    assessment: "self",
    reviewerNotes: "",
    updatedAt: date,
    archived: false,
  };
}
export function updateAttempt(p: Progress, a: Attempt): Progress {
  return {
    ...p,
    attempts: p.attempts.some((x) => x.id === a.id)
      ? p.attempts.map((x) => (x.id === a.id ? a : x))
      : [...p.attempts, a],
  };
}
export function readiness(a: Attempt, q: Quest): string | undefined {
  if (
    a.checkedCode !== fingerprint(a) ||
    a.checks.length !== q.checks.length ||
    !q.checks.every((c) => a.checks.some((r) => r.id === c.id && r.passed))
  )
    return "Run the current code and pass every behavior check first.";
  if (!a.prediction.trim())
    return "Write your prediction; being wrong is fine.";
  if (!a.reflection.trim()) return "Add your reflection before completing.";
  if (q.fresh && !a.explanation.trim())
    return "Add an explanation for this fresh variation. Understanding is assessed by a person.";
  if (
    isBoss(q) &&
    (!a.rubric.every(Boolean) || !a.explanation.trim() || !a.bug.trim())
  )
    return "Complete the boss rubric, explanation and bug diagnosis.";
  if (a.assessment === "coach" && !a.reviewerNotes.trim())
    return "Record notes from a real coach review, or choose self-assessment.";
}
export function independentEligibility(
  p: Progress,
  a: Attempt,
  q: Quest,
): { eligible: boolean; reason: string } {
  if (!q.fresh)
    return {
      eligible: false,
      reason: "Independent evidence needs a fresh variation; this activity is practice.",
    };
  if (a.solution)
    return {
      eligible: false,
      reason:
        "A solution has been revealed for this challenge, so this attempt counts as guided practice.",
    };
  if (a.hints > 0)
    return {
      eligible: false,
      reason: "Hints were used in this attempt, so it counts as practice.",
    };
  if (!a.explanation.trim())
    return {
      eligible: false,
      reason: "Add an explanation to qualify for independent evidence.",
    };

  const priorExposure = p.attempts.find(
    (other) =>
      other.id !== a.id &&
      other.questId === q.id &&
      (other.completedAt || other.hints > 0 || other.solution),
  );
  if (priorExposure?.completedAt)
    return {
      eligible: false,
      reason:
        "This challenge was already completed. Repeats are practice; use another fresh variation to build independent evidence.",
    };
  if (priorExposure?.solution)
    return {
      eligible: false,
      reason:
        "A solution was revealed on an earlier attempt of this challenge, so this reset is practice.",
    };
  if (priorExposure?.hints)
    return {
      eligible: false,
      reason:
        "A hint was used on an earlier attempt of this challenge, so this reset is practice.",
    };
  return {
    eligible: true,
    reason:
      "This fresh variation has an explanation and no recorded hint or solution exposure.",
  };
}
export function completeAttempt(
  p: Progress,
  a: Attempt,
  q: Quest,
  date = now(),
): Progress {
  if (!unlocked(p, q))
    throw Error("Complete the prerequisites and boss evidence first.");
  const issue = readiness(a, q);
  if (issue) throw Error(issue);
  if (a.completedAt) return p;
  const done = { ...a, completedAt: date, updatedAt: date };
  const result = updateAttempt(p, done);
  const award = (suffix: string, amount: number) => {
    const id = `${q.id}:${suffix}`;
    if (!result.awards.some((x) => x.id === id))
      result.awards = [
        ...result.awards,
        { id, questId: q.id, attemptId: a.id, amount, date },
      ];
  };
  if (q.kind === "boss") award("boss", 50);
  else {
    award("prediction", 5);
    award("modification", 10);
    award("reflection", 5);
  }
  for (const skillId of q.skills) {
    const previous = p.evidence
      .filter(
        (e) =>
          e.skillId === skillId &&
          ["Independent", "Retained"].includes(e.level),
      )
      .sort((x, y) => x.date.localeCompare(y.date))[0];
    const eligibility = independentEligibility(p, a, q);
    const independent = eligibility.eligible;
    const retained =
      independent &&
      previous &&
      previous.attemptId !== a.id &&
      localDate(date) >=
        addDays(localDate(previous.date), p.settings.reviewDays.first);
    const level = a.solution
      ? "Guided"
      : a.hints
        ? "With hints"
        : retained
          ? "Retained"
          : independent
            ? "Independent"
            : "Guided";
    result.evidence = [
      ...result.evidence,
      {
        id: `${a.id}:${skillId}`,
        skillId,
        questId: q.id,
        attemptId: a.id,
        level,
        source: independent ? a.assessment : "practice",
        date,
        notes: independent
          ? a.assessment === "coach"
            ? a.reviewerNotes
            : a.explanation
          : eligibility.reason,
      },
    ];
    const review = result.reviews.find((r) => r.skillId === skillId);
    if (!review)
      result.reviews = [
        ...result.reviews,
        {
          id: `review:${skillId}`,
          skillId,
          due: addDays(localDate(date), p.settings.reviewDays.first),
          phase: 7,
          gap: "",
          completedQuestIds: [],
        },
      ];
    else if (q.kind === "review") {
      const first = result.evidence
        .filter((e) => e.skillId === skillId)
        .sort((x, y) => x.date.localeCompare(y.date))[0];
      const next = review.phase === 7 ? 30 : 60;
      const due =
        review.phase === 7
          ? addDays(localDate(first.date), p.settings.reviewDays.second)
          : addDays(localDate(date), 30);
      result.reviews = result.reviews.map((r) =>
        r.id === review.id
          ? {
              ...r,
              phase: next,
              due: due > localDate(date) ? due : addDays(localDate(date), 1),
              gap: "",
              completedQuestIds: [...new Set([...r.completedQuestIds, q.id])],
            }
          : r,
      );
    }
  }
  if (!result.journal.some((j) => j.attemptId === a.id))
    result.journal = [
      ...result.journal,
      {
        id: `journal:${a.id}`,
        attemptId: a.id,
        questId: q.id,
        date,
        explanation: a.explanation,
        reflection: a.reflection,
        bug: a.bug,
        nextStep: a.nextStep,
        hints: a.hints,
        solution: a.solution,
      },
    ];
  return result;
}
export function deferReview(
  p: Progress,
  id: string,
  days: number,
  gap = "",
  date = now(),
): Progress {
  return {
    ...p,
    reviews: p.reviews.map((r) =>
      r.id === id
        ? { ...r, due: addDays(localDate(date), days), gap: gap || r.gap }
        : r,
    ),
  };
}
export function reviewQuest(p: Progress, r: Review): Quest | undefined {
  return (
    quests.find(
      (q) =>
        q.kind === "review" &&
        q.skills.includes(r.skillId) &&
        unlocked(p, q) &&
        !r.completedQuestIds.includes(q.id),
    ) ||
    quests.find(
      (q) =>
        q.kind === "review" && q.skills.includes(r.skillId) && unlocked(p, q),
    )
  );
}
export function recommendation(
  p: Progress,
  date = now(),
): { quest?: Quest; reason: string; review?: Review } {
  const active = p.attempts.findLast(
    (a) => !a.archived && !a.completedAt && unlocked(p, questById(a.questId)!),
  );
  if (active)
    return {
      quest: questById(active.questId),
      reason: "Resume your unfinished quest",
    };
  const due = p.reviews
    .filter((r) => r.due <= localDate(date))
    .sort((x, y) => x.due.localeCompare(y.due))
    .find((r) => reviewQuest(p, r));
  if (due)
    return {
      quest: reviewQuest(p, due),
      reason: "A short recall is due",
      review: due,
    };
  const next = quests.find(
    (q) =>
      (q.kind === "core" || q.kind === "boss") &&
      !completed(p, q.id) &&
      unlocked(p, q),
  );
  if (next) return { quest: next, reason: "Your next core quest" };
  const missing = quests.find(
    (q) => q.kind === "boss" && completed(p, q.id) && !hasBossEvidence(p, q.id),
  );
  if (missing)
    return {
      quest: questById(`${missing.id}-fresh`),
      reason: "Build independent boss evidence with a fresh variation",
    };
  return {
    reason:
      "You have finished the available Weeks 1–4 core lessons. Practice your project and scheduled reviews; the local-workflow and later modules are planned. Explore Developer path for project briefs.",
  };
}
export const xp = (p: Progress) =>
  p.awards.reduce((sum, a) => sum + a.amount, 0);
export function rhythm(p: Progress, date = now()) {
  const start = weekStart(date);
  const end = addDays(start, 7);
  const current = p.attempts.filter(
    (a) =>
      a.completedAt &&
      localDate(a.completedAt) >= start &&
      localDate(a.completedAt) < end,
  );
  const unique = [...new Set(current.map((a) => a.questId))];
  return {
    core: unique.filter((id) => ["core", "boss"].includes(questById(id)!.kind))
      .length,
    optional: unique.filter(
      (id) => !["core", "boss"].includes(questById(id)!.kind),
    ).length,
    start,
  };
}
export function mastery(p: Progress, skillId: string) {
  const levels = [
    "Not started",
    "Guided",
    "With hints",
    "Independent",
    "Retained",
  ];
  return p.evidence
    .filter((e) => e.skillId === skillId)
    .sort(
      (a, b) =>
        levels.indexOf(b.level) - levels.indexOf(a.level) ||
        b.date.localeCompare(a.date),
    )[0];
}
export function coaching(a: Attempt, q: Quest, question: string) {
  return `# Coding Quest coaching handoff\n\nQuest: ${q.title} (${q.id}, content v${a.contentVersion})\nAttempt: ${a.id}\nQuestion: ${question || "Help me understand the result and suggest one next step."}\n\nPrediction: ${a.prediction}\nHelp used: ${a.hints} hints; solution ${a.solution ? "revealed" : "not revealed"}\n\n## HTML\n\`\`\`html\n${a.code.html}\n\`\`\`\n## CSS\n\`\`\`css\n${a.code.css}\n\`\`\`\n## JavaScript\n\`\`\`js\n${a.code.js}\n\`\`\`\n\n## Behavior checks\n${a.checks.map((r) => `${r.passed ? "PASS" : "FAIL"} ${r.label}: ${r.detail}`).join("\n") || "Not run"}\n\nExplanation: ${a.explanation}\nReflection: ${a.reflection}\nBug: ${a.bug}\nNext step: ${a.nextStep}\n\nUnderstanding assessment: ${a.assessment}; notes: ${a.reviewerNotes}\nPlease coach without giving the full solution unless I ask.`;
}
