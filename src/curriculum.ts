import type { Check, Code, Quest } from "./types";
import { lessonGuides } from "./lesson-guides";
import { week3Quests } from "./week3-quests";
import { week4Quests } from "./week4-quests";
import { computingQuests } from "./computing-quests";

export const pack = {
  id: "season-01-foundations",
  version: 4,
  title: "Season 01 · Build your footing",
  weeks: 4,
};
export const curriculumPacks = [pack];
export const skills = [
  { id: "roles", title: "Structure, style & behavior", stage: 0 },
  { id: "html", title: "HTML elements", stage: 0 },
  { id: "css", title: "CSS rules", stage: 0 },
  { id: "values", title: "Values & variables", stage: 1 },
  { id: "expressions", title: "Strings, numbers & expressions", stage: 1 },
  { id: "conditions", title: "Conditions", stage: 1 },
  { id: "functions", title: "Functions", stage: 1 },
  { id: "events", title: "Click events", stage: 1 },
  { id: "arrays", title: "Arrays & indexes", stage: 1 },
  { id: "objects", title: "Objects & named properties", stage: 1 },
  { id: "validation", title: "Input validation", stage: 1 },
  { id: "debugging", title: "Reproduce & repair bugs", stage: 2 },
  { id: "computing", title: "Input, instructions & output", stage: 0 },
  { id: "algorithms", title: "Problem-solving steps", stage: 0 },
  { id: "loops", title: "Loops & running totals", stage: 1 },
  { id: "testing", title: "Test cases & boundaries", stage: 1 },
  { id: "ai-review", title: "Critical AI code review", stage: 1 },
];
export const stages = [
  "HTML / CSS",
  "JavaScript fundamentals",
  "Developer workflow",
  "APIs & async behavior",
  "React · library",
  "TypeScript · language",
  "Backend · Node.js",
  "Data & security · PostgreSQL",
  "Delivery & collaboration",
];
const css =
  "body { font-family: system-ui; padding: 24px; background: #f8f5ed; }\n.card { padding: 16px; background: white; border-radius: 12px; }\nh2 { color: #193e36; }\nbutton { padding: 12px; cursor: pointer; }";
const card =
  '<article class="card">\n  <h2 id="name">Demo Board</h2>\n  <p id="description">A fictional practice product.</p>\n  <p id="output">Ready</p>\n  <button id="action">Try it</button>\n</article>';
