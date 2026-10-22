import type { Check, Code, Quest } from "./types";

const html = '<article class="card"><h2>Fictional event planner</h2><p>Practice data only. No real bookings.</p><p id="output">Ready</p><button id="action">Show plan</button></article>';
const css = 'body { font-family: system-ui; padding: 24px; background: #141917; color: #e0e6dd; } .card { padding: 16px; background: #1c2420; border-radius: 12px; } button { padding: 12px; cursor: pointer; }';
const code = (js: string): Code => ({ html, css, js });
const show = (expression: string) => `\ndocument.querySelector("#output").textContent = ${expression};`;
const wire = (expression: string) => `\nfunction showPlan() { document.querySelector("#output").textContent = ${expression}; }\ndocument.querySelector("#action").addEventListener("click", showPlan);`;
const check = (id: string, fn: string, args: NonNullable<Check["args"]>, expected: string | number): Check => ({
  id, kind: "function", fn, args, ...(typeof expected === "number" ? { value: expected } : { expected }),
  label: `${fn}(${args.map((value) => JSON.stringify(value)).join(", ")}) returns ${JSON.stringify(expected)}`,
});
const output = (expected: string): Check => ({ id: "output", kind: "text", selector: "#output", expected, label: `The page shows ${expected}` });
const click = (expected: string): Check => ({ id: "click", kind: "click", selector: "#action", initial: "Ready", expected, label: `A click changes Ready to ${expected}` });
const base = { version: 1, week: 4, fresh: false, reflection: "Describe the input, the steps and the result. Name a test that could expose a mistake and explain why." };
const counts = "const seats = [3, 0, 2, 5];\n";
const sumSolution = counts + `function firstSeats(count) {
  let total = 0;
  for (let index = 0; index < count; index = index + 1) {
    total = total + seats[index];
  }
  return total;
}`;
const testingSolution = counts + `function availableTotal(count) {
  let total = 0;
  for (let index = 0; index < count; index = index + 1) {
    total = total + seats[index];
  }
  return total;
}`;
const aiSolution = `function canReserve(requested, capacity) {
  if (!Number.isInteger(requested)) { return "Use a whole number"; }
  if (requested < 1) { return "Use at least 1"; }
  if (requested > capacity) { return "Not enough seats"; }
  return "Reservation OK";
}`;
const sessions = 'const sessions = [{ name: "Morning", seats: 3 }, { name: "Evening", seats: 5 }, { name: "Night", seats: 2 }];\n';
const bossSolution = sessions + `function eligibleSeats(minimum) {
  if (!Number.isInteger(minimum)) { return "Choose 1 to 10"; }
  if (minimum < 1) { return "Choose 1 to 10"; }
  if (minimum > 10) { return "Choose 1 to 10"; }
  let total = 0;
  for (let index = 0; index < sessions.length; index = index + 1) {
    if (sessions[index].seats >= minimum) {
      total = total + sessions[index].seats;
    }
  }
  return total;
}` + wire('"Eligible seats: " + eligibleSeats(3)');
const rooms = 'const rooms = [{ seats: 2 }, { seats: 5 }, { seats: 1 }];\n';
const freshSolution = rooms + `function extraSeats(goal) {
  if (!Number.isInteger(goal)) { return "Choose 1 to 10"; }
  if (goal < 1) { return "Choose 1 to 10"; }
  if (goal > 10) { return "Choose 1 to 10"; }
  let total = 0;
  for (let index = 0; index < rooms.length; index = index + 1) {
    if (rooms[index].seats < goal) {
      total = total + (goal - rooms[index].seats);
    }
  }
  return total;
}` + wire('"Extra seats: " + extraSeats(3)');
const reviewSolution = rooms + `function surplusSeats(target) {
  if (!Number.isInteger(target)) { return "Choose 1 to 10"; }
  if (target < 1) { return "Choose 1 to 10"; }
  if (target > 10) { return "Choose 1 to 10"; }
  let total = 0;
  for (let index = 0; index < rooms.length; index = index + 1) {
    if (rooms[index].seats > target) {
      total = total + (rooms[index].seats - target);
    }
  }
  return total;
}` + show('"Surplus seats: " + surplusSeats(3)');

