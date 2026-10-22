import type { Code, Quest } from "./types";

const css = "body { font-family: system-ui; padding: 24px; background: #141917; color: #e0e6dd; } article { max-width: 560px; }";
const code = (html: string): Code => ({ html, css, js: "" });
const heading = '<article><h2>A computer follows instructions</h2><p>Input: two guests. Instruction: give each guest one seat.</p><p id="output">Write the result here</p></article>';
const plan = '<article><h2>Plan before code</h2><ol><li>Read the number of guests: 3.</li><li>Multiply by seats per guest: 2.</li><li>Show the result.</li></ol><p id="output">0 seats</p></article>';
const base = {
  version: 1, week: 0, kind: "optional" as const, fresh: false,
  prerequisites: [],
  hints: ["Read the supplied input and instruction before editing.", "The result belongs between the opening and closing paragraph tags labeled output.", "Use the worked example, then explain why this result follows from the input. This counts as guided orientation."],
};

export const computingQuests: Quest[] = [
  {
    ...base, id: "pre01", title: "Input, instructions, output", skills: ["computing", "roles"],
    objective: "Recognize the input, the program's instructions and the result it produces.",
    lesson: "A computer stores information and follows precise instructions. A program is a set of those instructions. Input is the information it starts with; output is the result. A browser is the program showing this page. HTML describes page pieces, CSS their appearance and JavaScript their actions. Today you only change one piece of HTML text.",
    example: 'Input: 4 guests. Rule: 1 seat each. Output: 4 seats.\n<p id="output">4 seats</p>',
    prediction: "With two guests and one seat each, what result should the page show? Which part is input?",
    predictionAnswer: "2 seats. The number of guests, 2, is input; the rule converts it into an output.",
    exercise: "Read the fictional instruction on the page. In HTML, replace Write the result here with 2 seats. Run and explain the input, instruction and output.",
    starter: code(heading), solution: code(heading.replace("Write the result here", "2 seats")),
    checks: [{ id: "result", kind: "text", selector: "#output", expected: "2 seats", label: "The output matches two guests at one seat each" }],
    reflection: "Name the input, instruction and output. What did the automatic check verify, and what did it not judge?",
  },
  {
    ...base, id: "pre02", title: "Make a plan you can trace", skills: ["computing", "algorithms"], prerequisites: ["pre01"],
    objective: "Follow an ordered algorithm and compare its result with an expected answer.",
    lesson: "An algorithm is a precise sequence of steps for solving a problem. Pseudocode expresses those steps in plain language before choosing code syntax. To trace a plan, follow each instruction with a small example and write down what changes. A file is saved data on a device; running a program uses working memory. This app saves your text separately in browser storage. An output appearing does not prove a backup exists.",
    example: "READ guests = 2\nSET seatsPerGuest = 3\nCALCULATE total = guests × seatsPerGuest\nSHOW total → 6 seats",
    prediction: "For the page's input of 3 guests and 2 seats each, what output should the third step show? Could multiplying before reading the input leave you with the wrong information?",
    predictionAnswer: "6 seats. The steps must use the supplied inputs; doing work before getting them can use missing or stale values.",
    exercise: "Trace the three supplied steps. Change only 0 seats to 6 seats in the HTML output. Run, then explain why the calculation follows from the inputs. The HTML check verifies your written result, not your reasoning.",
    starter: code(plan), solution: code(plan.replace("0 seats", "6 seats")),
    checks: [{ id: "trace", kind: "text", selector: "#output", expected: "6 seats", label: "The traced plan produces 6 seats" }],
    reflection: "Describe the three steps in your own words. How would the result change with 4 guests? Where is your Coding Quest work saved?",
  },
];
