import type { LessonGuide } from "./lesson-guides";

const html = { term: "HTML paragraph", meaning: '<p id="output">2 seats</p> describes a paragraph. <p ...> opens it, </p> closes it, and the words between appear on the page. id="output" is a label for this one piece. You only edit the words.' };
const run = { instruction: "In Practice, choose Run & check. Compare the result and check feedback with your prediction. A mismatch is useful information; edit and try again." };

export const computingGuides: Record<string, LessonGuide> = {
  pre01: {
    introduction: "Start with the job a computer does: it follows instructions using information. No coding knowledge is needed. The surrounding HTML is supplied so you can make one visible change.",
    terms: [
      { term: "Input → instructions → output", meaning: "Input is starting information, such as a guest count. Instructions tell the computer what to do with it. Output is the result, such as seats needed. A program is a set of instructions; a browser is a program that displays web pages." },
      { term: "Data and representation", meaning: "Data is information represented so a computer can work with it. Computers store bits, each a 0 or 1; groups of bits can represent numbers and text. You do not need to write binary for this web path." }, html,
    ],
    walkthrough: [
      { code: "INPUT: 4 guests", meaning: "Start with a known guest count. This is data, not an instruction." },
      { code: "INSTRUCTION: one seat for every guest", meaning: "The rule tells us how to use the input." },
      { code: "OUTPUT: 4 seats", meaning: "Following the rule produces the result. Different input can produce different output." },
      { code: '<p id="output">4 seats</p>', meaning: "This HTML displays a written result. It does not calculate it; JavaScript calculations come later." },
    ],
    editTabs: ["html"],
    steps: [{ tab: "html", instruction: "Find the paragraph labeled output. Keep the surrounding tags and id." }, { tab: "html", instruction: "Read the page: two guests, one seat each. Replace only Write the result here with 2 seats." }, run, { instruction: "In Reflect, explain each part of input → instructions → output. Checks compare visible text; they cannot judge your explanation." }],
    success: "The page shows 2 seats and its text check passes. You can describe why those words match the rule.",
    reflectionStarter: "The input is ___. The instruction is ___. The output is ___. The text check cannot tell whether I ___.",
  },
  pre02: {
    introduction: "Before writing more code, express a task as exact steps. Use one small example to trace the plan and catch mistakes before adding syntax.",
    terms: [
      { term: "Algorithm / pseudocode / trace", meaning: "An algorithm is an ordered method for solving a problem. Pseudocode writes it in plain language rather than a programming language. Tracing means following its steps and tracking each value by hand." },
      { term: "Expected and actual", meaning: "Expected is the result the requirement says should happen. Actual is what your plan or program produces. Compare them with the same input before deciding whether a solution works." },
      { term: "Memory / file / browser storage", meaning: "Working memory holds a program's current values while it runs. A file stores data on a device. This app saves attempts in this browser profile's local storage, separate from a preview's working values. Export JSON in Settings for a portable backup." }, html,
    ],
    walkthrough: [
      { code: "READ guests = 2", meaning: "Get the input first. The word READ is pseudocode here, not a command to paste into JavaScript." },
      { code: "SET seatsPerGuest = 3", meaning: "State the rule's second value explicitly." },
      { code: "CALCULATE total = guests × seatsPerGuest", meaning: "Use both values. Two groups of three seats make six." },
      { code: "SHOW total → 6 seats", meaning: "Present the result so a person can inspect it. Compare it to the expected six seats." },
    ],
    editTabs: ["html"],
    steps: [{ tab: "html", instruction: "Read the ordered list: 3 guests, 2 seats each, then show the result." }, { tab: "html", instruction: "Trace the plan on paper or in your head. Replace 0 seats in the output paragraph with 6 seats." }, run, { instruction: "In Reflect, explain the steps and try a new input of 4 guests. No code calculation is being graded yet." }],
    success: "The page shows 6 seats. You can describe why the same rule would produce 8 seats for 4 guests.",
    reflectionStarter: "First I read ___. Then I ___. Finally I ___. With 4 guests the expected result is ___. My app work is stored in ___; a portable backup is ___.",
  },
};
