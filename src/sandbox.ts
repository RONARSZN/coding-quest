import { parse } from "acorn";
import { full } from "acorn-walk";
import MagicString from "magic-string";
import type { Check, Code } from "./types";
export { acceptMessage } from "./preview-message";

export function instrument(source: string, guard = "__questGuard"): string {
  if (source.length > 30000)
    throw Error(
      "JavaScript is limited to 30,000 characters for this beginner workspace.",
    );
  const ast = parse(source, { ecmaVersion: 2022, sourceType: "script" });
  const s = new MagicString(source);
  const guarded = new Set<number>();
  const body = (node: any) => {
    if (guarded.has(node.start)) return;
    guarded.add(node.start);
    if (node.type === "BlockStatement")
      s.appendLeft(node.start + 1, `${guard}();`);
    else {
      s.appendLeft(node.start, `{${guard}();`);
      s.appendLeft(node.end, "}");
    }
  };
  full(ast, (n: any) => {
    if (
      [
        "ImportExpression",
        "AwaitExpression",
        "YieldExpression",
        "WithStatement",
      ].includes(n.type) ||
      n.async ||
      n.generator
    )
      throw Error(
        "Use synchronous beginner JavaScript here. Async, imports and generators are later curriculum.",
      );
    if (
      n.type === "Identifier" &&
      ["eval", "Function", "Worker", "SharedWorker", "importScripts"].includes(
        n.name,
      )
    )
      throw Error(
        "Dynamic code execution and extra workers are unavailable in this exercise sandbox.",
      );
    if (
      n.type === "MemberExpression" &&
      ((!n.computed && n.property.name === "constructor") ||
        (n.computed && n.property.value === "constructor"))
    )
      throw Error(
        "Dynamic constructors are unavailable in this beginner sandbox.",
      );
    if (
      [
        "ForStatement",
        "ForInStatement",
        "ForOfStatement",
        "WhileStatement",
        "DoWhileStatement",
      ].includes(n.type)
    )
      body(n.body);
    if (
      [
        "FunctionDeclaration",
        "FunctionExpression",
        "ArrowFunctionExpression",
      ].includes(n.type)
    ) {
      if (n.body.type === "BlockStatement") body(n.body);
      else {
        s.appendLeft(n.body.start, `(${guard}(),`);
        s.appendLeft(n.body.end, ")");
      }
    }
  });
  return s.toString();
}
export function sanitizeHTML(raw: string): string {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  const allowed = new Set([
    "ARTICLE",
    "SECTION",
    "DIV",
    "SPAN",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "P",
    "BUTTON",
    "STRONG",
    "EM",
    "UL",
    "OL",
    "LI",
    "BR",
    "LABEL",
    "INPUT",
  ]);
  for (const el of [...doc.body.querySelectorAll("*")]) {
    if (!allowed.has(el.tagName)) {
      el.remove();
      continue;
    }
    for (const attr of [...el.attributes])
      if (
        !["id", "class", "type", "aria-label", "value", "disabled"].includes(
          attr.name,
        )
      )
        el.removeAttribute(attr.name);
  }
  return doc.body.innerHTML;
}
const json = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
export function buildPreview(
  code: Code,
  checks: Check[],
  runId: string,
): string {
  const guard = `__g${crypto.randomUUID().replaceAll("-", "")}`;
  const compiled = instrument(code.js, guard);
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const html = sanitizeHTML(code.html);
  const fnChecks = checks.filter((c) => c.kind === "function");
  const exports = fnChecks
    .map((c) => `${json(c.fn)}:typeof ${c.fn}==='function'?${c.fn}:undefined`)
    .join(",");
  const fnWorkerTests = fnChecks
    .map(
      (c) =>
        `{const got=typeof ${c.fn}==='function'?${c.fn}(...${json(c.args || [])}):undefined;output.push({id:${json(c.id)},label:${json(c.label)},passed:got===${json(c.value ?? c.expected)},detail:'Expected '+${json(String(c.value ?? c.expected))}+'; received '+String(got)});}`,
    )
    .join("\n");
  const workerSource = `const output=[];const start=Date.now();let count=0;const ${guard}=()=>{if(++count>25000||Date.now()-start>250)throw Error('Execution stopped: too many steps or time limit.');};const element={textContent:'Ready',addEventListener(){}};const document={querySelector(){return element;}};try{${compiled}\n${fnWorkerTests}\npostMessage({ok:true,output});}catch(error){postMessage({ok:false,error:String(error.message||error)});}`;
  const learnerSource = `(()=>{${compiled}\nwindow[${json(guard + "exports")}]={${exports}};})()`;
  const csp = `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; worker-src blob:; form-action 'none'; base-uri 'none';`;
  const boot = `(()=>{
    const sendNative=parent.postMessage.bind(parent);const dateNow=Date.now.bind(Date);const log=[];let count=0,deadline=dateNow()+500;let finished=false;
    const guard=()=>{if(++count>25000||dateNow()>deadline)throw Error('Execution stopped: too many steps or time limit. Your draft is preserved.');};
    Object.defineProperty(window,${json(guard)},{value:guard,writable:false});
    setInterval(()=>{count=0;deadline=dateNow()+500;},100);
    const send=(results,error='')=>sendNative({type:'quest-result',runId:${json(runId)},results,error},'*');
    window.addEventListener('error',event=>{log.push(String(event.message).slice(0,1000));if(finished)send([],log.join('\\n'));});
    window.addEventListener('unhandledrejection',event=>{log.push(String(event.reason).slice(0,1000));if(finished)send([],log.join('\\n'));});
    console.log=(...args)=>log.push('Console: '+args.map(String).join(' ').slice(0,1000));
    const worker=new Worker(URL.createObjectURL(new Blob([${json(workerSource)}],{type:'text/javascript'})));
    const timeout=setTimeout(()=>{worker.terminate();send([], 'Execution stopped after 900ms in the preflight worker. Your draft is preserved.');},900);
    worker.onerror=event=>{clearTimeout(timeout);worker.terminate();send([], 'JavaScript could not start: '+event.message);};
    worker.onmessage=event=>{
      clearTimeout(timeout);worker.terminate();
      if(!event.data.ok){send([],event.data.error);return;}
      const node=document.createElement('script');node.nonce=${json(nonce)};node.textContent=${json(learnerSource)};document.body.append(node);node.remove();
      const results=[];
      for(const check of ${json(checks)}){
        try{
          let got, passed=false;
          if(check.kind==='function'){
            const f=window[${json(guard + "exports")} ]?.[check.fn];got=typeof f==='function'?f(...check.args):undefined;passed=got===(check.value??check.expected);
          }else{
            const element=document.querySelector(check.selector);if(!element)throw Error('Element '+check.selector+' was not found. Check its id or selector.');
            if(check.kind==='css'){got=getComputedStyle(element).getPropertyValue(check.property).trim();passed=got===check.expected;}
            else if(check.kind==='click'){const output=document.querySelector('#output');const before=output?.textContent.trim();element.click();got=output?.textContent.trim();passed=before===check.initial&&got===check.expected;if(before!==check.initial)got='Before click: '+before+'; after: '+got;}
            else {got=element.textContent.trim().replace(/\\s+/g,' ');passed=got===check.expected;}
          }
          results.push({id:check.id,label:check.label,passed,detail:'Expected '+(check.value??check.expected)+'; received '+String(got)});
        }catch(error){results.push({id:check.id,label:check.label,passed:false,detail:String(error.message||error)});}
      }
      if(log.some(line=>!line.startsWith('Console:')))for(const r of results)r.passed=false;
      finished=true;send(results,log.join('\\n'));delete window[${json(guard + "exports")}];
    };
  })();`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><style>${code.css.replaceAll("<", "\\3c ")}</style></head><body>${html}<script nonce="${nonce}">${boot}</script></body></html>`;
}
