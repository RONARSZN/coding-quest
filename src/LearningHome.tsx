import { useState } from "react";
import { courseModules, learningApproach, resourceGuidance } from "./course-map";
import { quests, questById, skills } from "./curriculum";
import { completed, deferReview, hasBossEvidence, latest, localDate, recommendation, reviewQuest, rhythm, unlocked } from "./domain";
import type { Progress, Quest } from "./types";

type Start = (q: Quest, again?: boolean) => void;
export const activityNames = {core: "Guided lesson", boss: "Project checkpoint", optional: "Extra practice", review: "Recall & transfer", variation: "Independent challenge"};

export function QuestRow({q,p,start,index}: {q:Quest;p:Progress;start:Start;index:number}) {
  const open = unlocked(p,q), done = completed(p,q.id), active = latest(p,q.id);
  const waiting = q.gate && !hasBossEvidence(p,q.gate)
    ? `First demonstrate independent understanding in ${questById(q.gate)?.title} or its fresh challenge.`
    : `First complete ${q.prerequisites.map(id => questById(id)?.title).join(", ")}.`;
  return <article className={`quest-row ${done ? "is-done" : ""} ${!open ? "is-locked" : ""}`}>
    <span className="row-index" aria-hidden="true">{done ? "✓" : String(index).padStart(2,"0")}</span>
    <div><span className="eyebrow">{activityNames[q.kind]}{q.fresh ? " · fresh problem" : ""}</span><h3>{q.title}</h3><p>{!open ? waiting : done ? "Completed · code and evidence saved. Revisit any time." : q.objective}</p></div>
    <button disabled={!open} className={!done && open ? "primary" : ""} onClick={() => start(q)}>{done ? "View" : active ? "Resume" : open ? "Start →" : "Locked"}</button>
  </article>;
}

export function Dashboard({p,start,commit,onMap,onProjects}: {p:Progress;start:Start;commit:(p:Progress)=>void;onMap:()=>void;onProjects:()=>void}) {
  const next = recommendation(p), weekly = rhythm(p);
  const q = next.quest;
  const module = courseModules.find(m => q && m.questIds.includes(q.id));
  const core = quests.filter(q => ["core","boss"].includes(q.kind));
  const count = core.filter(q => completed(p,q.id)).length;
  const due = p.reviews.filter(r => r.due <= localDate());
  const milestone = quests.find(q => q.kind === "boss" && !hasBossEvidence(p,q.id));
  return <>
    <div className="page-heading"><div><span className="eyebrow">YOUR PRACTICE STUDIO</span><h1>A little further,<br/><span className="accent">every session.</span></h1><p>Learn how it works. Build something that proves it.</p></div><span className="session-note"><span className="status-dot"/> YOUR PACE, ALWAYS<br/><small>About 30 minutes · no countdown required</small></span></div>
    <div className="dashboard">
      <section className="next-action panel">
        <div className="section-title"><span className="eyebrow">{q && latest(p,q.id) && !completed(p,q.id) ? "PICK UP WHERE YOU LEFT OFF" : "YOUR NEXT STEP"}</span><span className="pill">{q ? activityNames[q.kind] : "Ongoing practice"}</span></div>
        <span className="module-kicker">{module?.subtitle || "Keep the practice going"}</span>
        <h2>{q?.title || "Turn your learning into a useful change."}</h2><p>{q?.objective || next.reason}</p>
        <div className="why-next"><span className="eyebrow">WHY THIS MATTERS</span><p>{module?.why || "Choose one project, change one requirement, and record what you tested and learned."}</p></div>
        <div className="actions">{q ? <button className="primary" onClick={() => start(q,q.kind === "review" && completed(p,q.id))}>{latest(p,q.id) && !completed(p,q.id) ? "Resume lesson" : "Open next lesson"}<span>→</span></button> : <button className="primary" onClick={onProjects}>Open your projects →</button>}<button className="quiet" onClick={onMap}>Explore the course map ↗</button></div>
        <div className="learning-loop"><span>01 Learn</span><i>→</i><span>02 Practice</span><i>→</i><span>03 Explain</span></div>
      </section>
      <aside className="dashboard-side">
        <section className="panel rhythm"><span className="eyebrow">A SUSTAINABLE RHYTHM</span><div className="stat-value">{Math.min(weekly.core,5)}<span>/ 5 this week</span></div><div className="five" aria-label={`${weekly.core} core sessions this week`}>{[0,1,2,3,4].map(i=><span key={i} className={i<weekly.core ? "filled" : ""}>{i<weekly.core ? "✓" : "·"}</span>)}</div><p>Missed days never erase your work.</p><small>{weekly.optional} optional / review sessions · Mon–Sun</small></section>
        <section className="panel milestone"><span className="eyebrow">BUILD TOWARD SOMETHING</span><div className="flag-symbol" aria-hidden="true">⚑</div><h3>{milestone?.title || "Your next project variation"}</h3><p>Working code, an explained change, and a reproduced bug. That’s the checkpoint.</p><button className="quiet" onClick={onProjects}>See project briefs →</button></section>
      </aside>
    </div>
    <section className="progress-strip"><div><span className="eyebrow">FOUNDATIONS ROUTE</span><strong>{count} / {core.length} core activities completed</strong></div><progress max={core.length} value={count} aria-label="Core activity completion"/><button className="quiet" onClick={onMap}>View your route →</button></section>
    <section className="section"><div className="section-title"><div><span className="eyebrow">COME BACK TO MAKE IT STICK</span><h2>Your review queue</h2></div><span className="pill">{due.length} due</span></div>
      {p.reviews.length ? [...p.reviews].sort((a,b)=>a.due.localeCompare(b.due)).map(r=>{const rq=reviewQuest(p,r);return <div className="review-row" key={r.id}><div><strong>{skills.find(s=>s.id===r.skillId)?.title}</strong><p>{r.due<=localDate() ? "Due" : "Next review"} {r.due}{r.gap ? ` · ${r.gap}` : " · recall, then try a changed problem"}</p></div><div className="actions">{rq ? <button onClick={()=>start(rq,completed(p,rq.id))}>Practice</button>:<span className="muted">Review lesson planned</span>}<button className="quiet" onClick={()=>commit(deferReview(p,r.id,1))}>Tomorrow</button></div></div>}) : <div className="empty"><strong>No reviews due yet.</strong><p>Your first completed practice schedules a return. The default gaps are 7 and 30 days.</p></div>}
    </section>
    <section className="bridge-banner"><div><span className="eyebrow">NEW TO COMPUTING?</span><h3>Start with the ideas behind the code.</h3><p>Inputs, instructions, output, and a plan in ordinary words.</p></div><button onClick={()=>{const bridge=questById("pre01");if(bridge)start(bridge);}}>Open the starting bridge →</button></section>
  </>;
}

