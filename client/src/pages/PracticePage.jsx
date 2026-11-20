import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Brain,
  Play,
  Send,
  RotateCcw,
  ChevronRight,
  Info,
  Lightbulb,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { problemApi } from '../services/problemApi';
import { sessionApi } from '../services/sessionApi';
import { useCodeDraft } from '../hooks/useCodeDraft';
import { SAMPLE_PROBLEMS } from '../data/problems';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function difficultyVariant(d) {
  const diff = (d || '').toLowerCase();
  if (diff === 'easy') return 'emerald';
  if (diff === 'medium') return 'amber';
  return 'red';
}

function findMockProblem(slugOrId) {
  return (
    SAMPLE_PROBLEMS.find((p) => p.id === slugOrId || p.slug === slugOrId) ||
    SAMPLE_PROBLEMS[0]
  );
}

// Normalize backend problem to the shape the UI expects
function normalizeProblem(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    difficulty: p.difficulty,
    topics: p.topics || [],
    description: p.description || '',
    examples: Array.isArray(p.examples) ? p.examples : [],
    constraints: Array.isArray(p.constraints) ? p.constraints : [],
    starterCode: p.starter_code || '',
    functionName: p.function_name || '',
    socraticHints: [], // Populated in Phase 4
  };
}

function formatSaveStatus(status, lastSavedAt) {
  if (status === 'saving') return 'Saving…';
  if (status === 'saved' && lastSavedAt) {
    const s = Math.round((Date.now() - lastSavedAt.getTime()) / 1000);
    return `Saved ${s < 5 ? 'just now' : `${s}s ago`}`;
  }
  if (status === 'conflict') return '⚠ Conflict — reload';
  if (status === 'error') return '✕ Save failed';
  return 'Draft in browser';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const { problemId: slugOrId } = useParams();
  const { isDemo, user } = useAuth();

  // ── Problem loading ──────────────────────────────────────────────────────
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(true);
  const [problemError, setProblemError] = useState(null);

  // ── Session ──────────────────────────────────────────────────────────────
  const [sessionId, setSessionId] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);

  // ── UI State ─────────────────────────────────────────────────────────────
  const [tutorMode, setTutorMode] = useState('socratic');
  const [hintHistory, setHintHistory] = useState([]);
  const [executionMessage, setExecutionMessage] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [tickSecond, setTickSecond] = useState(0); // forces save-status re-render

  // ── Draft / autosave ─────────────────────────────────────────────────────
  const {
    code,
    version,
    saveStatus,
    lastSavedAt,
    conflictError,
    handleCodeChange,
    loadDraft,
    resetCode,
    saveAttempt,
    flushSave,
  } = useCodeDraft(sessionId, problem?.starterCode || '', isDemo);

  // Tick to refresh "saved X seconds ago" label
  useEffect(() => {
    const id = setInterval(() => setTickSecond((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  // ── Fetch problem ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setProblemLoading(true);
    setProblemError(null);
    setSessionId(null);

    async function load() {
      if (isDemo) {
        const mock = findMockProblem(slugOrId);
        const normalized = {
          ...mock,
          difficulty: (mock.difficulty || '').toLowerCase(),
          topics: mock.topic ? [mock.topic] : [],
          constraints: [],
          starterCode: mock.starterCode || '',
          functionName: '',
        };
        if (!cancelled) {
          setProblem(normalized);
          setProblemLoading(false);
          // Seed hint history from mock socraticHints
          if (mock.socraticHints?.length) {
            setHintHistory([{
              id: 'h-init',
              sender: 'tutor',
              level: 1,
              title: mock.socraticHints[0].title,
              text: mock.socraticHints[0].content,
              timestamp: 'Demo',
            }]);
          }
        }
        return;
      }

      try {
        const res = await problemApi.getProblem(slugOrId);
        if (!cancelled) {
          const normalized = normalizeProblem(res.data);
          setProblem(normalized);
          setProblemLoading(false);
        }
      } catch {
        // Fallback to mock
        const mock = findMockProblem(slugOrId);
        if (!cancelled) {
          setProblem({
            ...mock,
            difficulty: (mock.difficulty || '').toLowerCase(),
            topics: mock.topic ? [mock.topic] : [],
            constraints: [],
            starterCode: mock.starterCode || '',
            functionName: '',
          });
          setProblemLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slugOrId, isDemo]);

  // ── Start / resume session once problem is loaded ────────────────────────
  useEffect(() => {
    if (!problem || isDemo || sessionId) return;

    let cancelled = false;
    setSessionLoading(true);

    async function startSession() {
      try {
        const res = await sessionApi.startSession(problem.id);
        if (!cancelled) {
          const { session, draft } = res.data;
          setSessionId(session.id);
          loadDraft(draft.code, draft.version);
        }
      } catch {
        // Backend unavailable — fall back to localStorage draft
        if (!cancelled) {
          const saved = localStorage.getItem(`codepulse_draft_${slugOrId}`);
          if (saved) loadDraft(saved, 0);
          else loadDraft(problem.starterCode, 0);
        }
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    }

    startSession();
    return () => { cancelled = true; };
  }, [problem, isDemo, sessionId, slugOrId, loadDraft]);

  // ── Reset hint history when problem changes ──────────────────────────────
  useEffect(() => {
    if (problem) {
      setHintHistory([{
        id: `h-${Date.now()}`,
        sender: 'tutor',
        level: 1,
        title: 'Level 1 — Intuition Nudge (Demo)',
        text: problem.socraticHints?.[0]?.content || 'Think about the invariant at each step. What property must always hold?',
        timestamp: 'Demo preview',
      }]);
      setExecutionMessage(null);
      setSelectedTestCase(0);
    }
  }, [problem?.id]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleRunCode = () => {
    setExecutionMessage({
      type: 'notice',
      title: 'Code Execution Unavailable',
      text: 'Live code execution and test-case evaluation are coming in Phase 5 (Sandbox Integration). Your code is autosaved to the database.',
    });
  };

  const handleSubmit = async () => {
    setExecutionMessage({
      type: 'notice',
      title: 'Submission Unavailable',
      text: 'Automated submission evaluation arrives in Phase 5. A code snapshot has been saved to your practice session.',
    });
    // Save a manual attempt snapshot
    await saveAttempt('manual_snapshot');
  };

  const handleResetCode = () => {
    setShowResetConfirm(false);
    resetCode();
  };

  const handleUnlockNextHint = () => {
    const nextLevel = (hintHistory.length % 3) + 1;
    const hintData = problem?.socraticHints?.[nextLevel - 1];
    setHintHistory((prev) => [
      ...prev,
      {
        id: `h-${Date.now()}`,
        sender: 'tutor',
        level: nextLevel,
        title: hintData?.title || `Level ${nextLevel} Hint (Demo)`,
        text: hintData?.content || 'Consider the algorithmic invariants and trade-offs at this level.',
        timestamp: 'Demo preview',
      },
    ]);
  };

  // ─── Loading / Error states ──────────────────────────────────────────────

  if (problemLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] gap-3">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        <span className="text-slate-400 text-sm">Loading problem…</span>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <p className="text-slate-300 font-semibold">Problem not found</p>
        <Link to="/problems">
          <Button variant="primary" size="sm">← Back to Problems</Button>
        </Link>
      </div>
    );
  }

  const saveLabel = formatSaveStatus(saveStatus, lastSavedAt, tickSecond);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-5rem)] flex flex-col">

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-dark-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white">Reset code?</h3>
            <p className="text-xs text-slate-400">
              This will replace your current code with the starter template. Your saved attempt snapshots in the database are not affected.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleResetCode}>Reset</Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <span>Problems</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{problem.title}</span>
            <Badge variant={difficultyVariant(problem.difficulty)} size="sm">
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </Badge>
            {problem.topics.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{t}</span>
            ))}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Python 3.10</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRunCode}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Run Code
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Execution notice */}
      {executionMessage && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>{executionMessage.title}:</strong> {executionMessage.text}</span>
          </div>
          <button onClick={() => setExecutionMessage(null)} className="text-amber-400 hover:text-amber-200 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Conflict notice */}
      {conflictError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{conflictError}</span>
          </div>
        </div>
      )}

      {/* 3-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">

        {/* Panel 1: Problem Description */}
        <div className="lg:col-span-4 bg-dark-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 bg-dark-950/60 font-semibold text-xs text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Description</span>
            {problem.topics[0] && (
              <span className="text-[11px] font-mono text-emerald-400">{problem.topics[0]}</span>
            )}
          </div>
          <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
            <p className="whitespace-pre-line">{problem.description}</p>

            {problem.examples.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide">Examples:</h4>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-dark-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div><strong className="text-slate-400">Input:</strong> <span className="text-emerald-300">{ex.input}</span></div>
                    <div><strong className="text-slate-400">Output:</strong> <span className="text-cyan-300">{ex.output}</span></div>
                    {ex.explanation && (
                      <div className="pt-1 text-slate-400 font-sans text-xs">
                        <strong className="font-mono">Explanation:</strong> {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide">Constraints:</h4>
                <ul className="space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="font-mono text-[11px] text-slate-400">• {c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Test Case Tabs */}
            {problem.examples.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide mb-2">Test Cases:</h4>
                <div className="flex gap-2 mb-2 flex-wrap">
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
                <p className="mt-2 text-[10px] text-slate-600 italic">
                  Test evaluation available in Phase 5.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Monaco Editor */}
        <div className="lg:col-span-5 bg-dark-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800 bg-dark-950/60 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-emerald-400 font-medium">solution.py</span>
            <div className="flex items-center gap-2">
              {sessionLoading && (
                <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
              )}
              <span
                className={`text-[11px] transition-colors ${
                  saveStatus === 'saved' ? 'text-emerald-500' :
                  saveStatus === 'saving' ? 'text-amber-400' :
                  saveStatus === 'conflict' || saveStatus === 'error' ? 'text-red-400' :
                  'text-slate-500'
                }`}
              >
                {saveLabel}
              </span>
              {version > 0 && (
                <span className="text-[10px] font-mono text-slate-600">v{version}</span>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-[350px]">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
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

        {/* Panel 3: AI Tutor */}
        <div className="lg:col-span-3 bg-dark-900 rounded-xl border border-emerald-500/30 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-dark-950 to-dark-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">AI Socratic Coach</span>
            </div>
            <Badge variant="amber" size="sm">Phase 4</Badge>
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

          {/* Phase 4 Notice */}
          <div className="p-3 bg-amber-500/5 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
            <span>Gemini-powered Socratic hints arrive in Phase 4. Sample questions shown below.</span>
          </div>

          {/* Hint Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            <div className="text-[11px] text-slate-500 text-center py-1">
              Sample Socratic dialogue (Demo preview)
            </div>
            {hintHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-dark-950 border border-emerald-500/20 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400 text-[11px]">{item.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Hint Controls */}
          <div className="p-3 border-t border-slate-800 bg-dark-950/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Hint Level:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {Math.min(hintHistory.length, 3)} of 3
              </span>
            </div>

            {hintHistory.length < 3 ? (
              <Button
                variant="subtle"
                size="sm"
                className="w-full text-xs"
                onClick={handleUnlockNextHint}
                leftIcon={<Lightbulb className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Request Level {hintHistory.length + 1} Hint (Demo)
              </Button>
            ) : (
              <div className="p-2 rounded bg-dark-900 border border-slate-800 text-[11px] text-slate-400 text-center">
                All 3 demo hint levels shown. Real AI hints in Phase 4.
              </div>
            )}

            {sessionId && (
              <div className="text-[10px] text-slate-600 font-mono text-center truncate">
                Session: {sessionId.slice(0, 8)}…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