export const week4Quests: Quest[] = [
  {
    ...base, id: "q15", title: "Turn a requirement into steps", kind: "core", skills: ["algorithms", "functions", "testing"], prerequisites: ["boss03"], gate: "boss03",
    objective: "Write down a small contract, trace it and repair code to match it.",
    lesson: "Problem-solving starts before syntax. State the input, the required output and the steps between them. A contract describes accepted inputs and expected behavior. For this exercise, guests and seatsPerGuest are supplied numeric whole numbers from 0 to 6. Your function multiplies them; it does not validate other types. Trace one example by hand before changing the code.",
    example: "INPUT: 2 guests, 3 seats each\nPLAN: multiply guests by seatsPerGuest\nOUTPUT: 6\nfunction seatsNeeded(guests, seatsPerGuest) { return guests * seatsPerGuest; }",
    prediction: "The starter adds its inputs. What will it return for (3, 2), and what does the multiplication requirement expect? Could (2, 2) hide the bug?",
    predictionAnswer: "The starter returns 5; the expected result is 6. (2, 2) returns 4 for both addition and multiplication, so that one case hides the bug.",
    exercise: "Repair planSeats(guests, seatsPerGuest) to follow the multiplication plan. Keep both inputs and the supplied display. Before running, choose an example that distinguishes addition from multiplication.",
    starter: code('function planSeats(guests, seatsPerGuest) { return guests + seatsPerGuest; }' + show('"Seats needed: " + planSeats(3, 2)')),
    solution: code('function planSeats(guests, seatsPerGuest) { return guests * seatsPerGuest; }' + show('"Seats needed: " + planSeats(3, 2)')),
    hints: ["Compare expected and actual for (3, 2): the difference identifies the operation to change.", "A sum adds two counts. This requirement needs equal groups of seats.", "Return guests * seatsPerGuest; then explain why testing only (2, 2) would miss the original mistake."],
    checks: [check("distinguish", "planSeats", [3, 2], 6), check("hidden", "planSeats", [2, 2], 4), check("zero", "planSeats", [0, 4], 0), check("other", "planSeats", [5, 3], 15), output("Seats needed: 6")],
  },
  {
    ...base, id: "q16", title: "Repeat a small step with a loop", kind: "core", skills: ["loops", "arrays", "algorithms"], prerequisites: ["q15"],
    objective: "Trace a for loop and accumulate seats from the first requested items.",
    lesson: "A loop repeats instructions while a condition is true. for has a starting value, a condition and an update. index starts at 0, index < count decides whether another item belongs, and index = index + 1 moves to the next position. An accumulator is a variable holding a running result. Start total at 0 and add each selected seat count. Here count is a supplied numeric whole number from 0 through seats.length, inclusive; invalid count types are outside this exercise.",
    example: "const groups = [2, 4];\nlet total = 0;\nfor (let index = 0; index < groups.length; index = index + 1) {\n  total = total + groups[index];\n}\n// total becomes 2, then 6",
    prediction: "With seats = [3, 0, 2, 5] and count = 3, which indexes run and what are the running totals? What happens when count is 0?",
    predictionAnswer: "Indexes 0, 1 and 2 run. Totals become 3, 3 and 5. count 0 runs no iterations and returns the starting total 0.",
    exercise: "The loop is supplied. Replace the fixed addition of 1 with seats[index] so firstSeats(count) sums the first count items. Keep count in the loop condition.",
    starter: code(counts + 'function firstSeats(count) {\n  let total = 0;\n  for (let index = 0; index < count; index = index + 1) {\n    total = total + 1;\n  }\n  return total;\n}' + show('"First 3 groups: " + firstSeats(3)')),
    solution: code(sumSolution + show('"First 3 groups: " + firstSeats(3)')),
    hints: ["The loop already chooses each position. Read the array at that position instead of adding a fixed 1.", "seats[index] is 3, then 0, then 2 when count is 3.", "Inside the braces use total = total + seats[index];. Return after the loop so every selected item contributes."],
    checks: [check("empty", "firstSeats", [0], 0), check("one", "firstSeats", [1], 3), check("includes-zero", "firstSeats", [2], 3), check("three", "firstSeats", [3], 5), check("all", "firstSeats", [4], 10), output("First 3 groups: 5")],
  },
  {
    ...base, id: "q17", title: "Choose tests that expose a bug", kind: "core", skills: ["testing", "debugging", "loops"], prerequisites: ["q16"],
    objective: "Use normal, empty and end-boundary cases to repair an off-by-one loop.",
    lesson: "A test compares an expected result with the program's actual result for a specific input. Use a normal case, no work (0), and the maximum valid count (4). An off-by-one error repeats one time too many or too few. count says how many items, so the last selected index is count - 1. Reading seats[4] in a four-item list gives undefined; adding it produces NaN, meaning Not a Number. Tests passing for a few inputs do not prove every possible case.",
    example: "const items = [4, 1];\n// For count = 2, valid positions are 0 and 1.\n// index < 2 stops before position 2.\n// Expected total = 5; reading items[2] is a boundary mistake.",
    prediction: "The starter uses index <= count. With count = 0, should it read seats[0]? With count = 4, which extra position does it try to read?",
    predictionAnswer: "No; zero items should return 0 without reading any item. count 4 wrongly includes index 4, beyond the final valid index 3.",
    exercise: "Run the starter once and compare the named checks. Repair only the loop's boundary comparison. Explain why the empty and all-item tests matter; do not change the supplied seats list.",
    starter: code(testingSolution.replace("index < count", "index <= count") + show('"All groups: " + availableTotal(4)')),
    solution: code(testingSolution + show('"All groups: " + availableTotal(4)')),
    hints: ["The requirement selects count items, beginning at index 0.", "Including an index equal to count adds an extra item. Try tracing count 0 on paper.", "Use index < count. The update still adds 1 each time. Explain why <= both breaks empty work and reads beyond the array."],
    checks: [check("empty", "availableTotal", [0], 0), check("normal", "availableTotal", [3], 5), check("all-boundary", "availableTotal", [4], 10), output("All groups: 10")],
  },
  {
    ...base, id: "q18", title: "Review a confident AI suggestion", kind: "core", skills: ["ai-review", "validation", "testing", "debugging"], prerequisites: ["q17"],
    objective: "Read, challenge, repair and explain supplied code instead of trusting its claim.",
    lesson: "AI can suggest code without understanding your exact requirements. Treat a suggestion as a draft. Restate the contract, explain each line, choose tests that might disprove it, then make and recheck a small change. This fictional suggestion claims that comparing requested < capacity is sufficient. Our contract accepts only numeric whole requests from 1 through the supplied capacity, including equality. capacity is a supplied nonnegative whole number. It must reject text, decimals, null, booleans, zero and negatives. No AI service is connected; you are auditing a supplied snippet.",
    example: '// A claim is not a test:\n// "This accepts every valid age"\nfunction oldEnough(age) { return age > 18; }\n// If the rule is age 18 or older, testing age 18 disproves that claim.',
    prediction: 'How does the starter treat (3, 3) and ("2", 3)? Why are both results evidence against its claim?',
    predictionAnswer: 'It rejects the valid exact-capacity request, but accepts text "2" because comparison converts it. Our contract allows equality and rejects text.',
    exercise: 'Repair canReserve(requested, capacity). Use the messages "Use a whole number", "Use at least 1", "Not enough seats" and "Reservation OK". Test the claim against invalid types and the exact-capacity boundary. Explain one thing these checks still do not prove.',
    starter: code('// AI draft: "One comparison handles every input."\nfunction canReserve(requested, capacity) {\n  if (requested < capacity) { return "Reservation OK"; }\n  return "Not enough seats";\n}' + show("canReserve(3, 3)")),
    solution: code(aiSolution + show("canReserve(3, 3)")),
    hints: ["A confident comment is not proof. Check type, lower bound and upper bound separately.", "Number.isInteger rejects decimals and non-number types. Check it before comparisons, then allow equality with capacity.", 'Return "Use a whole number" for !Number.isInteger(requested), "Use at least 1" for requested < 1, and "Not enough seats" for requested > capacity; otherwise return "Reservation OK".'],
    checks: [check("normal", "canReserve", [2, 3], "Reservation OK"), check("equal", "canReserve", [3, 3], "Reservation OK"), check("over", "canReserve", [4, 3], "Not enough seats"), check("zero", "canReserve", [0, 3], "Use at least 1"), check("negative", "canReserve", [-1, 3], "Use at least 1"), check("decimal", "canReserve", [1.5, 3], "Use a whole number"), check("text", "canReserve", ["2", 3], "Use a whole number"), check("null", "canReserve", [null, 3], "Use a whole number"), check("boolean", "canReserve", [true, 3], "Use a whole number"), output("Reservation OK")],
    reflection: "Explain the supplied draft's two wrong assumptions, the checks that exposed them and your repair. Name what you would verify before using this outside practice. Never paste secrets or private business data into an AI prompt.",
  },
  {
    ...base, id: "boss04", title: "Checkpoint · Plan eligible event seats", kind: "boss", fresh: true, skills: ["algorithms", "loops", "testing", "ai-review", "objects", "validation"], prerequisites: ["q18"],
    objective: "Build and explain a fictional planner that sums eligible session seats using a tested loop.",
    lesson: "Integrate the same problem-solving cycle: state the contract, trace one input, implement a small part, test it and explain it. A session is eligible when its seat count meets the requested minimum. The supplied sessions are valid fictional records. minimum must be a numeric whole number from 1 to 10; otherwise return Choose 1 to 10. Your loop visits each session once, adds eligible seats and returns the total after the loop.",
    example: 'const classes = [{ seats: 4 }, { seats: 1 }];\n// With minimum 3, include 4 and skip 1: total 4.\n// Plan: validate → start total → visit each class → include or skip → return.',
    prediction: "For sessions with 3, 5 and 2 seats and minimum 3, which sessions qualify, and what total should be returned? What about minimum 6?",
    predictionAnswer: "3 and 5 qualify, totaling 8. Minimum 6 has no eligible session and returns 0.",
    exercise: "Implement eligibleSeats(minimum) using the supplied sessions. First sum all seats. Then apply the changed requirement. Keep the display and listener; a click should show Eligible seats: 8 for minimum 3.",
    changedRequirement: "Only include sessions with seats greater than OR EQUAL TO minimum. Do not return the number of sessions: return their total seats. Reject minimum outside numeric whole values 1–10 with Choose 1 to 10. The final checks use this rule.",
    bug: "A proposed loop says index <= sessions.length. What happens at the final iteration, and which smaller comparison fixes it? Explain why a passing total for only one minimum cannot establish understanding.",
    starter: code(sessions + 'function eligibleSeats(minimum) {\n  return 0;\n}' + wire('"Eligible seats: " + eligibleSeats(3)')),
    solution: code(bossSolution),
    hints: ["Write your plan first. Validate the minimum, initialize a running total, visit each session and return the total afterward.", "Visit indexes strictly below sessions.length. A session contributes only when its .seats value meets the minimum, including equality.", "Use the prior lessons' integer/lower/upper guards. Inside the loop, if sessions[index].seats >= minimum, add that seats value to total. Return total after the loop."],
    checks: [check("all", "eligibleSeats", [1], 10), check("equal-boundary", "eligibleSeats", [3], 8), check("largest", "eligibleSeats", [5], 5), check("none", "eligibleSeats", [6], 0), check("high-valid", "eligibleSeats", [10], 0), check("zero", "eligibleSeats", [0], "Choose 1 to 10"), check("over", "eligibleSeats", [11], "Choose 1 to 10"), check("decimal", "eligibleSeats", [1.5], "Choose 1 to 10"), check("text", "eligibleSeats", ["3"], "Choose 1 to 10"), check("null", "eligibleSeats", [null], "Choose 1 to 10"), check("boolean", "eligibleSeats", [true], "Choose 1 to 10"), click("Eligible seats: 8")],
    reflection: "Explain the input contract, loop and changed selection rule. Name a normal, invalid, equality and no-match test. State any AI assistance honestly; explanations are assessed by a person.",
  },
  {
    ...base, id: "opt04-repair", title: "Optional · Keep the running total", kind: "optional", skills: ["loops", "debugging", "testing"], prerequisites: ["q16"],
    objective: "Repair an accumulator that forgets earlier iterations.",
    lesson: "An accumulator retains earlier work. total = number replaces the previous total; total = total + number adds the next value to it. A one-iteration case can hide the difference. For this exercise, count is a supplied numeric whole number from 0 through 5. Sum the numbers 1 through count, and return 0 when count is 0.",
    example: "// Add 1, then 2, then 3:\n// running total: 0 → 1 → 3 → 6\n// replacing instead would leave 3",
    prediction: "For count 3, does replacing total with each number leave 3 or 6? Why can count 1 hide the mistake?",
    predictionAnswer: "It leaves 3. With only one number, replacing and adding both produce 1.",
    exercise: "Repair the assignment inside countSlots so it adds number to the running total. Keep the loop's 1 through count inclusive rule; this loop starts at 1, unlike an array index.",
    starter: code('function countSlots(count) {\n  let total = 0;\n  for (let number = 1; number <= count; number = number + 1) {\n    total = number;\n  }\n  return total;\n}' + show('"Slots: " + countSlots(3)')),
    solution: code('function countSlots(count) {\n  let total = 0;\n  for (let number = 1; number <= count; number = number + 1) {\n    total = total + number;\n  }\n  return total;\n}' + show('"Slots: " + countSlots(3)')),
    hints: ["Compare a one-step case with three steps.", "Keep the existing value of total when adding the next number.", "Use total = total + number;. Here <= count is correct because number starts at 1 and represents a number to include, not an array position."],
    checks: [check("empty", "countSlots", [0], 0), check("one-hidden", "countSlots", [1], 1), check("three", "countSlots", [3], 6), check("five", "countSlots", [5], 15), output("Slots: 6")],
  },
  {
    ...base, id: "boss04-fresh", title: "Fresh challenge · Find the seat shortfall", kind: "variation", fresh: true, skills: ["algorithms", "loops", "testing", "validation"], prerequisites: ["boss04"],
    objective: "Transfer loop reasoning to total missing seats rather than total eligible capacity.",
    lesson: "Fresh work changes the problem, not just the labels. Each fictional room should have goal seats. A room already at or above goal needs zero extra; otherwise it needs goal minus its existing seats. Sum those shortfalls. goal must be a numeric whole number 1–10, or return Choose 1 to 10. The supplied room records are valid.",
    example: "// Rooms with 4 and 1 seats, goal 3:\n// First needs 0 extra; second needs 2. Total shortfall = 2.\n// Do not sum the existing seats or count the rooms.",
    prediction: "Rooms have 2, 5 and 1 seats. With goal 3, how many extra seats are needed in each room and in total?",
    predictionAnswer: "1, 0 and 2 extra seats: total 3.",
    exercise: "Implement extraSeats(goal). Use the provided rooms and return the sum of positive shortfalls. Keep the click wiring; the page should show Extra seats: 3 for goal 3.",
    changedRequirement: "Existing capacity above the goal does not cancel another room's shortfall. Count only positive differences, once for each room.",
    bug: "A teammate subtracts goal from every room's seats, including rooms already large enough. How does that differ from the required shortfall? Trace goal 3 to expose the sign and selection mistake.",
    starter: code(rooms + 'function extraSeats(goal) { return 0; }' + wire('"Extra seats: " + extraSeats(3)')),
    solution: code(freshSolution),
    hints: ["Reuse the validation and iteration structure; change what each matching room contributes.", "A room contributes only if room.seats < goal, and its contribution is goal - room.seats.", "Start total at 0, visit indexes below rooms.length, add goal - rooms[index].seats only when seats < goal, then return total."],
    checks: [check("no-shortfall", "extraSeats", [1], 0), check("equal-room", "extraSeats", [2], 1), check("mixed", "extraSeats", [3], 3), check("larger", "extraSeats", [5], 7), check("all-short", "extraSeats", [6], 10), check("zero", "extraSeats", [0], "Choose 1 to 10"), check("too-large", "extraSeats", [11], "Choose 1 to 10"), check("decimal", "extraSeats", [2.5], "Choose 1 to 10"), check("text", "extraSeats", ["3"], "Choose 1 to 10"), check("null", "extraSeats", [null], "Choose 1 to 10"), check("boolean", "extraSeats", [true], "Choose 1 to 10"), click("Extra seats: 3")],
  },
  {
    ...base, id: "review04", title: "Review · Count spare capacity", kind: "review", fresh: true, skills: ["algorithms", "loops", "testing", "validation"], prerequisites: ["boss04"],
    objective: "After a gap, adapt your plan to sum surplus seats above a target.",
    lesson: "A review checks what you can reconstruct after time away. This time the question is spare capacity: for each fictional room above target, add room.seats minus target. Rooms at or below target contribute zero. Accept only numeric whole targets 1–10; otherwise return Choose 1 to 10. Try your own plan first, then use the refresher or hints when useful. Help is recorded without penalty.",
    example: "// Rooms [4 seats, 1 seat], target 3:\n// Surplus is 1 + 0 = 1.\n// This is different from shortfall or total capacity.",
    prediction: "With rooms of 2, 5 and 1 seats and target 3, which room has surplus and how much? What happens when target is 5?",
    predictionAnswer: "Only the 5-seat room has surplus: 2 seats. Target 5 leaves no surplus: 0.",
    exercise: "Write surplusSeats(target), validate its input and sum only positive surplus. Keep the display. Explain how the calculation differs from the checkpoint and fresh challenge.",
    starter: code(rooms + 'function surplusSeats(target) { return 0; }' + show('"Surplus seats: " + surplusSeats(3)')),
    solution: code(reviewSolution),
    hints: ["Write a normal and no-surplus example before editing.", "A room contributes only when its seats > target, and contributes seats - target.", "Validate a numeric integer 1–10, start total at 0, loop below rooms.length, add only the positive differences, then return total."],
    checks: [check("many", "surplusSeats", [1], 5), check("equal", "surplusSeats", [2], 3), check("mixed", "surplusSeats", [3], 2), check("none", "surplusSeats", [5], 0), check("high-valid", "surplusSeats", [10], 0), check("zero", "surplusSeats", [0], "Choose 1 to 10"), check("too-large", "surplusSeats", [11], "Choose 1 to 10"), check("decimal", "surplusSeats", [1.5], "Choose 1 to 10"), check("text", "surplusSeats", ["3"], "Choose 1 to 10"), check("null", "surplusSeats", [null], "Choose 1 to 10"), check("boolean", "surplusSeats", [true], "Choose 1 to 10"), output("Surplus seats: 2")],
  },
];