export function CourseMap({p,start}: {p:Progress;start:Start}) {
  const [filter,setFilter] = useState("all");
  return <>
    <div className="page-heading"><div><span className="eyebrow">ONE FOCUSED WEB PATH</span><h1>Your course map.</h1><p>Small lessons. Practical projects. Understanding you can show.</p></div><span className="pill">HTML + CSS → JavaScript</span></div>
    <section className="route-banner"><span className="eyebrow">THE LONGER ROUTE</span><p>Web foundations <span>→</span> JavaScript <span>→</span> Developer workflow <span>→</span> APIs <span>→</span> React <span>→</span> TypeScript <span>→</span> Node.js <span>→</span> PostgreSQL</p><small>Start with the authored foundations. Later packs are a direction, with prerequisites and project briefs below.</small></section>
    <div className="filter-bar" role="group" aria-label="Activity filter">{[["all","All activities"],["core","Core route"],["proof","Challenges & reviews"]].map(([value,label])=><button key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}</button>)}</div>
    <div className="course-route">{courseModules.map((m,i)=>{const available=m.status==="available";const list=m.questIds.map(id=>questById(id)).filter((q):q is Quest=>!!q).filter(q=>filter==="all" || (filter==="core" ? ["core","boss"].includes(q.kind) : ["variation","review"].includes(q.kind)));const done=m.questIds.filter(id=>completed(p,id)).length;return <section className={`course-module ${available ? "" : "planned"}`} key={m.id}>
      <div className="module-top"><span className="module-node" aria-hidden="true">{String(i).padStart(2,"0")}</span><div><span className="eyebrow">{m.subtitle}</span><h2>{m.title}</h2></div><span className="pill">{available ? `${done} / ${m.questIds.length} done` : "Planned"}</span></div>
      <p className="module-why">{m.why}</p><details className="module-brief"><summary>Outcomes, prerequisites & completion criteria</summary><p><strong>Before you begin:</strong> {m.prerequisites}</p><ul>{m.outcomes.map(o=><li key={o}>{o}</li>)}</ul><p><strong>Project:</strong> {m.project}</p><p><strong>Checkpoint:</strong> {m.checkpoint}</p></details>
      {available ? list.length ? list.map((q,n)=><QuestRow key={q.id} q={q} p={p} start={start} index={n+1}/>) : <p className="empty">No activities of this type in this module.</p> : <p className="planned-note">Future content · project brief only. Lessons and execution setup are not implemented yet.</p>}
    </section>;})}</div>
    <section className="section"><span className="eyebrow">LEARN WITH INTENTION</span><h2>A course, with a few useful companions.</h2><p className="intro">{learningApproach.core}</p><div className="notice"><strong>Why JavaScript stays the focus</strong><p>{learningApproach.language}</p></div><div className="resource-grid">{resourceGuidance.map(r=><article className="panel" key={r.name}><span className="eyebrow">{r.role}</span><h3>{r.name}</h3><p>{r.reason}</p><p className="small">{r.access}</p><a href={r.url} target="_blank" rel="noreferrer">Official resource ↗</a></article>)}</div><p className="small">Resource access checked 21 October 2026. External exercises do not update your Coding Quest record. No paid resource is required.</p><details><summary>How completion, understanding and pace work</summary><p>{learningApproach.evidence}</p><p>{learningApproach.rhythm}</p></details></section>
  </>;
}
