import type { Check, Code, Quest } from "./types";

const html = '<article class="card"><h2>Week 3 practice</h2><p>Fictional examples only.</p><p id="output">Ready</p><button id="action">Try it</button></article>';
const css = 'body { font-family: system-ui; padding: 24px; background: #141917; color: #e0e6dd; } .card { padding: 16px; background: #1c2420; border-radius: 12px; } button { padding: 12px; cursor: pointer; }';
const code = (js: string): Code => ({ html, css, js });
const show = (expression: string) => `\ndocument.querySelector("#output").textContent = ${expression};`;
const button = (fn: string, call: string) => `\nfunction showResult() { document.querySelector("#output").textContent = ${fn}(${call}); }\ndocument.querySelector("#action").addEventListener("click", showResult);`;
const check = (id: string, fn: string, args: NonNullable<Check["args"]>, expected: number | string): Check => ({
  id, kind: "function", fn, args,
  ...(typeof expected === "number" ? { value: expected } : { expected }),
  label: `${fn}(${args.map((arg) => JSON.stringify(arg)).join(", ")}) returns ${JSON.stringify(expected)}`,
});
const output = (expected: string): Check => ({ id: "output", kind: "text", selector: "#output", expected, label: `The page shows ${expected}` });
const clicked = (expected: string): Check => ({ id: "click", kind: "click", selector: "#action", initial: "Ready", expected, label: `A click changes Ready to ${expected}` });
const base = {
  version: 1, week: 3, fresh: false,
  reflection: "Which line changed the result? Explain a valid input and an input that exposes a mistake.",
};

const quantitySolution = `function quantityMessage(quantity, stock) {
  if (!Number.isInteger(quantity)) { return "Use a whole number"; }
  if (quantity < 1) { return "Use at least 1"; }
  if (quantity > stock) { return "Not enough stock"; }
  return "Quantity OK";
}`;
const products = 'const products = [{ name: "Demo Cap", price: 80, stock: 4 }, { name: "Demo Bag", price: 150, stock: 2 }];\n';
const bossSolution = products + `function orderMessage(index, quantity) {
  if (!Number.isInteger(index)) { return "Choose a product"; }
  const product = products[index];
  if (!product) { return "Choose a product"; }
  if (!Number.isInteger(quantity)) { return "Use a whole number"; }
  if (quantity < 1) { return "Use at least 1"; }
  if (quantity > product.stock) { return "Not enough stock"; }
  let fee = 20;
  if (quantity >= 3) { fee = 0; }
  const total = product.price * quantity + fee;
  return product.name + " total: " + total;
}` + button("orderMessage", "0, 2");
const kits = 'const kits = [{ name: "Practice Stickers", price: 45, stock: 5 }, { name: "Practice Mug", price: 120, stock: 2 }];\n';
const freshSolution = kits + `function reserveMessage(index, quantity) {
  if (!Number.isInteger(index)) { return "Choose a kit"; }
  const kit = kits[index];
  if (!kit) { return "Choose a kit"; }
  if (!Number.isInteger(quantity)) { return "Use a whole number"; }
  if (quantity < 1) { return "Use at least 1"; }
  if (quantity > 3) { return "Limit is 3"; }
  if (quantity > kit.stock) { return "Not enough stock"; }
  let reduction = 0;
  if (quantity >= 2) { reduction = 15; }
  return kit.name + " total: " + (kit.price * quantity - reduction);
}` + button("reserveMessage", "0, 2");
const sessions = 'const sessions = [{ rate: 65, capacity: 3 }, { rate: 95, capacity: 4 }];\n';
const reviewSolution = sessions + `function bookingMessage(index, quantity) {
  if (!Number.isInteger(index)) { return "Choose a session"; }
  const session = sessions[index];
  if (!session) { return "Choose a session"; }
  if (!Number.isInteger(quantity)) { return "Use a whole number"; }
  if (quantity < 1) { return "Use at least 1"; }
  if (quantity > session.capacity) { return "Not enough seats"; }
  let reduction = 0;
  if (quantity >= 2) { reduction = 5; }
  return "Booked: " + (session.rate * quantity - reduction);
}` + button("bookingMessage", "1, 2");

