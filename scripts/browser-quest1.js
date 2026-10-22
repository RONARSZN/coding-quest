// Run through playwright-cli run-code --filename scripts/browser-quest1.js
async (page) => {
  const ensure = (condition, message) => {
    if (!condition) throw Error(message)
  }
  if (
    !(await page
      .getByRole("textbox", { name: "HTML code", exact: true })
      .count())
  )
    await page
      .getByRole("button", { name: "Resume quest ↗", exact: true })
      .click()
  const original = await page
    .getByRole("textbox", { name: "HTML code", exact: true })
    .inputValue()
  await page
    .getByRole("textbox", { name: "HTML code", exact: true })
    .fill(original.replace("Demo Board", "Practice Board"))
  await page.reload()
  await page
    .getByRole("button", { name: "Resume quest ↗", exact: true })
    .click()
  ensure(
    (
      await page
        .getByRole("textbox", { name: "HTML code", exact: true })
        .inputValue()
    ).includes("Practice Board"),
    "Draft did not resume",
  )
  ensure(
    (
      await page
        .getByRole("textbox", { name: "Match the roles:", exact: false })
        .inputValue()
    ).includes("HTML is structure"),
    "Prediction did not resume",
  )
  await page.getByRole("button", { name: "Run & check ▶", exact: true }).click()
  await page
    .getByText("PASS · The heading says Practice Board", { exact: true })
    .waitFor()
  await page
    .getByRole("textbox", { name: "Which building block did you edit?" })
    .fill("I edited HTML. The heading changed to Practice Board after Run.")
  await page
    .getByRole("button", { name: "Complete quest ✓", exact: true })
    .click()
  const read = () =>
    page.evaluate(() =>
      JSON.parse(localStorage.getItem("coding-quest:progress")),
    )
  const before = await read()
  ensure(
    before.awards.reduce((s, a) => s + a.amount, 0) === 20,
    "Quest 1 XP mismatch",
  )
  await page.reload()
  const after = await read()
  ensure(
    JSON.stringify(before) === JSON.stringify(after),
    "Reload did not preserve exact progress",
  )
  await page.getByRole("button", { name: "02 Quests", exact: true }).click()
  const row = page.locator(".quest-row").filter({
    has: page.getByRole("heading", {
      name: "Meet the three building blocks",
      exact: true,
    }),
  })
  await row.getByRole("button", { name: "View", exact: true }).click()
  await page.getByRole("button", { name: "Run & check ▶", exact: true }).click()
  await page
    .getByRole("button", { name: "Run & check ▶", exact: true })
    .waitFor()
  const reopened = await read()
  ensure(reopened.awards.length === 3, "Reopening duplicated XP")
  ensure(
    reopened.attempts[0].checks[0].passed,
    "Re-running completed work erased checks",
  )
  await page.getByRole("button", { name: "05 Backup", exact: true }).click()
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page
      .getByRole("button", {
        name: "Export all progress · JSON ↓",
        exact: true,
      })
      .click(),
  ])
  await download.saveAs("output/playwright/quest1-backup.json")
  await page.getByRole("button", { name: "01 Today", exact: true }).click()
  await page.screenshot({
    path: "output/playwright/dashboard-desktop.png",
    fullPage: true,
  })
  return {
    quest1: "pass",
    draftReload: "pass",
    completionReload: "pass",
    uniqueXP: 20,
    backup: "output/playwright/quest1-backup.json",
  }
}
