import React, { useState, useEffect } from 'react';
import {
  FaPlay, FaTerminal, FaCode, FaTrashAlt, FaRegCopy,
  FaCheckCircle, FaExclamationTriangle, FaSpinner,
  FaChevronRight, FaLightbulb, FaPaperPlane, FaFlask
} from 'react-icons/fa';
import { judge0Api } from '../../../services/judge0Api';
import { toast } from 'react-hot-toast';

const LANGUAGES = [
  { id: 63,  name: 'JavaScript',           icon: 'JS',  ext: 'js',   slug: 'javascript',
    template: '// Write your JavaScript code here\nconsole.log("Hello, World!");' },
  { id: 71,  name: 'Python (3.8.1)',        icon: 'PY',  ext: 'py',   slug: 'python3',
    template: '# Write your Python code here\nprint("Hello, World!")' },
  { id: 54,  name: 'C++ (GCC 9.2.0)',       icon: 'C++', ext: 'cpp',  slug: 'cpp',
    template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { id: 62,  name: 'Java (OpenJDK 13.0.1)', icon: 'JV',  ext: 'java', slug: 'java',
    template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: 50,  name: 'C (GCC 9.2.0)',         icon: 'C',   ext: 'c',    slug: 'c',
    template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' }
];

// ─── Harness generation helpers ────────────────────────────────────────────────

/** Parse function info from JS starter code */
const parseJSFunc = (code) => {
  const m = code.match(/var\s+(\w+)\s*=\s*function\s*\(([^)]*)\)/)
           || code.match(/function\s+(\w+)\s*\(([^)]*)\)/);
  if (!m) return null;
  const name   = m[1];
  const params = (m[2] || '').split(',').map(p => p.trim().split(/[\s:]/)[0]).filter(Boolean);
  return { name, params };
};

/** Parse method info from Python starter code */
const parsePyMethod = (code) => {
  const m = code.match(/def\s+(\w+)\s*\(self(?:,\s*([^)]*))?\)/);
  if (!m) return null;
  const name   = m[1];
  const params = (m[2] || '').split(',').map(p => p.trim().split(':')[0].trim()).filter(Boolean);
  return { name, params };
};

/**
 * Split raw exampleTestcases (newline-separated) into per-case groups
 * by using the number of parameters to know how many lines = 1 case.
 */
const splitRawCases = (raw, numParams) => {
  if (!raw || !numParams) return [];
  const lines = raw.split('\n').filter(l => l.trim() !== '');
  const groups = [];
  for (let i = 0; i < lines.length; i += numParams) {
    groups.push(lines.slice(i, i + numParams));
  }
  return groups;
};

/** Build a complete JS program that embeds the test and prints the result */
const buildJSHarness = (userCode, funcInfo, inputLines) => {
  const { name, params } = funcInfo;
  const assignments = params.map((p, i) => {
    const raw = inputLines[i] ?? 'null';
    return `  const ${p} = JSON.parse(${JSON.stringify(raw)});`;
  }).join('\n');

  return `${userCode}

// ── Auto-generated harness ──
try {
${assignments}
  const __r = ${name}(${params.join(', ')});
  console.log(typeof __r === 'string' ? __r : JSON.stringify(__r));
} catch (__e) {
  process.stderr.write(__e.message);
}`;
};

/** Build a complete Python program that embeds the test and prints the result */
const buildPyHarness = (userCode, methodInfo, inputLines) => {
  const { name, params } = methodInfo;
  const assignments = params.map((p, i) => {
    const raw = inputLines[i] ?? 'null';
    return `    ${p} = json.loads(${JSON.stringify(raw)})`;
  }).join('\n');

  // Inject imports at the top if missing
  let code = userCode;
  if (!code.includes('import json')) code = 'import json\n' + code;
  if (!code.includes('from typing')) code = 'from typing import List, Optional, Dict, Tuple\n' + code;

  return `${code}

# ── Auto-generated harness ──
_s = Solution()
try:
${assignments}
    __r = _s.${name}(${params.join(', ')})
    print(__r if isinstance(__r, str) else json.dumps(__r))
except Exception as __e:
    import sys; sys.stderr.write(str(__e))`;
};

// ─── Normalise output for comparison ──────────────────────────────────────────
const normalise = (s = '') =>
  s.replace(/\r/g, '').trim()
   .replace(/\s*,\s*/g, ',')   // normalise spacing around commas
   .replace(/\[\s+/g, '[').replace(/\s+\]/g, ']') // normalise arrays
   .toLowerCase();

// ─── Execute one submission via Judge0 with polling ───────────────────────────
const executeOne = async (code, langId, stdin = '') => {
  const { token } = await judge0Api.submitCode(code, langId, stdin);
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1500));
    const result = await judge0Api.getSubmission(token);
    if (result.status.id > 2) return result;
  }
  throw new Error('Execution timed out');
};

