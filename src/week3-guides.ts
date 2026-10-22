import type { LessonGuide } from "./lesson-guides";

const array = { term: "Array / index / length", meaning: 'An array is an ordered list: ["Gate", "Cafe"]. An index is a position starting at 0. list[0] reads the first item; list[1] the second. .length counts items, so a two-item list has length 2 and last index 1. Commas separate items.' };
const object = { term: "Object / property / dot", meaning: 'An object groups named values: { price: 35, stock: 3 }. A colon separates a property name from its value; a comma separates properties. item.price reads the price belonging to item. Braces around an object describe data; braces after a function or if group instructions.' };
const fn = { term: "Function input / return", meaning: "A function is a named recipe. Parameters inside ( ) receive inputs when it is called. return sends a result back and immediately ends that call. To work for different inputs, calculate using parameters instead of hard-coding one answer." };
const missing = { term: "Missing selection / undefined / !", meaning: "An array position that does not exist returns undefined: no value. !chosen asks whether a chosen value is absent (false-like). Our supplied records are objects, so this check detects a missing record. Check it before reading chosen.price or chosen.capacity; reading a property of undefined causes an error." };
const integer = { term: "Number.isInteger / !", meaning: 'Number.isInteger(value) checks for a numeric whole number. It returns true for 2, false for 1.5, "2", null and true. ! reverses a true/false answer, so !Number.isInteger(value) asks whether the input fails that check. We reject text; we do not convert it into numbers.' };
const compare = { term: "Comparison / early return", meaning: "< means less than; > means greater than; >= means greater than or equal to. if checks the comparison and runs its braces when true. An early return ends the function before later lines run. Use > stock when equality is allowed." };
const math = { term: "Arithmetic / parentheses", meaning: "* multiplies, + adds numbers, and - subtracts. Parentheses run first; multiplication runs before addition or subtraction. A fee is added once after multiplying price by quantity; a reduction is subtracted once. When + joins text to a calculation, put the calculation in parentheses." };
const event = { term: "Click / page wiring", meaning: 'document.querySelector("#output") finds the output paragraph; .textContent replaces its words. addEventListener("click", showResult) gives the button a function to run later. No () after showResult: those would call it immediately. The click check presses the supplied button automatically.' };
const boundary = { term: "Boundary / reproduce a bug", meaning: "A boundary is where a rule changes: stock 3 allows quantity 3 but rejects 4. Reproduce a bug by choosing inputs that make expected and received results differ. A test that passes for quantity 1 may hide a per-item fee mistake." };
const run = { instruction: "In Practice, choose Run & check. The unchanged starter is incomplete and should fail. Read each expected/received result, make one small change, then run again." };
const explain = { instruction: "In Reflect, explain why each guard or calculation is needed using a valid, invalid and boundary input. Automatic checks do not judge your understanding." };

