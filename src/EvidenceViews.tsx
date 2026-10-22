import { quests, questById, skills } from "./curriculum";
import { developerStages } from "./developer-path";
import {
  completed,
  fingerprint,
  hasBossEvidence,
  latest,
  localDate,
  mastery,
  reviewQuest,
  unlocked,
  xp,
} from "./domain";
import type { Attempt, Progress, Quest } from "./types";

type ViewProps = {
  p: Progress;
  start: (quest: Quest, again?: boolean) => void;
};

const dateLabel = (stamp: string) =>
  new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(stamp.length === 10 ? `${stamp}T00:00:00+08:00` : stamp));

function prerequisiteText(p: Progress, q: Quest) {
  const missing = q.prerequisites
    .filter((id) => !completed(p, id))
    .map((id) => questById(id)?.title || id);
  if (missing.length) return `First complete: ${missing.join("; ")}.`;
  if (q.gate && !hasBossEvidence(p, q.gate))
    return "First record independent evidence in the preceding checkpoint or its fresh variation.";
  return "Ready when you are. Your code and notes save as you work.";
}

function checkCount(a: Attempt, q: Quest) {
  return a.checkedCode === fingerprint(a)
    ? q.checks.filter((check) => a.checks.some((r) => r.id === check.id && r.passed)).length
    : 0;
}

function AttemptRecord({ a }: { a: Attempt }) {
  const q = questById(a.questId);
  const current = a.checkedCode === fingerprint(a);
  return (
    <div className="attempt-record">
      <p className="small muted">
        Updated {dateLabel(a.updatedAt)} · {a.solution ? "Solution revealed" : `${a.hints} hints used`}
        {a.archived ? " · Preserved previous attempt" : ""}
      </p>
      <dl className="record-notes">
        <div><dt>Prediction</dt><dd>{a.prediction || "Not written yet."}</dd></div>
        <div><dt>My explanation</dt><dd>{a.explanation || "Not written yet."}</dd></div>
        <div><dt>Reflection</dt><dd>{a.reflection || "Not written yet."}</dd></div>
        <div><dt>Bug and fix</dt><dd>{a.bug || "No note recorded."}</dd></div>
        <div><dt>Next step / assistance</dt><dd>{a.nextStep || "No note recorded."}</dd></div>
      </dl>
      <p className="small">
        {q ? `${checkCount(a, q)} / ${q.checks.length} current behavior checks pass.` : "No available behavior checks."}{" "}
        {a.checks.length > 0 && !current && "Code changed after the last run; those results are historical."}
      </p>
      {a.checks.map((r) => (
        <p key={r.id} className="small">
          <strong>{r.passed ? "PASS" : "NEEDS WORK"} · {r.label}</strong><br />{r.detail}
        </p>
      ))}
      <details>
        <summary>Saved code and record details</summary>
        {Object.entries(a.code).map(([language, value]) => (
          <div key={language}>
            <h4>{language === "js" ? "JavaScript" : language.toUpperCase()}</h4>
            <pre>{value || "// This tab is empty."}</pre>
          </div>
        ))}
        <p className="small muted">Attempt {a.id} · content v{a.contentVersion}</p>
        <p className="small">Assessment: {a.assessment === "coach" ? "Coach review recorded manually" : "Self-assessment"}. {a.reviewerNotes}</p>
      </details>
    </div>
  );
}