// ─── Single test case result row ──────────────────────────────────────────────
const TestCaseResult = ({ tc, idx, result }) => {
  const [open, setOpen] = useState(idx === 0);
  const passed = result?.passed;

  const borderCls = result ? (passed ? 'border-emerald-300' : 'border-rose-300') : 'border-slate-200';
  const bgHdr     = result ? (passed ? 'bg-emerald-50' : 'bg-rose-50') : 'bg-slate-50';

  return (
    <div className={`rounded-lg border ${borderCls} overflow-hidden`}>
      <button onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-2.5 ${bgHdr} text-left transition-colors`}>
        <span className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
          Case {idx + 1}
          {result && (
            <span className={`text-[10px] ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {passed ? '✓ Passed' : (result.error ? '✗ Error' : '✗ Wrong Answer')}
            </span>
          )}
          {!result && <span className="text-[10px] text-slate-400">Pending</span>}
        </span>
        <FaChevronRight size={9} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 space-y-3 bg-white border-t border-slate-100">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Input</p>
            <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-2 font-mono text-slate-700 whitespace-pre-wrap break-all">{tc.input}</pre>
          </div>
          {tc.expected !== null && (
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Output</p>
              <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-2 font-mono text-slate-700 whitespace-pre-wrap">{tc.expected}</pre>
            </div>
          )}
          {result?.stdout !== undefined && (
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Output</p>
              <pre className={`text-xs rounded p-2 font-mono whitespace-pre-wrap border ${
                passed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>{result.stdout || '(empty)'}</pre>
            </div>
          )}
          {(result?.compile_output || result?.stderr) && (
            <div>
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Error</p>
              <pre className="text-xs bg-rose-50 border border-rose-200 rounded p-2 font-mono text-rose-700 whitespace-pre-wrap break-all">
                {result.compile_output || result.stderr}
              </pre>
            </div>
          )}
          {result && (
            <p className="text-[9px] text-slate-400 font-mono">
              Runtime: {result.time ? `${result.time}s` : 'N/A'} · Memory: {result.memory ? `${(result.memory/1024).toFixed(1)}MB` : 'N/A'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CodePractice = ({
  initialCode, initialLanguageId, initialStdin,
  testCases = [], rawExampleTestcases = '', codeSnippets = []
}) => {
  const [language, setLanguage]         = useState(LANGUAGES.find(l => l.id === initialLanguageId) || LANGUAGES[0]);
  const [code, setCode]                 = useState(initialCode || language.template);
  const [stdin, setStdin]               = useState(initialStdin || '');
  const [activeTab, setActiveTab]       = useState('run');
  const [runOutput, setRunOutput]       = useState(null);
  const [isRunning, setIsRunning]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [tcResults, setTcResults]       = useState([]);
  const [submitVerdict, setSubmitVerdict] = useState(null);
  const [harnessMode, setHarnessMode]   = useState(false); // true when harness used

  useEffect(() => {
    if (initialCode)       setCode(initialCode);
    if (initialStdin)      setStdin(initialStdin);
    if (initialLanguageId) {
      const found = LANGUAGES.find(l => l.id === initialLanguageId);
      if (found) setLanguage(found);
    }
  }, [initialCode, initialLanguageId, initialStdin]);

  // When language changes, try to load its starter code from codeSnippets
  const handleLanguageChange = (e) => {
    const selected = LANGUAGES.find(l => l.id === parseInt(e.target.value));
    const isDefault = code === language.template;
    // Try to get starter code for new language from problem snippets
    const snippet = codeSnippets.find(s => s.langSlug === selected.slug);
    const newCode  = snippet?.code || selected.template;
    if (isDefault) setCode(newCode);
    setLanguage(selected);
    setRunOutput(null);
    setTcResults([]);
    setSubmitVerdict(null);
  };

  const clearAll = () => {
    const snippet = codeSnippets.find(s => s.langSlug === language.slug);
    setCode(snippet?.code || language.template);
    setStdin(initialStdin || '');
    setRunOutput(null);
    setTcResults([]);
    setSubmitVerdict(null);
    toast.success('Reset to starter code');
  };

  const copyCode = () => { navigator.clipboard.writeText(code); toast.success('Copied'); };

  // ── Build harness for a given test case ─────────────────────────────────────
  const buildHarness = (inputLines) => {
    if (language.id === 63) { // JavaScript
      const info = parseJSFunc(code);
      if (info) return { harness: buildJSHarness(code, info, inputLines), used: true };
    }
    if (language.id === 71) { // Python
      const info = parsePyMethod(code);
      if (info) return { harness: buildPyHarness(code, info, inputLines), used: true };
    }
    // No harness for C/C++/Java — they already use stdin
    return { harness: null, used: false };
  };

  // Get split raw inputs aligned with testCases
  const getRawInputGroups = () => {
    // Determine numParams from the parsed function
    let numParams = 1;
    if (language.id === 63) {
      const info = parseJSFunc(code);
      if (info) numParams = info.params.length;
    } else if (language.id === 71) {
      const info = parsePyMethod(code);
      if (info) numParams = info.params.length;
    }
    return splitRawCases(rawExampleTestcases, numParams);
  };

  // ── Simple Run (custom stdin, no validation) ─────────────────────────────────
  const runCode = async () => {
    if (!code.trim()) { toast.error('Write some code first'); return; }
    setIsRunning(true);
    setRunOutput(null);
    setActiveTab('run');
    try {
      const result = await executeOne(code, language.id, stdin);
      setRunOutput(result);
      if (result.status.id === 3) toast.success('Executed!');
      else toast.error(result.status.description || 'Error');
    } catch {
      toast.error('Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  // ── Submit: run harness against all test cases, compare expected outputs ─────
  const submitCode = async () => {
    if (!code.trim()) { toast.error('Write some code first'); return; }
    if (testCases.length === 0) {
      toast('No test cases available — using Run instead.');
      runCode(); return;
    }

    setIsSubmitting(true);
    setActiveTab('submit');
    setTcResults([]);
    setSubmitVerdict(null);
    setSubmitProgress(0);

    const rawGroups  = getRawInputGroups();
    const results    = [];
    let allPassed    = true;
    let hasError     = false;
    let usedHarness  = false;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      setSubmitProgress(Math.round((i / testCases.length) * 100));

      // Decide: harness or raw stdin?
      const rawLines = rawGroups[i];
      const { harness, used } = rawLines ? buildHarness(rawLines) : { harness: null, used: false };
      if (used) usedHarness = true;

      const codeToRun = harness || code;
      // If harness is used, stdin = '' (input is embedded); otherwise pass tc.input as stdin
      const stdinToUse = harness ? '' : tc.input;

      try {
        const result = await executeOne(codeToRun, language.id, stdinToUse);
        const stdout  = (result.stdout || '').trim();
        const hasExpected = tc.expected !== null && tc.expected !== undefined;
        const passed = hasExpected
          ? normalise(stdout) === normalise(tc.expected)
          : result.status.id === 3;

        if (!passed) allPassed = false;
        if (result.status.id > 3) hasError = true;

        results.push({ ...result, stdout, passed, error: result.status.id > 3 });
      } catch {
        results.push({ passed: false, error: true, stderr: 'Timeout or connection error', stdout: '' });
        allPassed = false;
        hasError  = true;
      }
      setTcResults([...results]);
    }

    setSubmitProgress(100);
    setIsSubmitting(false);
    setHarnessMode(usedHarness);

    if (hasError)       { setSubmitVerdict('error');    toast.error('Runtime/compile error'); }
    else if (allPassed) { setSubmitVerdict('accepted'); toast.success('All test cases passed! 🎉'); }
    else                { setSubmitVerdict('wrong');    toast.error('Some test cases failed'); }
  };

  const VERDICT = {
    accepted: 'bg-emerald-50 border-emerald-300 text-emerald-700',
    wrong:    'bg-rose-50 border-rose-300 text-rose-700',
    error:    'bg-amber-50 border-amber-300 text-amber-700',
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in">

      {/* ── Control Bar ── */}
      <div className="bg-white border border-slate-200 p-3 rounded shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
            <FaCode size={13} />
          </div>
          <select value={language.id} onChange={handleLanguageChange}
            className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer">
            {LANGUAGES.map(lang => <option key={lang.id} value={lang.id}>{lang.name}</option>)}
          </select>
          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-1" />
          <button onClick={copyCode} className="p-2 text-slate-400 hover:text-slate-900 transition-colors" title="Copy"><FaRegCopy size={13} /></button>
          <button onClick={clearAll} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Reset"><FaTrashAlt size={13} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={runCode} disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded font-black uppercase tracking-widest text-[10px] border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm">
            {isRunning ? <FaSpinner className="animate-spin" size={10} /> : <FaPlay size={9} />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button onClick={submitCode} disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded font-black uppercase tracking-widest text-[10px] bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all shadow-sm">
            {isSubmitting ? <FaSpinner className="animate-spin" size={10} /> : <FaPaperPlane size={10} />}
            {isSubmitting ? `Testing ${submitProgress}%` : 'Submit'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 flex-1 min-h-[520px]">
        {/* ── Code Editor ── */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                solution.{language.ext}
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/5">UTF-8</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent text-slate-300 p-5 font-mono text-sm resize-none focus:outline-none custom-scrollbar leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* ── Right Panel ── */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded border border-slate-200">
            <button onClick={() => setActiveTab('run')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'run' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
              <FaTerminal size={9} /> Run
            </button>
            <button onClick={() => setActiveTab('submit')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'submit' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
              <FaFlask size={9} /> Tests
              {testCases.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[8px]">{testCases.length}</span>
              )}
            </button>
          </div>

          {/* ── Run Tab ── */}
          {activeTab === 'run' && (
            <div className="flex flex-col gap-3 flex-1 min-h-0">
              <div className="flex flex-col bg-white border border-slate-200 rounded shadow-sm overflow-hidden" style={{ height: '120px' }}>
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                  <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <FaTerminal size={9} className="text-slate-400" /> Custom Stdin
                  </h4>
                </div>
                <textarea value={stdin} onChange={(e) => setStdin(e.target.value)}
                  placeholder="Paste input here..."
                  className="flex-1 w-full p-3 text-xs font-mono bg-white resize-none focus:outline-none text-slate-700 placeholder:text-slate-300" />
              </div>

              <div className="flex flex-col bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex-1 min-h-[200px]">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-between">
                  <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <FaTerminal size={9} className="text-slate-400" /> Output
                  </h4>
                  {runOutput && (
                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${runOutput.status.id === 3 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {runOutput.status.id === 3 ? <FaCheckCircle /> : <FaExclamationTriangle />}
                      {runOutput.status.description}
                    </span>
                  )}
                </div>
                <div className="flex-1 p-3 bg-slate-50 overflow-y-auto custom-scrollbar font-mono text-[11px] whitespace-pre-wrap">
                  {!runOutput && !isRunning && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 space-y-2">
                      <FaPlay size={20} /><p className="font-bold text-[9px] uppercase tracking-widest">Run to see output</p>
                    </div>
                  )}
                  {isRunning && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                      <FaSpinner size={20} className="animate-spin" />
                      <p className="font-bold text-[9px] uppercase tracking-widest">Executing...</p>
                    </div>
                  )}
                  {runOutput && (
                    <div className="space-y-2">
                      {runOutput.stdout     && <div className="text-slate-700">{runOutput.stdout}</div>}
                      {runOutput.compile_output && <div className="text-rose-600 bg-rose-50 p-2 rounded border border-rose-100">{runOutput.compile_output}</div>}
                      {runOutput.stderr     && <div className="text-rose-500 italic">{runOutput.stderr}</div>}
                      <div className="flex gap-4 pt-2 mt-2 border-t border-slate-200 text-[9px] text-slate-400">
                        <span>Time: <strong className="text-slate-700">{runOutput.time ? `${runOutput.time}s` : 'N/A'}</strong></span>
                        <span>Memory: <strong className="text-slate-700">{runOutput.memory ? `${(runOutput.memory/1024).toFixed(1)}MB` : 'N/A'}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Submit Tab ── */}
          {activeTab === 'submit' && (
            <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              {/* Harness info badge */}
              {harnessMode && submitVerdict && (
                <div className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded px-3 py-2">
                  ⚡ Auto-harness: your function was called automatically with embedded inputs.
                </div>
              )}

              {/* Verdict banner */}
              {submitVerdict && (
                <div className={`px-4 py-3 rounded-lg border font-black text-sm uppercase tracking-widest flex items-center gap-2 ${VERDICT[submitVerdict]}`}>
                  {submitVerdict === 'accepted' && <><FaCheckCircle /> All Test Cases Passed</>}
                  {submitVerdict === 'wrong'    && <><FaExclamationTriangle /> Wrong Answer</>}
                  {submitVerdict === 'error'    && <><FaExclamationTriangle /> Runtime Error</>}
                </div>
              )}

              {/* Progress */}
              {isSubmitting && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Running test cases...</span><span>{submitProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-slate-900 h-1.5 rounded-full transition-all duration-500" style={{ width: `${submitProgress}%` }} />
                  </div>
                </div>
              )}

              {/* No test cases */}
              {!isSubmitting && testCases.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
                  <FaFlask size={28} className="opacity-30" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No parseable test cases</p>
                  <p className="text-[9px] leading-relaxed px-4">LeetCode didn't expose structured test cases for this problem. Use the <strong>Run</strong> tab with custom input.</p>
                </div>
              )}

              {/* Test case rows */}
              {testCases.length > 0 && (
                <div className="space-y-2">
                  {testCases.map((tc, i) => (
                    <TestCaseResult key={i} tc={tc} idx={i} result={tcResults[i] ?? null} />
                  ))}
                </div>
              )}

              {/* Summary */}
              {tcResults.length === testCases.length && testCases.length > 0 && !isSubmitting && (
                <p className="text-[10px] text-slate-400 font-bold text-center pt-1">
                  {tcResults.filter(r => r.passed).length} / {testCases.length} passed
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePractice;
