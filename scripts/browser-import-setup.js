async (page) => {
  const original=await page.evaluate(()=>localStorage.getItem('coding-quest:progress'));
  await page.evaluate(raw=>sessionStorage.setItem('coding-quest:qa-import',raw),original);
  await page.getByRole('button',{name:'05 Backup',exact:true}).click();
  await page.getByLabel('Choose progress JSON').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('not json')});
  await page.getByRole('alert').getByText('This is not valid JSON.',{exact:false}).waitFor();
  if(await page.evaluate(()=>localStorage.getItem('coding-quest:progress'))!==original)throw Error('Malformed import changed current storage');
  await page.evaluate(()=>localStorage.removeItem('coding-quest:progress'));await page.reload();
  await page.getByRole('button',{name:'Begin Quest 1 ↗',exact:true}).click();
  await page.getByRole('button',{name:'05 Backup',exact:true}).click();
  await page.getByLabel('Choose progress JSON').setInputFiles({name:'restore.json',mimeType:'application/json',buffer:Buffer.from(original)});
  await page.getByText('Validated backup · ready for review',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Replace after confirmation',exact:true}).click();
}
