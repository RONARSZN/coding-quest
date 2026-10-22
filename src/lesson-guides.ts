import type { Code } from "./types";
import { week3Guides } from "./week3-guides";
import { week4Guides } from "./week4-guides";
import { computingGuides } from "./computing-guides";

type Term = { term: string; meaning: string };
type Line = { code: string; meaning: string };
type Step = { tab?: keyof Code; instruction: string };
export type LessonGuide = {
  introduction: string;
  terms: Term[];
  walkthrough: Line[];
  steps: Step[];
  editTabs: (keyof Code)[];
  success: string;
  reflectionStarter: string;
  bugHelp?: string;
};

const heading: Term = {
  term: "HTML element / tag",
  meaning:
    "An element is a piece of a page. <h2> starts a heading and </h2> ends it. The words between them appear on the page. <p> and </p> surround a paragraph.",
};
const labels: Term = {
  term: "id and class",
  meaning:
    'These are labels inside an HTML opening tag. id="name" identifies one piece; class="card" groups pieces for styling. Keep the supplied labels. #name finds an id; .card finds a class.',
};
const spacing: Term = {
  term: "CSS rule / padding",
  meaning:
    "A CSS rule chooses what to style, then lists settings inside { }. padding is space INSIDE the chosen box, between its edge and its content. px means pixels, a unit of screen distance.",
};
const variable: Term = {
  term: "Variable / value",
  meaning:
    "A variable is a name holding a value. In let price = 100;, price is the name and 100 is the value. = stores the value; it does not ask whether two things are equal. let allows later changes; const prevents assigning a new value to that name during a run. You can still edit its starting number before a new Run.",
};
const strings: Term = {
  term: "String / number",
  meaning:
    'A string is text inside quotes, such as "Hello". A number such as 100 has no quotes and can be used in arithmetic. + adds numbers, but joins text when one of the pieces is a string.',
};
const punctuation: Term = {
  term: "Reading the symbols",
  meaning:
    "; ends an instruction in our JavaScript examples. ( ) hold inputs or a condition. { } group instructions. A dot accesses a feature of something, as in button.addEventListener. // starts a comment: a note the browser does not run.",
};
const display: Term = {
  term: "Finding and updating page text",
  meaning:
    'document means the page. querySelector("#output") finds the piece with id="output". .textContent is that piece\'s plain text. Assigning to it replaces the visible words. This is called DOM wiring: connecting JavaScript to the page.',
};
const condition: Term = {
  term: "Condition / branch",
  meaning:
    "A condition is a question with a true or false answer. stock > 0 asks whether stock is greater than zero. if runs a group of instructions when the answer is true; else runs the other group when false. Each possible path is a branch.",
};
const calculation: Term = {
  term: "Expression / multiply",
  meaning:
    "An expression produces a value. price * quantity multiplies those two numbers; * is the keyboard symbol for multiplication. 40 * 3 produces 120.",
};
const functions: Term = {
  term: "Function / parameter / return",
  meaning:
    "A function is a named recipe of instructions. Parameters are names for its inputs. Calling calculateTotal(40, 3) gives it 40 and 3, in that order. return sends the answer back and ends that call; it does not display the answer by itself.",
};
const events: Term = {
  term: "Event / listener",
  meaning:
    'An event is something that happens, such as a click. A listener waits for it. addEventListener("click", showTotal) tells the button to run showTotal later. showTotal() calls it immediately; showTotal without () hands over the recipe.',
};
const priceLines: Line[] = [
  {
    code: "let price = 100;",
    meaning: "Create the name price and store the number 100 in it.",
  },
  {
    code: 'document.querySelector("#output")',
    meaning:
      'Find the HTML paragraph labeled id="output". The # means “find this id”.',
  },
  {
    code: '.textContent = "Demo price: " + price;',
    meaning:
      'Replace its text with the words "Demo price: " followed by the stored number. With 100, the page shows Demo price: 100.',
  },
];
const functionLines: Line[] = [
  {
    code: "function double(value) {",
    meaning:
      "Define a recipe called double. value is a name for the number someone gives it. The opening brace starts the instructions.",
  },
  {
    code: "  return value * 2;",
    meaning: "Multiply the given number by 2, then send the answer back.",
  },
  { code: "}", meaning: "End the recipe. Defining it does not run it yet." },
  {
    code: "double(4)",
    meaning:
      "Run the recipe with 4. value becomes 4 for this call, so the answer is 8.",
  },
];
const eventLines: Line[] = [
  {
    code: 'const button = document.querySelector("#action");',
    meaning:
      'Find the HTML button with id="action" and store a reference to it under the name button.',
  },
  {
    code: 'button.addEventListener("click", showTotal);',
    meaning:
      "Wait for a click on that button, then run the function named showTotal. Do not put () after the function name on this line.",
  },
];
const cardLines: Line[] = [
  {
    code: '<h2 id="name">Example Bag</h2>',
    meaning:
      "HTML supplies the heading words. Keep its tags and id while editing the name.",
  },
  {
    code: ".card { padding: 20px; }",
    meaning:
      "CSS supplies the inner space for the card. 20px is a distance, not a price.",
  },
  {
    code: "let price = 90;",
    meaning:
      "JavaScript supplies the price value. The provided display line puts it into the page.",
  },
];
const branchLines: Line[] = [
  {
    code: "function chooseLabel(stock) {",
    meaning:
      "Define a recipe that receives the stock number. A function input can change on every call.",
  },
  {
    code: '  if (stock > 0) { return "Ready"; }',
    meaning:
      "If there is any stock, return Ready. return ends this call, so the next return is skipped.",
  },
  {
    code: '  return "Unavailable";',
    meaning:
      "If the earlier condition was false, execution reaches this line and returns Unavailable.",
  },
  {
    code: "}",
    meaning:
      "End the function. For this example, chooseLabel(1) returns Ready and chooseLabel(0) returns Unavailable.",
  },
];
const runStep: Step = {
  instruction:
    "In Practice, choose Run & check. The browser follows your code; compare the preview and check messages with your prediction.",
};

