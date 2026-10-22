async (page) => {
  const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('coding-quest:progress')));
  const previous=p.attempts.find(a=>a.questId==='q02'&&a.archived);
  const current=p.attempts.find(a=>a.questId==='q02'&&!a.archived);
  if(!previous?.code.html.includes('Preserved draft')||!previous.solution||previous.hints!==1)throw Error('Reset did not preserve old attempt/help');
  if(!current?.code.html.includes('Demo Board')||!current.solution)throw Error('Reset did not restore starter and carry solution use');
  await page.evaluate(()=>{localStorage.setItem('coding-quest:progress',sessionStorage.getItem('coding-quest:qa-guidance'));sessionStorage.removeItem('coding-quest:qa-guidance');});
  await page.reload();
  return {hintAndSolutionUsage:'recorded',reset:'confirmed and archived old draft',independence:'solution taint preserved'};
}
