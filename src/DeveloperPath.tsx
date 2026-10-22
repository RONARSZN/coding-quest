import { courseModules } from "./course-map";
import { completed, fingerprint, localDate, recommendation } from "./domain";
import { quests, skills } from "./curriculum";
import type { Progress, Quest } from "./types";

function moduleEvidence(p: Progress, module: (typeof courseModules)[number]) {
  const questIds = new Set(module.questIds);
  const checked = new Set(p.attempts.filter((attempt) => {
    const quest = quests.find((item) => item.id === attempt.questId);
    return questIds.has(attempt.questId) && quest && attempt.completedAt
      && attempt.checkedCode === fingerprint(attempt)
      && attempt.checks.length === quest.checks.length
      && quest.checks.every((check) => attempt.checks.some((result) => result.id === check.id && result.passed));
  }).map((attempt) => attempt.questId));
  const skillIds = new Set(quests.filter((quest) => questIds.has(quest.id)).flatMap((quest) => quest.skills));
  return {
    checked: checked.size,
    records: p.evidence.filter((record) => skillIds.has(record.skillId)),
  };
}

export function DeveloperPath({ p, start }: { p: Progress; start: (q: Quest, again?: boolean) => void }) {
  const next = recommendation(p);
  const nextQuest = next.quest;
  return (
    <>
      <section className="notice">
        <h2>One route, built on your web experience.</h2>
        <p>JavaScript → React → TypeScript → Node.js → PostgreSQL. AI supports the work; video remains an existing supporting skill. Next.js is an optional later step.</p>
        <p>Your direction is demonstrated capability and opportunities around PHP35,000+ monthly within three months. This is a target, not an income forecast. Website and marketing/content work may be nearer while independent coding develops.</p>
        <p className="small">This path is our interpretation of the role benchmark in the task brief. The referenced role asked for two or more years of developer experience; three months of lessons do not replace that. Check listing availability and Philippines/LATAM eligibility before applying.</p>
        {nextQuest ? <button className="primary" onClick={() => start(nextQuest, nextQuest.kind === "review" && completed(p, nextQuest.id))}>Open next available lesson ↗</button> : <p>Available core lessons complete. Use scheduled reviews and continue with the available project brief.</p>}
      </section>
      <div className="developer-stages">
        {courseModules.map((module, i) => {
          const evidence = moduleEvidence(p, module);
          return (
            <section className={`developer-stage${module.status === "planned" ? " planned" : ""}`} key={module.id} aria-labelledby={`path-module-${module.id}`}>
              <div className="stage-heading">
                <span className="stage-index">{String(i + 1).padStart(2, "0")}</span>
                <div><h2 id={`path-module-${module.id}`}>{module.title}</h2><span className="badge">{module.status === "available" ? "Lessons available" : "Planned"}</span></div>
              </div>
              <p>{module.subtitle}</p>
              <p>{module.why}</p>
              <p><strong>Before this module:</strong> {module.prerequisites}</p>
              <details>
                <summary>Project, outcomes and checkpoint</summary>
                <p><strong>Project:</strong> {module.project}</p>
                <strong>What to learn</strong>
                <ul>{module.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>Checkpoint:</strong> {module.checkpoint}</p>
              </details>
              <div className="path-evidence">
                <strong>Saved learning evidence</strong>
                <p className="small">{evidence.checked} distinct exercises have passing saved checks. These results do not establish module mastery.</p>
                {evidence.records.length ? <details>
                  <summary>View {evidence.records.length} evidence records · practice / self / coach</summary>
                  <ul>{evidence.records.map((record) => <li key={record.id}>{skills.find((skill) => skill.id === record.skillId)?.title || record.skillId}: {record.level} · {record.source === "practice" ? "guided/practice record" : record.source === "self" ? "self-assessment" : "coach assessment"} · {record.questId} · {localDate(record.date)}<p className="small">{record.notes}</p></li>)}</ul>
                </details> : <p className="small">No skill evidence recorded for this module. Planned modules have no Start action or readiness award.</p>}
              </div>
            </section>
          );
        })}
      </div>
      <section className="section">
        <h2>A manageable 90-day direction</h2>
        <p>These are adjustable milestones. At 30 minutes on five days a week, three months offers roughly 30 hours of study; stages may take longer.</p>
        <ol className="path-milestones">
          <li><strong>Days 1–30:</strong> Work through available foundations, practice explaining and debugging, and build one small interactive page.</li>
          <li><strong>Days 31–60:</strong> Extend that project with a changed requirement, basic Git workflow and meaningful checks. Introduce API/React work only after prerequisite evidence supports it and project setup has been taught.</li>
          <li><strong>Days 61–90:</strong> Polish one or two demonstrated projects, write honest case studies and practice explaining decisions. Begin targeted applications/outreach using verified strengths while the longer curriculum continues.</li>
        </ol>
        <p><strong>Weekly system:</strong> About 20 minutes of taught practice and 10 minutes of explanation/review per session. Allocate one of the five sessions to integration or portfolio work. Adjust the pace to your responsibilities.</p>
        <p><strong>Goal–Plan–System, applied here:</strong> Goal = demonstrated capability and career direction. Plan = sequenced stages and projects. System = repeatable practice and review.</p>
        <h3>Three first-week actions</h3>
        <ol>
          <li>Complete your next unlocked lesson.</li>
          <li>Explain one working function and one reproduced bug in your lesson notes.</li>
          <li>Record one small project brief tied to a real user need in a lesson’s Next step note: who needs it, accepted inputs, useful output and a success check. It is saved with your completed journal entry.</li>
        </ol>
        <p className="small">Sessions, time and attempts measure activity. Working changes, clear explanations and successful transfer after a delay measure learning outcomes. Interviews and paid work are separate career outcomes; Coding Quest tracks learning evidence.</p>
      </section>
      <section className="notice">
        <h3>Practice environment and references</h3>
        <p>Weeks 1–4 use the restricted synchronous HTML/CSS/JavaScript sandbox. Later stages need a separately taught local practice environment; network requests, React, Node.js and SQL are not enabled here.</p>
        <p className="small">Progress autosaves only in this browser profile at this origin. Export JSON in Backup for recovery; local autosave is not cloud sync.</p>
        <div className="actions">
          <a href="https://cs50.harvard.edu/x/2026/" target="_blank" rel="noreferrer">CS50x 2026</a>
          <a href="https://www.codedex.io/javascript" target="_blank" rel="noreferrer">Codédex JavaScript</a>
          <a href="https://www.freecodecamp.org/learn/" target="_blank" rel="noreferrer">freeCodeCamp</a>
          <a href="https://developer.mozilla.org/en-US/curriculum/core/" target="_blank" rel="noreferrer">MDN curriculum</a>
          <a href="https://react.dev/learn" target="_blank" rel="noreferrer">React</a>
          <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noreferrer">TypeScript</a>
          <a href="https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" target="_blank" rel="noreferrer">Node.js</a>
          <a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noreferrer">PostgreSQL</a>
          <a href="https://git-scm.com/book/en/v2" target="_blank" rel="noreferrer">Pro Git</a>
        </div>
      </section>
    </>
  );
}
