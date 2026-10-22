async (page) => {
  const ensure = (condition, message) => {
    if (!condition) throw Error(message)
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("http://127.0.0.1:5189/")
  await page.getByRole("button", { name: "Begin Quest 1", exact: false }).click()
  ensure(
    await page.locator("#learn-heading").evaluate((heading) =>
      !!(heading.compareDocumentPosition(document.getElementById("prediction")) & Node.DOCUMENT_POSITION_FOLLOWING),
    ),
    "Prediction appears before teaching",
  )
  ensure(await page.getByText("HTML → content and structure", { exact: true }).isVisible(), "HTML was not introduced")
  ensure(await page.getByText("CSS → appearance", { exact: true }).isVisible(), "CSS was not introduced")
  ensure(await page.getByText("JavaScript → actions", { exact: true }).isVisible(), "JavaScript was not introduced")
  ensure(await page.getByRole("textbox", { name: "HTML code", exact: true }).isVisible(), "Wrong first editor")
  await page.screenshot({ path: "output/playwright/beginner-teaching-desktop.png" })
  await page.locator("#prediction").fill("Practice Cap will appear. Changing the words does not change their color.")
  await page.getByRole("button", { name: "Run & check ▶", exact: true }).click()
  await page.getByText("FAIL · The heading says Practice Board", { exact: true }).waitFor()
  const editor = page.getByRole("textbox", { name: "HTML code", exact: true })
  const starter = await editor.inputValue()
  await editor.fill(starter.replace("Demo Board", "Practice Board"))
  await page.getByRole("button", { name: "Run & check ▶", exact: true }).click()
  await page.getByText("PASS · The heading says Practice Board", { exact: true }).waitFor()
  await page.frameLocator('iframe[title="Learner code preview"]').getByRole("heading", { name: "Practice Board", exact: true }).waitFor()
  await page.getByRole("textbox", { name: "Which building block did you edit?", exact: false }).fill("I changed Demo Board to Practice Board in HTML. After Run, the heading showed Practice Board.")
  await page.getByRole("button", { name: "Complete quest ✓", exact: true }).click()
  await page.getByText("Quest completed. Your practice, XP and review dates are recorded.", { exact: true }).waitFor()
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("coding-quest:progress")))
  ensure(before.awards.reduce((sum, award) => sum + award.amount, 0) === 20, "Beginner flow did not award 20 unique XP")
  await page.reload()
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("coding-quest:progress")))
  ensure(JSON.stringify(before) === JSON.stringify(after), "Teaching update lost progress on reload")

  const fixture = await page.evaluate(async () => {
    const { quests } = await import("/src/curriculum.ts")
    const { lessonGuides } = await import("/src/lesson-guides.ts")
    const { blankProgress, createAttempt, completeAttempt, fingerprint } = await import("/src/domain.ts")
    let progress = blankProgress()
    progress.settings.onboarded = true
    for (const quest of quests.filter((quest) => ["core", "boss"].includes(quest.kind))) {
      const attempt = {
        ...createAttempt(progress, quest),
        code: quest.solution,
        prediction: "Browser QA fixture",
        reflection: "Browser QA fixture",
        explanation: "Browser QA fixture for authored teaching views",
        bug: "Browser QA fixture",
        rubric: [true, true, true, true],
        checks: quest.checks.map((check) => ({ id: check.id, label: check.label, passed: true, detail: "Fixture" })),
      }
      attempt.checkedCode = fingerprint(attempt)
      progress = completeAttempt(progress, attempt, quest)
    }
    localStorage.setItem("coding-quest:progress", JSON.stringify(progress))
    return quests.map((quest) => ({ id: quest.id, title: quest.title, guide: lessonGuides[quest.id] }))
  })
  await page.reload()
  await page.getByRole("button", { name: "02 Quests", exact: true }).click()
  const covered = []
  for (const quest of fixture) {
    const row = page.locator(".quest-row").filter({ has: page.getByRole("heading", { name: quest.title, exact: true }) })
    await row.getByRole("button").click()
    await page.getByRole("heading", { name: "Start with the explanation", exact: true }).waitFor()
    ensure(await page.locator(".term-list dt").count() === quest.guide.terms.length, `${quest.id}: missing term explanations`)
    ensure(await page.locator(".explained-line").count() === quest.guide.walkthrough.length, `${quest.id}: missing example explanations`)
    ensure(await page.locator(".task-steps li").count() === quest.guide.steps.length, `${quest.id}: missing task steps`)
    ensure(await page.getByText(quest.guide.success, { exact: true }).isVisible(), `${quest.id}: expected result missing`)
    const firstTab = quest.guide.editTabs[0] === "js" ? "JavaScript" : quest.guide.editTabs[0].toUpperCase()
    ensure(await page.getByRole("button", { name: firstTab, exact: true }).getAttribute("aria-pressed") === "true", `${quest.id}: wrong default editor`)
    if (quest.id === "q01") {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.evaluate(() => window.scrollTo(0, 0))
      ensure(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Beginner teaching overflows on mobile")
      await page.screenshot({ path: "output/playwright/beginner-teaching-mobile.png", fullPage: true })
      await page.setViewportSize({ width: 1440, height: 1000 })
    }
    covered.push(quest.id)
    await page.getByRole("button", { name: "← Quest library", exact: true }).click()
  }
  return { teachingBeforePrediction: "pass", quest1FromZero: "pass", starterFeedback: "pass", completionAndReload: "pass", uniqueXP: 20, mobile: "pass", activitiesWithTeaching: covered }
}
