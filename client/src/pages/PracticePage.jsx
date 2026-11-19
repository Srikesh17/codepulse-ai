import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Brain,
  Play,
  Send,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  Clock
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { SAMPLE_PROBLEMS } from '../data/problems';

export default function PracticePage() {
  const { problemId } = useParams();
  const problem = SAMPLE_PROBLEMS.find((p) => p.id === problemId) || SAMPLE_PROBLEMS[0];

  const storageKey = `codepulse_code_${problem.id}`;
  const [code, setCode] = useState(() => {
    return localStorage.getItem(storageKey) || problem.starterCode;
  });

  const [tutorMode, setTutorMode] = useState('socratic'); // 'socratic' or 'direct'
  const [unlockedHintLevel, setUnlockedHintLevel] = useState(1);
  const [hintHistory, setHintHistory] = useState([
    {
      id: 'h-init',
      sender: 'tutor',
      type: 'socratic',
      level: 1,
      title: 'Level 1: Intuition Nudge',
      text: problem.socraticHints[0]?.content || 'What invariant can you check first?',
      timestamp: 'Just now'
    }
  ]);

  const [executionMessage, setExecutionMessage] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(0);

  // Sync draft in localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, code);
  }, [code, storageKey]);

  // When problemId changes, load correct code
  useEffect(() => {
    const saved = localStorage.getItem(`codepulse_code_${problem.id}`);
    setCode(saved || problem.starterCode);
    setUnlockedHintLevel(1);
    setHintHistory([
      {
        id: `h-${Date.now()}`,
        sender: 'tutor',
        type: 'socratic',
        level: 1,
        title: 'Level 1: Intuition Nudge',
        text: problem.socraticHints[0]?.content || 'What invariant can you check first?',
        timestamp: 'Just now'
      }
    ]);
    setExecutionMessage(null);
  }, [problem.id]);

  const handleResetCode = () => {
    setCode(problem.starterCode);
    localStorage.removeItem(storageKey);
  };

  const handleSimulateExecution = (actionType) => {
    setExecutionMessage({
      type: 'notice',
      title: `${actionType} Triggered (Demo Notice)`,
      text: 'Code execution and test evaluation are scheduled for Phase 4 sandbox integration. In Phase 1, you can edit and preserve your code in the Monaco editor.'
    });
  };

  const handleUnlockNextHint = () => {
    if (unlockedHintLevel >= 3) return;
    const nextLevel = unlockedHintLevel + 1;
    const hintData = problem.socraticHints[nextLevel - 1];

    setUnlockedHintLevel(nextLevel);
    setHintHistory((prev) => [
      ...prev,
      {
        id: `h-${Date.now()}`,
        sender: 'tutor',
        type: tutorMode,
        level: nextLevel,
        title: hintData?.title || `Level ${nextLevel} Hint`,
        text: hintData?.content || 'Consider the algorithmic invariants and trade-offs.',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <span>Problems</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{problem.title}</span>
            <Badge
              variant={
                problem.difficulty === 'Easy'
                  ? 'emerald'
                  : problem.difficulty === 'Medium'
                  ? 'amber'
                  : 'red'
              }
              size="sm"
            >
              {problem.difficulty}
            </Badge>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language indicator */}
          <div className="px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Python 3.10</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetCode}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSimulateExecution('Run Code')}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Run Code
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSimulateExecution('Submit Solution')}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Execution Warning Notice */}
      {executionMessage && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>{executionMessage.title}:</strong> {executionMessage.text}</span>
          </div>
          <button
            onClick={() => setExecutionMessage(null)}
            className="text-amber-400 hover:text-amber-200 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3-Panel Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Panel 1: Problem Description (Left, 4 cols) */}
        <div className="lg:col-span-4 bg-dark-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 bg-dark-950/60 font-semibold text-xs text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Description</span>
            <span className="text-[11px] font-mono text-emerald-400">{problem.topic}</span>
          </div>
          <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
            <p className="whitespace-pre-line">{problem.description}</p>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wide">Examples:</h4>
              {problem.examples.map((ex, i) => (
                <div key={i} className="p-3 rounded-lg bg-dark-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div><strong className="text-slate-400">Input:</strong> <span className="text-emerald-300">{ex.input}</span></div>
                  <div><strong className="text-slate-400">Output:</strong> <span className="text-cyan-300">{ex.output}</span></div>
                  {ex.explanation && (
                    <div className="pt-1 text-slate-400 font-sans text-xs"><strong className="font-mono">Explanation:</strong> {ex.explanation}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="font-bold text-white text-xs uppercase tracking-wide mb-2">Test Cases (Demo View):</h4>
              <div className="flex gap-2 mb-2">
                {problem.examples.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTestCase(idx)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      selectedTestCase === idx
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-dark-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
              <div className="p-2.5 rounded bg-dark-950 border border-slate-800 font-mono text-[11px] text-slate-400">
                {problem.examples[selectedTestCase]?.input}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Monaco Editor (Middle, 5 cols) */}
        <div className="lg:col-span-5 bg-dark-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800 bg-dark-950/60 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-emerald-400 font-medium">solution.py</span>
            <span className="text-[11px] text-slate-500">Draft saved in browser</span>
          </div>
          <div className="flex-1 min-h-[350px]">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'Fira Code, Menlo, Monaco, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>
        </div>

        {/* Panel 3: Socratic AI Tutor (Right, 3 cols) */}
        <div className="lg:col-span-3 bg-dark-900 rounded-xl border border-emerald-500/30 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-dark-950 to-dark-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">AI Socratic Coach</span>
            </div>
            <Badge variant="emerald" size="sm">Demo Mode</Badge>
          </div>

          {/* Mode Selector */}
          <div className="p-2 bg-dark-950/80 border-b border-slate-800 grid grid-cols-2 gap-1 text-[11px]">
            <button
              onClick={() => setTutorMode('socratic')}
              className={`py-1 rounded font-medium transition-colors ${
                tutorMode === 'socratic'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Socratic Guided
            </button>
            <button
              onClick={() => setTutorMode('direct')}
              className={`py-1 rounded font-medium transition-colors ${
                tutorMode === 'direct'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Concept
            </button>
          </div>

          {/* Hint Chat Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            <div className="text-[11px] text-slate-500 text-center py-1">
              Sample Socratic dialogue for this problem
            </div>

            {hintHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-dark-950 border border-emerald-500/20 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400 text-[11px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Progressive Hint Progression Trigger */}
          <div className="p-3 border-t border-slate-800 bg-dark-950/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Hint Progression:</span>
              <span className="text-emerald-400 font-mono font-bold">Level {unlockedHintLevel} of 3</span>
            </div>

            {unlockedHintLevel < 3 ? (
              <Button
                variant="subtle"
                size="sm"
                className="w-full text-xs"
                onClick={handleUnlockNextHint}
                leftIcon={<Lightbulb className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Request Level {unlockedHintLevel + 1} Hint
              </Button>
            ) : (
              <div className="p-2 rounded bg-dark-900 border border-slate-800 text-[11px] text-slate-400 text-center">
                All 3 conceptual hint levels revealed. Try coding the implementation!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
