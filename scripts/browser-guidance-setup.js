async (page) => {
  await page.evaluate(()=>sessionStorage.setItem('coding-quest:qa-guidance',localStorage.getItem('coding-quest:progress')));
  await page.getByRole('button',{name:'02 Quests',exact:true}).click();
  const row=page.locator('.quest-row').filter({has:page.getByRole('heading',{name:'Give a product some structure',exact:true})});
  await row.getByRole('button',{name:'Start ↗',exact:true}).click();
  const original=await page.getByRole('textbox',{name:'HTML code',exact:true}).inputValue();
  await page.getByRole('textbox',{name:'HTML code',exact:true}).fill(original.replace('Demo Board','Preserved draft'));
  await page.getByRole('button',{name:'Reveal hint 1 · no XP penalty',exact:true}).click();
  await page.getByRole('button',{name:'Reveal full solution',exact:true}).click();
}
