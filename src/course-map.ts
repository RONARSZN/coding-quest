import { quests } from "./curriculum";

export type CourseModule = {
  id: string;
  title: string;
  subtitle: string;
  why: string;
  prerequisites: string;
  outcomes: string[];
  questIds: string[];
  project: string;
  checkpoint: string;
  status: "available" | "planned";
};

const week = (number: number) => quests.filter((q) => q.week === number).map((q) => q.id);

export const courseModules: CourseModule[] = [
  {
    id: "orientation", title: "How a computer follows a plan", subtitle: "Optional starting bridge · no experience needed",
    why: "Understand what a program does before worrying about its punctuation. Revisit this bridge whenever code feels like magic.",
    prerequisites: "None. Existing learners can revisit it without losing access to their next lesson.",
    outcomes: ["Describe input → instructions → output.", "Distinguish running code, stored files and saved browser data.", "Trace a plain-language algorithm and compare an expected result."],
    questIds: week(0), project: "Turn a fictional event checklist into exact, ordered instructions.",
    checkpoint: "Read a tiny page, change its instruction and explain the result. This is guided orientation, not independent mastery.", status: "available",
  },
  {
    id: "web", title: "Give an idea a page", subtitle: "Module 01 · structure, style and values",
    why: "HTML, CSS and JavaScript have different jobs. Seeing each change makes later code easier to reason about.",
    prerequisites: "Start from zero. The orientation bridge is recommended, not required.",
    outcomes: ["Read and edit headings, paragraphs and attributes.", "Choose a CSS selector and explain padding.", "Trace a variable into visible page text."],
    questIds: week(1), project: "Build a fictional product card with meaningful words, spacing and a displayed value.",
    checkpoint: "Pass the card checks, explain three changes and diagnose a selector bug. Use the fresh variation after solution assistance.", status: "available",
  },
  {
    id: "behavior", title: "Make the page respond", subtitle: "Module 02 · JavaScript decisions and functions",
    why: "Reusable calculations and events turn a static page into a useful tool.",
    prerequisites: "Complete Module 01 checkpoint and record independent self/coach evidence on boss01 or its fresh variation. XP does not unlock this module.",
    outcomes: ["Distinguish strings from numbers.", "Trace both branches of a condition.", "Write a function that uses its inputs and connect it to a click."],
    questIds: week(2), project: "Build a small fictional stock-and-total card that responds after a click.",
    checkpoint: "Check several inputs, explain the data flow and change a requirement. Return for the scheduled review.", status: "available",
  },
  {
    id: "data", title: "Work with small collections", subtitle: "Module 03 · lists, records and validation",
    why: "A working demo must handle missing selections and boundary values as carefully as the happy path.",
    prerequisites: "Complete boss02 and record independent evidence on boss02 or boss02-fresh.",
    outcomes: ["Read array positions and object properties.", "Reject invalid quantities before calculating.", "Reproduce a bug with an input that exposes it."],
    questIds: week(3), project: "Build a fictional order estimator with product selection, quantities and one delivery fee.",
    checkpoint: "Demonstrate valid, invalid and exact-stock inputs; explain why the guards and changed fee rule work.", status: "available",
  },
  {
    id: "reasoning", title: "Solve, test, explain", subtitle: "Module 04 · loops, test cases and AI code review",
    why: "Understand a solution well enough to adapt it, challenge it with tests and explain the work—even when AI helped write it.",
    prerequisites: "Complete boss03 and record independent evidence on boss03 or boss03-fresh.",
    outcomes: ["Break a requirement into inputs, steps and output.", "Trace a bounded loop and accumulate a result.", "Compare expected and actual results for normal, empty and boundary cases.", "Audit an AI suggestion, repair it and state what its checks do not prove."],
    questIds: week(4), project: "Build a fictional event-seat planner, then transfer the idea to a different rule in a fresh challenge.",
    checkpoint: "Pass behavior checks, explain the loop, reproduce a boundary bug, change the counting rule and record the understanding rubric. Review later with a booking-capacity problem.", status: "available",
  },
  {
    id: "workflow", title: "Take the work into real files", subtitle: "Next pack · planned",
    why: "A local project, readable history and meaningful tests let you work beyond a browser exercise.",
    prerequisites: "Explain a plain JavaScript project and its tests before setting up tools.",
    outcomes: ["Create and navigate a practice folder.", "Use terminal commands and Git safely.", "Build a responsive, semantic page and test keyboard use.", "Write an automated regression check."],
    questIds: [], project: "Turn the estimator into a local project with a README, small commits and a reproduced bug fix.",
    checkpoint: "Show the project running, mobile and keyboard checks, test results and an explained commit. Lessons are not authored yet.", status: "planned",
  },
  {
    id: "apis-react", title: "Build a larger interactive app", subtitle: "Later packs · APIs → React → TypeScript · planned",
    why: "Learn one coherent web path. Add a tool when the project gives it a purpose.",
    prerequisites: "Local workflow, functions, objects, events and tested input rules. Learn HTTP/JSON before async requests; understand plain JavaScript before React and types.",
    outcomes: ["Handle loading, results, empty data and failure.", "Explain components, props and state.", "Use types while retaining runtime validation."],
    questIds: [], project: "Expand the same practice estimator with fixture/API data, then components and checked data contracts.",
    checkpoint: "Demonstrate failed requests, a changed requirement and explained data flow. Separate local environments will be taught; this sandbox does not execute these technologies.", status: "planned",
  },
  {
    id: "delivery", title: "Store, deliver and maintain", subtitle: "Later packs · Node.js → PostgreSQL → delivery · planned",
    why: "Move trusted decisions to a server and add structured storage only when the project needs persistent records.",
    prerequisites: "A working, tested frontend; HTTP/JSON and local tools. Learn API responsibilities before database access and authorization.",
    outcomes: ["Validate server requests and protect secrets.", "Model persistent records and enforce authorization.", "Document testing, limits, deployment and maintenance."],
    questIds: [], project: "Build a small serverless practice API, add fictional reservations, and write an honest capstone case study.",
    checkpoint: "Show rejected invalid/unauthorized requests, recovery notes and a tested change. No automatic job-readiness claim or deployment.", status: "planned",
  },
];