const code = (html = card, js = "", style = css): Code => ({
  html,
  css: style,
  js,
});
const text = (
  id: string,
  selector: string,
  expected: string,
  label: string,
): Check => ({ id, kind: "text", selector, expected, label });
const fn = (
  id: string,
  name: string,
  args: number[],
  value: number,
): Check => ({
  id,
  kind: "function",
  fn: name,
  args,
  value,
  label: `${name}(${args.join(", ")}) returns ${value}`,
});
const click = (expected: string, initial = "Ready"): Check => ({
  id: "click",
  kind: "click",
  selector: "#action",
  expected,
  initial,
  label: `Button changes the output from ${initial} to ${expected}`,
});
const common = {
  version: 2,
  fresh: false,
  reflection:
    "What did you change? Which line controlled the result? Explain it in your own words.",
  hints: [
    "Compare the requested result with what the preview currently shows.",
    "Find the element or value responsible for the output. Change one thing, then Run again.",
    "Use the worked example as a pattern. If stuck, reveal the solution and count this as guided practice.",
  ],
};
export const quests: Quest[] = [
  {
    ...common,
    id: "q01",
    title: "Meet the three building blocks",
    week: 1,
    kind: "core",
    skills: ["roles"],
    prerequisites: [],
    objective:
      "Recognize HTML, CSS and JavaScript, then change the product heading.",
    lesson:
      "A web page can use three building blocks. HTML supplies its pieces, CSS styles them, and JavaScript adds actions. Today you only edit the visible words in an HTML heading. The code around those words is already written for you.",
    example: "HTML: <h2>Practice Bag</h2>\nCSS: h2 { color: blue; }",
    prediction:
      "In the heading example above, if you replace only Practice Bag with Practice Cap, what words will appear on the page? Will that edit change its color?",
    predictionAnswer:
      "Practice Cap will appear. Editing those words changes the HTML content; it does not change the CSS color setting.",
    exercise:
      "Open HTML. Change only Demo Board to Practice Board. Press Run & check. Then write one sentence about what happened. No JavaScript edit is needed.",
    starter: code(),
    solution: code(card.replace("Demo Board", "Practice Board")),
    checks: [
      text(
        "heading",
        "#name",
        "Practice Board",
        "The heading says Practice Board",
      ),
    ],
    hints: [
      "Look for Demo Board in the HTML tab.",
      'Replace the words between <h2 id="name"> and </h2>.',
      'The whole line becomes: <h2 id="name">Practice Board</h2>.',
    ],
    reflection:
      "Which building block did you edit? What did the preview show after Run?",
  },
  {
    ...common,
    id: "q02",
    title: "Give a product some structure",
    week: 1,
    kind: "core",
    skills: ["html"],
    prerequisites: ["q01"],
    objective: "Use a heading for a name and a paragraph for a description.",
    lesson:
      'An HTML element has an opening tag, content and usually a closing tag. <h2> is a heading; <p> is a paragraph. The id attribute is a label that code and checks can use to find that element. Keep id="name" and id="description" while changing their words.',
    example:
      '<h2 id="name">Practice Helmet</h2>\n<p id="description">A fictional helmet for code practice.</p>',
    prediction:
      "If you change words inside <p>, does that create a heading or change a paragraph?",
    predictionAnswer: "It changes a paragraph.",
    exercise:
      "Rename the product to Demo Vest. Replace the description with A fictional vest for practice.",
    starter: code(),
    solution: code(
      card
        .replace("Demo Board", "Demo Vest")
        .replace(
          "A fictional practice product.",
          "A fictional vest for practice.",
        ),
    ),
    checks: [
      text("name", "#name", "Demo Vest", "Name is Demo Vest"),
      text(
        "description",
        "#description",
        "A fictional vest for practice.",
        "Description is the requested paragraph",
      ),
    ],
  },
  {
    ...common,
    id: "q03",
    title: "Style the right element",
    week: 1,
    kind: "core",
    skills: ["css"],
    prerequisites: ["q02"],
    objective: "Change a heading color and the space inside a card.",
    lesson:
      'A selector chooses elements. h2 selects headings; .card selects elements with class="card". A rule contains property: value pairs. color controls text color. padding controls the space inside an element. px means pixels. These checks measure the rendered result, so an equivalent selector is fine.',
    example: "h2 { color: #193e36; }\n.card { padding: 16px; }",
    prediction: "Which selector controls the card spacing: h2 or .card?",
    predictionAnswer: ".card controls card spacing.",
    exercise:
      "Set the heading color to blue (blue or #0000ff) and the card padding to 24px. Explain which rule changed each result.",
    starter: code(),
    solution: code(
      card,
      "",
      css.replace("#193e36", "blue").replace("padding: 16px", "padding: 24px"),
    ),
    checks: [
      {
        id: "color",
        kind: "css",
        selector: "#name",
        property: "color",
        expected: "rgb(0, 0, 255)",
        label: "Heading is blue",
      },
      {
        id: "padding",
        kind: "css",
        selector: ".card",
        property: "padding-top",
        expected: "24px",
        label: "Card has 24px of inner space",
      },
    ],
  },
  {
    ...common,
    id: "q04",
    title: "Make a value visible",
    week: 1,
    kind: "core",
    skills: ["values"],
    prerequisites: ["q03"],
    objective: "Change a variable and see it displayed.",
    lesson:
      'JavaScript stores values in named variables. let price = 100 means price currently holds the number 100. document.querySelector("#output") finds the element labeled output. .textContent sets its visible text. This DOM wiring is supplied; focus on the price value. "Demo price: " is a string (text). + joins that text with the number.',
    example:
      'let price = 100;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
    prediction: "What exact message will the starter show with price = 100?",
    predictionAnswer: "Demo price: 100",
    exercise:
      "Change price to 150. Keep the supplied display wiring, then Run.",
    starter: code(
      card,
      'let price = 100;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
    ),
    solution: code(
      card,
      'let price = 150;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
    ),
    checks: [
      text(
        "price",
        "#output",
        "Demo price: 150",
        "Displayed demo price is 150",
      ),
    ],
  },
  {
    ...common,
    id: "boss01",
    title: "Boss · Build a product card",
    week: 1,
    kind: "boss",
    fresh: true,
    skills: ["html", "css", "values"],
    prerequisites: ["q04"],
    objective: "Combine structure, style and a displayed value on a new card.",
    lesson:
      "A boss is a small checkpoint. Behavior checks verify the visible output. You separately assess whether you can explain your work, change a requirement and diagnose a bug. That understanding is self-assessed unless you manually record a real chat review. XP alone cannot unlock week 2.",
    example:
      '<h2 id="name">Example Bag</h2>\n.card { padding: 20px; }\nlet price = 90;',
    prediction:
      "If price changes from 80 to 120, what will the supplied output line display?",
    predictionAnswer: "Demo price: 120",
    exercise:
      "Rename the card to Demo Helmet. Set card padding to 24px. Change the price to 120. Run and explain all three changes. Then satisfy the changed requirement below before completing.",
    changedRequirement:
      "The buyer changed the requested demo price to 135. Make that final change; the checks expect 135.",
    bug: 'A teammate wrote document.querySelector("output") instead of document.querySelector("#output"). Why might it fail to find the paragraph?',
    starter: code(
      card,
      'let price = 80;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
    ),
    solution: code(
      card.replace("Demo Board", "Demo Helmet"),
      'let price = 135;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
      css.replace("padding: 16px", "padding: 24px"),
    ),
    checks: [
      text("name", "#name", "Demo Helmet", "Heading is Demo Helmet"),
      {
        id: "padding",
        kind: "css",
        selector: ".card",
        property: "padding-top",
        expected: "24px",
        label: "Card padding is 24px",
      },
      text(
        "price",
        "#output",
        "Demo price: 135",
        "Final changed requirement: price 135",
      ),
    ],
  },
  {
    ...common,
    id: "q06",
    title: "Calculate a fictional total",
    week: 2,
    kind: "core",
    skills: ["expressions"],
    prerequisites: ["boss01"],
    gate: "boss01",
    objective: "Multiply a price by a quantity and display the total.",
    lesson:
      'Numbers can be calculated: * multiplies, + adds. Strings are text in quotes. 80 * 2 gives the number 160, while "80" + "2" joins text into "802". Keep price and quantity as numbers. const names a value that will not be reassigned here.',
    example:
      "const price = 80;\nconst quantity = 2;\nconst total = price * quantity;",
    prediction: 'What is 80 * 2? What is "80" + "2"?',
    predictionAnswer: '160 and "802".',
    exercise:
      "Use price 125 and quantity 3. Calculate total with multiplication and display Demo total: 375.",
    starter: code(
      card,
      'const price = 80;\nconst quantity = 2;\nconst total = price * quantity;\ndocument.querySelector("#output").textContent = "Demo total: " + total;',
    ),
    solution: code(
      card,
      'const price = 125;\nconst quantity = 3;\nconst total = price * quantity;\ndocument.querySelector("#output").textContent = "Demo total: " + total;',
    ),
    checks: [text("total", "#output", "Demo total: 375", "Total displays 375")],
  },
  {
    ...common,
    id: "q07",
    title: "Choose a message with a condition",
    week: 2,
    kind: "core",
    skills: ["conditions"],
    prerequisites: ["q06"],
    objective: "Display a different message when stock is unavailable.",
    lesson:
      "if checks whether something is true. > means greater than. If stock > 0 is true, the first block runs; otherwise else runs. Braces group each block. Changing a number changes which branch runs. Every stock value here is fictional.",
    example:
      'if (stock > 0) {\n  message = "Available";\n} else {\n  message = "Unavailable";\n}',
    prediction:
      "With stock = 0, is stock > 0 true? Which message should appear?",
    predictionAnswer: "False; Unavailable.",
    exercise:
      "Change the supplied stock value to 0 so the output says Unavailable. The condition is already written. Try stock = 2 to see Available, then return to 0 for the final check.",
    starter: code(
      card,
      'const stock = 2;\nlet message;\nif (stock > 0) {\n  message = "Available";\n} else {\n  message = "Unavailable";\n}\ndocument.querySelector("#output").textContent = message;',
    ),
    solution: code(
      card,
      'const stock = 0;\nlet message;\nif (stock > 0) {\n  message = "Available";\n} else {\n  message = "Unavailable";\n}\ndocument.querySelector("#output").textContent = message;',
    ),
    checks: [
      text(
        "unavailable",
        "#output",
        "Unavailable",
        "Zero stock displays Unavailable",
      ),
    ],
  },
  {
    ...common,
    id: "q08",
    title: "Give a calculation a name",
    week: 2,
    kind: "core",
    skills: ["functions"],
    prerequisites: ["q07"],
    objective: "Write a function that returns a total for different inputs.",
    lesson:
      "A function is a reusable set of steps. Parameters are input names. return gives a value back to the caller. calculateTotal(50, 2) passes 50 and 2 into price and quantity. A function should use its inputs, so it works with other values too.",
    example:
      "function double(value) {\n  return value * 2;\n}\n// double(4) returns 8",
    prediction: "What should calculateTotal(50, 2) return?",
    predictionAnswer: "100",
    exercise:
      "Fill in calculateTotal(price, quantity) so it returns price * quantity. The checks try two different input pairs. Display Demo total: 180 for calculateTotal(60, 3).",
    starter: code(
      card,
      'function calculateTotal(price, quantity) {\n  return 0;\n}\ndocument.querySelector("#output").textContent = "Demo total: " + calculateTotal(60, 3);',
    ),
    solution: code(
      card,
      'function calculateTotal(price, quantity) {\n  return price * quantity;\n}\ndocument.querySelector("#output").textContent = "Demo total: " + calculateTotal(60, 3);',
    ),
    checks: [
      fn("fn-a", "calculateTotal", [50, 2], 100),
      fn("fn-b", "calculateTotal", [30, 4], 120),
      text("total", "#output", "Demo total: 180", "Visible total is 180"),
    ],
  },
  {
    ...common,
    id: "q09",
    title: "Let a click do the work",
    week: 2,
    kind: "core",
    skills: ["events"],
    prerequisites: ["q08"],
    objective: "Connect a supplied button to a function.",
    lesson:
      'addEventListener tells the browser which function to run when an event happens. "click" is the event name. Use showTotal without () when registering it: you give the function to the browser so it can call it later. The supplied function calculates and displays the result.',
    example:
      'const button = document.querySelector("#action");\nbutton.addEventListener("click", showTotal);',
    prediction:
      "Should showTotal run immediately when the page loads, or after a click?",
    predictionAnswer: "After a click.",
    exercise:
      "Add a click listener to #action using showTotal. The preview should show Ready before the click and Demo total: 200 after it.",
    starter: code(
      card,
      'function showTotal() {\n  document.querySelector("#output").textContent = "Demo total: " + (100 * 2);\n}\nconst button = document.querySelector("#action");\n// Add the click listener below.\n',
    ),
    solution: code(
      card,
      'function showTotal() {\n  document.querySelector("#output").textContent = "Demo total: " + (100 * 2);\n}\nconst button = document.querySelector("#action");\nbutton.addEventListener("click", showTotal);',
    ),
    checks: [click("Demo total: 200")],
  },
  {
    ...common,
    id: "boss02",
    title: "Boss · Make the card respond",
    week: 2,
    kind: "boss",
    fresh: true,
    skills: ["expressions", "conditions", "functions", "events"],
    prerequisites: ["q09"],
    objective: "Combine a calculation, a condition and a click response.",
    lesson:
      "Start with one piece at a time: make the calculation return a value; make the condition choose a message; connect the button. Run after each change. These checks also change the stock input to check the other branch. Your explanation and bug diagnosis stay separate from automatic behavior checks.",
    example:
      'function chooseLabel(stock) {\n  if (stock > 0) { return "Ready"; }\n  return "Unavailable";\n}',
    prediction: "With stock = 0, should clicking show a total or Unavailable?",
    predictionAnswer: "Unavailable.",
    exercise:
      'Write calculateTotal(price, quantity). Write messageFor(stock) to return "Demo total: " + calculateTotal(70, 2) when stock > 0, otherwise "Unavailable". Make showCard call messageFor(2) and connect it to a click.',
    changedRequirement:
      "Change the quantity from 2 to 3 inside messageFor. Final click output must be Demo total: 210. Keep messageFor(0) returning Unavailable.",
    bug: 'Why does button.addEventListener("click", showCard()) run too early? What should you pass instead?',
    starter: code(
      card,
      'function calculateTotal(price, quantity) {\n  return 0;\n}\nfunction messageFor(stock) {\n  return "Unavailable";\n}\nfunction showCard() {\n  document.querySelector("#output").textContent = messageFor(2);\n}\nconst button = document.querySelector("#action");\n',
    ),
    solution: code(
      card,
      'function calculateTotal(price, quantity) {\n  return price * quantity;\n}\nfunction messageFor(stock) {\n  if (stock > 0) { return "Demo total: " + calculateTotal(70, 3); }\n  return "Unavailable";\n}\nfunction showCard() {\n  document.querySelector("#output").textContent = messageFor(2);\n}\ndocument.querySelector("#action").addEventListener("click", showCard);',
    ),
    checks: [
      fn("fn-a", "calculateTotal", [20, 4], 80),
      {
        id: "available",
        kind: "function",
        fn: "messageFor",
        args: [2],
        expected: "Demo total: 210",
        label: "Available branch returns total 210",
      },
      {
        id: "empty",
        kind: "function",
        fn: "messageFor",
        args: [0],
        expected: "Unavailable",
        label: "Unavailable branch works",
      },
      click("Demo total: 210"),
    ],
  },
  {
    ...common,
    id: "opt01-repair",
    title: "Optional · Repair a missing label",
    week: 1,
    kind: "optional",
    skills: ["html", "values"],
    prerequisites: ["q04"],
    objective: "Find why a visible value never updates.",
    lesson:
      "An error is information. querySelector uses # before an id. Read the error output and compare the selector with the HTML id. Missing elements cause a null value, which cannot receive textContent.",
    example:
      '<p id="output">Ready</p>\ndocument.querySelector("#output").textContent = "Hello";',
    prediction: "What might happen if a selector cannot find its element?",
    predictionAnswer:
      "It returns null and the following textContent assignment errors.",
    exercise:
      "Fix the selector so the preview displays Demo price: 95. Record the bug in the journal.",
    starter: code(
      card,
      'let price = 95;\ndocument.querySelector("output").textContent = "Demo price: " + price;',
    ),
    solution: code(
      card,
      'let price = 95;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
    ),
    checks: [
      text(
        "fixed",
        "#output",
        "Demo price: 95",
        "Selector repair updates the price",
      ),
    ],
  },
  {
    ...common,
    id: "opt01-recall",
    title: "Optional · A fresh name and style",
    week: 1,
    kind: "optional",
    fresh: true,
    skills: ["html", "css"],
    prerequisites: ["q03"],
    objective: "Recall HTML and CSS with a different card.",
    lesson:
      "Try from memory first. It is fine to use a hint; that records With hints rather than Independent. An explanation is recorded as your own assessment, not automatically graded.",
    example: "A heading holds a name. A CSS rule changes its appearance.",
    prediction: "Where do you edit a name? Where do you edit padding?",
    predictionAnswer: "HTML for the name; CSS for padding.",
    exercise:
      "Create Demo Bag as the heading and give the card 32px padding. Explain both edits.",
    starter: code(),
    solution: code(
      card.replace("Demo Board", "Demo Bag"),
      "",
      css.replace("padding: 16px", "padding: 32px"),
    ),
    checks: [
      text("name", "#name", "Demo Bag", "Heading is Demo Bag"),
      {
        id: "padding",
        kind: "css",
        selector: ".card",
        property: "padding-top",
        expected: "32px",
        label: "Card padding is 32px",
      },
    ],
  },
  {
    ...common,
    id: "opt02-repair",
    title: "Optional · Repair an early click",
    week: 2,
    kind: "optional",
    skills: ["functions", "events"],
    prerequisites: ["q09"],
    objective: "Diagnose a function called while registering a click.",
    lesson:
      "showTotal() calls the function now. showTotal refers to the function so it can run later. The check verifies that the output starts as Ready before it triggers a click.",
    example: 'button.addEventListener("click", showTotal);',
    prediction:
      "What is the difference between showTotal and showTotal() here?",
    predictionAnswer:
      "The first passes the function; the second calls it immediately.",
    exercise:
      "Fix the listener. Show Ready on load and Demo total: 240 after a click.",
    starter: code(
      card,
      'function showTotal() { document.querySelector("#output").textContent = "Demo total: 240"; }\ndocument.querySelector("#action").addEventListener("click", showTotal());',
    ),
    solution: code(
      card,
      'function showTotal() { document.querySelector("#output").textContent = "Demo total: 240"; }\ndocument.querySelector("#action").addEventListener("click", showTotal);',
    ),
    checks: [click("Demo total: 240")],
  },
  {
    ...common,
    id: "opt02-recall",
    title: "Optional · Calculate something new",
    week: 2,
    kind: "optional",
    fresh: true,
    skills: ["expressions", "functions"],
    prerequisites: ["q08"],
    objective: "Return a new total using your function inputs.",
    lesson:
      "This is a fresh input variation. Start from the supplied signature and use both parameters. Checks call your function with more than one pair of values.",
    example:
      "return gives the calculated value back to whoever called the function.",
    prediction: "What should totalFor(90, 4) return?",
    predictionAnswer: "360",
    exercise:
      "Write totalFor(price, quantity) and display Demo total: 360 for totalFor(90, 4).",
    starter: code(
      card,
      'function totalFor(price, quantity) { return 0; }\ndocument.querySelector("#output").textContent = "Demo total: " + totalFor(90, 4);',
    ),
    solution: code(
      card,
      'function totalFor(price, quantity) { return price * quantity; }\ndocument.querySelector("#output").textContent = "Demo total: " + totalFor(90, 4);',
    ),
    checks: [
      fn("a", "totalFor", [11, 3], 33),
      fn("b", "totalFor", [90, 4], 360),
      text("total", "#output", "Demo total: 360", "New total is 360"),
    ],
  },
  {
    ...common,
    id: "review01",
    title: "Review · A card from memory",
    week: 1,
    kind: "review",
    fresh: true,
    skills: ["roles", "html", "css", "values"],
    prerequisites: ["boss01"],
    objective: "Recall a heading, spacing and value with fresh requirements.",
    lesson:
      "A review helps find what survived a gap. Try before opening hints. If this feels difficult, record the gap and schedule more practice. Past achievements and XP stay intact.",
    example:
      "Use HTML for the heading, CSS for spacing, and the price variable for the displayed value.",
    prediction: "Would changing padding change the product name?",
    predictionAnswer: "No. Padding affects spacing.",
    exercise:
      "Make the heading Demo Rope, use 28px card padding, and display Demo price: 65.",
    starter: code(
      card,
      'let price = 10;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
    ),
    solution: code(
      card.replace("Demo Board", "Demo Rope"),
      'let price = 65;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
      css.replace("padding: 16px", "padding: 28px"),
    ),
    checks: [
      text("name", "#name", "Demo Rope", "New heading is Demo Rope"),
      {
        id: "padding",
        kind: "css",
        selector: ".card",
        property: "padding-top",
        expected: "28px",
        label: "New padding is 28px",
      },
      text("price", "#output", "Demo price: 65", "New price is 65"),
    ],
  },
  {
    ...common,
    id: "review02",
    title: "Review · A new click calculation",
    week: 2,
    kind: "review",
    fresh: true,
    skills: ["expressions", "conditions", "functions", "events"],
    prerequisites: ["boss02"],
    objective: "Recall a calculation and both condition branches.",
    lesson:
      "Work through the function input, returned value and event in that order. A later independent success can support Retained evidence after the configured gap. The text explanation is still self-assessed or manually coach-reviewed.",
    example:
      "A click calls a function. That function chooses a message from its input.",
    prediction: "For zero stock, should the total appear?",
    predictionAnswer: "No. Unavailable should appear.",
    exercise:
      "Write labelFor(stock): with stock > 0 return Demo total: 180 (45 * 4); otherwise return Unavailable. Connect the button to show labelFor(1).",
    starter: code(
      card,
      'function labelFor(stock) { return "Unavailable"; }\nfunction show() { document.querySelector("#output").textContent = labelFor(1); }',
    ),
    solution: code(
      card,
      'function labelFor(stock) {\n  if (stock > 0) { return "Demo total: " + (45 * 4); }\n  return "Unavailable";\n}\nfunction show() { document.querySelector("#output").textContent = labelFor(1); }\ndocument.querySelector("#action").addEventListener("click", show);',
    ),
    checks: [
      {
        id: "one",
        kind: "function",
        fn: "labelFor",
        args: [1],
        expected: "Demo total: 180",
        label: "Positive stock gives 180",
      },
      {
        id: "zero",
        kind: "function",
        fn: "labelFor",
        args: [0],
        expected: "Unavailable",
        label: "Zero stock is unavailable",
      },
      click("Demo total: 180"),
    ],
  },
];
const boss1 = quests.find((q) => q.id === "boss01")!;
const boss2 = quests.find((q) => q.id === "boss02")!;
quests.push({
  ...boss1,
  id: "boss01-fresh",
  title: "Boss variation · A different product",
  kind: "variation",
  prerequisites: ["boss01"],
  exercise:
    "Create Demo Bag, set 32px padding, and display Demo price: 175. Explain each change.",
  changedRequirement:
    "The final requested price changes to 185. Use 185 before submitting.",
  starter: code(
    card,
    'let price = 50;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
  ),
  solution: code(
    card.replace("Demo Board", "Demo Bag"),
    'let price = 185;\ndocument.querySelector("#output").textContent = "Demo price: " + price;',
    css.replace("padding: 16px", "padding: 32px"),
  ),
  checks: [
    text("name", "#name", "Demo Bag", "Heading is Demo Bag"),
    {
      id: "padding",
      kind: "css",
      selector: ".card",
      property: "padding-top",
      expected: "32px",
      label: "Padding is 32px",
    },
    text("price", "#output", "Demo price: 185", "Changed price is 185"),
  ],
});
quests.push({
  ...boss2,
  id: "boss02-fresh",
  title: "Boss variation · A different interaction",
  kind: "variation",
  prerequisites: ["boss02"],
  exercise:
    "Write calculateTotal and messageFor. With positive stock, messageFor returns Demo total: 160 (40 * 4); with zero stock it returns Unavailable. Connect a click using messageFor(3).",
  changedRequirement: "Change quantity to 5. Final total is 200.",
  solution: code(
    card,
    'function calculateTotal(price, quantity) { return price * quantity; }\nfunction messageFor(stock) {\n  if (stock > 0) { return "Demo total: " + calculateTotal(40, 5); }\n  return "Unavailable";\n}\nfunction showCard() { document.querySelector("#output").textContent = messageFor(3); }\ndocument.querySelector("#action").addEventListener("click", showCard);',
  ),
  checks: [
    fn("fn-a", "calculateTotal", [20, 4], 80),
    {
      id: "available",
      kind: "function",
      fn: "messageFor",
      args: [3],
      expected: "Demo total: 200",
      label: "Changed total is 200",
    },
    {
      id: "empty",
      kind: "function",
      fn: "messageFor",
      args: [0],
      expected: "Unavailable",
      label: "Zero stock is unavailable",
    },
    click("Demo total: 200"),
  ],
});
quests.push(...week3Quests);
quests.push(...week4Quests);
quests.push(...computingQuests);
const specificHints: Record<string, string[]> = {
  q02: [
    "The name lives in h2; the description lives in p.",
    "Keep the id attributes and tags; change only the words inside them.",
    'Use <h2 id="name">Demo Vest</h2> and <p id="description">A fictional vest for practice.</p>.',
  ],
  q03: [
    "Open CSS. Find h2 and .card.",
    "Change color in the h2 rule and padding in the .card rule.",
    "Use h2 { color: blue; } and .card { padding: 24px; }. Other existing properties can stay.",
  ],
  q04: [
    "Open JavaScript and find the first line.",
    "The number after let price = is the value to change.",
    "Change the first line to let price = 150; and keep the supplied display line.",
  ],
  boss01: [
    "Work on the heading, then spacing, then price. Run after each.",
    "The heading is #name, spacing is .card padding, and the displayed value comes from price.",
    "Use Demo Helmet as the heading, 24px padding in .card, and let price = 135; for the final requirement.",
  ],
  q06: [
    "Look at price and quantity before changing total.",
    "Use numeric values 125 and 3; * multiplies them.",
    'const total = price * quantity; calculates 375. Keep "Demo total: " + total in the display line.',
  ],
  q07: [
    "Look at the stock value and the if comparison.",
    "Zero is not greater than zero, so the else block should run.",
    'Use const stock = 0; and if (stock > 0). The else block assigns message = "Unavailable".',
  ],
  q08: [
    "The function must return something calculated from both inputs.",
    "Use multiplication between price and quantity; do not hard-code one test total.",
    "Inside calculateTotal, write return price * quantity; before the closing brace.",
  ],
  q09: [
    "The function already works. Your job is to connect it to the button.",
    'Use button.addEventListener with the event name "click" and the function name showTotal.',
    'Add button.addEventListener("click", showTotal); without parentheses after showTotal.',
  ],
  boss02: [
    "First calculate, then choose a message, then connect the button.",
    "calculateTotal returns price * quantity. messageFor uses if (stock > 0) to choose the total.",
    'The positive branch returns "Demo total: " + calculateTotal(70, 3). Otherwise return "Unavailable". Register showCard as the click function.',
  ],
  "opt01-repair": [
    "Read the selector inside querySelector.",
    'The HTML uses id="output"; an id selector starts with #.',
    'Change querySelector("output") to querySelector("#output").',
  ],
  "opt01-recall": [
    "One edit is in HTML and one is in CSS.",
    "Change the words inside #name and padding inside .card.",
    "Use Demo Bag for the heading and .card { padding: 32px; } for the spacing.",
  ],
  "opt02-repair": [
    "Does the function run while the listener is being registered?",
    "A function name refers to it; parentheses call it now.",
    'Remove the parentheses from showTotal() in the listener: addEventListener("click", showTotal).',
  ],
  "opt02-recall": [
    "Use both parameters inside totalFor.",
    "Return price multiplied by quantity; the supplied display calls your function.",
    "Use return price * quantity; so totalFor(90, 4) returns 360.",
  ],
  review01: [
    "Recall which file controls each requested result.",
    "HTML controls Demo Rope, .card padding controls 28px, and price controls 65.",
    "Use Demo Rope in #name, padding: 28px in .card, and let price = 65; in JavaScript.",
  ],
  review02: [
    "Work through labelFor before connecting the button.",
    "With positive stock return the calculated message; otherwise return Unavailable.",
    'Inside labelFor, if (stock > 0) return "Demo total: " + (45 * 4); then return "Unavailable". Register show as the click handler.',
  ],
  "boss01-fresh": [
    "There are three edits across HTML, CSS and JavaScript.",
    "Use #name for Demo Bag, .card for spacing, and price for the displayed number.",
    "The final requirements are Demo Bag, padding: 32px, and let price = 185;. Explain why each changes its result.",
  ],
  "boss02-fresh": [
    "Reuse the calculation → condition → click pattern with new inputs.",
    "The positive branch now uses price 40 and final quantity 5. The zero branch is unchanged.",
    "Use calculateTotal(40, 5) in the positive branch; connect showCard without calling it immediately.",
  ],
};
for (const quest of quests)
  if (specificHints[quest.id]) quest.hints = specificHints[quest.id];