export function ProjectsView({ p, start }: ViewProps) {
  const projects = quests.filter((q) => q.kind === "boss");
  return (
    <>
      <section className="notice">
        <strong>Build something you can explain.</strong>
        <p>Each project combines earlier lessons into a working result. Keep your first version, change a rule, test the edge cases, and explain the choices. A working result and an explanation are different kinds of evidence.</p>
      </section>
      <div className="project-grid">
        {projects.map((q, index) => {
          const a = latest(p, q.id);
          const available = unlocked(p, q);
          const done = completed(p, q.id);
          const fresh = questById(`${q.id}-fresh`);
          const proven = hasBossEvidence(p, q.id);
          return (
            <article className="project-card panel" key={q.id}>
              <div className="section-title">
                <span className="eyebrow">PROJECT {String(index + 1).padStart(2, "0")}</span>
                <span className={`pill ${proven ? "success" : ""}`}>{proven ? "Fresh evidence recorded" : done ? "Practice completed" : a ? "Draft saved" : "Build & explain"}</span>
              </div>
              <h2>{q.title.replace(/^Boss\s*·\s*/, "")}</h2>
              <p>{q.objective}</p>
              <p className="small muted">{q.skills.map((id) => skills.find((s) => s.id === id)?.title).filter(Boolean).join(" · ")}</p>
              <details>
                <summary>Project brief & completion criteria</summary>
                <p>{q.exercise}</p>
                <h3>Definition of done</h3>
                <ul>
                  <li>Pass every behavior check with the current code.</li>
                  <li>Explain what the inputs, rules and result mean.</li>
                  <li>Implement and explain the changed requirement: {q.changedRequirement || "change a rule and compare the result."}</li>
                  <li>Describe the bug, the failing example and why the fix works.</li>
                  <li>Record any AI or other help in your explanation or next-step note. Read, modify and test suggested code before relying on it.</li>
                </ul>
              </details>
              <p className="small">{prerequisiteText(p, q)}</p>
              {a && <p className="small muted">{checkCount(a, q)} / {q.checks.length} checks pass · latest draft {dateLabel(a.updatedAt)}</p>}
              <div className="actions">
                <button className="primary" disabled={!available} onClick={() => start(q)}>
                  {done ? "View project" : a ? "Resume project →" : available ? "Build project →" : "Prerequisites needed"}
                </button>
                {fresh && (
                  <button disabled={!unlocked(p, fresh)} onClick={() => start(fresh)}>
                    {completed(p, fresh.id) ? "View fresh challenge" : latest(p, fresh.id) ? "Resume fresh challenge" : "Try a fresh challenge"}
                  </button>
                )}
              </div>
              {fresh && <p className="small muted">The fresh challenge changes the problem. Passing without hints or a revealed solution, plus your explanation, records self- or coach-assessed independent evidence.</p>}
            </article>
          );
        })}
      </div>
      <section className="panel section">
        <div className="section-title"><h2>Where projects go next</h2><span className="pill">Future content</span></div>
        <p>Keep improving one useful tool as your skills grow. These briefs describe the route ahead; they do not include playable lessons yet.</p>
        {developerStages.filter((stage) => stage.availability === "Planned").map((stage) => (
          <details className="history" key={stage.title}>
            <summary>{stage.title} · planned</summary>
            <p>{stage.project}</p>
            <p className="small"><strong>Before this:</strong> {stage.prerequisites}</p>
            <ul>{stage.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
          </details>
        ))}
      </section>
    </>
  );
}

export function ProgressView({ p, start }: ViewProps) {
  const core = quests.filter((q) => q.kind === "core" || q.kind === "boss");
  const finished = core.filter((q) => completed(p, q.id)).length;
  const independent = skills.filter((s) => ["Independent", "Retained"].includes(mastery(p, s.id)?.level || "")).length;
  const retained = skills.filter((s) => mastery(p, s.id)?.level === "Retained").length;
  const reviews = [...p.reviews].sort((a, b) => a.due.localeCompare(b.due));
  return (
    <>
      <div className="evidence-grid">
        <section className="panel metric"><span className="eyebrow">CORE PRACTICE</span><strong>{finished}<small> / {core.length}</small></strong><p>Lessons and checkpoints completed. Completion records practice.</p></section>
        <section className="panel metric"><span className="eyebrow">PRACTICE XP</span><strong>{xp(p)}</strong><p>Earned once per activity. XP does not measure understanding.</p></section>
        <section className="panel metric"><span className="eyebrow">FRESH EVIDENCE</span><strong>{independent}<small> skills</small></strong><p>Independent or retained work, labeled by assessment source.</p></section>
        <section className="panel metric"><span className="eyebrow">RETURN & RECALL</span><strong>{retained}<small> retained</small></strong><p>Fresh work after a saved review gap. Understanding still needs human judgment.</p></section>
      </div>
      <section className="panel section">
        <div className="section-title"><h2>Your evidence, skill by skill</h2><span className="eyebrow">NO READINESS SCORE</span></div>
        <p className="small muted">Guided → With hints → Independent → Retained. The app checks results; you or a real coach assess the explanation. Past achievements remain visible when later practice is difficult.</p>
        {skills.map((skill) => {
          const e = mastery(p, skill.id);
          const records = p.evidence.filter((item) => item.skillId === skill.id).sort((a, b) => b.date.localeCompare(a.date));
          const next = quests.find((q) => q.skills.includes(skill.id) && unlocked(p, q) && !completed(p, q.id));
          return (
            <div className="skill-row" key={skill.id}>
              <div className="section-title"><h3>{skill.title}</h3><span className={`pill ${e && ["Independent", "Retained"].includes(e.level) ? "success" : ""}`}>{e?.level || "Not started"}</span></div>
              {e ? <p className="small muted">{e.source === "self" ? "Self-assessed" : e.source === "coach" ? "Coach review recorded" : "Guided practice"} · {dateLabel(e.date)} · {questById(e.questId)?.title}</p> : <p className="small muted">No evidence recorded yet.</p>}
              {records.length > 0 && (
                <details>
                  <summary>View {records.length} evidence {records.length === 1 ? "record" : "records"}</summary>
                  {records.map((record) => (
                    <div className="evidence-record" key={record.id}>
                      <p className="small"><strong>{record.level}</strong> · {record.source === "self" ? "Self-assessed" : record.source === "coach" ? "Coach-reviewed" : "Practice"} · {dateLabel(record.date)}</p>
                      <p>{record.notes}</p>
                      <p className="small muted">{questById(record.questId)?.title} · attempt {record.attemptId}</p>
                    </div>
                  ))}
                </details>
              )}
              {next && <button className="quiet" onClick={() => start(next)}>Practice this skill →</button>}
            </div>
          );
        })}
      </section>
      <section className="panel section">
        <div className="section-title"><h2>Review queue</h2><span className="pill">{reviews.filter((r) => r.due <= localDate()).length} due</span></div>
        {reviews.length ? reviews.map((review) => {
          const q = reviewQuest(p, review);
          return (
            <div className="review-row" key={review.id}>
              <div><strong>{skills.find((s) => s.id === review.skillId)?.title}</strong><p className="small muted">{review.due <= localDate() ? "Due" : "Next review"} {dateLabel(review.due)}{review.gap ? ` · Practice gap: ${review.gap}` : ""}</p></div>
              {q ? <button onClick={() => start(q, completed(p, q.id))}>Review →</button> : <span className="small muted">A review variation is not available yet.</span>}
            </div>
          );
        }) : <p className="empty">Reviews appear after practice. Return after a gap to find what you remember and what needs another example.</p>}
      </section>
    </>
  );
}

export function JournalView({ p, start }: ViewProps) {
  const drafts = p.attempts.filter((a) => !a.completedAt && !a.archived).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return (
    <>
      <section className="panel section">
        <div className="section-title"><h2>Pick up where you paused</h2><span className="pill">{drafts.length} saved {drafts.length === 1 ? "draft" : "drafts"}</span></div>
        {drafts.length ? drafts.map((a) => {
          const q = questById(a.questId);
          return <div className="review-row" key={a.id}><div><strong>{q?.title || a.questId}</strong><p className="small muted">Saved {dateLabel(a.updatedAt)} · code, notes and help history preserved.</p></div>{q && <button className="primary" disabled={!unlocked(p, q)} onClick={() => start(q)}>Resume →</button>}</div>;
        }) : <p className="empty">No unfinished work. Start a lesson or project and your draft will appear here.</p>}
      </section>
      <section className="section">
        <div className="section-title"><h2>Notes from completed practice</h2><span className="eyebrow">YOUR WORDS, YOUR WORK</span></div>
        {p.journal.length ? [...p.journal].reverse().map((entry) => {
          const a = p.attempts.find((item) => item.id === entry.attemptId);
          return (
            <article className="journal-entry panel" key={entry.id}>
              <span className="eyebrow">{dateLabel(entry.date)} · {entry.solution ? "GUIDED · SOLUTION USED" : `${entry.hints} HINTS USED`}</span>
              <h3>{questById(entry.questId)?.title || entry.questId}</h3>
              <p>{entry.reflection}</p>
              {entry.explanation && <p><strong>My explanation:</strong> {entry.explanation}</p>}
              {entry.bug && <p><strong>Bug & fix:</strong> {entry.bug}</p>}
              {entry.nextStep && <p><strong>Next step / assistance:</strong> {entry.nextStep}</p>}
              {a && <details><summary>Inspect saved attempt</summary><AttemptRecord a={a} /></details>}
            </article>
          );
        }) : <p className="empty panel">Your first completed activity starts this journal. Record what you changed, why it worked, and what you want to try next.</p>}
      </section>
      <section className="panel section">
        <div className="section-title"><h2>All attempts</h2><span className="pill">{p.attempts.length} preserved</span></div>
        <p className="small muted">Resetting starts a new attempt and preserves the old one here. Solution exposure remains part of that activity’s history.</p>
        {p.attempts.length ? [...p.attempts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((a) => (
          <details className="history" key={a.id}>
            <summary>{questById(a.questId)?.title || a.questId} · {a.completedAt ? "completed" : a.archived ? "previous attempt" : "in progress"}</summary>
            <AttemptRecord a={a} />
          </details>
        )) : <p>No attempts yet.</p>}
      </section>
    </>
  );
}
