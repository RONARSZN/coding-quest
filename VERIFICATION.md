# Coding Quest delivery evidence

## Current redesign verification · 2026-10-22

This section records the current v4 curriculum and app. The 4 October MVP evidence below is historical and describes the earlier app.

### Automated checks

The checks were rerun from `apps/coding-quest` after the final mobile CSS changes, using the existing locked toolchain:

| Command | Result |
|---|---|
| `npm.cmd test` | 108 tests passed across 6 files. |
| `npm.cmd run typecheck` | Passed. |
| `npm.cmd run lint` | Passed. |
| `npm.cmd run build` | Passed; Vite transformed 133 modules. The main JavaScript bundle is 518.20 kB (155.06 kB gzip), which triggers Vite's 500 kB advisory. The sandbox bundle is 147.15 kB (44.19 kB gzip); CSS is 36.10 kB (7.61 kB gzip). |

The suites include stable-identity and v3-backup compatibility, old XP/evidence preservation, new content registration, loop and boundary solutions, fresh-evidence integrity, progress validation, and the sandbox/runtime checks. The build warning is recorded rather than hidden; initial JavaScript splitting remains a performance improvement to consider if the app grows.

### Browser acceptance

Used the Coding Quest app on isolated QA origins `http://127.0.0.1:5191/` and `http://127.0.0.1:5192/` with synthetic fixtures. The normal learner origin/profile was not opened or written. Desktop viewport was 1366×900; mobile viewports were 390×844 and 320×720. Earlier redesign screenshots are under the ignored `output/playwright/redesign-2026-10-21/` folder; final narrow-screen captures are `output/mobile-lesson-320-final.png` and `output/mobile-lesson-390-final.png`.

| Flow | Result |
|---|---|
| Dashboard and navigation | Next lesson, its purpose, weekly rhythm, project milestone, core completion and review queue are visible. Today, Course map, Projects, Progress, Journal and Settings open. |
| Course map | Shows the optional computing bridge, all authored modules with prerequisites/outcomes/checkpoints, resource access notes, and future packs marked planned without playable Start actions. No horizontal page overflow at 390 px. |
| Existing activity | Quest 1 previewed a useful failure, accepted an edited HTML heading, passed its actual iframe check, saved a reflection and completed for 20 once-only XP. Its code, prediction, journal and review record appeared in the JSON export. |
| New Module 04 flow | `Turn a requirement into steps` taught a contract, algorithm and distinguishing test before asking for a prediction. The edited multiplication solution passed all 5 live checks; the explanation identified why equal inputs hide the bug. Completion saved and reload advanced to the loop lesson. |
| New loop lesson on mobile | At 390 px, lesson and editor stayed within the 375 px document width. The edited accumulator loop passed 6 live checks. No horizontal page overflow. |
| Mobile navigation and lesson workspace | At both 320 px and 390 px, all six primary destinations and the Learn / Practice / Reflect controls fit without horizontal navigation scrolling. At 320 px the lesson editor measured 292 px wide; at 390 px it measured 347 px. |
| Projects, evidence and journal | Project briefs show prerequisites and concrete definition-of-done criteria. Progress separates completed practice, XP, fresh evidence and retained evidence, including assessment source. The journal displays the saved Module 04 explanation and attempt. |
| Settings | Changed review gaps to 8 and 21 days, saved, reloaded and confirmed both values. |
| Backup compatibility | The Settings UI validated and restored the frozen synthetic v3 backup. A subsequent UI export was deeply compared with the fixture: schema 1, settings, attempts, evidence, awards, reviews and journal were identical; only the pack map advanced from v3 to v4. Counts remained 8 attempts, 11 evidence records, 16 awards (150 XP) and 6 journal entries. The app reload retained the restored state. Current and restored synthetic exports are retained in the QA folder. |
| Production build smoke | Served the built `dist/` locally on isolated port 5192. Opened the first lesson, predicted, edited HTML, reloaded, resumed the exact draft, passed the real iframe check, saved a reflection and completed for 20 XP. The dashboard offered the next lesson; the built app had no console errors. |
| Final mobile persistence smoke | On the rebuilt port 5192 preview at 390 px, entered a prediction, edited the HTML exercise, and passed both behavior checks. Reload returned to the dashboard; Resume restored the exact code and its passing checks. At 320 px, the same lesson exposed all three step controls and a 292 px editor without horizontal page overflow. |

Fixtures and exports in that folder are generated QA records only. They do not represent Mark's skill or progress. The supplied transcript was read in full. Direct video retrieval was blocked, so the video-specific guidance is grounded in the transcript, not a claim that the video itself was watched. Resource and pricing notes were checked against official provider pages on 21 October 2026; those pages and limitations are documented in `docs/CURRICULUM.md`.

