import { useEffect, useRef, useState } from "react";
import { pack, quests, questById } from "./curriculum";
import { lessonGuides } from "./lesson-guides";
import { activityNames, Dashboard, CourseMap } from "./LearningHome";
import { JournalView, ProgressView, ProjectsView } from "./EvidenceViews";
import {
  addDays,
  blankProgress,
  coaching,
  completeAttempt,
  completed,
  createAttempt,
  deferReview,
  fingerprint,
  independentEligibility,
  isBoss,
  latest,
  localDate,
  now,
  recommendation,
  readiness,
  updateAttempt,
  xp,
  unlocked,
} from "./domain";
import { acceptMessage } from "./preview-message";
import {
  load,
  markdown,
  MAX_BYTES,
  parseProgress,
  save,
  STORAGE_KEY,
} from "./storage";
import type { Attempt, Code, Progress, Quest } from "./types";

function download(name: string, body: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const backup = (p: Progress) =>
  download(`coding-quest-${localDate()}.json`, JSON.stringify(p, null, 2));
const tabs = [
  { id: "Today", label: "Today", icon: "◷" },
  { id: "Course map", label: "Course map", icon: "⌖" },
  { id: "Projects", label: "Projects", icon: "▣" },
  { id: "Progress", label: "Progress", icon: "↗" },
  { id: "Journal", label: "Journal", icon: "☷" },
  { id: "Settings", label: "Settings", icon: "⚙" },
] as const;
type Tab = (typeof tabs)[number]["id"];

function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [initial] = useState(() => {
    const loaded = load();
    let hasStoredProgress = false;
    try {
      hasStoredProgress = localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      // load() has already captured storage access errors for the recovery view.
    }
    return { ...loaded, hasStoredProgress };
  });
  const [p, setP] = useState(initial.progress);
  const current = useRef(p);
  const [status, setStatus] = useState(
    initial.error ||
      (initial.hasStoredProgress
        ? "Saved on this browser"
        : "Not saved yet · browser storage available"),
  );
  const [corrupt, setCorrupt] = useState(initial.corrupt);
  const recovering = corrupt !== null;
  const [conflict, setConflict] = useState(false);
  const [tab, setTab] = useState<Tab>("Today");
  const [selected, setSelected] = useState<string | null>(null);
  const main = useRef<HTMLElement>(null);
  const q = selected ? questById(selected) : undefined;
  const a = q ? latest(p, q.id) : undefined;
  const storageWarning =
    recovering ||
    conflict ||
    status.startsWith("Unsaved") ||
    /unavailable|corrupt|unsupported/i.test(status);

  useEffect(() => {
    const fn = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setConflict(true);
        setStatus(
          "Another tab changed progress. Export this tab before reloading to choose that version.",
        );
      }
    };
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);

  function commit(next: Progress) {
    current.current = next;
    setP(next);
    if (recovering || conflict) {
      setStatus("Unsaved — resolve recovery before saving.");
      return;
    }
    const error = save(next);
    setStatus(error || "Saved on this browser");
  }

  function start(quest: Quest, again = false) {
    if (!unlocked(current.current, quest)) return;
    let next = current.current;
    if (!next.settings.onboarded) {
      next = {
        ...next,
        settings: { ...next.settings, onboarded: true },
      };
    }
    const active = latest(next, quest.id);
    if (again || !active) {
      if (again && active) {
        next = {
          ...next,
          attempts: next.attempts.map((attempt) =>
            attempt.id === active.id ? { ...attempt, archived: true } : attempt,
          ),
        };
      }
      next = updateAttempt(next, createAttempt(next, quest));
      commit(next);
    } else if (next !== current.current) {
      commit(next);
    }
    setSelected(quest.id);
    window.scrollTo(0, 0);
  }

  function nav(next: Tab) {
    setSelected(null);
    setTab(next);
    window.setTimeout(() => main.current?.focus(), 0);
  }

  const tabHeadings: Partial<
    Record<Tab, { eyebrow: string; title: string; description: string }>
  > = {
    Projects: {
      eyebrow: "BUILD, TEST, EXPLAIN",
      title: "Your projects.",
      description:
        "Practice turning a requirement into working code you can describe.",
    },
    Progress: {
      eyebrow: "EVIDENCE OVER POINTS",
      title: "What your practice shows.",
      description:
        "See what you have tried, what passed, and where a fresh explanation is still needed.",
    },
    Journal: {
      eyebrow: "YOUR WORK, KEPT",
      title: "Your learning record.",
      description:
        "Resume a saved draft or revisit the notes and code behind completed practice.",
    },
    Settings: {
      eyebrow: "LOCAL DATA & PREFERENCES",
      title: "Settings and recovery.",
      description:
        "Choose review timing, export a backup, or review a validated restore before replacing progress.",
    },
  };

  return (
    <>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <div className="shell">
        <aside className="sidebar">
          <a
            className="wordmark"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              nav("Today");
            }}
          >
            <span className="mark" aria-hidden="true">
              CQ<span>↗</span>
            </span>
            <span className="brand-name">
              Coding
              <br />
              Quest
            </span>
            <span className="studio">PRACTICE STUDIO</span>
          </a>
          <nav className="primary-nav" aria-label="Main navigation">
            {tabs.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={tab === item.id ? "selected" : ""}
                aria-current={tab === item.id ? "page" : undefined}
                onClick={() => nav(item.id)}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="nav-label">{item.label}</span>
                {tab === item.id && (
                  <span className="nav-current" aria-hidden="true">
                    →
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-note">
            <span className="eyebrow">ONE SMALL STEP</span>
            <p>
              Learn it.
              <br />
              Try it.
              <br />
              Explain it.
            </p>
            <span>About 30 minutes is a suggestion, never a deadline.</span>
          </div>
          <div className="local-note">
            <span aria-hidden="true">●</span> Local &amp; private
            <br />
            <small>No account. No telemetry.</small>
          </div>
        </aside>
        <div className="content">
          <header className="topbar">
            <span className="pack-label">
              FOUNDATIONS PACK
              <span className="muted"> · v{pack.version}</span>
            </span>
            <span
              className={`save-status ${storageWarning ? "warning" : ""}`}
              role="status"
            >
              {status}
            </span>
          </header>
          <main id="main" ref={main} tabIndex={-1}>
            {(recovering || conflict) && (
              <section className="notice danger" role="alert">
                <h2>Keep your existing progress safe</h2>
                <p>
                  {recovering
                    ? "Your stored file is corrupt or uses an unsupported schema. It has not been overwritten."
                    : status}
                </p>
                <div className="actions">
                  {recovering && (
                    <button
                      type="button"
                      onClick={() =>
                        download(
                          "coding-quest-recovery.txt",
                          corrupt ?? "",
                          "text/plain",
                        )
                      }
                    >
                      Export raw stored data
                    </button>
                  )}
                  <button type="button" onClick={() => backup(p)}>
                    Export this tab’s progress
                  </button>
                  {conflict && (
                    <button type="button" onClick={() => location.reload()}>
                      Reload other tab’s version
                    </button>
                  )}
                  {recovering && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            "Reset local progress? Export raw data first if you need recovery. This replaces the stored record.",
                          )
                        ) {
                          const next = blankProgress();
                          const error = save(next);
                          if (error) {
                            setStatus(error);
                            return;
                          }
                          setCorrupt(null);
                          setP(next);
                          current.current = next;
                          setStatus("Reset saved on this browser");
                        }
                      }}
                    >
                      Explicitly reset storage
                    </button>
                  )}
                </div>
              </section>
            )}
            {tab === "Today" && !p.settings.onboarded && !recovering && (
              <section className="notice first-visit" aria-labelledby="first-visit">
                <div>
                  <span className="eyebrow">START WHEN YOU’RE READY</span>
                  <h2 id="first-visit">Start with one small lesson.</h2>
                  <p>
                    You can explore the course map and every section first.
                    Your work stays on this browser; the lesson can be resumed
                    whenever you are ready.
                  </p>
                </div>
                <button
                  className="primary"
                  type="button"
                  onClick={() => {
                    const firstLesson = questById("q01") || quests[0];
                    if (firstLesson) start(firstLesson);
                  }}
                >
                  Start the first lesson →
                </button>
              </section>
            )}
            {q && a ? (
              <Workspace
                key={a.id}
                q={q}
                a={a}
                p={p}
                commit={commit}
                onBack={() => {
                  setSelected(null);
                  window.setTimeout(() => main.current?.focus(), 0);
                }}
                onNext={() => {
                  const next = recommendation(current.current);
                  if (next.quest)
                    start(
                      next.quest,
                      next.quest.kind === "review" &&
                        completed(current.current, next.quest.id),
                    );
                  else nav("Today");
                }}
                onReset={() => {
                  if (
                    confirm(
                      "Reset to starter? This preserves the previous attempt in the journal/history. Solution usage carries over; use a different fresh variation for independent evidence.",
                    )
                  )
                    start(q, true);
                }}
              />
            ) : tab === "Today" ? (
              <Dashboard
                p={p}
                start={start}
                commit={commit}
                onMap={() => nav("Course map")}
                onProjects={() => nav("Projects")}
              />
            ) : tab === "Course map" ? (
              <CourseMap p={p} start={start} />
            ) : tab === "Projects" ? (
              <>
                <PageHeading {...tabHeadings.Projects!} />
                <ProjectsView p={p} start={start} />
              </>
            ) : tab === "Progress" ? (
              <>
                <PageHeading {...tabHeadings.Progress!} />
                <ProgressView p={p} start={start} />
              </>
            ) : tab === "Journal" ? (
              <>
                <PageHeading {...tabHeadings.Journal!} />
                <JournalView p={p} start={start} />
              </>
            ) : (
              <>
                <PageHeading {...tabHeadings.Settings!} />
                <Backup
                  p={p}
                  commit={commit}
                  corrupt={recovering}
                  conflict={conflict}
                />
              </>
            )}
          </main>
          <footer>
            Learn at your pace. Your progress stays on this browser.
            <span>
              Local v1 · {pack.id} / v{pack.version}
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}

