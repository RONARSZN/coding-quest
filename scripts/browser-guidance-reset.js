async (page) => {
  const recorded=await page.evaluate(()=>JSON.parse(localStorage.getItem('coding-quest:progress')).attempts.at(-1));
  if(!recorded.solution||recorded.hints!==1)throw Error('Help usage was not recorded');
  await page.getByRole('button',{name:'Reset to starter',exact:true}).click();
}