export const week3Guides: Record<string, LessonGuide> = {
  q11: {
    introduction: "You have used individual variables. Now keep a few related names in order and read the one requested by a function input. A list position starts at zero, not one.",
    terms: [array, fn],
    walkthrough: [
      { code: 'const stops = ["Gate", "Cafe"];', meaning: "Square brackets hold two string values; the comma separates them. const names this list." },
      { code: "stops[0] // Gate", meaning: "Index 0 reads the first item. The brackets here choose from an existing list." },
      { code: "stops[1] // Cafe", meaning: "Index 1 reads the second item. Index and item count are different." },
      { code: "stops.length // 2", meaning: "The dot reads the length property: the number of items." },
      { code: "function stopAt(index) { return stops[index]; }", meaning: "The parameter chooses which position to read; this works for both valid indexes." },
    ],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: "Find names and itemName(index). Keep all three supplied names." }, { tab: "js", instruction: "Replace the fixed position inside itemName with its index input. Keep the supplied display line, which asks for index 1 and names.length." }, run, explain],
    success: "The page shows Second: Demo Bag · Items: 3. Function checks read the first, second and last names correctly.",
    reflectionStarter: "Index 0 means ___. I used ___ inside brackets because ___. The length is ___.",
  },
  q12: {
    introduction: "A list keeps items in order. An object keeps related facts under names. Use the supplied item's price to calculate different quantities.",
    terms: [object, fn, math],
    walkthrough: [
      { code: 'const ticket = { name: "Practice Pass", price: 35 };', meaning: "The braces group two properties. name holds text; price holds a number." },
      { code: "ticket.price // 35", meaning: "The dot reads the named price property from ticket." },
      { code: "function ticketTotal(count) { return ticket.price * count; }", meaning: "Multiply the object's price by the quantity received by the function." },
      { code: "ticketTotal(2) // 70", meaning: "Calling with 2 uses the same object but produces a total for two tickets." },
    ],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: "Read item: price is 120 and stock is 4. This lesson uses quantities 1–4 and does not validate inputs." }, { tab: "js", instruction: "Find costFor(quantity). Change its arithmetic to calculate the price for that quantity. Keep the object and display line." }, run, explain],
    success: "The page shows Demo total: 360. The function also returns 120 for quantity 1 and 480 for quantity 4.",
    reflectionStarter: "item.price reads ___. Multiplying by quantity gives ___. Hard-coding 360 would fail when ___.",
  },
  q13: {
    introduction: "Before doing useful work, a function should reject inputs outside its rules. Learn to return a helpful failure message early, then leave the successful path at the end.",
    terms: [integer, compare, fn, boundary],
    walkthrough: [
      { code: "Number.isInteger(2) // true", meaning: "2 is a number with no fractional part. The built-in check returns true." },
      { code: 'Number.isInteger("2") // false', meaning: "Quotes make text. This exercise rejects text instead of guessing a conversion." },
      { code: 'if (!Number.isInteger(age)) { return "Whole age needed"; }', meaning: "! means not. An invalid type or decimal exits immediately; later age checks do not run." },
      { code: 'if (age < 0) { return "Age cannot be negative"; }', meaning: "Only whole numeric ages reach this comparison. A negative value exits here." },
      { code: 'return "Age OK";', meaning: "If no guard returned, the input meets all the rules." },
    ],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: 'Inside quantityMessage, reject a non-integer with "Use a whole number" first. stock is a supplied nonnegative whole number.' }, { tab: "js", instruction: 'Next reject quantity less than 1 with "Use at least 1", then more than stock with "Not enough stock". Allow quantity equal to stock.' }, { tab: "js", instruction: 'Keep "Quantity OK" as the final return. Keep the display call quantityMessage(6, 5).' }, run, explain],
    success: "The page shows Not enough stock. The checks also cover equal stock, zero, negative, decimal, text, null and boolean quantities; only numeric whole quantities within stock pass.",
    reflectionStarter: "The first guard rejects ___. Equality with stock is ___ because ___. Returning early prevents ___.",
  },
  q14: {
    introduction: "Some bugs survive a single test. Compare one item with two items to see whether a fee is being charged once for the order or repeatedly for each item.",
    terms: [math, boundary, fn],
    walkthrough: [
      { code: "(30 + 5) * 1 // 35", meaning: "The incorrect fee-per-item formula looks right when there is just one ticket." },
      { code: "(30 + 5) * 2 // 70", meaning: "Parentheses add the fee first, then multiply it too. Two fees are charged." },
      { code: "30 * 2 + 5 // 65", meaning: "Multiply only the ticket price, then add one booking fee." },
      { code: "function ticketTotal(rate, count, fee) { return rate * count + fee; }", meaning: "The inputs let you check the same requirement with several different orders." },
    ],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: "Find deliveryTotal. Work out the expected result for price 80, quantity 2 and fee 10: 170." }, { tab: "js", instruction: "Move the fee outside the multiplication. Keep all three parameters; do not replace the expression with 170." }, run, { instruction: "Use the reflection to describe why quantity 1 hides the bug and quantity 2 exposes it. These input ranges are calculation fixtures, not production validation." }],
    success: "The page shows Delivery total: 170. One-item, different-price and zero-fee checks also pass.",
    reflectionStarter: "The bug charged ___ once per ___. Quantity 1 hid it because ___. Quantity 2 exposed it by ___.",
  },
  boss03: {
    introduction: "Combine the ideas you just practiced. First meet the no-fee request, then apply the changed delivery rule. The hidden solution is only one implementation; checks judge the results.",
    terms: [array, object, missing, integer, compare, math, event, boundary],
    walkthrough: [
      { code: 'const classes = [{ name: "Drawing", seats: 3 }];', meaning: "Square brackets hold a list. Its first value is an object with two named properties." },
      { code: "const chosen = classes[index];", meaning: "Choose an object by position. A position outside the list produces undefined." },
      { code: 'if (!chosen) { return "Choose a class"; }', meaning: "Stop before accessing properties when no record was selected." },
      { code: "return chosen.name;", meaning: "It is now safe to read a named property of the supplied object." },
      { code: "let fee = 8; if (people >= 4) { fee = 0; }", meaning: "let allows a changed value; >= includes equality. This different example waives a fee for four or more people." },
      { code: 'button.addEventListener("click", showResult);', meaning: "Pass the function name so the button calls it later. This wiring is supplied in your task." },
    ],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: 'Reject a non-integer index with "Choose a product". Choose products[index] and reject a missing product with the same message before reading .stock or .price.' }, { tab: "js", instruction: 'Reuse the quantity checks: "Use a whole number", "Use at least 1", then "Not enough stock". Valid quantities include equality with stock.' }, { tab: "js", instruction: 'First return product.name + " total: " + price × quantity with no fee. Keep the supplied showResult and click listener.' }, { tab: "js", instruction: "Apply the changed requirement: one fee of 20, waived for quantity >= 3. Final automatic checks use this version. Do not add fees to invalid requests." }, run, { instruction: "The output stays Ready until the click; the click check presses it automatically. Explain the selection guard, each boundary and the changed fee, answer the bug question and confirm the boss rubric." }],
    success: "Clicking shows Demo Cap total: 180. Other checks cover both products, the fee waiver at 3, exact stock, absent/invalid selections and invalid quantities.",
    reflectionStarter: "I check the selection before ___ because ___. Quantity ___ is the fee boundary. The changed rule affected ___.",
    bugHelp: "Trace index 2: products has only indexes 0 and 1. Say what products[2] returns and why reading .price then fails. Compare quantity 1 with 2 to expose a fee multiplied per item.",
  },
  "opt03-repair": {
    introduction: "Repair one boundary without rewriting the entire function. Test below, equal to and above stock so the fix still rejects impossible requests.",
    terms: [compare, boundary, fn],
    walkthrough: [{ code: "requested > remaining", meaning: "True only when the request exceeds availability. Equality is allowed." }, { code: "requested >= remaining", meaning: "True for equality too. This rejects the last available item incorrectly." }, { code: "// remaining = 2: requested 1 and 2 pass; requested 3 fails.", meaning: "These three neighboring inputs show the boundary clearly." }],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: "Find the if comparison in stockMessage. Keep its two inputs and return messages." }, { tab: "js", instruction: "Change only the comparison so ordering exactly all stock is allowed. Quantities are supplied numeric integers 1–5; stocks are 0–5." }, run, explain],
    success: "The page shows Available for quantity 3 and stock 3. Below-stock requests pass; above-stock and empty-stock requests fail with Too many.",
    reflectionStarter: "The old comparison rejected ___ incorrectly. I changed ___ so equality ___. The above-stock test still ___.",
  },
  "opt03-recall": {
    introduction: "Use the same list and property ideas for capacity rather than prices. Read the requirement, recall the pattern, and use the refresher if needed. Explain your own work to record fresh evidence.",
    terms: [array, object, missing, math, fn],
    walkthrough: [{ code: "const room = { capacity: 8, used: 3 };", meaning: "Two named numbers describe the same room." }, { code: "room.capacity - room.used // 5", meaning: "Subtract occupied spaces from total capacity. A full room gives zero, which is a valid answer." }, { code: 'if (!room) { return "Choose a room"; }', meaning: "For a list selection, reject a missing room before reading those properties." }],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: "Read the supplied groups; indexes 0, 1 and 2 have records. Find spacesLeft(index)." }, { tab: "js", instruction: 'Choose groups[index]. Return "Choose a group" if absent, before reading capacity and used.' }, { tab: "js", instruction: "Return capacity minus used for the chosen group. Keep the display wiring. Type validation is outside this recall exercise." }, run, explain],
    success: "The page shows Free spaces: 4. A full group returns 0, another returns 6 and absent positions return Choose a group.",
    reflectionStarter: "The index chooses ___. I subtract ___ from ___. A result of zero means ___. A missing group is handled by ___.",
  },
  "boss03-fresh": {
    introduction: "This is a different reservation requirement after the original checkpoint. There is no delivery fee: use a per-customer limit and subtract one qualifying reduction. Seeing the earlier solution does not solve these changed rules.",
    terms: [array, object, missing, integer, compare, math, event, boundary],
    walkthrough: [{ code: "let reduction = 0;", meaning: "Begin with no subtraction for the order." }, { code: "if (people >= 4) { reduction = 8; }", meaning: "A different example qualifies four or more people for one reduction of 8." }, { code: "rate * people - reduction", meaning: "Calculate the full price then subtract the reduction once, not once per person." }, { code: 'if (people > limit) { return "Limit exceeded"; }', meaning: "A customer limit can reject a request even when enough stock exists. Check it before stock for a predictable message." }],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: 'Choose kits[index] safely: reject non-integer indexes and absent kits with "Choose a kit" before reading properties.' }, { tab: "js", instruction: 'Reject non-integer quantity with "Use a whole number", then values below 1 with "Use at least 1". Initially reject quantities above 4 with "Limit is 4", before checking stock.' }, { tab: "js", instruction: 'Reject quantity above kit.stock with "Not enough stock". For valid requests subtract 15 once if quantity >= 2, otherwise subtract zero. Return the name followed by " total: " and the result; keep click wiring.' }, { tab: "js", instruction: 'Now lower the limit to 3 and change its failure message to "Limit is 3". Final checks use this changed rule. Quantity 3 passes only when stock also permits it.' }, run, { instruction: "Explain why the limit and stock are separate rules and how reduction differs from the earlier fee. Answer the bug question and confirm the rubric. Use no hints or revealed solution for independent evidence." }],
    success: "Clicking shows Practice Stickers total: 75. Quantity 3 gives 120; 4 is rejected by the customer limit. Practice Mug quantity 2 gives 225; quantity 3 exceeds stock.",
    reflectionStarter: "This request differs from the earlier one because ___. I check the customer limit before ___. The reduction is applied ___ time(s).",
    bugHelp: "Trace an absent index before accessing .stock. For two stickers, compare 45 × 2 - 15 with (45 - 15) × 2. Explain which matches a single order reduction.",
  },
  review03: {
    introduction: "Return after your scheduled gap and rebuild the pattern for session bookings. It is fine to use the refresher; hints and solution use remain recorded. Early completion is practice, not automatically retained understanding.",
    terms: [array, object, missing, integer, compare, math, event],
    walkthrough: [{ code: "const workshop = { rate: 40, capacity: 6 };", meaning: "A session now uses rate and capacity instead of product price and stock." }, { code: "40 * 3 - 7 // 113", meaning: "A different booking example subtracts one reduction of 7 from three tickets." }, { code: 'if (!chosen) { return "Choose a workshop"; }', meaning: "The selection guard still belongs before accessing properties, whatever the business context." }],
    editTabs: ["js"],
    steps: [{ tab: "js", instruction: 'In bookingMessage, reject non-integer indexes and absent sessions with "Choose a session" before reading properties.' }, { tab: "js", instruction: 'Reject non-integer quantity with "Use a whole number", less than 1 with "Use at least 1", and above session.capacity with "Not enough seats". Equality with capacity is valid.' }, { tab: "js", instruction: 'Calculate rate × quantity, subtracting 5 once for quantities >= 2. Return "Booked: " plus the calculation in parentheses. Keep the supplied click wiring.' }, run, explain],
    success: "Clicking shows Booked: 185. Checks also cover both sessions, the reduction boundary, full capacity, absent/invalid selections and invalid quantities. Review scheduling continues with your saved gaps.",
    reflectionStarter: "I recalled ___. The session properties are ___. My missing-selection guard prevents ___. The capacity boundary is ___.",
  },
};
