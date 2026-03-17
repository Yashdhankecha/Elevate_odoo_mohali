import React, { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaTerminal, 
  FaCode, 
  FaTrashAlt, 
  FaRegCopy, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaSpinner,
  FaChevronRight,
  FaLightbulb
} from 'react-icons/fa';
import { judge0Api } from '../../../services/judge0Api';
import { toast } from 'react-hot-toast';

const LANGUAGES = [
  { id: 63, name: 'JavaScript', icon: 'JS', template: '// Write your JavaScript code here\nconsole.log("Hello, World!");' },
  { id: 71, name: 'Python (3.8.1)', icon: 'PY', template: '# Write your Python code here\nprint("Hello, World!")' },
  { id: 54, name: 'C++ (GCC 9.2.0)', icon: 'C++', template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)', icon: 'JV', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: 50, name: 'C (GCC 9.2.0)', icon: 'C', template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' }
];

const CodePractice = ({ initialCode, initialLanguageId, initialStdin }) => {
  const [language, setLanguage] = useState(LANGUAGES.find(l => l.id === initialLanguageId) || LANGUAGES[0]);
  const [code, setCode] = useState(initialCode || language.template);
  const [stdin, setStdin] = useState(initialStdin || '');
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, submitting, polling, finished

  // Detect prop changes
  useEffect(() => {
    if (initialCode) setCode(initialCode);
    if (initialStdin) setStdin(initialStdin);
    if (initialLanguageId) {
      const found = LANGUAGES.find(l => l.id === initialLanguageId);
      if (found) setLanguage(found);
    }
  }, [initialCode, initialLanguageId, initialStdin]);

  // Update code when language changes if code is still the default template
  const handleLanguageChange = (e) => {
    const selected = LANGUAGES.find(l => l.id === parseInt(e.target.value));
    const currentTemplate = LANGUAGES.find(l => l.id === language.id)?.template;
    
    if (code === currentTemplate) {
      setCode(selected.template);
    }
    setLanguage(selected);
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code');
      return;
    }

    setIsRunning(true);
    setStatus('submitting');
    setOutput(null);

    try {
      const { token } = await judge0Api.submitCode(code, language.id, stdin);
      setStatus('polling');
      
      // Poll for result
      pollResult(token);
    } catch (error) {
      toast.error('Failed to submit code');
      setIsRunning(false);
      setStatus('idle');
    }
  };

  const pollResult = async (token) => {
    try {
      const result = await judge0Api.getSubmission(token);
      
      // Status IDs: 1-In Queue, 2-Processing, 3-Accepted, etc.
      if (result.status.id <= 2) {
        setTimeout(() => pollResult(token), 1500);
      } else {
        setOutput(result);
        setIsRunning(false);
        setStatus('finished');
        
        if (result.status.id === 3) {
          toast.success('Execution successful!');
        } else {
          toast.error(result.status.description || 'Execution failed');
        }
      }
    } catch (error) {
      toast.error('Failed to get execution result');
      setIsRunning(false);
      setStatus('idle');
    }
  };

  const clearAll = () => {
    setCode(language.template);
    setStdin('');
    setOutput(null);
    setStatus('idle');
    toast.success('Cleared editor');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in">
      {/* Control Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white">
              <FaCode size={14} />
            </div>
            <select 
              value={language.id}
              onChange={handleLanguageChange}
              className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={copyToClipboard}
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              title="Copy Code"
            >
              <FaRegCopy size={16} />
            </button>
            <button 
              onClick={clearAll}
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
              title="Clear All"
            >
              <FaTrashAlt size={16} />
            </button>
          </div>
        </div>

        <button 
          onClick={runCode}
          disabled={isRunning}
          className={`flex items-center gap-2 px-8 py-2.5 rounded shadow-sm font-black uppercase tracking-widest text-[11px] transition-all ${
            isRunning 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
          }`}
        >
          {isRunning ? <FaSpinner className="animate-spin" size={12} /> : <FaPlay size={10} />}
          {isRunning ? (status === 'submitting' ? 'Submitting...' : 'Executing...') : 'Run Code'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        {/* Editor Area */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded border border-slate-800 shadow-xl overflow-hidden group">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <FaCode size={12} /> main.{language.name.toLowerCase().includes('python') ? 'py' : language.name.toLowerCase().includes('java') ? 'java' : 'js'}
              </span>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/5">UTF-8</span>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent text-slate-300 p-6 font-mono text-sm resize-none focus:outline-none custom-scrollbar leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Input/Output Area */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Input Section */}
          <div className="flex flex-col bg-white border border-slate-200 rounded shadow-sm overflow-hidden h-1/3">
             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <FaTerminal size={12} className="text-slate-400" /> Stdin Input
                </h4>
             </div>
             <textarea
               value={stdin}
               onChange={(e) => setStdin(e.target.value)}
               placeholder="Optional program input..."
               className="flex-1 w-full p-4 text-xs font-mono bg-white resize-none focus:outline-none text-slate-700 placeholder:text-slate-300"
             />
          </div>

          {/* Output Section */}
          <div className="flex flex-col bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex-1 min-h-[300px]">
             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <FaTerminal size={12} className="text-slate-400" /> Console Output
                </h4>
                {output && (
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    output.status.id === 3 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {output.status.id === 3 ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    {output.status.description}
                  </span>
                )}
             </div>
             
             <div className="flex-1 p-4 bg-slate-50 overflow-y-auto custom-scrollbar font-mono text-[11px] whitespace-pre-wrap">
                {!output && !isRunning && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3 opacity-50">
                    <FaPlay size={24} />
                    <p className="font-bold uppercase tracking-widest text-[10px]">Run code to see output</p>
                  </div>
                )}
                
                {isRunning && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <FaSpinner size={24} className="animate-spin" />
                    <div className="text-center">
                       <p className="font-bold uppercase tracking-widest text-[10px]">{status === 'submitting' ? 'Connecting to Judge0...' : 'Executing Code...'}</p>
                       <p className="text-[9px] mt-1 opacity-60">This usually takes 2-5 seconds</p>
                    </div>
                  </div>
                )}

                {output && (
                  <div className="space-y-4">
                    {output.stdout && (
                      <div className="text-slate-700">{output.stdout}</div>
                    )}
                    {output.compile_output && (
                      <div className="text-rose-600 bg-rose-50 p-3 rounded border border-rose-100">{output.compile_output}</div>
                    )}
                    {output.stderr && (
                      <div className="text-rose-500 italic">{output.stderr}</div>
                    )}
                    {output.message && (
                      <div className="text-slate-400 border-t border-slate-200 pt-2 mt-2">{output.message}</div>
                    )}
                    
                    <div className="flex flex-wrap gap-4 pt-4 mt-6 border-t border-slate-200">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time</span>
                         <span className="font-bold text-slate-900">{output.time ? `${output.time}s` : 'N/A'}</span>
                      </div>
                      <div className="flex flex-col transition-all">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Memory</span>
                         <span className="font-bold text-slate-900">{output.memory ? `${(output.memory / 1024).toFixed(1)} MB` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Suggested Problems (Mock for now) */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/5">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-indigo-300 border border-white/10 shadow-inner">
               <FaLightbulb size={24} />
            </div>
            <div>
               <h4 className="text-xl font-bold tracking-tight">Need a challenge?</h4>
               <p className="text-indigo-200 text-sm font-medium mt-1">Try solving: "Implement a Balanced Binary Search Tree"</p>
            </div>
         </div>
         <button className="bg-white text-slate-900 px-6 py-3 rounded font-black uppercase tracking-widest text-[11px] flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-lg active:scale-95">
            Load Problem <FaChevronRight size={10} />
         </button>
      </div>
    </div>
  );
};

export default CodePractice;
