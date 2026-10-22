async (page) => {
  await page.getByText('Backup restored. Attempts, XP, evidence and review dates are preserved.',{exact:true}).waitFor();
  const equal=await page.evaluate(()=>localStorage.getItem('coding-quest:progress')===sessionStorage.getItem('coding-quest:qa-import'));
  if(!equal)throw Error('Import did not reproduce all stored fields exactly');
  await page.evaluate(()=>sessionStorage.removeItem('coding-quest:qa-import'));
  await page.getByRole('button',{name:'01 Today',exact:true}).click();
  return {malformedImport:'unchanged',replaceConfirmation:'required',cleanStorageRoundTrip:'all fields equal'};
}
