async (page) => {
  if (new URL(page.url()).origin !== "http://127.0.0.1:5189") throw Error("Use only the isolated test origin")
  await page.reload()
  const old = await page.evaluate(() => sessionStorage.getItem("coding-quest:qa-old-backup"))
  if (!old) throw Error("Run browser-career.js to create an actual pre-update backup fixture")
  await page.getByRole("button", { name: /Backup/ }).click()
  const before = await page.evaluate(() => localStorage.getItem("coding-quest:progress"))
  await page.getByLabel("Choose progress JSON").setInputFiles({ name: "native-confirm-v2.json", mimeType: "application/json", buffer: Buffer.from(old) })
  await page.getByText("Validated backup · ready for review", { exact: true }).waitFor()
  if (await page.evaluate(() => localStorage.getItem("coding-quest:progress")) !== before) throw Error("Validation changed progress before confirmation")
  await page.getByRole("button", { name: "Replace after confirmation", exact: true }).click()
}
