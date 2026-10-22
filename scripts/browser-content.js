async (page) => {
  let network = 0
  await page.route("https://coding-quest.invalid/**", (route) => {
    network++
    return route.fulfill({ status: 200, body: "blocked-test" })
  })
  const result = await page.evaluate(async () => {
    const { quests } = await import("/src/curriculum.ts")
    const { buildPreview } = await import("/src/sandbox.ts")
    const run = (code, checks) =>
      new Promise((resolve) => {
        const frame = document.createElement("iframe")
        frame.sandbox = "allow-scripts"
        frame.style.display = "none"
        const id = crypto.randomUUID()
        let timer
        const cleanup = () => {
          clearTimeout(timer)
          window.removeEventListener("message", listener)
          frame.remove()
        }
        const listener = (e) => {
          if (e.source === frame.contentWindow && e.data?.runId === id) {
            cleanup()
            resolve(e.data)
          }
        }
        window.addEventListener("message", listener)
        timer = setTimeout(() => {
          cleanup()
          resolve({ error: "TEST TIMEOUT", results: [] })
        }, 3500)
        frame.srcdoc = buildPreview(code, checks, id)
        document.body.append(frame)
      })
    const rows = []
    for (const quest of quests) {
      const correct = await run(quest.solution, quest.checks)
      if (
        correct.error ||
        correct.results.length !== quest.checks.length ||
        correct.results.some((r) => !r.passed)
      )
        throw Error(`${quest.id} solution failed: ${JSON.stringify(correct)}`)
      const wrong = await run(quest.starter, quest.checks)
      if (
        wrong.results.length &&
        wrong.results.every((r) => r.passed) &&
        !wrong.error
      )
        throw Error(`${quest.id} starter unexpectedly passed`)
      rows.push({
        id: quest.id,
        solution: "pass",
        starter: "fails meaningfully",
      })
    }
    const base = quests[0].starter
    const whileLoop = await run({ ...base, js: "while (true) {}" }, [])
    if (!whileLoop.error.includes("Execution stopped"))
      throw Error("Infinite loop was not interrupted")
    const nativeRunaway = await run(
      {
        ...base,
        js: '"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!".replace(/(a+)+$/, "");',
      },
      [],
    )
    if (!nativeRunaway.error.includes("900ms"))
      throw Error(
        "Native-work preflight worker was not terminated by the parent deadline",
      )
    const recursion = await run(
      { ...base, js: "function recurse(){ recurse(); } recurse();" },
      [],
    )
    if (!recursion.error) throw Error("Recursion was not interrupted")
    const eventLoop = await run(
      {
        ...base,
        js: 'document.querySelector("#action").addEventListener("click",()=>{while(true){}});',
      },
      [
        {
          id: "event-loop",
          kind: "click",
          selector: "#action",
          initial: "Ready",
          expected: "Done",
          label: "Runaway click",
        },
      ],
    )
    if (!eventLoop.error.includes("Execution stopped"))
      throw Error("Runaway event was not interrupted")
    const blocked = await run(
      {
        ...base,
        js: 'try { document.querySelector("#output").textContent = parent.localStorage.getItem("coding-quest:progress"); } catch (error) { document.querySelector("#output").textContent = "Storage blocked"; }',
      },
      [
        {
          id: "blocked",
          kind: "text",
          selector: "#output",
          expected: "Storage blocked",
          label: "Parent storage isolation",
        },
      ],
    )
    if (!blocked.results[0]?.passed)
      throw Error("Parent storage was not blocked")
    const navigation = await run(
      {
        ...base,
        js: 'try { top.location.href = "https://coding-quest.invalid/navigation"; } catch (error) { document.querySelector("#output").textContent = "Navigation blocked"; }',
      },
      [
        {
          id: "navigation",
          kind: "text",
          selector: "#output",
          expected: "Navigation blocked",
          label: "Top navigation isolation",
        },
      ],
    )
    if (!navigation.results[0]?.passed)
      throw Error("Top navigation was not blocked")
    const fetchResult = await run(
      {
        ...base,
        js: 'fetch("https://coding-quest.invalid/network").catch(()=>{});',
      },
      [],
    )
    if (fetchResult.error === "TEST TIMEOUT")
      throw Error("Network isolation test hung")
    return {
      activities: rows,
      whileLoop: "interrupted",
      recursion: "interrupted",
      nativeWorkerTimeout: "terminated after 900ms",
      eventLoop: "interrupted",
      parentStorage: "blocked",
      topNavigation: "blocked",
      network: "CSP blocked",
      hostResponsive: true,
    }
  })
  await page.unroute("https://coding-quest.invalid/**")
  if (network) throw Error("Sandbox network request escaped CSP")
  return { ...result, escapedNetworkRequests: network }
}
