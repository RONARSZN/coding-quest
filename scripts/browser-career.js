async (page) => {
  const ensure = (condition, message) => { if (!condition) throw Error(message) }
  const stable = (value) => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item)
  ensure(new URL(page.url()).origin === "http://127.0.0.1:5189", "Use only the isolated test origin")
  await page.evaluate(() => localStorage.removeItem("coding-quest:progress"))
  await page.reload()
  await page.evaluate(() => { window.confirm = () => true })
  await page.setViewportSize({ width: 1440, height: 1000 })
  const fixtures = await page.evaluate(async () => {
    const oldDomain = await import("/output/developer-path-baseline/src/domain.ts")
    const oldContent = await import("/output/developer-path-baseline/src/curriculum.ts")
    const domain = await import("/src/domain.ts")
    const content = await import("/src/curriculum.ts")
    const { lessonGuides } = await import("/src/lesson-guides.ts")
    const finish = (d, p, q, solution = false) => {
      const a = { ...d.createAttempt(p, q), code: q.solution, solution,
        prediction: "QA fixture", reflection: "QA fixture", explanation: "QA fixture",
        bug: "QA fixture", rubric: [true, true, true, true],
        checks: q.checks.map((c) => ({ id: c.id, label: c.label, passed: true, detail: "QA fixture" })) }
      a.checkedCode = d.fingerprint(a)
      return d.completeAttempt(p, a, q)
    }
    let old = oldDomain.blankProgress()
    old.settings.onboarded = true
    for (const q of oldContent.quests.filter((q) => ["core", "boss"].includes(q.kind))) old = finish(oldDomain, old, q)
    const oldDraft = { ...oldDomain.createAttempt(old, oldContent.questById("q09")), code: { ...oldContent.questById("q09").starter, js: "// unfinished old draft" }, prediction: "Keep this prediction", hints: 1 }
    old = oldDomain.updateAttempt(old, oldDraft)
    let week2 = domain.blankProgress()
    week2.settings.onboarded = true
    for (const q of content.quests.filter((q) => q.week <= 2 && ["core", "boss"].includes(q.kind))) week2 = finish(domain, week2, q)
    let all = week2
    for (const q of content.quests.filter((q) => q.week === 3 && ["core", "boss"].includes(q.kind))) all = finish(domain, all, q)
    let guided = week2
    for (const q of content.quests.filter((q) => q.week === 3 && ["core", "boss"].includes(q.kind))) guided = finish(domain, guided, q, q.id === "boss03")
    sessionStorage.setItem("coding-quest:qa-old-backup", JSON.stringify(old))
    return { old, week2, all, guided, newContent: content.quests.filter((q) => q.week === 3).map((q) => ({ id: q.id, title: q.title, guide: lessonGuides[q.id], solution: q.solution })) }
  })
  await page.getByRole("button", { name: "Begin Quest 1", exact: false }).click()
  await page.getByRole("button", { name: "05 Backup", exact: true }).click()
  await page.getByLabel("Choose progress JSON").setInputFiles({ name: "older-v2.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(fixtures.old)) })
  await page.getByText("Validated backup · ready for review", { exact: true }).waitFor()
  await page.getByRole("button", { name: "Replace after confirmation", exact: true }).click()
  await page.getByText("Backup restored. Attempts, XP, evidence and review dates are preserved.", { exact: true }).waitFor()
  const imported = await page.evaluate(() => JSON.parse(localStorage.getItem("coding-quest:progress")))
  for (const key of ["attempts", "evidence", "awards", "reviews", "journal", "settings"]) ensure(stable(imported[key]) === stable(fixtures.old[key]), `Old backup lost ${key}`)
  ensure(imported.packs["season-01-foundations"] === 3 && imported.schemaVersion === 1, "Wrong pack/schema upgrade")
  await page.reload()
  await page.evaluate(() => { window.confirm = () => true })
  await page.getByText("Resume your unfinished quest", { exact: true }).waitFor()
  await page.getByRole("button", { name: "05 Backup", exact: true }).click()
  await page.getByLabel("Choose progress JSON").setInputFiles({ name: "older-v2-again.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(fixtures.old)) })
  await page.getByRole("button", { name: "Replace after confirmation", exact: true }).click()
  ensure(await page.evaluate(() => JSON.parse(localStorage.getItem("coding-quest:progress")).awards.length) === fixtures.old.awards.length, "Repeated import duplicated XP")

  const install = async (progress) => {
    await page.evaluate((p) => localStorage.setItem("coding-quest:progress", JSON.stringify(p)), progress)
    await page.reload()
    await page.evaluate(() => { window.confirm = () => true })
  }
  await install(fixtures.week2)
  await page.getByRole("heading", { name: "Read a list by position", exact: true }).waitFor()
  await page.getByRole("button", { name: "Open quest", exact: false }).focus()
  await page.keyboard.press("Enter")
  ensure(await page.locator("#learn-heading").evaluate((heading) => !!(heading.compareDocumentPosition(document.getElementById("prediction")) & Node.DOCUMENT_POSITION_FOLLOWING)), "Teaching must precede prediction")
  await page.getByRole("textbox", { name: "JavaScript code", exact: true }).fill("// draft survives reload\nconst names = ['Draft'];")
  await page.locator("#prediction").fill("My saved prediction")
  const draft = await page.evaluate(() => localStorage.getItem("coding-quest:progress"))
  await page.reload()
  await page.evaluate(() => { window.confirm = () => true })
  ensure(await page.evaluate(() => localStorage.getItem("coding-quest:progress")) === draft, "Reload changed the unfinished draft")
  await page.getByRole("button", { name: "Resume quest", exact: false }).click()
  ensure((await page.getByRole("textbox", { name: "JavaScript code", exact: true }).inputValue()).includes("draft survives reload"), "Editor did not restore draft")
  ensure(await page.locator("#prediction").inputValue() === "My saved prediction", "Prediction lost on reload")
  await page.getByRole("button", { name: "Reveal hint 1", exact: false }).click()
  ensure(await page.getByText("Find the brackets in itemName, not the display line.", { exact: false }).isVisible(), "Hint did not appear")
  await page.getByRole("button", { name: "Reveal full solution", exact: true }).click()
  await page.getByText("Guided practice · intended solution", { exact: true }).waitFor()
  const q11 = fixtures.newContent.find((q) => q.id === "q11")
  await page.getByRole("textbox", { name: "JavaScript code", exact: true }).fill(q11.solution.js)
  await page.getByRole("button", { name: "Run & check ▶", exact: true }).focus()
  await page.keyboard.press("Enter")
  await page.getByText("PASS · The page shows Second: Demo Bag · Items: 3", { exact: true }).waitFor()
  await page.locator(".reflection-grid textarea").nth(0).fill("I use the input as the index; index 1 selects the second name.")
  await page.getByRole("button", { name: "Complete quest ✓", exact: true }).click()
  ensure(await page.evaluate(() => JSON.parse(localStorage.getItem("coding-quest:progress")).evidence.filter((e) => e.questId === "q11").every((e) => e.level === "Guided")), "Revealed solution earned independent evidence")

  await install(fixtures.all)
  await page.getByText("Keep the practice going.", { exact: true }).waitFor()
  await page.getByRole("button", { name: "02 Quests", exact: true }).click()
  ensure(await page.getByText("Week 4 · Planned, not playable yet", { exact: true }).isVisible(), "Week 4 availability is wrong")
  const covered = []
  for (const quest of fixtures.newContent) {
    const row = page.locator(".quest-row").filter({ has: page.getByRole("heading", { name: quest.title, exact: true }) })
    await row.getByRole("button").click()
    await page.getByRole("heading", { name: "Start with the explanation", exact: true }).waitFor()
    ensure(await page.locator(".term-list dt").count() === quest.guide.terms.length, `${quest.id}: vocabulary missing`)
    ensure(await page.locator(".explained-line").count() === quest.guide.walkthrough.length, `${quest.id}: example missing`)
    ensure(await page.locator(".task-steps li").count() === quest.guide.steps.length, `${quest.id}: editing steps missing`)
    ensure(await page.getByRole("button", { name: "JavaScript", exact: true }).getAttribute("aria-pressed") === "true", `${quest.id}: wrong editing tab`)
    ensure(await page.locator("#learn-heading").evaluate((heading) => !!(heading.compareDocumentPosition(document.getElementById("prediction")) & Node.DOCUMENT_POSITION_FOLLOWING)), `${quest.id}: questions before teaching`)
    if (quest.id === "q11") await page.screenshot({ path: "output/playwright/week3-teaching-desktop.png", fullPage: true })
    if (quest.id === "boss03") {
      await page.setViewportSize({ width: 390, height: 844 })
      ensure(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Week 3 mobile overflow")
      await page.screenshot({ path: "output/playwright/week3-checkpoint-mobile.png", fullPage: true })
      await page.setViewportSize({ width: 1440, height: 1000 })
    }
    covered.push(quest.id)
    await page.getByRole("button", { name: "← Quest library", exact: true }).click()
  }
  await install(fixtures.guided)
  await page.getByRole("heading", { name: "Fresh checkpoint: a kit reservation", exact: true }).waitFor()
  await page.getByRole("button", { name: "06 Developer path", exact: true }).focus()
  await page.keyboard.press("Enter")
  ensure(await page.getByRole("heading", { name: "Your developer path.", exact: true }).isVisible(), "Keyboard path navigation failed")
  ensure(await page.locator("h1").evaluate((h) => document.activeElement === h), "Path heading did not receive navigation focus")
  ensure(await page.locator(".developer-stage").count() === 9, "Missing path stages")
  for (const stage of await page.locator(".developer-stage").all()) {
    if (await stage.locator(".badge").innerText() === "Planned") ensure(await stage.getByRole("button").count() === 0, "Planned stage has Start button")
  }
  await page.locator(".developer-stage").nth(1).locator("summary").first().focus()
  await page.keyboard.press("Enter")
  ensure(await page.locator(".developer-stage").nth(1).getByText("Evidence to work toward", { exact: true }).isVisible(), "Keyboard brief expansion failed")
  await page.screenshot({ path: "output/playwright/developer-path-desktop.png", fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => window.scrollTo(0, 0))
  ensure(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Path mobile overflow")
  await page.screenshot({ path: "output/playwright/developer-path-mobile.png", fullPage: true })
  await page.getByRole("button", { name: /Skill map/ }).click()
  ensure(await page.getByText("Arrays & indexes", { exact: true }).isVisible(), "Skill map omitted Week 3")
  ensure(await page.getByText("Input validation", { exact: true }).isVisible(), "Skill map omitted validation")
  return { oldBackupImport: "all records preserved; pack v2 to v3; schema stays 1", repeatedImportXP: "unchanged", unfinishedDraftReload: "pass", q11KeyboardRunAndCompletion: "pass", hintAndSolutionRules: "guided", nineTeachingViews: covered, guidedBossRecommendsFresh: "pass", contentExhaustion: "pass", pathStages: 9, plannedStartButtons: 0, keyboardNavigationAndBrief: "pass", desktopAnd390px: "pass" }
}