export const resourceGuidance = [
  {
    name: "Harvard CS50x", role: "Supplement · computing foundations", url: "https://cs50.harvard.edu/x/2026/",
    access: "The 2026 OpenCourseWare is free. A free CS50 Certificate requires an edX account linked to the CS50 gradebook and at least 70% on every required assignment, including the final project. The optional edX verified certificate is paid.",
    reason: "Use selected Week 0 and algorithms material to deepen problem-solving. CS50x welcomes learners with or without prior experience, then teaches Scratch, C, Python, SQL and web topics across eleven weeks. The full course is a substantial optional branch; it is not a required language detour for this JavaScript path.",
  },
  {
    name: "Codédex", role: "Supplement · focused practice and design reference", url: "https://www.codedex.io/javascript",
    access: "Introductory JavaScript chapters are free; later chapters and some courses/projects require Club access. Billing options and localized prices can change. Coding Quest does not require a subscription.",
    reason: "Choose a matching JavaScript topic only when extra practice is useful. Borrow clear chapters, a nearby editor and visible project milestones; retain original lessons, styling and evidence rules.",
  },
  {
    name: "freeCodeCamp", role: "Supplement · extra drills and later project practice", url: "https://www.freecodecamp.org/learn/",
    access: "Learning and certifications are free; sign in to save progress. The current JavaScript and Responsive Web Design certifications use lessons, workshops, labs, reviews, quizzes and five required projects before a closed-book exam in a downloadable desktop app. Exams are limited to one attempt per week and passing exams are reviewed by staff.",
    reason: "Use a matching JavaScript or web topic for a specific gap; no certification or parallel language track is required here. Its current Full-Stack Developer route also includes front-end libraries, Python, relational databases, back-end/API work and a capstone, so it is a substantial optional route rather than a prerequisite for this app.",
  },
];

export const learningApproach = {
  core: "Coding Quest is the core sequence. Learn → read an annotated example → predict → modify → run and inspect → explain → transfer → review.",
  language: "Stay with JavaScript for useful web tools, then React, TypeScript, Node.js and PostgreSQL when needed. Python remains an optional future branch for a specific automation/data goal, not a restart.",
  evidence: "Completion and XP record practice. Passing checks demonstrates only their cases. Independent and retained evidence also require a fresh task, an explanation and honest self/coach assessment; the app cannot judge explanation quality.",
  rhythm: "Aim for five short core sessions per week, with optional practice when useful. A module may take several weeks. After the authored pack, rotate spaced reviews and one small project change; later packs are explicitly planned.",
};