No deployment was performed. The advanced developer workflow, APIs, React, TypeScript, Node.js, PostgreSQL and delivery modules remain explicitly planned.

## Historical MVP record · 2026-10-04

Verified 2026-10-04, Asia/Manila. Local MVP built from `C:/Users/Mark/Downloads/coding-quest-build-task.md`. No deployment, live Homies integration, messaging, account, database or paid service was used. QA learning records belong to a separate Playwright browser session; they are not Mark’s actual proficiency evidence.

## Commands actually run

Commands ran from `D:/Codex/workspace/TINKERBELL/apps/coding-quest`, sequentially after Windows initially failed concurrent tools with memory-allocation errors. The successful verification environment used `NODE_OPTIONS=--max-old-space-size=384 --max-semi-space-size=2`.

| Command | Actual result |
|---|---|
| `npm.cmd install --no-fund --no-audit` | Installed 194 packages. Initial TypeScript 7/ESLint peer mismatch was resolved by pinning supported TypeScript 5.9.3. |
| `npm.cmd test` | 49 tests passed, two files. Final run: 1.66 seconds. |
| `npm.cmd run typecheck` | Passed, exit 0. |
| `npm.cmd run lint` | Passed, exit 0; rerun after QA scripts were added. |
| `npm.cmd run build` | Passed, 121 modules; main JS 359.17 kB / 109.08 kB gzip, lazy sandbox 147.15 kB / 44.20 kB gzip. No final chunk-size warning. |
| `npm.cmd run preview` | Built app served at `http://127.0.0.1:5188/`; production UI smoke passed. |

The test suite covers unique scoring, repeated attempts/reloads, bosses versus regular XP, stale checks, solution/hint evidence, prerequisite gates, self versus coach sources, retained evidence after a gap, Manila midnight/Monday boundaries, 7/30-day reviews, optional targets, deferral, content exhaustion, exact backup round-trip, v0 migration, registered pack additions, malformed/large/unsupported imports, storage-denied/corrupt/empty records, HTML sanitization, execution instrumentation and active-message validation.

## Browser acceptance

Chromium through the Playwright skill/CLI, isolated session `coding-quest`. Laptop/desktop and 390px narrow viewport tested; reduced-motion emulation tested. Screenshots were inspected. Deliberate learner errors and blocked security requests produce expected console entries in the QA log; they are not successful external requests.

| Flow | Evidence |
|---|---|
| Quest 1 | Prediction and edited heading survived reload. Actual iframe check passed. Reflection/completion saved 20 XP. Reopen/re-run did not duplicate awards or erase checks. |
| Close/reopen | A new tab in the same profile/origin loaded the exact stored progress. Browser-process restart was not separately exercised. |
| All initial content | All 18 intended solutions passed real iframe checks. Every starter failed meaningfully; no placeholder activity. |
| Equivalence | Behavior checks measure text/styles/returns/clicks rather than source-string identity. |
| Help/reset | Hint and solution use persisted; confirmed reset archived the previous custom draft and retained its assistance history. Fresh reset still carried solution taint. |
| Backup/import | JSON download succeeded. Malformed import left storage unchanged. Clean-storage restoration required confirmation and reproduced all stored fields exactly. |
| Recovery | Corrupt raw record was preserved/exported. Denied storage showed unavailable/unsaved and still allowed an in-memory backup download. |
| Sandbox | Parent storage and top navigation blocked. CSP blocked network with zero escaped/intercepted network requests. Infinite while, recursion and click callback loop interrupted. Catastrophic native regex work terminated in the preflight worker after 900ms. |
| UI interruption | A runaway script showed readable feedback, retained the editor draft, accepted a repair and then passed checks. Verified again against the built app. |
| Keyboard/coaching | Start/Run/completion worked via focused buttons + Enter. Editor tabs navigated via Tab. Modal received focus and closed with Escape. Current code/checks/question appeared in the handoff; copying succeeded. |
| Responsive | Dashboard/workspace had no page overflow at 390px. Mobile and desktop screenshots inspected; controls have focus states and reduced-motion overrides. No complete screen-reader audit or non-Chromium testing claimed. |

## Repeat browser QA

Use an isolated browser profile. The Quest 1 script expects a fresh begun quest with the prediction entered; the other UI scripts expect the saved Quest 1 fixture. Native confirmation steps are split because the CLI yields when a dialog appears.

```powershell
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest open http://127.0.0.1:5188 --headed
# Begin Quest 1 in this test profile and enter its prediction.
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-quest1.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-content.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-recovery.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-ui-smoke.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-import-setup.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest dialog-accept
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-import-verify.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-guidance-setup.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest dialog-accept
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-guidance-reset.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest dialog-accept
npx.cmd --yes --package @playwright/cli playwright-cli -s=coding-quest run-code --filename scripts/browser-guidance-verify.js
```

