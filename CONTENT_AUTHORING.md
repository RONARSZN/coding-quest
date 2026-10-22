# Content authoring · v1

Content is authored in TypeScript data, not a CMS. Begin with `src/types.ts` and `src/curriculum.ts`. Nothing is playable until it has a complete lesson, starter, intended solution, meaningful checks, graduated hints and reflection. Never invent real product/stock/price claims; examples are fictional.

## Teach from zero

Every quest must also have an entry in `src/lesson-guides.ts`. Curriculum validation rejects an activity without a complete guide. Teach before asking for a prediction: a first encounter is not recall. Explain new words, symbols and supplied wiring before they appear in an exercise. Avoid unexplained terms such as selector, DOM, signature, branch or listener. Never replace teaching with encouragement to guess.

Each guide needs an introduction, plain definitions, worked code lines with a meaning for each, numbered steps naming the editor tabs, the observable success result and a reflection sentence starter. Boss bug questions need `bugHelp` to explain how to approach the question. Use examples with different requirements from fresh assessments; full intended solutions remain behind the recorded reveal action. Distinguish the original request from the changed final requirement. Explain that click checks perform a click automatically. Starter failures are expected, not learner failures.

```ts
lessonGuides['q-next-stable-id'] = {
  introduction: 'Connect this task to what the learner has already practiced.',
  terms: [{term: 'New word', meaning: 'Ordinary language and symbols explained.'}],
  walkthrough: [{code: 'A small example', meaning: 'What this instruction does.'}],
  editTabs: ['js'],
  steps: [
    {tab: 'js', instruction: 'Find the supplied line to change.'},
    {tab: 'js', instruction: 'Make one specific edit using the taught pattern.'},
    {instruction: 'Run & check, compare the result, then explain it.'},
  ],
  success: 'The visible result and the checks that should pass.',
  reflectionStarter: 'I changed ___ because ___. I saw ___.',
};
```

Content version 2 added this teaching without changing stable quest IDs or check requirements. Foundations pack version 3 adds nine Week 3 activities; existing quest/check versions and IDs remain unchanged, and the new quests start at version 1. Progress schema remains 1. Older attempts/backups remain readable; unfinished code, notes, hints, evidence, journal and unique awards are preserved. Do not change the progress schema for prose or teaching-layout updates.

Foundations pack version 4 adds two optional computing bridge activities and eight Week 4 activities, for 37 registered quests total. Existing 27 quest/check/skill IDs, behavior and content versions remain stable; the new activities use new IDs. The progress schema stays at 1. Pack upgrades must not rewrite prior answers, evidence or awards.

## Pack v4 and phase-based guides · 2026-10-21

- `computing-quests.ts` and `computing-guides.ts` author `pre01` and `pre02` as optional bridges. They have no prerequisites and never gate the established JavaScript route.
- `week4-quests.ts` and `week4-guides.ts` author `q15`–`q18`, `boss04`, `opt04-repair`, `boss04-fresh` and `review04`. Week 4 covers pseudocode/problem breakdown, loops and accumulators, test selection and limits of automated checks, an evidence-focused AI review, and transfer to a changed rule.
- `q15` requires completion of `boss03` plus its independent-evidence gate. If the old boss solution has been revealed, `boss03-fresh` supplies the changed independent task. The optional bridge is never retroactively required.
- The available route is an intentionally single-language web path: JavaScript first, then planned React and TypeScript, then planned Node.js and PostgreSQL. Python is optional, not a forced restart. Do not offer a Start action for `planned` modules.
- The user-facing lesson phases are Learn → Practice → Reflect. Put the prediction in Learn before code edits; run the task in Practice; move explanations, bug reasoning and the self/coach checklist to Reflect. Guide instructions should name these phases instead of referring to content “above”, “below” or “at the bottom” of a long scrolling page.
- Every new activity has plain definitions and an annotated example before prediction, a meaningful solution that is executable in the existing sandbox, checks that cover multiple normal and boundary inputs, and a guide entry. A fresh boss must also explain its bug prompt with `bugHelp`.
- New skill IDs are registered before quests refer to them. Course-module quest links must resolve to actual registered IDs; planned modules keep `questIds: []`. New stage metadata is descriptive only and must not create evidence or mastery.
- Tests execute authored function checks against intended solutions and starters, then mutate important arithmetic, boundary and changed-rule behavior. Preserve frozen compatibility tests and the backed-up pre-redesign baseline as read-only.

Research notes and the current path overview are in [`docs/CURRICULUM.md`](docs/CURRICULUM.md). External references are supplemental examples, not copied lesson content or required credentials.

## Template

