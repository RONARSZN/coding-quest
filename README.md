# Coding Quest

Mark's local coding practice studio. The core route stays HTML/CSS → JavaScript, with projects, debugging, explanations and spaced review. Later tools have prerequisites and honest future-content labels; there is no graduation date or automatic job-readiness claim.

## Open locally

Use the existing **Coding Quest** desktop shortcut, or:

```powershell
Set-Location 'D:\Codex\workspace\TINKERBELL\apps\coding-quest'
npm.cmd run build
npm.cmd run preview
```

Open **http://127.0.0.1:5188/** in the same browser profile you previously used. `localhost`, another port, private browsing and another profile have separate storage. Only one server can use port 5188. `launch.cmd` and `desktop-launch.ps1` keep their original behavior. No deployment is required.

For development use `npm.cmd run dev`. Install the locked dependencies with `npm.cmd ci` only when needed. The existing React + TypeScript + Vite stack and dependencies are retained.

## Find your next step

- **Today:** resume an unfinished activity, take the next eligible lesson, or return to a due review. The panel explains the purpose and action.
- **Course map:** one sequence with prerequisites, outcomes, exercises, projects and completion criteria. Filters separate core activities from challenges/reviews. Planned packs have briefs, without playable buttons.
- **Projects:** combine the taught skills, save code/notes in the existing attempt system, and take a changed fresh challenge. Record AI assistance in your explanation or next-step note.
- **Progress:** inspect completed practice, XP, independent/retained evidence and its self/coach source separately.
- **Journal:** resume drafts and inspect completed notes, saved code, checks and preserved attempts.
- **Settings:** export/restore complete JSON backups, download a readable summary, and adjust future review gaps.

## Learn → practice → explain

Begin with terms and an annotated example, then predict in ordinary words. In Practice, follow numbered steps, edit the named code tab, run the preview and compare expected/received results. A failure means a requirement still needs work; it has no XP penalty. In Reflect, describe your change, compare your prediction, and explain a bug or changed requirement where required.

Checkpoints and fresh challenges require current passing checks, prediction/reflection, explanation, bug diagnosis and the understanding checklist. The app stores explanations but does not grade their meaning. Read, modify, test and explain code even when AI produced it. No AI service is connected.

The optional timer is a suggestion, can be paused, and never fails or erases a lesson. Five short core sessions per week is a useful rhythm, not a deadline. A module can take several weeks. Continue with spaced review and one changed project requirement after the authored core; repeat practice has value even without new XP.

## Curriculum and resources

Foundations pack v4 adds an optional two-activity computing bridge and Module 04: planning, bounded loops, useful test cases, AI-code review, an event-seat project, repair/recall practice, a fresh changed-rule challenge and a delayed review. All earlier activities remain available under their original IDs. **Course map** is the authoritative playable inventory, rather than calendar week deadlines.

The longer route is JavaScript → local developer workflow → APIs → React → TypeScript → Node.js → PostgreSQL → delivery. Responsive/accessibility projects, Git/local setup and advanced execution lessons remain planned. A project brief does not mean its teaching is implemented. The restricted sandbox executes synchronous HTML/CSS/JavaScript only.

[Curriculum decisions and reference evaluation](docs/CURRICULUM.md) explains the supplied video/transcript, language choice, current official offerings and cost/access limits. Coding Quest is the core; selected CS50, Codédex and freeCodeCamp material is supplementary. No paid subscription is required. [CONTENT_AUTHORING.md](CONTENT_AUTHORING.md) explains how to extend the route safely.

## Practice is different from understanding

Regular, optional, review and fresh activities award 5 + 10 + 5 XP for prediction, verified change and reflection, once per activity. A boss awards 50 once. Hints and failed runs carry no penalty; resetting/repeating cannot create duplicate awards.

Guided practice includes worked lessons or a revealed solution. With hints records assistance. Independent evidence requires a fresh activity, no hints/solution, passing current checks and an explanation labeled as self-assessed or actually coach-reviewed. Retained additionally requires a later fresh result after the configured gap. Existing achievements remain visible after a difficult attempt. Explanations and rubric ticks require honest human judgment; passing cases prove only the tested behavior.

A revealed answer stays recorded when that activity is reset. Use a different fresh challenge for independent evidence. XP never bypasses a prerequisite evidence gate. Repeated review does not become a new unseen problem or earn repeated XP; more distinct variations require authoring.

## Saving, compatibility and recovery

- Progress key: `coding-quest:progress`; storage schema: **1**, unchanged. Pack metadata upgrades additively to v4. Earlier quest/check/skill IDs, code, attempts, awards, achievements, evidence, journal, review dates and settings are retained.
- Every edit saves synchronously. Saved appears only after a successful write. If storage fails, your in-memory draft remains exportable and the UI says Unsaved. Export before closing.
- JSON export is the complete restorable backup. Markdown is a readable summary. Local browser storage is not cloud sync or a backup.
- Import validates size, versions, fields, IDs, references and awards before offering a confirmed replacement. Download the current JSON first. Import replaces rather than merges; invalid input changes nothing.
- Corrupt/unsupported/empty data is preserved for raw export. Reset is explicit. Another tab changing progress blocks writes; export this tab before reloading the other version.
- Data is private local text, not encrypted. Limits are 4 MB, 2,000 attempts and 30,000 characters per text field. Sustained high-volume use needs a tested storage migration before expanding those limits.

The preserved pre-redesign source/tests/docs and SHA256 manifest are in ignored `output/redesign-baseline-2026-10-21/`. A frozen pre-redesign backup/identity contract in `tests/fixtures/redesign-v3.json` is synthetic QA data, not Mark's learning record. The compatibility suite compares old learner fields exactly and checks new activity round trips and award deduplication.

## Execution boundaries

The preview retains its opaque-origin iframe with only `allow-scripts`, HTML allowlist, nonce CSP, blocked network/forms/top-navigation and active-frame/run-ID/result-shape checks. Acorn instruments loops/functions; a restricted worker performs preflight with a 900ms timeout before the DOM run. The app owns completion and awards.

A DOM iframe may share the browser renderer thread. Native operations, resource exhaustion or deliberate guard bypass can still freeze it; this is a personal beginner environment, not a hostile-code hosting service. Save happens before Run. Use Stop when responsive, or reload and resume. Async/imports/generators, dynamic execution, extra workers, React, Node.js and SQL are outside this sandbox. No accounts, telemetry, live business records or external AI calls were added.

## Verify

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Run browser acceptance on an isolated origin/profile; never run storage-writing QA in Mark's normal profile. The 21 October checks use port 5191, leaving normal port 5188/progress untouched. [VERIFICATION.md](VERIFICATION.md) records actual outcomes and limitations. Older `scripts/browser-*.js` preserve historical checks but their old navigation selectors need adaptation to the redesigned screens.

## Design decision and change log · 2026-10-21

Goal: let an absolute beginner find the next action, understand why it matters, practice comfortably and inspect real learning evidence. The proposed direction is a low-light study fieldbook: ink-green surfaces, lime actions, cyan status, numbered route markers and readable lessons. Codédex informed chapter progression, nearby instructions/editor/results and checkpoint projects. Coding Quest's identity, lessons and evidence model remain original. No Codédex assets or code were copied.

Added: computing/loop/testing/AI-review lessons, an explicit course map, project/evidence screens and backup compatibility coverage. Changed: full navigation/dashboard/workspace/feedback/settings presentation; no learner-schema conversion. Preserved: originals in the snapshot and learner identity contracts. Technical verification, Mark's creative approval and publication remain separate; the redesign is for local review and has not been deployed.
