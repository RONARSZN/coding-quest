// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  acceptMessage,
  buildPreview,
  instrument,
  sanitizeHTML,
} from "../src/sandbox";
import { quests } from "../src/curriculum";
describe("sandbox boundary and execution guard", () => {
  it("removes HTML execution, navigation and external resource surfaces", () => {
    const html = sanitizeHTML(
      '<script>alert(1)</script><iframe src="/secret"></iframe><a href="https://example.com">link</a><img src="https://example.com/a"><button onclick="alert(1)" id="action">Go</button>',
    );
    expect(html).toBe('<button id="action">Go</button>');
  });
  it("escapes learner closing script/style attempts and applies restrictive CSP", () => {
    const output = buildPreview(
      {
        html: "<p>Safe</p>",
        css: "</style><script>evil()</script>",
        js: 'const text = "</script>";',
      },
      quests[0].checks,
      "run",
    );
    expect(output).toContain("connect-src 'none'");
    expect(output).toContain("form-action 'none'");
    expect(output).toContain("worker-src blob:");
    expect(output).not.toContain("allow-same-origin");
    expect(output).not.toContain("unsafe-eval");
    expect(output).not.toContain("<script>evil");
  });
  it("instruments loops, brace-less loops and recursive functions", () => {
    const output = instrument(
      "while(true) x++; function recurse(){recurse()} const f=x=>x+1;",
    );
    expect(output).toContain("while(true) {__questGuard();x++;}");
    expect(output).toContain("function recurse(){__questGuard();");
    expect(output).toContain("x=>(__questGuard(),x+1)");
  });
  it("actually interrupts infinite loops and recursion", () => {
    const guard = () => {
      throw Error("stopped");
    };
    expect(() =>
      new Function("__questGuard", instrument("while(true){}"))(guard),
    ).toThrow("stopped");
    expect(() =>
      new Function("__questGuard", instrument("function f(){f()} f();"))(guard),
    ).toThrow("stopped");
  });
  it.each([
    'eval("1")',
    'new Function("return 1")',
    'new Worker("x")',
    "async function f() {}",
    'const f=()=>({}).constructor.constructor("return 1")();',
  ])("rejects unsupported dynamic execution %s", (source) => {
    expect(() => instrument(source)).toThrow();
  });
  it("parses every authored starter and solution", () => {
    for (const q of quests) {
      expect(() => instrument(q.starter.js)).not.toThrow();
      expect(() => instrument(q.solution.js)).not.toThrow();
    }
  });
  it("accepts only the active preview source, run ID and check shape", () => {
    const source = window;
    const valid = new MessageEvent("message", {
      source,
      data: {
        type: "quest-result",
        runId: "active",
        results: [
          { id: "heading", label: "Heading", passed: true, detail: "pass" },
        ],
        error: "",
      },
    });
    expect(
      acceptMessage(valid, source, "active", quests[0].checks),
    ).not.toBeNull();
    expect(acceptMessage(valid, null, "active", quests[0].checks)).toBeNull();
    expect(acceptMessage(valid, source, "stale", quests[0].checks)).toBeNull();
    expect(
      acceptMessage(
        new MessageEvent("message", {
          source,
          data: { ...valid.data, results: [{ id: "heading", passed: "yes" }] },
        }),
        source,
        "active",
        quests[0].checks,
      ),
    ).toBeNull();
  });
});