export const week3Quests: Quest[] = [
  {
    ...base, id: "q11", title: "Read a list by position", kind: "core", skills: ["arrays"], prerequisites: ["boss02"], gate: "boss02",
    objective: "Read the second item and the size of a list without hard-coding its answer.",
    lesson: "An array stores an ordered list inside square brackets. Positions start at zero: [0] is the first item, [1] the second. .length counts all items. Our itemName function accepts numeric whole indexes 0, 1 and 2 only; missing selections are taught in the checkpoint.",
    example: 'const stops = ["Gate", "Cafe"];\n// stops[0] is "Gate"; stops[1] is "Cafe"; stops.length is 2.',
    prediction: "What will itemName(1) return after the fix? How many items are in names?",
    predictionAnswer: "Demo Bag; names.length is 3. Index 1 means the second item.",
    exercise: "Make itemName(index) read names at its supplied index. Keep the display wiring: it requests index 1 and the list length.",
    starter: code('const names = ["Demo Cap", "Demo Bag", "Demo Rope"];\nfunction itemName(index) { return names[0]; }' + show('"Second: " + itemName(1) + " · Items: " + names.length')),
    solution: code('const names = ["Demo Cap", "Demo Bag", "Demo Rope"];\nfunction itemName(index) { return names[index]; }' + show('"Second: " + itemName(1) + " · Items: " + names.length')),
    hints: ["Find the brackets in itemName, not the display line.", "A constant 0 always reads the first item; use the function input.", "Replace names[0] with names[index]. .length is already supplied."],
    checks: [check("first", "itemName", [0], "Demo Cap"), check("second", "itemName", [1], "Demo Bag"), check("last", "itemName", [2], "Demo Rope"), output("Second: Demo Bag · Items: 3")],
  },
  {
    ...base, id: "q12", title: "Keep related values together", kind: "core", skills: ["objects", "functions"], prerequisites: ["q11"],
    objective: "Calculate a fictional total using a named object property.",
    lesson: "An object groups named properties inside braces. Each name and value is separated by a colon; commas separate properties. item.price reads the price belonging to item. costFor accepts numeric whole quantities 1–4 in this lesson. Validation comes next; these checks do not promise safe handling of every input.",
    example: 'const ticket = { name: "Practice Pass", price: 35 };\nconst total = ticket.price * 2; // 70',
    prediction: "What should costFor(3) return when item.price is 120?",
    predictionAnswer: "360, because 120 multiplied by 3 is 360.",
    exercise: "Repair costFor(quantity) so it multiplies the object's price by its input. Do not change item or hard-code one total.",
    starter: code('const item = { name: "Demo Bottle", price: 120, stock: 4 };\nfunction costFor(quantity) { return item.price + quantity; }' + show('"Demo total: " + costFor(3)')),
    solution: code('const item = { name: "Demo Bottle", price: 120, stock: 4 };\nfunction costFor(quantity) { return item.price * quantity; }' + show('"Demo total: " + costFor(3)')),
    hints: ["The object is supplied. Find the operator inside costFor.", "item.price is one item's price; quantity says how many.", "Multiply item.price by quantity using *. Keep the return."],
    checks: [check("one", "costFor", [1], 120), check("three", "costFor", [3], 360), check("boundary", "costFor", [4], 480), output("Demo total: 360")],
  },
  {
    ...base, id: "q13", title: "Reject an impossible quantity", kind: "core", skills: ["validation", "conditions", "functions"], prerequisites: ["q12"],
    objective: "Return a clear message for valid, invalid and boundary quantities.",
    lesson: "Validation checks whether an input meets the rules before calculating. Number.isInteger(value) is true only for numeric whole numbers; strings, null and decimals are false. ! reverses true/false. return immediately ends this function. Accept numeric integers from 1 up to stock, including equality; stock is supplied as a nonnegative whole number. Reject other quantity types without converting them.",
    example: 'function ageMessage(age) {\n  if (!Number.isInteger(age)) { return "Whole age needed"; }\n  if (age < 0) { return "Age cannot be negative"; }\n  return "Age OK";\n}',
    prediction: "Which message should quantityMessage(5, 5) return? What about quantityMessage(1.5, 5)?",
    predictionAnswer: "Quantity OK for 5: equality is allowed. Use a whole number for 1.5.",
    exercise: "Add the three early-return checks in this order: non-integer, less than 1, more than stock. Use the exact messages in the guide. The remaining path returns Quantity OK.",
    starter: code('function quantityMessage(quantity, stock) { return "Quantity OK"; }' + show("quantityMessage(6, 5)")),
    solution: code(quantitySolution + show("quantityMessage(6, 5)")),
    hints: ["The starter accepts everything. Add guards before Quantity OK.", "Check the type first, then the lower and upper limits. Equality with stock is valid.", 'Start with if (!Number.isInteger(quantity)) { return "Use a whole number"; }. Then use < 1 and > stock.'],
    checks: [check("valid", "quantityMessage", [2, 5], "Quantity OK"), check("equal", "quantityMessage", [5, 5], "Quantity OK"), check("zero", "quantityMessage", [0, 5], "Use at least 1"), check("negative", "quantityMessage", [-1, 5], "Use at least 1"), check("over", "quantityMessage", [6, 5], "Not enough stock"), check("decimal", "quantityMessage", [1.5, 5], "Use a whole number"), check("string", "quantityMessage", ["2", 5], "Use a whole number"), check("null", "quantityMessage", [null, 5], "Use a whole number"), check("boolean", "quantityMessage", [true, 5], "Use a whole number"), output("Not enough stock")],
  },
  {
    ...base, id: "q14", title: "Find the calculation that hides a bug", kind: "core", skills: ["debugging", "expressions"], prerequisites: ["q13"],
    objective: "Charge a delivery fee once per order and explain why quantity 1 hides the mistake.",
    lesson: "A bug is a mismatch between the requirement and actual behavior. Reproduce it with a small input, compare expected and received values, then change one expression. Parentheses run first. (price + fee) * quantity charges the fee for every item. price * quantity + fee charges it once. Inputs here are numeric whole numbers: price 1–200, quantity 1–5 and fee 0–30; input validation is outside this calculation exercise.",
    example: '// Two tickets at 30 each, one booking fee of 5:\n// (30 + 5) * 2 is 70 (wrong). 30 * 2 + 5 is 65 (right).',
    prediction: "Why do both expressions return 90 for price 80, quantity 1 and fee 10? What changes with quantity 2?",
    predictionAnswer: "Multiplying by 1 hides the bug. For quantity 2, the incorrect expression returns 180; the required result is 170.",
    exercise: "Repair deliveryTotal so fee is added only once. Keep its three inputs. In your reflection, explain which input exposes the bug.",
    starter: code('function deliveryTotal(price, quantity, fee) { return (price + fee) * quantity; }' + show('"Delivery total: " + deliveryTotal(80, 2, 10)')),
    solution: code('function deliveryTotal(price, quantity, fee) { return price * quantity + fee; }' + show('"Delivery total: " + deliveryTotal(80, 2, 10)')),
    hints: ["Compare a quantity of 1 with a quantity of 2.", "The fee belongs to the entire order, so it must stay outside the multiplication.", "Return price * quantity + fee. Explain why the earlier parentheses multiplied the fee too."],
    checks: [check("hidden", "deliveryTotal", [80, 1, 10], 90), check("exposed", "deliveryTotal", [80, 2, 10], 170), check("other", "deliveryTotal", [35, 3, 5], 110), check("no-fee", "deliveryTotal", [60, 4, 0], 240), output("Delivery total: 170")],
  },
  {
    ...base, id: "boss03", title: "Checkpoint: a small fictional order", kind: "boss", fresh: true, skills: ["arrays", "objects", "validation", "debugging", "events", "functions"], prerequisites: ["q14"],
    objective: "Select a product safely, validate quantity, calculate a total and show it after a click.",
    lesson: "An array can hold objects: products[index] chooses an object, then product.price reads its price. An absent position produces undefined (no value). Check the selection before reading properties. Numeric whole indexes 0 and 1 are valid; reject all other indexes and types. Quantity must be a numeric integer from 1 through the selected stock. No strings are converted. This is a bounded learning exercise, not production ordering software.",
    example: 'const classes = [{ name: "Drawing", seats: 3 }];\nfunction className(index) {\n  const chosen = classes[index];\n  if (!chosen) { return "Choose a class"; }\n  return chosen.name;\n}',
    prediction: "What should happen for a missing selection? What should the final orderMessage(0, 2) return?",
    predictionAnswer: "Choose a product before reading its properties. Demo Cap total: 180 after the final fee change.",
    exercise: "Implement orderMessage(index, quantity). Return Choose a product for invalid/missing selection, then the three quantity messages taught in q13. Initially calculate price × quantity with no fee. Keep showResult and its click listener; the automatic check clicks the button.",
    changedRequirement: "Add a fee of 20 once per valid order, waived for quantities of 3 or more. Final checks use this rule. Quantity equal to stock remains valid. Do not charge any fee to invalid requests.",
    bug: "Why does reading products[index].price before checking the selection crash for index 2? Which input exposes a fee charged per item?",
    starter: code(products + 'function orderMessage(index, quantity) { return "Complete the order logic"; }' + button("orderMessage", "0, 2")),
    solution: code(bossSolution),
    hints: ["Choose safely, then validate, then calculate, then display. Keep the supplied button wiring.", "Reject non-integer indexes and missing product before reading product.stock. Reuse quantity guards; set one order fee.", 'After the guards, let fee = 20; if (quantity >= 3) { fee = 0; }. Return product.name + " total: " + the calculated total.'],
    checks: [check("one", "orderMessage", [0, 1], "Demo Cap total: 100"), check("two", "orderMessage", [0, 2], "Demo Cap total: 180"), check("waived", "orderMessage", [0, 3], "Demo Cap total: 240"), check("equal", "orderMessage", [0, 4], "Demo Cap total: 320"), check("second-equal", "orderMessage", [1, 2], "Demo Bag total: 320"), check("missing", "orderMessage", [2, 1], "Choose a product"), check("negative-index", "orderMessage", [-1, 1], "Choose a product"), check("decimal-index", "orderMessage", [0.5, 1], "Choose a product"), check("string-index", "orderMessage", ["0", 1], "Choose a product"), check("null-index", "orderMessage", [null, 1], "Choose a product"), check("zero", "orderMessage", [0, 0], "Use at least 1"), check("negative", "orderMessage", [0, -1], "Use at least 1"), check("over", "orderMessage", [1, 3], "Not enough stock"), check("fraction", "orderMessage", [0, 1.5], "Use a whole number"), check("text", "orderMessage", [0, "2"], "Use a whole number"), check("null", "orderMessage", [0, null], "Use a whole number"), clicked("Demo Cap total: 180")],
  },
  {
    ...base, id: "opt03-repair", title: "Repair the equal-stock boundary", kind: "optional", skills: ["validation", "debugging"], prerequisites: ["q13"],
    objective: "Allow the last available item while still rejecting a request beyond stock.",
    lesson: "A boundary is the point where a decision changes. > means strictly more; >= means more or equal. If all available stock may be ordered, quantity equal to stock must pass. This exercise accepts numeric integer quantities 1–5 and stocks 0–5; compare those values only. Type validation is outside this repair exercise.",
    example: '// Two remaining seats: requesting 2 is allowed. Requesting 3 is not.\n// requested > remaining rejects only requests beyond the boundary.',
    prediction: "What should stockMessage(3, 3) return? Which comparison wrongly rejects it?",
    predictionAnswer: "Available. >= wrongly rejects equality; > rejects only a larger request.",
    exercise: "Change the stock comparison in stockMessage. Keep the two messages and explain the equal-stock case.",
    starter: code('function stockMessage(quantity, stock) {\n  if (quantity >= stock) { return "Too many"; }\n  return "Available";\n}' + show("stockMessage(3, 3)")),
    solution: code('function stockMessage(quantity, stock) {\n  if (quantity > stock) { return "Too many"; }\n  return "Available";\n}' + show("stockMessage(3, 3)")),
    hints: ["Use a request just below, equal to and just above stock.", "The requirement allows equality. The rejection should apply strictly above stock.", "Replace >= with > in the if condition; keep the return messages."],
    checks: [check("below", "stockMessage", [2, 3], "Available"), check("equal", "stockMessage", [3, 3], "Available"), check("above", "stockMessage", [4, 3], "Too many"), check("empty", "stockMessage", [1, 0], "Too many"), output("Available")],
  },
  {
    ...base, id: "opt03-recall", title: "Recall with remaining spaces", kind: "optional", fresh: true, skills: ["arrays", "objects", "functions"], prerequisites: ["q12"],
    objective: "Read a group from a list and calculate its remaining capacity.",
    lesson: "Transfer means using a learned idea in a different problem. A group has capacity and used properties. Remaining spaces = capacity - used; - subtracts. Read groups[index], check for a missing group, then read its properties. Inputs are numeric indexes 0, 1 or 2; any absent position returns Choose a group. Group records are supplied and valid; type validation is not the goal here.",
    example: 'const room = { capacity: 8, used: 3 };\nconst free = room.capacity - room.used; // 5',
    prediction: "How many spaces remain in group 1? What happens when index 3 has no group?",
    predictionAnswer: "Zero: 4 - 4. A missing group returns Choose a group.",
    exercise: "Complete spacesLeft(index) using the supplied groups. Return a number for a valid group and Choose a group before reading missing properties.",
    starter: code('const groups = [{ capacity: 6, used: 2 }, { capacity: 4, used: 4 }, { capacity: 9, used: 3 }];\nfunction spacesLeft(index) { return 0; }' + show('"Free spaces: " + spacesLeft(0)')),
    solution: code('const groups = [{ capacity: 6, used: 2 }, { capacity: 4, used: 4 }, { capacity: 9, used: 3 }];\nfunction spacesLeft(index) {\n  const group = groups[index];\n  if (!group) { return "Choose a group"; }\n  return group.capacity - group.used;\n}' + show('"Free spaces: " + spacesLeft(0)')),
    hints: ["The index chooses one group, not its capacity directly.", "Check the chosen group before subtracting used from capacity.", 'Use const group = groups[index]; then if (!group) return "Choose a group"; before the subtraction.'],
    checks: [check("first", "spacesLeft", [0], 4), check("full", "spacesLeft", [1], 0), check("other", "spacesLeft", [2], 6), check("missing", "spacesLeft", [3], "Choose a group"), check("negative", "spacesLeft", [-1], "Choose a group"), output("Free spaces: 4")],
  },
  {
    ...base, id: "boss03-fresh", title: "Fresh checkpoint: a kit reservation", kind: "variation", fresh: true, skills: ["arrays", "objects", "validation", "debugging", "events", "functions"], prerequisites: ["boss03"],
    objective: "Transfer the order pattern to a per-customer limit and an order reduction.",
    lesson: "This request has different rules from the previous order: a reduction subtracts from a total instead of adding a fee. Numeric whole indexes 0 and 1 select kits; reject other indexes/types before reading properties. Quantity must be a numeric integer from 1 through both the customer limit and stock. Check the customer limit before stock so the failure message is predictable. Do not convert strings.",
    example: '// A one-time reduction of 8 for a qualifying booking:\nlet reduction = 0;\nif (people >= 4) { reduction = 8; }\n// final = rate * people - reduction, once per booking.',
    prediction: "How does an order reduction differ from a delivery fee? What should reserveMessage(0, 2) return?",
    predictionAnswer: "Subtract the reduction once instead of adding a fee. Practice Stickers total: 75 (45 × 2 - 15).",
    exercise: "Implement reserveMessage safely. Invalid selection returns Choose a kit; invalid quantities use the q13 messages. Initially allow at most 4 per customer. More than the limit returns Limit is 4 before testing stock. Subtract 15 once when quantity is at least 2; otherwise subtract zero. Keep the click wiring.",
    changedRequirement: "Lower the customer limit from 4 to 3. Final requests above 3 return Limit is 3 even if stock allows them. There is no delivery fee. This change and the reduction rule assess transfer, not just new data.",
    bug: "Why must a missing kit be checked before reading kit.stock? Why does subtracting 15 per item give the wrong total for quantity 2?",
    starter: code(kits + 'function reserveMessage(index, quantity) { return "Complete the reservation logic"; }' + button("reserveMessage", "0, 2")),
    solution: code(freshSolution),
    hints: ["Write the selection and quantity guards first, then limit, stock and reduction.", "The final customer limit is 3. The reduction is 15 for the order, not each item.", 'Use a reduction initialized to 0, set to 15 when quantity >= 2. Return kit.name + " total: " + (kit.price * quantity - reduction).'],
    checks: [check("one", "reserveMessage", [0, 1], "Practice Stickers total: 45"), check("two", "reserveMessage", [0, 2], "Practice Stickers total: 75"), check("limit", "reserveMessage", [0, 3], "Practice Stickers total: 120"), check("over-limit", "reserveMessage", [0, 4], "Limit is 3"), check("other-equal", "reserveMessage", [1, 2], "Practice Mug total: 225"), check("over-stock", "reserveMessage", [1, 3], "Not enough stock"), check("missing", "reserveMessage", [2, 1], "Choose a kit"), check("negative-index", "reserveMessage", [-1, 1], "Choose a kit"), check("string-index", "reserveMessage", ["0", 1], "Choose a kit"), check("fraction-index", "reserveMessage", [0.5, 1], "Choose a kit"), check("null-index", "reserveMessage", [null, 1], "Choose a kit"), check("zero", "reserveMessage", [0, 0], "Use at least 1"), check("negative", "reserveMessage", [0, -2], "Use at least 1"), check("decimal", "reserveMessage", [0, 2.5], "Use a whole number"), check("string", "reserveMessage", [0, "2"], "Use a whole number"), check("null", "reserveMessage", [0, null], "Use a whole number"), clicked("Practice Stickers total: 75")],
  },
  {
    ...base, id: "review03", title: "Later recall: book a practice session", kind: "review", fresh: true, skills: ["arrays", "objects", "validation", "debugging", "events", "functions"], prerequisites: ["boss03"],
    objective: "Rebuild safe selection, quantity rules and a booking calculation after a gap.",
    lesson: "Try recalling the pattern, then use this refresher if needed. An array chooses a session; a missing session must be rejected before reading its capacity. Numeric whole indexes 0 and 1 are valid. Accept numeric integer quantities from 1 through the chosen capacity. Reject strings and other types. A qualifying reduction belongs to the entire booking. Scheduled review dates use your existing gaps; opening this early is practice, not proof of retention.",
    example: 'const workshop = { rate: 40, capacity: 6 };\n// For 3 people with one reduction of 7: 40 * 3 - 7 is 113.',
    prediction: "What should bookingMessage(1, 2) return? Should quantity equal to capacity pass?",
    predictionAnswer: "Booked: 185 (95 × 2 - 5). Equality with capacity passes.",
    exercise: "Complete bookingMessage(index, quantity). Use Choose a session, Use a whole number, Use at least 1, and Not enough seats for the corresponding failures. Return Booked: followed by rate × quantity, minus a single reduction of 5 for quantities of 2 or more. Keep the automatic click wiring.",
    starter: code(sessions + 'function bookingMessage(index, quantity) { return "Complete the booking logic"; }' + button("bookingMessage", "1, 2")),
    solution: code(reviewSolution),
    hints: ["Recall selection → validation → calculation → display. Check a missing session first.", "Quantity equal to capacity passes. A reduction of 5 applies once when quantity >= 2.", 'Use session.rate * quantity - reduction inside parentheses when joining it to "Booked: ".'],
    checks: [check("one", "bookingMessage", [0, 1], "Booked: 65"), check("two", "bookingMessage", [1, 2], "Booked: 185"), check("first-equal", "bookingMessage", [0, 3], "Booked: 190"), check("last-equal", "bookingMessage", [1, 4], "Booked: 375"), check("over", "bookingMessage", [0, 4], "Not enough seats"), check("missing", "bookingMessage", [2, 1], "Choose a session"), check("negative-index", "bookingMessage", [-1, 1], "Choose a session"), check("fraction-index", "bookingMessage", [0.5, 1], "Choose a session"), check("string-index", "bookingMessage", ["0", 1], "Choose a session"), check("null-index", "bookingMessage", [null, 1], "Choose a session"), check("zero", "bookingMessage", [0, 0], "Use at least 1"), check("negative", "bookingMessage", [0, -1], "Use at least 1"), check("decimal", "bookingMessage", [0, 1.5], "Use a whole number"), check("string", "bookingMessage", [0, "2"], "Use a whole number"), check("null", "bookingMessage", [0, null], "Use a whole number"), clicked("Booked: 185")],
  },
];