`browser-content.js` imports the actual source modules from Vite, so it requires `npm.cmd run dev`. UI smoke works against both dev and production preview. Start only one server on port 5188. Browser fixture exports/screenshots are in ignored `output/playwright/`; CLI snapshots/console logs are in ignored `.playwright-cli/`.

## File inventory

All files below were created for this task and refined during implementation. No pre-existing app files were modified or deleted.

| Files | Purpose |
|---|---|
| `src/App.tsx`, `src/main.tsx`, `src/styles.css` | Dashboard, quest library/workspace, timer, skill map, journal, coaching modal, backups and responsive UI |
| `src/types.ts`, `src/curriculum.ts` | Versioned entities, packs, skills and 18 authored activities |
| `src/domain.ts` | Evidence, unique XP, gates, calendar, weekly rhythm, reviews and coaching text |
| `src/storage.ts` | Adapter, schema validation/migrations, safe load/save and Markdown summary |
| `src/sandbox.ts`, `src/preview-message.ts` | Parser guards, isolated worker/DOM preview, behavior checks and message boundary |
| `tests/domain.test.ts`, `tests/sandbox.test.ts` | 49 meaningful tests |
| `scripts/browser-*.js` | Nine reproducible browser QA function files |
| `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `.gitignore`, `index.html`, `public/favicon.svg` | App/toolchain setup, exact lockfile, loading fallback and original app icon |
| `README.md`, `CONTENT_AUTHORING.md`, `VERIFICATION.md`, `launch.cmd` | Launch, use, backup, content expansion, limitations and delivery instructions |
| `dist/` (generated, ignored) | Verified static build |

Coordination files: created/released `90_LOGS/claims/codex-2026-10-04-coding-quest.md`; appended only to this task’s own `90_LOGS/activity/codex-2026-10-04-coding-quest.md`. `MASTER_INDEX.md` remains unchanged because the active PWA claim holds it. No Git metadata mutation, staging or commits.

## Honest remaining limits

The full browser process was not restarted with the same persistent profile; tab close/reopen and reload were verified. DOM/native operation interruption cannot be guaranteed for arbitrary hostile/resource-heavy code; see README’s execution limits. Clipboard recovery, local storage and browser exports depend on browser capabilities. The four-week season currently contains two weeks; further distinct review and advanced content must be authored. V1 has a 4 MB / 2,000-attempt limit; expand/migrate storage before sustained high-volume use. No cloud backup, synchronization or automatic semantic understanding assessment is claimed.

## Beginner teaching revision — 2026-10-04

Mark identified that the first recall question expected coding knowledge before the lesson. Content pack and quest prose versions are now 2; progress schema remains 1. Every activity teaches first, then asks for prediction and practice. Created `src/lesson-guides.ts` with plain definitions, annotated examples, named editor tabs, numbered actions, expected results, reflection starters and support for checkpoint bug questions. The UI explains editor, preview, checks, help and completion. JavaScript tasks now open the JavaScript editor first. Quest 1 predicts a simple text edit rather than requiring an untaught role match.

Modified `src/App.tsx`, `src/curriculum.ts`, `src/styles.css`, `tests/domain.test.ts`, README and content-authoring instructions; created `scripts/browser-beginner.js`. No source files deleted. The production `dist` was rebuilt for the existing desktop shortcut. Stable quest/check IDs, code requirements and scoring are unchanged.

- `npm.cmd test`: **50/50 pass**. Added a meaningful version-1 compatibility test preserving completed evidence, XP, journal, review dates and an unfinished draft with hints after the teaching update.
- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`: **pass**. Main JS 390.91 kB, CSS 16.61 kB, unchanged sandbox chunk 147.15 kB.
- Ran `npx.cmd --yes --package @playwright/cli playwright-cli -s=cq-beginner run-code --filename scripts/browser-beginner.js` against temporary dev port 5189 in an isolated Chrome profile. **Pass**: explanations precede prediction, all three roles introduced, unchanged starter fails meaningfully, one text edit passes and displays Practice Board, plain reflection completes, 20 unique XP and exact reload persistence.
- Opened **all 18** teaching views. Term definitions, explained examples, numbered steps, expected result and correct default editor are present. Mobile width 390 has no horizontal overflow. Inspected desktop/mobile screenshots in `output/playwright/beginner-teaching-*.png`; browser console had no app errors.
- Verified updated production HTML and new JS asset return **HTTP 200** at the stable port 5188. Opened Quest 1 in the production build and confirmed the revised teaching, prediction, steps and editor guidance. Mark's browser profile/storage was not used for QA.

These checks verify the authored learning flow, not a person's comprehension. Explanations remain self-assessed or manually coach-reviewed. Existing attempts retain their original recorded content version and answers; the current lesson displays the improved teaching.