type LessonStep = "learn" | "practice" | "reflect";

function Workspace({
  q,
  a,
  p,
  commit,
  onBack,
  onReset,
  onNext,
}: {
  q: Quest;
  a: Attempt;
  p: Progress;
  commit: (p: Progress) => void;
  onBack: () => void;
  onReset: () => void;
  onNext: () => void;
}) {
  const guide = lessonGuides[q.id];
  const changedFromStarter = (Object.keys(q.starter) as (keyof Code)[]).some(
    (language) => a.code[language] !== q.starter[language],
  );
  const hasSavedWork = !!a.prediction.trim() || changedFromStarter;
  const [step, setStep] = useState<LessonStep>(() =>
    a.completedAt ? "reflect" : hasSavedWork ? "practice" : "learn",
  );
  const [editor, setEditor] = useState<keyof Code>(guide.editTabs[0]);
  const [src, setSrc] = useState("");
  const [runtime, setRuntime] = useState("");
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const [handoff, setHandoff] = useState(false);
  const [question, setQuestion] = useState("");
  const [seconds, setSeconds] = useState(1800);
  const [ticking, setTicking] = useState(false);
  const stepper = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const active = useRef({ id: "", code: "" });
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const done = !!a.completedAt;
  const update = (patch: Partial<Attempt>) =>
    commit(updateAttempt(p, { ...a, ...patch, updatedAt: now() }));
  function changeStep(next: LessonStep) {
    setStep(next);
    window.setTimeout(() => {
      stepper.current
        ?.querySelector<HTMLButtonElement>(`[data-step="${next}"]`)
        ?.focus();
    }, 0);
  }
  useEffect(() => {
    if (!ticking) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [ticking]);
  useEffect(() => {
    if (seconds === 0) setTicking(false);
  }, [seconds]);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const payload = acceptMessage(
        event,
        frame.current?.contentWindow || null,
        active.current.id,
        q.checks,
      );
      if (!payload) return;
      clearTimeout(timeout.current);
      setRunning(false);
      setRuntime(payload.error);
      const attempt = {
        ...a,
        checks: payload.results,
        checkedCode: active.current.code,
        updatedAt: now(),
      };
      if (!done) commit(updateAttempt(p, attempt));
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [a, p, q, commit, done]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function run() {
    if (!done) update({ checks: [], checkedCode: "" });
    setRuntime("");
    setNotice("");
    const id = crypto.randomUUID();
    active.current = { id, code: fingerprint(a) };
    setRunning(true);
    try {
      const { buildPreview } = await import("./sandbox");
      const doc = buildPreview(a.code, q.checks, id);
      if (active.current.id !== id) return;
      setSrc(doc);
      setRunning(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setRunning(false);
        setSrc("");
        setRuntime(
          "Preview timed out. Stopped the frame; your editor draft is preserved. Check for a loop or retry.",
        );
      }, 2500);
    } catch (e) {
      setRuntime(e instanceof Error ? e.message : "Could not run this code.");
      setSrc("");
      setRunning(false);
    }
  }
  function finish() {
    try {
      const result = completeAttempt(p, a, q);
      commit(result);
      setNotice(
        "Quest completed. Your practice, XP and review dates are recorded.",
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not complete.");
    }
  }
  const stale = a.checkedCode !== fingerprint(a);
  const issue = readiness(a, q);
  const evidenceEligibility = independentEligibility(p, a, q);
  const evidenceChecksReady =
    !stale &&
    a.checks.length === q.checks.length &&
    a.checks.every((result) => result.passed);
  const passedChecks = stale
    ? 0
    : a.checks.filter((result) => result.passed).length;
  const nextAction = recommendation(p);
  return (
    <>
      <div className={`learning-workspace phase-${step}`}>
      <div className="workspace-top">
        <button className="quiet" onClick={onBack}>
          ← Back to learning
        </button>
        <div className="timer">
          <span aria-live="off">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
          <button onClick={() => setTicking(!ticking)}>
            {ticking ? "Pause" : "Start timer"}
          </button>
          <button
            onClick={() => {
              setSeconds(1800);
              setTicking(false);
            }}
          >
            Reset timer
          </button>
        </div>
      </div>
      <div className="workspace-heading">
        <span className="eyebrow">
          {q.week === 0 ? "STARTING BRIDGE" : `MODULE ${q.week}`} / {activityNames[q.kind]} {done ? " / COMPLETED" : ""}
        </span>
        <h1>{q.title}</h1>
        <p>{q.objective}</p>
        {seconds === 0 && (
          <p role="status">
            Suggested time is up. Your work is safe; continue whenever you want.
          </p>
        )}
      </div>
      <nav
        ref={stepper}
        className="lesson-stepper"
        aria-label="Lesson steps"
      >
        {([
          ["learn", "Learn", "Read the idea and predict"],
          ["practice", "Practice", "Change code and inspect results"],
          ["reflect", "Reflect", "Explain and record your work"],
        ] as const).map(([id, label, description], index) => (
          <button
            key={id}
            data-step={id}
            type="button"
            className={`lesson-step ${step === id ? "is-current" : ""}`}
            aria-current={step === id ? "step" : undefined}
            onClick={() => changeStep(id)}
          >
            <span className="lesson-step-number">0{index + 1}</span>
            <strong>{label}</strong>
            <small>{description}</small>
          </button>
        ))}
      </nav>
      <section
        className="lesson foundations learn-step"
        aria-labelledby="learn-heading"
        aria-hidden={step !== "learn"}
      >
        <span className="eyebrow">01 / LEARN FIRST · ABOUT 5 MIN</span>
        <h2 id="learn-heading">Start with the explanation</h2>
        <p>{guide.introduction}</p>
        <p className="small">
          Read at your own pace. You can look back while answering. New topics
          are taught here before you are asked to use them; no memorizing code
          is required to start.
        </p>
        <details
          className="workspace-help"
          open={q.id === "q01" ? true : undefined}
        >
          <summary>How this workspace works</summary>
          <ol>
            <li>
              Read the explanation and example, then predict what the page will do in ordinary words.
            </li>
            <li>
              In Practice, edit the supplied HTML, CSS or JavaScript and follow the numbered task steps.
            </li>
            <li>
              Run &amp; check shows the resulting page in Preview and checks the requested behavior.
            </li>
            <li>
              PASS means a requested result matched. FAIL means it still needs a
              change; it does not erase progress or cost points. It is expected
              when you run the unchanged starter.
            </li>
            <li>
              A hint gives more help. A full solution is a worked answer you can
              study. Both are allowed; the app records the help you used.
            </li>
            <li>
              In Reflect, describe what you changed and saw, then review the completion criteria. The timer is optional.
            </li>
          </ol>
        </details>
        <div className="teaching-grid">
          <div>
            <h3>Words and symbols for this task</h3>
            <dl className="term-list">
              {guide.terms.map((term) => (
                <div key={term.term}>
                  <dt>{term.term}</dt>
                  <dd>{term.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3>A worked example, explained</h3>
            <p>{q.lesson}</p>
            <p className="small">
              These small examples teach the pattern. Your exercise uses the
              requirements listed below.
            </p>
            {guide.walkthrough.map((line) => (
              <div className="explained-line" key={line.code}>
                <pre>{line.code}</pre>
                <p>{line.meaning}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="small">
          Earlier practice:{" "}
          {q.prerequisites.length
            ? q.prerequisites.map((id) => questById(id)?.title).join(" → ")
            : "None. This is your first lesson."}
        </p>
        <section className="prediction-panel">
          <span className="eyebrow">TRY THE IDEA YOU JUST LEARNED</span>
          <h2>What do you expect to happen?</h2>
          <p className="small">
            Use the explanation above. Write what you expect to see; a wrong
            prediction is useful practice, not a failed test.
          </p>
          <label htmlFor="prediction">{q.prediction}</label>
          <textarea
            id="prediction"
            maxLength={30000}
            value={a.prediction}
            onChange={(e) => update({ prediction: e.target.value })}
            disabled={done}
            placeholder="I think the page will show ___ because ___. It is OK to be unsure."
          />
          <details>
            <summary>Compare after predicting</summary>
            <p>{q.predictionAnswer}</p>
          </details>
        </section>
        <button
          className="primary step-next"
          type="button"
          onClick={() => changeStep("practice")}
        >
          Continue to practice →
        </button>
      </section>
      <section
        className="practice-step"
        aria-label="Practice and result checks"
        aria-hidden={step !== "practice"}
      >
      {!a.prediction.trim() && !done && (
        <div className="notice prediction-reminder">
          <div>
            <strong>Write your prediction before you finish.</strong>
            <p>You can return to Learn and answer in your own words.</p>
          </div>
          <button type="button" onClick={() => changeStep("learn")}>
            Return to Learn to predict
          </button>
        </div>
      )}
      <div className="lesson-layout">
        <section className="lesson">
          <span className="eyebrow lesson-step">02 / PRACTICE · ABOUT 15 MIN</span>
          <h2>Your task, step by step</h2>
          <p>{q.exercise}</p>
          <ol className="task-steps">
            {guide.steps.map((step, i) => (
              <li key={i}>
                {step.tab && (
                  <strong>
                    {step.tab === "js" ? "JavaScript" : step.tab.toUpperCase()}
                    :{" "}
                  </strong>
                )}
                {step.instruction}
              </li>
            ))}
          </ol>
          {q.changedRequirement && (
            <div className="notice">
              <strong>Then change the requirement</strong>
              <p>{q.changedRequirement}</p>
            </div>
          )}
          <div className="notice expected-result">
            <strong>What you should see</strong>
            <p>{guide.success}</p>
          </div>
          <div className="hints">
            {q.hints.slice(0, a.hints).map((hint, i) => (
              <p key={hint}>
                <strong>Hint {i + 1}:</strong> {hint}
              </p>
            ))}
            <button
              disabled={done || a.hints >= 3}
              onClick={() => update({ hints: Math.min(3, a.hints + 1) })}
            >
              Reveal hint {Math.min(a.hints + 1, 3)} · no XP penalty
            </button>
            <button
              className="quiet"
              disabled={done || a.solution}
              onClick={() => {
                if (
                  confirm(
                    "Reveal the full solution? This attempt becomes guided practice. Use a fresh variation for independent evidence.",
                  )
                )
                  update({ solution: true });
              }}
            >
              Reveal full solution
            </button>
            {a.solution && (
              <details open>
                <summary>Guided practice · intended solution</summary>
                {Object.entries(q.solution).map(([lang, value]) => (
                  <div key={lang}>
                    <strong>{lang.toUpperCase()}</strong>
                    <pre>{value}</pre>
                  </div>
                ))}
                <p>
                  Copy the changes manually into your editor. A fresh variation
                  is needed for independence.
                </p>
              </details>
            )}
          </div>
        </section>
        <section className="practice">
          <div className="editor-guide">
            <strong>
              Edit for this task:{" "}
              {guide.editTabs
                .map((lang) =>
                  lang === "js" ? "JavaScript" : lang.toUpperCase(),
                )
                .join(" + ")}
            </strong>
            <p className="small">
              Change the supplied code in the box below.{" "}
              {guide.editTabs.length === 1
                ? "The other two tabs can stay as they are."
                : "Switch tabs for each requested edit."}{" "}
              Then press Run &amp; check.
            </p>
          </div>
          <div className="editor-head">
            <div role="group" aria-label="Code language">
              {(["html", "css", "js"] as const).map((lang) => (
                <button
                  key={lang}
                  aria-pressed={editor === lang}
                  onClick={() => setEditor(lang)}
                >
                  {lang === "js" ? "JavaScript" : lang.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="quiet" onClick={onReset}>
              Reset to starter
            </button>
          </div>
          <label className="sr-only" htmlFor="code-editor">
            {editor === "js" ? "JavaScript" : editor.toUpperCase()} code
          </label>
          <textarea
            className="code-editor"
            id="code-editor"
            maxLength={30000}
            spellCheck={false}
            value={a.code[editor]}
            disabled={done}
            onChange={(e) => {
              clearTimeout(timeout.current);
              active.current = { id: "", code: "" };
              setRunning(false);
              setSrc("");
              update({
                code: { ...a.code, [editor]: e.target.value },
                checks: [],
                checkedCode: "",
              });
            }}
          />
          <div className="runbar">
            <span>
              {done
                ? "Completed attempt · reset to practice again"
                : "Edits save before Run. Preview updates only on Run."}
            </span>
            <button className="primary" onClick={run} disabled={running}>
              {running ? "Running…" : "Run & check ▶"}
            </button>
            <button
              onClick={() => {
                clearTimeout(timeout.current);
                active.current = { id: "", code: "" };
                setSrc("");
                setRunning(false);
                setRuntime("Preview stopped. Your draft is preserved.");
              }}
            >
              Stop
            </button>
          </div>
          <div className="preview-head">
            <span className="eyebrow">PREVIEW / YOUR RESULT</span>
            <span>Fictional data only</span>
          </div>
          {src ? (
            <iframe
              key={active.current.id}
              ref={frame}
              title="Learner code preview"
              sandbox="allow-scripts"
              referrerPolicy="no-referrer"
              srcDoc={src}
            />
          ) : (
            <div className="preview-empty">
              Your result appears here.
              <br />
              Press Run & check to see the starting page or your changes.
            </div>
          )}
          <div className="checks" aria-live="polite">
            <h2>
              Result checks <span className="small">/ automatic · {passedChecks}/{q.checks.length} pass</span>
            </h2>
            {runtime && (
              <pre className="runtime" role="alert">
                {runtime}
              </pre>
            )}
            {a.checks.length && !stale ? (
              a.checks.map((r) => (
                <div
                  className={`check ${r.passed ? "pass" : "fail"}`}
                  key={r.id}
                >
                  <strong>
                    {r.passed ? "PASS" : "FAIL"} · {r.label}
                  </strong>
                  <p>{r.detail}</p>
                </div>
              ))
            ) : (
              <p className="small">
                Run your current code to get specific feedback. Changed code
                needs new checks.
              </p>
            )}
            <p className="small">
              Checks inspect behavior, not your free-text understanding.
            </p>
            {a.checks.some((result) => !result.passed) && !stale && (
              <p className="small">
                Start with the first failed check. Compare its expected result
                with Preview, change one thing, then run again.
              </p>
            )}
            {runtime && (
              <p className="small">
                Fix the first reported problem, then run again before changing
                anything else.
              </p>
            )}
          </div>
          <button onClick={() => setHandoff(true)}>
            Prepare a coaching handoff ↗
          </button>
        </section>
      </div>
      <button
        className="primary step-next"
        type="button"
        onClick={() => changeStep("reflect")}
      >
        Continue to reflect →
      </button>
      </section>
      <section
        className="reflection reflect-step"
        aria-label="Reflection and completion"
        aria-hidden={step !== "reflect"}
      >
        <span className="eyebrow">03 / REFLECT · ABOUT 5 MIN</span>
        <h2>Make sense of what you changed.</h2>
        <p className="small">
          Reflection means describing your attempt in your own words. You can
          use this sentence starter: <strong>{guide.reflectionStarter}</strong>{" "}
          Fill the blanks with what you actually did. Technical vocabulary is
          optional.
        </p>
        <div className="completion-criteria">
          <h3>Completion criteria</h3>
          <ul>
            <li>Write a prediction and a reflection in your own words.</li>
            <li>Run the current code and pass every behavior check.</li>
            {q.fresh && (
              <li>
                Explain the changes. Your explanation is saved; a person makes
                the self or coach assessment because the app does not grade its
                meaning.
              </li>
            )}
            {isBoss(q) && (
              <>
                <li>
                  Implement and explain the changed requirement:{" "}
                  {q.changedRequirement || "change one rule and describe the result."}
                </li>
                <li>
                  Complete the checkpoint rubric and describe a bug and its fix.
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="reflection-grid">
          <label>
            {q.reflection}
            <textarea
              value={a.reflection}
              maxLength={30000}
              disabled={done}
              onChange={(e) => update({ reflection: e.target.value })}
              placeholder={guide.reflectionStarter}
            />
          </label>
          <label>
            Your explanation ·{" "}
            {q.fresh
              ? "required for this fresh variation"
              : "optional practice note"}
            <textarea
              value={a.explanation}
              maxLength={30000}
              disabled={done}
              onChange={(e) => update({ explanation: e.target.value })}
              placeholder={
                q.fresh
                  ? "Name each change and explain what it makes the page do. Use the lesson terms if helpful."
                  : "Optional: describe why your change worked."
              }
            />
          </label>
          <label>
            {q.bug || "A bug you encountered (optional)"}
            <span className="field-help">
              {q.bug
                ? guide.bugHelp
                : "A bug is a mistake that causes an unexpected result. Leave this blank if you did not encounter one."}
            </span>
            <textarea
              value={a.bug}
              maxLength={30000}
              disabled={done}
              onChange={(e) => update({ bug: e.target.value })}
            />
          </label>
          <label>
            Your next-step note (optional)
            <span className="field-help">
              One thing you want to practice or ask about next. You can leave
              this blank.
            </span>
            <textarea
              value={a.nextStep}
              maxLength={30000}
              disabled={done}
              onChange={(e) => update({ nextStep: e.target.value })}
            />
          </label>
        </div>
        {q.fresh && (
          <div className="assessment">
            <h3>Understanding assessment · recorded by a person</h3>
            <p>
              We store your explanation; we do not automatically grade its
              meaning. Retained evidence additionally needs a gap after earlier
              independent evidence.
            </p>
            <div
              className={`evidence-eligibility ${evidenceEligibility.eligible ? "eligible" : "ineligible"}`}
            >
              <strong>
                {evidenceEligibility.eligible
                  ? "Independent evidence check"
                  : "Practice status"}
              </strong>
              <p>{evidenceEligibility.reason}</p>
              <p>
                {evidenceChecksReady
                  ? "Current behavior checks pass. A person still records whether your explanation shows understanding."
                  : "Run the current code and pass every behavior check before this attempt can support independent evidence."}
              </p>
            </div>
            <label>
              Assessment source{" "}
              <select
                value={a.assessment}
                disabled={done}
                onChange={(e) =>
                  update({ assessment: e.target.value as "self" | "coach" })
                }
              >
                <option value="self">Self-assessed by Mark</option>
                <option value="coach">
                  Actual coach review recorded manually
                </option>
              </select>
            </label>
            {a.assessment === "coach" && (
              <label>
                Reviewer & actual review notes
                <textarea
                  value={a.reviewerNotes}
                  maxLength={30000}
                  disabled={done}
                  onChange={(e) => update({ reviewerNotes: e.target.value })}
                  placeholder="Who reviewed this? What did they confirm? Do not invent sign-off."
                />
              </label>
            )}
          </div>
        )}
        {isBoss(q) && (
          <fieldset disabled={done}>
            <legend>Checkpoint checklist · confirm what you understand</legend>
            {[
              "The current behavior checks pass.",
              "I can explain each change in plain English.",
              "I implemented and explained the changed requirement.",
              "I diagnosed the small bug and explained its fix.",
            ].map((text, i) => (
              <label className="checkbox" key={text}>
                <input
                  type="checkbox"
                  checked={a.rubric[i]}
                  onChange={(e) =>
                    update({
                      rubric: a.rubric.map((v, n) =>
                        i === n ? e.target.checked : v,
                      ),
                    })
                  }
                />
                {text}
              </label>
            ))}
          </fieldset>
        )}
        <div className="completion">
          <div>
            <strong>
              {done
                ? "Completed · practice recorded"
                : a.solution
                  ? "Guided practice"
                  : a.hints
                    ? "Practice with hints"
                    : q.fresh
                      ? "Fresh variation · self/coach evidence"
                      : "Practice · fresh evidence comes later"}
            </strong>
            <p>
              {done
                ? nextAction.quest
                  ? `Recommended next: ${nextAction.quest.title}.`
                  : "No new lesson is unlocked. Return to Today for review practice."
                : issue || "Ready to record completion."}
            </p>
            <span className="small">
              {q.kind === "boss"
                ? "Up to 50 XP once"
                : "5 prediction + 10 verified change + 5 reflection = 20 XP once"}
            </span>
          </div>
          <button
            className="primary"
            disabled={!done && !!issue}
            onClick={done ? onNext : finish}
          >
            {done
              ? nextAction.quest
                ? `Continue to ${nextAction.quest.title} →`
                : "Return to Today"
              : "Complete this activity ✓"}
          </button>
        </div>
        {notice && <p role="status">{notice}</p>}
        {q.kind === "review" && (
          <button
            disabled={done}
            onClick={() => {
              const gap =
                a.bug ||
                a.reflection ||
                "This review felt difficult; practice the skill again.";
              let next = updateAttempt(p, {
                ...a,
                archived: true,
                bug: a.bug || gap,
                nextStep:
                  a.nextStep ||
                  `Review practice again on ${addDays(localDate(), 1)}.`,
                updatedAt: now(),
              });
              for (const r of next.reviews.filter((r) =>
                q.skills.includes(r.skillId),
              ))
                next = deferReview(next, r.id, 1, gap);
              commit(next);
              setNotice(
                "Practice gap recorded. The affected skills are due again tomorrow; achievements and XP are preserved.",
              );
            }}
          >
            This review was difficult · practice again tomorrow
          </button>
        )}
      </section>
      </div>
      {handoff && (
        <Handoff
          text={coaching(a, q, question)}
          question={question}
          setQuestion={setQuestion}
          onClose={() => setHandoff(false)}
        />
      )}
    </>
  );
}
function Handoff({
  text,
  question,
  setQuestion,
  onClose,
}: {
  text: string;
  question: string;
  setQuestion: (s: string) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog ref={dialog} onCancel={onClose}>
      <div className="dialog-head">
        <h2>Review your coaching handoff</h2>
        <button onClick={onClose} aria-label="Close coaching handoff">
          Close ×
        </button>
      </div>
      <p>
        Review the text, then copy it into chat yourself. Nothing is sent
        automatically.
      </p>
      <label>
        Your specific question
        <textarea
          value={question}
          maxLength={5000}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </label>
      <label>
        Text to copy
        <textarea className="handoff" readOnly value={text} />
      </label>
      <button
        className="primary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopyStatus("Copied. Paste into your coaching chat when ready.");
          } catch {
            setCopyStatus(
              "Clipboard unavailable. Select the text above and copy manually.",
            );
          }
        }}
      >
        Copy handoff
      </button>
      <p role="status">{copyStatus}</p>
    </dialog>
  );
}
function Backup({
  p,
  commit,
  corrupt,
  conflict,
}: {
  p: Progress;
  commit: (p: Progress) => void;
  corrupt: boolean;
  conflict: boolean;
}) {
  const [incoming, setIncoming] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [first, setFirst] = useState(p.settings.reviewDays.first);
  const [second, setSecond] = useState(p.settings.reviewDays.second);
  return (
    <>
      <section className="backup-panel">
        <h2>Your work belongs to you.</h2>
        <p>
          Stored as versioned JSON in this browser’s localStorage at{" "}
          <strong>{location.origin}</strong>. It has no cloud sync. Export
          before changing browsers, profiles, origins, clearing data or
          replacing progress.
        </p>
        <p className="small">
          Standard local address: http://127.0.0.1:5188. Each address keeps a
          separate local save; return using the same browser, profile and
          address to resume.
        </p>
        <div className="actions">
          <button className="primary" onClick={() => backup(p)}>
            Export all progress · JSON ↓
          </button>
          <button
            onClick={() =>
              download(
                `coding-quest-${localDate()}.md`,
                markdown(p),
                "text/markdown",
              )
            }
          >
            Export readable summary ↓
          </button>
        </div>
        <p className="small">
          Includes settings, content versions, all attempts and code, checks,
          evidence, unique XP awards, reviews and journal. Runtime cost: no paid
          services. Privacy: local data and downloads only.
        </p>
        {notice && (
          <p className="notice status-message" role="status">
            {notice}
          </p>
        )}
      </section>
      <section className="section">
        <h2>Restore a backup</h2>
        <p>
          We validate the version, size (maximum 4 MB), fields, IDs and
          references before changing anything. Import replaces your current
          progress after confirmation; it does not merge or duplicate awards.
        </p>
        <label className="file-label">
          Choose progress JSON
          <input
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              setIncoming(null);
              setError("");
              setNotice("");
              if (!file) return;
              try {
                if (file.size > MAX_BYTES)
                  throw Error("Backup is larger than 4 MB.");
                setIncoming(parseProgress(await file.text()));
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Import failed. Existing data is untouched.",
                );
              }
              e.target.value = "";
            }}
          />
        </label>
        {error && (
          <p className="notice danger" role="alert">
            {error}
          </p>
        )}
        {incoming && (
          <div className="notice">
            <h3>Validated backup · ready for review</h3>
            <p>
              {incoming.attempts.length} attempts · {incoming.journal.length}{" "}
              completed entries · {xp(incoming)} XP · {incoming.evidence.length}{" "}
              evidence records · {incoming.reviews.length} review dates
            </p>
            <p>
              Current progress: {p.attempts.length} attempts · {xp(p)} XP.
              Download a backup before replacing.
            </p>
            <div className="actions">
              <button onClick={() => backup(p)}>
                Back up current progress first ↓
              </button>
              <button
                className="primary"
                disabled={corrupt || conflict}
                onClick={() => {
                  if (
                    confirm(
                      "Replace current progress with this validated backup? Export your current JSON first if you need it.",
                    )
                  ) {
                    const error = save(incoming);
                    if (error) {
                      setError(error);
                      setNotice("");
                      return;
                    }
                    commit(incoming);
                    setIncoming(null);
                    setError("");
                    setNotice(
                      "Backup restored. Attempts, XP, evidence and review dates are preserved.",
                    );
                  }
                }}
              >
                Replace after confirmation
              </button>
              <button onClick={() => setIncoming(null)}>Cancel</button>
            </div>
          </div>
        )}
      </section>
      <section className="section">
        <h2>Choose your review gaps</h2>
        <p>
          Default first review: 7 days; second: 30 days. These are adjustable
          practice defaults, not a guarantee of retention. Changes apply to
          newly scheduled reviews; existing due dates stay visible.
        </p>
        <div className="actions">
          <label>
            First gap (days)
            <input
              type="number"
              min={1}
              max={30}
              value={first}
              onChange={(e) => setFirst(Number(e.target.value))}
            />
          </label>
          <label>
            Second gap (days)
            <input
              type="number"
              min={2}
              max={90}
              value={second}
              onChange={(e) => setSecond(Number(e.target.value))}
            />
          </label>
          <button
            disabled={
              !Number.isInteger(first) ||
              !Number.isInteger(second) ||
              first < 1 ||
              first > 30 ||
              second <= first ||
              second > 90
            }
            onClick={() => {
              commit({
                ...p,
                settings: { ...p.settings, reviewDays: { first, second } },
              });
              setError("");
              setNotice("Review defaults saved. Existing dates are unchanged.");
            }}
          >
            Save defaults
          </button>
        </div>
      </section>
      <section className="notice">
        <h3>Future content keeps your progress.</h3>
        <p>
          The four-week Foundations pack is available. Later workflow, API,
          React, TypeScript, Node.js and PostgreSQL lessons remain future plans;
          the current runner does not teach or execute those stacks. Stable
          quest IDs and progress records are preserved as new content is added.
          See README and CONTENT_AUTHORING.md in the app source.
        </p>
      </section>
    </>
  );
}
