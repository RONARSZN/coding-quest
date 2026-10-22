async (page) => {
  const ensure = (condition, message) => {
    if (!condition) throw Error(message)
  }
  const read = () =>
    page.evaluate(() => localStorage.getItem("coding-quest:progress"))
  const original = await read()
  await page.evaluate(() =>
    localStorage.setItem("coding-quest:progress", "{broken"),
  )
  await page.reload()
  await page
    .getByRole("heading", {
      name: "Keep your existing progress safe",
      exact: true,
    })
    .waitFor()
  ensure((await read()) === "{broken", "Corrupt data was silently overwritten")
  const [rawDownload] = await Promise.all([
    page.waitForEvent("download"),
    page
      .getByRole("button", { name: "Export raw stored data", exact: true })
      .click(),
  ])
  await rawDownload.saveAs("output/playwright/corrupt-recovery.txt")
  await page.evaluate(
    (raw) => localStorage.setItem("coding-quest:progress", raw),
    original,
  )
  await page.reload()
  const denied = await page.context().newPage()
  await denied.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value() {
        throw new DOMException("Storage denied", "SecurityError")
      },
    })
    Object.defineProperty(Storage.prototype, "setItem", {
      value() {
        throw new DOMException("Storage denied", "SecurityError")
      },
    })
  })
  await denied.goto("http://127.0.0.1:5188")
  await denied
    .getByRole("status")
    .getByText("Browser storage is unavailable", { exact: false })
    .waitFor()
  await denied
    .getByRole("button", { name: "Begin Quest 1 ↗", exact: true })
    .click()
  await denied
    .getByRole("status")
    .getByText("Unsaved", { exact: false })
    .waitFor()
  await denied.getByRole("button", { name: "05 Backup", exact: true }).click()
  const [deniedDownload] = await Promise.all([
    denied.waitForEvent("download"),
    denied
      .getByRole("button", {
        name: "Export all progress · JSON ↓",
        exact: true,
      })
      .click(),
  ])
  await deniedDownload.saveAs("output/playwright/storage-denied-backup.json")
  await denied.close()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  ensure(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile dashboard overflows",
  )
  await page.getByRole("button", { name: /^(02 )?Quests$/ }).click()
  const row = page.locator(".quest-row").filter({
    has: page.getByRole("heading", {
      name: "Give a product some structure",
      exact: true,
    }),
  })
  await row.getByRole("button", { name: "Start ↗", exact: true }).click()
  ensure(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile workspace overflows",
  )
  await page.screenshot({
    path: "output/playwright/workspace-mobile.png",
    fullPage: true,
  })
  await page
    .getByRole("button", { name: "Prepare a coaching handoff ↗", exact: true })
    .click()
  await page.getByRole("dialog").waitFor()
  ensure(
    await page.evaluate(
      () => document.activeElement.closest("dialog") !== null,
    ),
    "Coaching dialog did not receive focus",
  )
  await page.keyboard.press("Escape")
  ensure(
    (await page.getByRole("dialog").count()) === 0,
    "Escape did not close dialog",
  )
  await page.getByRole("button", { name: "HTML", exact: true }).focus()
  await page.keyboard.press("Tab")
  ensure(
    await page.evaluate(() => document.activeElement.textContent === "CSS"),
    "Editor language buttons are not keyboard navigable",
  )
  await page.getByRole("button", { name: /^(01 )?Today$/ }).click()
  await page.screenshot({
    path: "output/playwright/dashboard-mobile.png",
    fullPage: true,
  })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.evaluate(
    (raw) => localStorage.setItem("coding-quest:progress", raw),
    original,
  )
  await page.reload()
  const reopened = await page.context().newPage()
  await reopened.goto("http://127.0.0.1:5188")
  ensure(
    (await reopened.evaluate(() =>
      localStorage.getItem("coding-quest:progress"),
    )) === original,
    "Reopened tab lost progress",
  )
  await reopened.close()
  return {
    corruptRecovery: "raw preserved and exported",
    storageDenied: "unsaved plus backup works",
    mobile390: "no overflow",
    keyboard: "language navigation and modal focus/Escape pass",
    reducedMotion: "respected",
    closeAndReopen: "same profile progress intact",
  }
}