export const lessonGuides: Record<string, LessonGuide> = {
  ...week3Guides,
  ...week4Guides,
  ...computingGuides,
  q01: {
    introduction:
      "Start here, even if you have never seen code. Code is written instructions for a computer. A browser is the app you use to open websites. This exercise changes just two ordinary words inside a ready-made page; you do not need to write a program.",
    terms: [
      {
        term: "HTML → content and structure",
        meaning:
          "HTML tells the browser what is on the page: a heading, a paragraph, a button. Structure means how these pieces are arranged.",
      },
      {
        term: "CSS → appearance",
        meaning:
          "CSS tells the browser how those pieces look: colors, text size and space around them.",
      },
      {
        term: "JavaScript → actions",
        meaning:
          "JavaScript tells the browser what to do, for example changing a message when someone clicks. We will learn it later; leave that tab alone today.",
      },
      heading,
    ],
    walkthrough: [
      {
        code: "<h2>Practice Bag</h2>",
        meaning:
          "<h2> starts a heading. Practice Bag is the visible text. </h2> ends the heading. h2 is just the name of this heading tag; you do not need to memorize it today.",
      },
      {
        code: "h2 { color: blue; }",
        meaning:
          "This CSS example makes h2 headings blue. Today you only need to recognize that CSS controls appearance.",
      },
    ],
    editTabs: ["html"],
    steps: [
      {
        instruction:
        "Read the guide, then write your prediction in Learn before editing. Use ordinary words; this is practice, not an entry test.",
      },
      {
        instruction:
          "Press Run & check once without editing. The preview shows Demo Board. FAIL simply means the requested change has not been made yet.",
      },
      {
        tab: "html",
        instruction:
        'In the code editor, choose the HTML tab. Find <h2 id="name">Demo Board</h2>. Select only the words Demo Board and type Practice Board. Leave everything between < and > unchanged.',
      },
      runStep,
      {
        instruction:
        "Open Reflect. Write what you edited and what appeared, then complete the quest. The other notes are optional.",
      },
    ],
    success:
      "The preview heading says Practice Board and the heading check says PASS. The color and Try it button can stay as they are.",
    reflectionStarter:
      "I changed the words ___ to ___ in HTML. After Run, the heading showed ___.",
  },
  q02: {
    introduction:
      "You already changed words inside a heading in Quest 1. Now use two different pieces of the page: a heading for the product name and a paragraph for its description. No new page or file is needed.",
    terms: [heading, labels],
    walkthrough: [
      {
        code: '<h2 id="name">Practice Helmet</h2>',
        meaning:
          'A heading labeled name shows Practice Helmet. id="name" is a label for the app; it is not visible product text.',
      },
      {
        code: '<p id="description">A fictional helmet for code practice.</p>',
        meaning:
          "A paragraph labeled description shows the sentence between its opening and closing tags.",
      },
    ],
    editTabs: ["html"],
    steps: [
      {
        tab: "html",
        instruction:
          "Find Demo Board inside the h2 heading. Change those words to Demo Vest.",
      },
      {
        tab: "html",
        instruction:
          'Find the paragraph with id="description". Replace only its sentence with A fictional vest for practice. Include the final period.',
      },
      runStep,
      {
        instruction:
          "Check that both the name and description pass, then write which tag held each piece of text in your reflection.",
      },
    ],
    success:
      "The card shows Demo Vest as its heading and A fictional vest for practice. underneath. Both checks pass.",
    reflectionStarter:
      "The h2 heading holds ___. The p paragraph holds ___. I changed their words and saw ___.",
  },
  q03: {
    introduction:
      "Keep the page words as they are. This time you change how the page looks. The CSS tab contains rules that choose a piece of the page and set its appearance.",
    terms: [
      spacing,
      labels,
      {
        term: "Selector / property / value",
        meaning:
          "In h2 { color: blue; }, h2 is the selector (what to style), color is the property (which setting), and blue is the value (the setting you want). : separates the setting from its value; ; ends that setting.",
      },
    ],
    walkthrough: [
      {
        code: "h2 { color: #193e36; }",
        meaning:
          "Choose headings and set their text color to this dark green. #193e36 is a color code; here # belongs to a color value, not an id selector.",
      },
      {
        code: ".card { padding: 16px; }",
        meaning:
          'Choose elements labeled class="card" and put 16 pixels of empty space inside their edges. Your full rule has other settings too; keep them.',
      },
    ],
    editTabs: ["css"],
    steps: [
      {
        tab: "css",
        instruction:
          "Find the h2 rule. Replace its color value #193e36 with blue. Keep color:, the semicolon and the braces.",
      },
      {
        tab: "css",
        instruction:
          "Find the .card rule. Change padding: 16px; to use 24px. There is also body padding; leave that one alone.",
      },
      runStep,
      {
        instruction:
          "Look for a blue heading and more space inside the white card. Explain which setting controlled each result.",
      },
    ],
    success:
      "The heading is blue and the card has 24px of inner space. The color and padding checks both pass.",
    reflectionStarter:
      "The h2 color setting changed ___. The .card padding setting changed ___.",
  },
  q04: {
    introduction:
      "Today you meet JavaScript by changing one number. The longer second line is already supplied. Read its annotated example in Learn; you only need to edit the first line.",
    terms: [variable, strings, display, punctuation],
    walkthrough: priceLines,
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Find let price = 100;. Change only the number 100 to 150, without quotes.",
      },
      {
        tab: "js",
        instruction:
          "Keep the second line as it is. It takes price and displays it in the output paragraph.",
      },
      runStep,
      {
        instruction:
          "Compare your prediction for the starting value with the new message. Explain how changing the stored number changed the page.",
      },
    ],
    success:
      "The output paragraph says Demo price: 150. This number is fictional practice data.",
    reflectionStarter:
      "price is a name holding ___. I changed its number from ___ to ___. The display line showed ___.",
  },
  boss01: {
    introduction:
      "Boss means a checkpoint, not a harder unexplained topic. Combine the three small edits you practiced in Quests 2–4. Take them one at a time. The checklist in Reflect asks you to confirm what you can explain; it does not grade your words automatically.",
    terms: [heading, spacing, variable, display],
    walkthrough: cardLines,
    editTabs: ["html", "css", "js"],
    steps: [
      {
        tab: "html",
        instruction:
          "Change the product heading to Demo Helmet. Keep the name id and heading tags.",
      },
      {
        tab: "css",
        instruction:
          "Find .card and set its padding to 24px. Keep the other style settings.",
      },
      {
        tab: "js",
        instruction:
          "Change the price value from 80 to 120. Run to see this first request. The final price check will not pass yet.",
      },
      {
        tab: "js",
        instruction:
          "Now follow the changed request: change the price to 135. Run again. This final value is what the checks expect.",
      },
      {
        instruction:
          "In Reflect, explain the name, padding and price edits. Read the bug question, write your reasoning, and tick each checkpoint box only when you can honestly confirm it.",
      },
    ],
    success:
      "The heading is Demo Helmet, the card padding is 24px and the final message is Demo price: 135. All checks and the understanding checklist are required to complete this checkpoint.",
    reflectionStarter:
      "HTML changed ___. CSS changed ___. JavaScript changed ___. When the request changed, I updated ___.",
    bugHelp:
      'A bug is a mistake in code. For this question, compare id="output" in HTML with the selector inside querySelector. The # marks an id; without it the browser looks for an element type named output. Explain the difference in your own words.',
  },
  q06: {
    introduction:
      "You can now display one number. Next, let JavaScript calculate a total from two numbers. The starting calculation already works; your task changes the price and quantity.",
    terms: [variable, strings, calculation, display],
    walkthrough: [
      {
        code: "const price = 80;",
        meaning:
          "Store the numeric price 80. const is suitable because this run does not assign a new value to price.",
      },
      {
        code: "const quantity = 2;",
        meaning:
          "Store the number of items: 2. This is a separate named value.",
      },
      {
        code: "const total = price * quantity;",
        meaning: "Multiply 80 by 2 and store the answer 160 as total.",
      },
      {
        code: '"Demo total: " + total',
        meaning:
          "Join a text label with the calculated answer. The supplied display line puts Demo total: 160 into the paragraph.",
      },
    ],
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Set the price number to 125 and quantity to 3. Keep both numbers outside quotes.",
      },
      {
        tab: "js",
        instruction:
          "Keep the total expression as price * quantity. * does the multiplication; you do not need to type the answer into the display line.",
      },
      runStep,
      {
        instruction:
          "Check the answer by hand: 125 × 3 = 375. Explain why the quotes around the message label stay, but the numbers have none.",
      },
    ],
    success:
      "The output says Demo total: 375. It comes from calculating 125 * 3.",
    reflectionStarter:
      "price holds ___ and quantity holds ___. * calculates ___. The message label is text, and total is ___.",
  },
  q07: {
    introduction:
      "A page can choose between two messages. The supplied code asks whether a fictional stock number is greater than zero. Change that number and watch the message follow a different path.",
    terms: [condition, variable, strings, punctuation],
    walkthrough: [
      {
        code: "const stock = 2;\nlet message;",
        meaning:
          "Store stock as 2. Prepare a name message without giving it text yet; the if/else instructions will supply it.",
      },
      {
        code: 'if (stock > 0) { message = "Available"; }',
        meaning:
          "Ask whether 2 is greater than 0. It is, so store Available in message.",
      },
      {
        code: 'else { message = "Unavailable"; }',
        meaning:
          "If the question is false instead, store Unavailable. Only one of these two paths runs.",
      },
      {
        code: 'document.querySelector("#output").textContent = message;',
        meaning:
          "Display whichever message the chosen path stored. This line runs after the choice.",
      },
    ],
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Change const stock = 2; to use 0. The supplied if/else is already complete; keep it.",
      },
      runStep,
      {
        tab: "js",
        instruction:
          "Try stock 2 and run again to see Available. Then return the number to 0 and run once more for the final check.",
      },
      {
        instruction:
          "Explain why zero follows the else path. Zero is equal to zero, but it is not greater than zero.",
      },
    ],
    success:
      "Your final code uses stock 0 and the paragraph says Unavailable. You also observed Available when trying stock 2.",
    reflectionStarter:
      "With stock ___, the question stock > 0 was ___. That made the ___ path display ___.",
  },
  q08: {
    introduction:
      "Instead of writing a calculation again for every price, make a reusable recipe. The starter names that recipe calculateTotal, but it currently returns 0. Replace the calculation inside it.",
    terms: [functions, calculation, punctuation, display],
    walkthrough: functionLines,
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Find calculateTotal(price, quantity). price and quantity are the two input names; keep them and the surrounding braces.",
      },
      {
        tab: "js",
        instruction:
          "Replace the 0 in return 0; with a calculation that multiplies those input names. Use the * symbol as in the lesson.",
      },
      {
        tab: "js",
        instruction:
          "Keep the supplied display line. It calls calculateTotal(60, 3), then displays the answer with Demo total: in front.",
      },
      runStep,
      {
        instruction:
          "Read the extra function checks: the app also calls your recipe with 50, 2 and 30, 4. Explain why a recipe using its inputs works for all three pairs.",
      },
    ],
    success:
      "The page displays Demo total: 180. The same function returns 100 for inputs 50 and 2, and 120 for inputs 30 and 4.",
    reflectionStarter:
      "The inputs are ___ and ___. My function returns ___. When it receives 60 and 3, its answer is ___.",
  },
  q09: {
    introduction:
      "The function showTotal already knows how to update the page. You now tell the button to run that function when clicked. Defining a recipe and deciding when to run it are separate steps.",
    terms: [events, functions, labels, punctuation],
    walkthrough: eventLines,
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Read showTotal above the button line. It displays 100 * 2 when it runs; keep that function unchanged.",
      },
      {
        tab: "js",
        instruction:
          'At the bottom, add the listener shown in the worked example: button.addEventListener("click", showTotal);. Keep showTotal without () on this line.',
      },
      runStep,
      {
        instruction:
          "Run & check automatically clicks once to test the response, so the preview may already show the total. Click Try it yourself too. The check confirms Ready before the click and Demo total: 200 after it.",
      },
    ],
    success:
      "The click check passes: the page starts with Ready and the button changes the message to Demo total: 200.",
    reflectionStarter:
      "showTotal contains the instructions to ___. The listener waits for ___. I passed the function name without () because ___.",
  },
  boss02: {
    introduction:
      "This checkpoint combines only the skills you practiced: a calculation recipe, a true/false choice and a button click. Work on one function at a time. A function can call another function; that simply uses the other recipe to get part of its answer.",
    terms: [functions, condition, events, display],
    walkthrough: branchLines,
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Inside calculateTotal, replace the temporary return 0 with multiplication of its two input names.",
      },
      {
        tab: "js",
        instruction:
          'Inside messageFor, use an if choice like the example. For positive stock, return the text "Demo total: " joined with calculateTotal(70, 2). For zero stock, return "Unavailable".',
      },
      {
        tab: "js",
        instruction:
          "Keep showCard calling messageFor(2). Under the supplied button line, add a click listener that runs showCard later. Use the pattern from Quest 9, without () after showCard.",
      },
      {
        tab: "js",
        instruction:
          "Run to see the first total, 140. Then follow the changed request: use quantity 3 instead of 2 in the calculation inside messageFor. Leave the stock input separate from the quantity.",
      },
      runStep,
      {
        instruction:
          "Explain the calculation, the choice and the click connection. Answer the bug question, then confirm the four understanding boxes honestly.",
      },
    ],
    success:
      "Final checks confirm a reusable calculation, Demo total: 210 for available stock, Unavailable for zero stock and the button response. These are separate checks; fix one at a time.",
    reflectionStarter:
      "calculateTotal does ___. messageFor chooses ___ when ___. Clicking runs ___. I changed the quantity from ___ to ___.",
    bugHelp:
      "Compare a function name with a function call. Parentheses after a function name run it now. The listener needs the function itself so it can run later. Explain what the extra parentheses do and how you would remove the early call.",
  },
  "opt01-repair": {
    introduction:
      "This is a deliberately broken example. You did not cause the error. Practice finding one small mismatch between a JavaScript selector and its HTML label.",
    terms: [
      labels,
      display,
      {
        term: "Bug / null / error",
        meaning:
          "A bug is a coding mistake. null means no element was found here. Trying to set textContent on nothing causes an error message. Read that message as a clue, not a judgment of you.",
      },
    ],
    walkthrough: [
      {
        code: '<p id="output">Ready</p>',
        meaning:
          "The paragraph has an id label named output. A selector for an id needs # before the name.",
      },
      {
        code: 'document.querySelector("#output").textContent = "Hello";',
        meaning:
          "In this working example, the selector finds the paragraph, so its text can become Hello.",
      },
    ],
    editTabs: ["js"],
    steps: [
      {
        instruction:
          "Run the supplied code once. Read the error: the paragraph lookup failed, so the price did not display.",
      },
      {
        tab: "js",
        instruction:
          "Compare the selector string in querySelector with the HTML id. Correct the missing id marker; keep price 95 and the message unchanged.",
      },
      runStep,
      {
        instruction:
        "In Reflect, describe the missing character and why adding it lets the browser find the paragraph.",
      },
    ],
    success: "The error is gone and the output says Demo price: 95.",
    reflectionStarter:
      "The browser could not find ___ because ___. I corrected ___ and the page then showed ___.",
  },
  "opt01-recall": {
    introduction:
      "Practice the two familiar edits with new requirements. The annotated example in Learn is a refresher. Try using what you remember; open a hint if you need more specific help.",
    terms: [heading, spacing, labels],
    walkthrough: cardLines.slice(0, 2),
    editTabs: ["html", "css"],
    steps: [
      {
        tab: "html",
        instruction:
          "Find the product heading and change its words to Demo Bag. Keep its labels and tags.",
      },
      {
        tab: "css",
        instruction:
          "Find the card spacing rule and set its inner space to 32px.",
      },
      runStep,
      {
        instruction:
          "Explain which edit changed the content and which changed the appearance. A plain sentence is enough; you do not have to use technical wording.",
      },
    ],
    success:
      "The heading reads Demo Bag and the card padding is 32px. Both checks pass.",
    reflectionStarter:
      "I changed ___ in HTML and ___ in CSS. These control ___ and ___.",
  },
  "opt02-repair": {
    introduction:
      "The code deliberately runs a function at the wrong time. Practice keeping the message Ready until the user clicks. You only need to remove two characters in the listener line.",
    terms: [events, functions, punctuation],
    walkthrough: eventLines,
    editTabs: ["js"],
    steps: [
      {
        instruction:
          "Run the starter. Notice that the initial-message check fails: the total appeared before the test click.",
      },
      {
        tab: "js",
        instruction:
          "Find the addEventListener line. Compare its function argument with the worked example. Pass the function name so it can run later; keep the function body unchanged.",
      },
      runStep,
      {
        instruction:
          "Record which characters caused the early call and why the corrected line waits for a click.",
      },
    ],
    success:
      "The check sees Ready before the click and Demo total: 240 after it. The automatic check performs the click, so the final preview shows the total.",
    reflectionStarter:
      "The original listener ran ___ immediately because ___. My corrected listener waits for ___.",
  },
  "opt02-recall": {
    introduction:
      "Use the function pattern again with a new name and new inputs. A signature just means the function name and the names inside its parentheses; it is already provided.",
    terms: [functions, calculation, display],
    walkthrough: functionLines,
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Find totalFor(price, quantity). Replace its temporary answer with multiplication of the input names.",
      },
      {
        tab: "js",
        instruction:
          "Leave the supplied call totalFor(90, 4) and display line unchanged.",
      },
      runStep,
      {
        instruction:
          "Check the two tested input pairs. Explain how the same recipe can return a different answer when it receives different numbers.",
      },
    ],
    success:
      "The page says Demo total: 360. The function also calculates 33 for 11 and 3, proving it uses its inputs.",
    reflectionStarter:
      "totalFor receives ___ and ___. It uses those inputs to ___. With 90 and 4 it returns ___.",
  },
  review01: {
    introduction:
      "This review revisits the same three skills after some time away. Forgetting is useful information. Read the refresher and take one edit at a time; you can ask for a hint without losing earned progress.",
    terms: [heading, spacing, variable, display],
    walkthrough: cardLines,
    editTabs: ["html", "css", "js"],
    steps: [
      { tab: "html", instruction: "Set the heading text to Demo Rope." },
      { tab: "css", instruction: "Set the card padding to 28px." },
      {
        tab: "js",
        instruction: "Set the price number to 65. Keep the display wiring.",
      },
      runStep,
      {
        instruction:
          "Explain which part controlled each result. If one part was difficult to recall, write that in your next-step note.",
      },
    ],
    success:
      "The heading says Demo Rope, padding is 28px and the message says Demo price: 65.",
    reflectionStarter:
      "I remembered ___. I needed to think again about ___. The three edits control ___.",
  },
  review02: {
    introduction:
      "Revisit a function, a choice and a click with new numbers. labelFor is simply the name of this activity's message recipe. You do not need a new tool or new programming concept.",
    terms: [functions, condition, events, display],
    walkthrough: branchLines,
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          'Inside labelFor(stock), choose a message based on stock > 0. Positive stock should return "Demo total: " joined with 45 * 4; zero stock should return "Unavailable".',
      },
      {
        tab: "js",
        instruction:
          "Keep the supplied show function. It sends labelFor(1) to the page. Add a listener for the action button that runs show after a click, using the familiar listener pattern.",
      },
      runStep,
      {
        instruction:
          "Read the positive-stock, zero-stock and click checks separately. Explain how the input, return value and displayed message connect.",
      },
    ],
    success:
      "Positive stock gives Demo total: 180; zero stock gives Unavailable. A click displays the positive-stock message.",
    reflectionStarter:
      "labelFor receives ___. For positive stock it returns ___; for zero it returns ___. A click runs ___ to display it.",
  },
  "boss01-fresh": {
    introduction:
      "This is a separate checkpoint with a new card request. It lets you practice after seeing an earlier solution. You are using the same HTML, CSS and variable skills, with different values.",
    terms: [heading, spacing, variable, display],
    walkthrough: cardLines,
    editTabs: ["html", "css", "js"],
    steps: [
      { tab: "html", instruction: "Change the heading text to Demo Bag." },
      { tab: "css", instruction: "Give the card 32px padding." },
      {
        tab: "js",
        instruction:
          "Change price to 175 and run to see the first request. Then follow the changed request: use 185 as the final price and run again.",
      },
      {
        instruction:
          "Explain the three edits and the later price change, answer the bug question, then confirm each understanding box honestly.",
      },
    ],
    success:
      "Demo Bag, 32px card padding and Demo price: 185 are the final results. The earlier price 175 is a practice step, not the final expected value.",
    reflectionStarter:
      "I used HTML for ___, CSS for ___ and JavaScript for ___. The final price changed because ___.",
    bugHelp:
      "The question uses an id lookup. Recall that # before a selector name identifies an id, while a bare name looks for an element type. Compare it with the HTML label and explain the mismatch.",
  },
  "boss02-fresh": {
    introduction:
      "Use the calculation → choice → click pattern on a different request. The supplied functions have the same roles as the earlier checkpoint. Follow the new price, quantity and stock values carefully.",
    terms: [functions, condition, events, display],
    walkthrough: branchLines,
    editTabs: ["js"],
    steps: [
      {
        tab: "js",
        instruction:
          "Make calculateTotal return the multiplication of its two inputs.",
      },
      {
        tab: "js",
        instruction:
          'Make messageFor choose a total for positive stock and "Unavailable" for zero stock. The first request uses price 40 and quantity 4, giving 160.',
      },
      {
        tab: "js",
        instruction:
          "In showCard, use messageFor(3) for the stock input. Connect the supplied button to showCard so it runs after a click.",
      },
      {
        tab: "js",
        instruction:
          "Now change only the calculation quantity from 4 to 5. The final total is 200. Stock and quantity have different jobs; keep the zero-stock path working.",
      },
      runStep,
      {
        instruction:
          "Explain the calculation, message choice, click and changed quantity. Answer the bug question and confirm the understanding checklist.",
      },
    ],
    success:
      "The final positive-stock and click result is Demo total: 200. Zero stock returns Unavailable, and the calculation works with other input pairs.",
    reflectionStarter:
      "The price is ___, quantity is ___ and stock decides ___. Changing quantity affects ___. The button runs ___.",
    bugHelp:
      "Use what you learned about function calls: adding () after a function name runs it immediately. A listener needs a function it can run when the event happens. Explain which form belongs in the listener.",
  },
};