```ts
const quest: Quest = {
  id: 'q-next-stable-id', // Never reuse an existing ID for a different task.
  version: 1,
  title: 'One small, concrete change',
  week: 3,
  kind: 'core', // core | boss | optional | review | variation
  skills: ['functions'],
  prerequisites: ['boss02'],
  gate: 'boss02', // When a stage requires independent boss evidence.
  fresh: false, // true only for a separately authored assessment variation.
  objective: 'One observable result in ordinary words.',
  lesson: 'Explain every concept needed; avoid hidden prerequisites.',
  example: 'A short worked example with different values.',
  prediction: 'What do you expect before Run?',
  predictionAnswer: 'A concise answer to compare after predicting.',
  exercise: 'Concrete requirements and what the learner should edit.',
  starter: {html: '<p id="output">Ready</p>', css: '', js: ''},
  solution: {html: '<p id="output">Example</p>', css: '', js: ''},
  hints: ['Point to the relevant file.', 'Point to the responsible concept.', 'Give a concrete partial pattern.'],
  checks: [{id: 'visible-output', kind: 'text', selector: '#output', expected: 'Example', label: 'The expected message appears'}],
  reflection: 'Which line controlled the result, and why?',
  // Boss/variation additionally needs changedRequirement and bug prompts.
};
```

Check kinds:

| Kind | Contract |
|---|---|
| text | `selector`, normalized visible `expected` text |
| css | `selector`, CSS `property`, exact computed `expected` value |
| function | named `fn`, scalar `args` (number, string, boolean or null), numeric `value` or string `expected`; test meaningful input cases |
| click | supplied button `selector`, starting output `initial`, resulting `expected`; output is `#output` |

Keep HTML/CSS/JS tabs available even when only one needs editing. Use ID/class names consistently. Include explained DOM wiring; the first two weeks require no arrays, async, frameworks or unexplained tooling. Describe boss behavior separately from the self/coach rubric: working behavior, explanation, changed requirement, bug diagnosis. A solution reveal needs a different authored boss variation for independent evidence.

## Add a pack without resetting progress

1. Export a backup. Keep old quest, skill, check and pack IDs. Never rename/delete progress-bearing content. Add new IDs for different assessment requirements; changing prose can increment a version while keeping historical check IDs/semantics compatible.
2. To extend season 01, add fully authored quest objects and increment its pack version. For a new pack, add metadata to `curriculumPacks`. Register any new skills before referencing them. The library groups authored weeks automatically.
3. Append the new quests to the exported `quests` collection, optionally importing an additional content module. Update the planned-stage copy and prerequisites only when the content actually exists. New packs can extend the same four-week season or later seasons; there is no cutoff.
4. `upgradePacks` adds registered versions without touching attempts, evidence or unique award IDs. Existing backups load against registered content. Backups requiring unknown/newer content are rejected until that content is installed.
5. Validate IDs, references and prerequisite cycles with `validateCurriculum`, then run tests, type check, lint and build. Test an old export against the expanded app and compare attempts, journal, review dates and XP exactly.
6. Run each intended solution in the real preview. Run wrong inputs/starters too. Include alternate working solutions where relevant; do not check source-string equality. Do not change award IDs when changing content versions.
7. Author new independent reviews instead of recycling a revealed answer as fresh evidence. Repeated authored reviews retain practice value but award no repeated XP. Meaningful advanced concepts need their own execution strategy; do not silently enable React/Next.js in the current JS sandbox.

Progress schema changes require explicit migrations in `src/storage.ts` and export/import tests. Version 0 migration supports the same layout without the packs registry. Version 1 is current; unsupported future schemas remain recoverable raw data.

## Week 3 and path conventions · 2026-10-06

- `week3-quests.ts` and `week3-guides.ts` keep content separate from the large workspace component. Both are integrated into the existing registries. Register new skill IDs before referencing them.
- Define accepted types and bounds in each lesson. q11/q12/q14 and the optional repair have narrow calculation/index contracts; they do not claim broad validation. q13 and checkpoints explicitly reject non-numeric or fractional quantities without coercion and permit equality with stock/capacity. Supplied stock/capacity records are fictional and valid.
- Check missing selection before reading object properties. Test absent, negative, fractional, text and null selections, along with valid, invalid and equality quantities. Checks serialize scalar arguments through the existing worker and DOM function runner; no sandbox capability was added.
- Assess changed behavior, not matching source strings. q14 includes a one-item case that hides the fee bug and multi-item cases that expose it. boss03 tests the fee waiver at its boundary. boss03-fresh adds a customer limit and one reduction per order; new data alone would not be enough transfer.
- `developer-path.ts` describes nine stages and derives results from saved checks/evidence. `DeveloperPath.tsx` renders them. Stage descriptions do not create evidence or pretend unauthored content is playable. Keep Skill map availability and path stage order aligned.
- Web fundamentals and workflow are partly authored: broader accessibility, responsive design and Git instruction remain planned. Later project briefs are useful preparation, not Start buttons or automatic mastery. Teach separate local project setup before APIs, React, types, server or database execution.
- Browser QA runs in isolated session `cq-devpath-1006` at temporary dev origin 5189. `browser-career.js` requires the pre-update source snapshot in ignored `output/developer-path-baseline/src`; it imports an actual v2 fixture. Its main flow auto-accepts confirmations only inside that QA page. `browser-career-import.js`, CLI `dialog-accept`, then `browser-career-import-verify.js` separately verify the native confirmation. Never run these storage-writing scripts in Mark's profile.
- Official beginner references checked for this pack: [MDN arrays](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays), [MDN object basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_basics), [MDN curriculum](https://developer.mozilla.org/en-US/curriculum/core/). Lessons and route mapping are our authored application, not copied curriculum or an employer-prescribed path.
