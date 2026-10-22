async (page) => {
  await page.getByText("Backup restored. Attempts, XP, evidence and review dates are preserved.", { exact: true }).waitFor()
  const result = await page.evaluate(() => {
    const old = JSON.parse(sessionStorage.getItem("coding-quest:qa-old-backup"))
    const restored = JSON.parse(localStorage.getItem("coding-quest:progress"))
    const stable = (value) => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item)
    for (const key of ["attempts", "evidence", "awards", "reviews", "journal", "settings"]) if (stable(old[key]) !== stable(restored[key])) throw Error(`Native import changed ${key}`)
    return { nativeConfirmation: "required and accepted", preservedFields: ["attempts", "evidence", "awards", "reviews", "journal", "settings"], schema: restored.schemaVersion, pack: restored.packs["season-01-foundations"] }
  })
  return result
}