export const questById = (id: string) => quests.find((q) => q.id === id);
export function validateCurriculum(content: Quest[] = quests) {
  const ids = new Set(content.map((q) => q.id));
  if (ids.size !== content.length) throw Error("Duplicate quest ID");
  const skillIds = new Set(skills.map((s) => s.id));
  for (const q of content) {
    if (
      !/^[a-z0-9-]+$/.test(q.id) ||
      !q.objective ||
      !q.lesson ||
      !q.prediction ||
      !q.reflection ||
      q.hints.length < 3 ||
      !q.checks.length ||
      !q.starter.html ||
      !q.solution.html
    )
      throw Error(`Incomplete quest ${q.id}`);
    if (
      q.skills.some((s) => !skillIds.has(s)) ||
      q.prerequisites.some((p) => !ids.has(p)) ||
      (q.gate && !ids.has(q.gate))
    )
      throw Error(`Unknown reference ${q.id}`);
    if (new Set(q.checks.map((c) => c.id)).size !== q.checks.length)
      throw Error(`Duplicate check ${q.id}`);
    const guide = lessonGuides[q.id];
    if (
      !guide?.introduction.trim() ||
      !guide.terms.length ||
      !guide.walkthrough.length ||
      guide.steps.length < 3 ||
      !guide.editTabs.length ||
      !guide.success.trim() ||
      !guide.reflectionStarter.trim() ||
      (q.bug && !guide.bugHelp?.trim()) ||
      guide.terms.some((term) => !term.term.trim() || !term.meaning.trim()) ||
      guide.walkthrough.some(
        (line) => !line.code.trim() || !line.meaning.trim(),
      ) ||
      guide.steps.some(
        (step) =>
          !step.instruction.trim() ||
          (step.tab && !guide.editTabs.includes(step.tab)),
      )
    )
      throw Error(`Missing beginner teaching guide ${q.id}`);
  }
  const visit = (id: string, path: string[]) => {
    if (path.includes(id)) throw Error("Prerequisite cycle");
    content
      .find((q) => q.id === id)!
      .prerequisites.forEach((p) => visit(p, [...path, id]));
  };
  content.forEach((q) => visit(q.id, []));
}
validateCurriculum();
