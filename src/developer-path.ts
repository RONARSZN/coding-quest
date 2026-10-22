import { fingerprint } from "./domain";
import { quests } from "./curriculum";
import type { Progress } from "./types";

export type DeveloperStage = {
  title: string;
  availability: "Lessons available" | "Partly available" | "Planned";
  available: string;
  focus: string;
  prerequisites: string;
  project: string;
  evidence: string[];
  benchmark: string;
  skillIds: string[];
  questIds: string[];
};

export const developerStages: DeveloperStage[] = [
  {
    title: "Web foundations", availability: "Partly available",
    available: "Week 1 HTML/CSS lessons are playable. Complete responsive layout, semantic HTML and accessibility project lessons are still planned.",
    focus: "HTML gives a page meaningful structure; CSS makes it readable and adaptable. Accessibility helps people use it with keyboards and assistive tools.",
    prerequisites: "Start here; no coding knowledge assumed. Complete the taught lessons before the checkpoint.",
    project: "Build a fictional community event page with clear headings, event information and a useful action. Specify the audience and what they need to find.",
    evidence: ["Build and explain the page structure and styling.", "Check a narrow mobile layout and keyboard navigation; record issues and fixes.", "A completed Week 1 exercise is partial evidence, not proof of all accessibility skills."],
    benchmark: "Frontend fundamentals: HTML, CSS, responsive design and accessibility.",
    skillIds: ["roles", "html", "css"], questIds: ["q01", "q02", "q03", "q04", "boss01", "boss01-fresh", "review01", "opt01-repair", "opt01-recall"],
  },
  {
    title: "JavaScript foundations", availability: "Lessons available",
    available: "Weeks 2–4 are playable. Each new core block follows the preceding checkpoint; boss03 requires independent evidence before q15. Optional orientation work never gates the existing route.",
    focus: "Use values, conditions, functions, arrays, objects, loops and click events to turn inputs into useful results. Test boundaries and question an AI suggestion before trusting its claim.",
    prerequisites: "Complete Week 1 and record independent boss evidence for Week 2. For Week 4, complete boss03 and record independent evidence on boss03 or boss03-fresh. Optional practice never blocks core progress.",
    project: "Build a fictional event-seat planner. Define accepted inputs, eligibility rules, missing/invalid behavior and the result. Change the counting rule in a fresh task and recheck it.",
    evidence: ["Show working valid, invalid, normal and boundary examples.", "Explain one loop, a reproduced bug and why the repair works.", "Audit a supplied AI suggestion against the contract, then transfer the idea to a fresh problem and later review."],
    benchmark: "JavaScript fundamentals, problem-solving, testing, AI-assisted code review and validation.",
    skillIds: ["values", "expressions", "conditions", "functions", "arrays", "objects", "validation", "events", "algorithms", "loops", "testing", "ai-review"], questIds: quests.filter((q) => q.week === 2 || q.week === 3 || q.week === 4).map((q) => q.id),
  },
  {
    title: "Developer workflow", availability: "Partly available",
    available: "Browser lessons teach test cases and boundary thinking. Git, terminal setup and local-project testing lessons are planned.",
    focus: "Tools help you reproduce errors, make small changes, preserve history and check that a fix does not break something else. The current browser sandbox does not teach or demonstrate Git proficiency.",
    prerequisites: "Introduce alongside later foundations. Learn files and terminal setup before Git commands; keep the practice repo separate from business projects.",
    project: "Create a local practice repository for the estimator. Reproduce a bug, write expected/received inputs, make one small fix and commit it with a clear message.",
    evidence: ["Show understandable commits and explain what each changed.", "Document a reproduced bug and fix, including a test that fails before and passes after.", "A sandbox result does not demonstrate Git or command-line proficiency."],
    benchmark: "Git, developer tools, testing and collaboration habits.",
    skillIds: ["debugging", "testing"], questIds: ["q14", "opt03-repair", "q17", "opt04-repair"],
  },
  {
    title: "APIs and async behavior", availability: "Planned", available: "No authored API lessons or network execution in this sandbox.",
    focus: "HTTP requests ask another service for data; JSON is a common data format. Async work finishes later, so the page must communicate waiting and failure.",
    prerequisites: "Explain functions, objects and events; demonstrate input handling and basic local workflow first. Learn request setup in a separate local practice project.",
    project: "Build a small data-driven page from a public practice API or local fixture, with loading, results, empty data and failure states.",
    evidence: ["Explain request, response and JSON shapes.", "Demonstrate loading, empty and failed requests, not just a happy-path screenshot.", "Keep credentials out of frontend code and document the API's limits."],
    benchmark: "APIs, HTTP integration, asynchronous behavior and error handling.", skillIds: [], questIds: [],
  },
  {
    title: "React", availability: "Planned", available: "No React lesson pack; the beginner sandbox does not execute React.",
    focus: "Components divide a page into reusable pieces. Props pass data in; state holds changing values. Forms and composition connect the pieces.",
    prerequisites: "Explain the plain JavaScript version and its data flow; learn a local project's setup first.",
    project: "Rebuild the learned estimator as a React app with small components for selection, quantity and results.",
    evidence: ["Explain where data lives and how a user action changes the result.", "Demonstrate forms, validation and a changed requirement.", "Explain your components rather than submitting an unexplained AI-generated app."],
    benchmark: "One frontend library/framework route; React is the chosen option, not every alternative in the listing.", skillIds: [], questIds: [],
  },
  {
    title: "TypeScript", availability: "Planned", available: "No authored TypeScript lessons or compiler workspace for learners yet.",
    focus: "Types describe the allowed shape of inputs, records and component contracts. They catch some mismatches before a program runs; runtime validation still matters.",
    prerequisites: "Understand the JavaScript and React app before adding types.",
    project: "Add input, product and component types to the same app. Introduce and fix a real mismatch, such as text where a numeric quantity is required.",
    evidence: ["Explain the type error and its fix.", "Run the type checker and meaningful behavior checks.", "Distinguish compiler checks from validating outside data at runtime."],
    benchmark: "Typed frontend code and clear data/component contracts.", skillIds: [], questIds: [],
  },
  {
    title: "Backend development", availability: "Planned", available: "No Node.js execution or backend lesson pack in this release.",
    focus: "Server code receives requests, validates inputs and enforces responsibilities that cannot be trusted to the browser. REST endpoints expose specific operations.",
    prerequisites: "Understand HTTP, JSON, validation, local tools and tests. Learn server setup before writing an API.",
    project: "Build a small Node.js API for fictional estimates. Define request/response shapes and failure cases. Prefer serverless delivery; use Express only if a persistent server is needed.",
    evidence: ["Test valid and malformed requests against the API.", "Explain browser versus server responsibilities and keep secrets in server environment variables.", "Show predictable status codes and failure handling."],
    benchmark: "Backend development, REST APIs and server responsibilities. Node.js is the single chosen backend route.", skillIds: [], questIds: [],
  },
  {
    title: "Data and security", availability: "Planned", available: "No database, SQL or authorization lesson pack; the learning app remains local.",
    focus: "PostgreSQL stores structured records. Models describe relationships; queries read/write records; transactions keep related changes consistent. Authorization decides who may act.",
    prerequisites: "Build and test an API first. Add a database only when real structured records are required; learn setup and access rules before connecting it.",
    project: "Extend a practice API with fictional reservations that actually need persistent records. Design the data and enforce access rules on the server or database.",
    evidence: ["Explain records, relationships, queries and a transaction.", "Demonstrate rejected unauthorized requests; hidden frontend controls are not security.", "Document input validation, secret handling and data recovery."],
    benchmark: "Databases, data modeling, security and authorization. PostgreSQL is the single chosen database route.", skillIds: [], questIds: [],
  },
  {
    title: "Delivery and collaboration", availability: "Planned", available: "No deployment/capstone lesson pack or automatic job-readiness assessment.",
    focus: "Delivering includes deployment, useful logs, performance checks, regression tests, documentation and maintaining a changing product with another person.",
    prerequisites: "Working project, explained code, meaningful checks and access rules where needed. Verify setup before a deployment lesson.",
    project: "Deliver one small capstone, document its limits, then resolve a changed requirement through a reviewed and tested change.",
    evidence: ["Demonstrate the delivered result, logs and performance measurements.", "Show a reviewed change and tests protecting previous behavior.", "Write an honest case study naming your work, AI assistance, limitations and maintenance plan."],
    benchmark: "Cloud deployment, testing, performance, security, collaboration and maintenance. Professional experience remains separate from lesson completion.", skillIds: [], questIds: [],
  },
];

export function stageEvidence(p: Progress, stage: DeveloperStage) {
  const ids = new Set(stage.questIds);
  const verified = new Set(p.attempts.filter((a) => {
    const q = quests.find((item) => item.id === a.questId);
    return ids.has(a.questId) && q && a.completedAt && a.checkedCode === fingerprint(a)
      && a.checks.length === q.checks.length
      && q.checks.every((check) => a.checks.some((r) => r.id === check.id && r.passed));
  }).map((a) => a.questId));
  return {
    checked: verified.size,
    records: p.evidence.filter((e) => stage.skillIds.includes(e.skillId)),
  };
}
