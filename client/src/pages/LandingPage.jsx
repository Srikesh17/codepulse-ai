import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Brain,
  Code2,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Terminal,
  HelpCircle,
  Lightbulb,
  Zap,
  ShieldCheck,
  ChevronRight,
  Play,
  Layers,
  GraduationCap
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { exploreDemo, isAuthenticated } = useAuth();

  const handleStartDemo = () => {
    exploreDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Top Demo Notice Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <DemoNoticeBanner compact />
        </div>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle glowing background orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-6 shadow-sm shadow-emerald-950">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Phase 1 Frontend Preview — Socratic AI Coding Platform</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
              Stop Copying Solutions.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Start Thinking Like an Engineer.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              CodePulse AI is your Socratic coding & retention coach. Instead of dumping full solutions,
              it nudges your mental models with progressive algorithmic hints, diagnostic questions,
              and spaced-repetition feedback.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Features
                </Button>
              </a>
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button
                    variant="subtle"
                    size="lg"
                    className="w-full sm:w-auto text-emerald-300"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Go to Workspace
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="subtle"
                  size="lg"
                  onClick={handleStartDemo}
                  className="w-full sm:w-auto text-emerald-300"
                  leftIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
                >
                  Explore Demo
                </Button>
              )}
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero spoiler answers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Monaco Python 3 editor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Retention & streak metrics</span>
              </div>
            </div>

            {/* Interactive Workspace Preview Mockup */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-dark-900/90 p-2 sm:p-4 shadow-2xl shadow-black/60 relative">
              <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-slate-300 font-semibold">workspace / two-sum-hash-map.py</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="emerald" size="sm">Socratic Active</Badge>
                  <span className="hidden sm:inline font-mono text-[11px] text-slate-400">Python 3.10</span>
                </div>
              </div>

              {/* Three-panel simulated preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3 text-left">
                {/* Panel 1: Problem spec */}
                <div className="lg:col-span-4 bg-dark-950 rounded-xl p-4 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">1. Two Sum</span>
                    <Badge variant="emerald" size="sm">Easy</Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Given an array of integers <code className="text-emerald-300 bg-dark-900 px-1 py-0.5 rounded">nums</code> and an integer <code className="text-emerald-300 bg-dark-900 px-1 py-0.5 rounded">target</code>, return indices of the two numbers such that they add up to target.
                  </p>
                  <div className="bg-dark-900/80 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400">
                    <span className="text-emerald-400">Input:</span> nums = [2,7,11,15], target = 9<br />
                    <span className="text-emerald-400">Output:</span> [0,1]
                  </div>
                </div>

                {/* Panel 2: Editor */}
                <div className="lg:col-span-5 bg-dark-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-slate-300 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-slate-500"># Solution draft in progress</div>
                    <div className="text-cyan-400">class <span className="text-amber-300">Solution</span>:</div>
                    <div className="pl-4 text-slate-300">
                      <span className="text-emerald-400">def</span> <span className="text-blue-400">twoSum</span>(self, nums: list[int], target: int) -&gt; list[int]:
                    </div>
                    <div className="pl-8 text-slate-400">seen = {}</div>
                    <div className="pl-8 text-slate-400">
                      <span className="text-emerald-400">for</span> i, num <span className="text-emerald-400">in</span> enumerate(nums):
                    </div>
                    <div className="pl-12 text-slate-400">complement = target - num</div>
                    <div className="pl-12 text-emerald-400"># Where do we check complement?</div>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-slate-800/60 mt-4 text-[11px]">
                    <span className="text-slate-400">Draft saved in browser</span>
                    <span className="text-emerald-400 font-semibold">Ready for hint check</span>
                  </div>
                </div>

                {/* Panel 3: Socratic Hint */}
                <div className="lg:col-span-3 bg-gradient-to-b from-dark-950 to-dark-900 rounded-xl p-4 border border-emerald-500/30 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <Brain className="w-3.5 h-3.5" />
                      <span>Socratic Coach</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-snug">
                      <span className="font-semibold block text-emerald-300 mb-1">Level 1 Nudge:</span>
                      "Before looking at future elements, what lookup data structure gives O(1) checks for previous values?"
                    </div>
                  </div>
                  <div className="pt-3">
                    <button
                      onClick={handleStartDemo}
                      className="w-full text-center py-1.5 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] rounded font-medium transition-colors"
                    >
                      Try Interactive Workspace →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE SHOWCASE SECTION */}
        <section id="features" className="py-20 border-t border-slate-800/80 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="cyan" size="md">Engineered for Mastery</Badge>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Everything you need to master problem solving
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Traditional platforms test you with pass/fail gates. CodePulse AI actively teaches you how to think, dissect trade-offs, and remember patterns under pressure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">3-Tier Socratic AI Hints</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Progressive hint progression: Level 1 provides conceptual nudges, Level 2 points out algorithmic strategies, and Level 3 offers pseudocode guidance without giving away the direct code.
                </p>
                <div className="pt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <span>Preserves "Aha!" moments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>

              {/* Feature 2 */}
              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Monaco Coding Sandbox</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The industry standard editor powered by VS Code. Full Python syntax highlighting, keyboard shortcuts, auto-indentation, and responsive side-by-side view with test cases.
                </p>
                <div className="pt-2 text-xs text-cyan-400 font-medium flex items-center gap-1">
                  <span>Professional dev environment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>

              {/* Feature 3 */}
              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Retention & Habit Analytics</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Monitor hint dependency curves, difficulty distribution (Easy, Medium, Hard), consistency streaks, and conceptual topic mastery over time.
                </p>
                <div className="pt-2 text-xs text-purple-400 font-medium flex items-center gap-1">
                  <span>Data-driven progress tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION: The Socratic Difference */}
        <section id="socratic-method" className="py-20 border-t border-slate-800/80 bg-dark-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="amber" size="md">The Cognitive Difference</Badge>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Copying Answers vs. Developing Intuition
              </h2>
              <p className="mt-4 text-base text-slate-400">
                Why LeetCode grinders fail real interviews, and how Socratic inquiry builds neural retention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Traditional Way */}
              <div className="p-6 rounded-2xl bg-dark-900 border border-red-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-red-500/20">
                  <span className="font-bold text-red-400 text-sm">The Broken Pattern: Copying</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">Ineffective</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Get stuck for 10 minutes, open solution tab, copy the optimal code.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Experience illusion of competence ("I understand this now").</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Forget the solution completely 2 weeks later in a live interview.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Freezes when interviewer introduces slight problem variations.</span>
                  </li>
                </ul>
              </div>

              {/* CodePulse Way */}
              <div className="p-6 rounded-2xl bg-dark-900 border border-emerald-500/40 shadow-glow-emerald space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <span className="font-bold text-emerald-400 text-sm">The CodePulse Socratic Approach</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Retention Engine</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>AI probes your invariants: "What constraint suggests O(N) space is acceptable?"</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>Your brain formulates the synthesis; you write every single line yourself.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>Spaced-repetition tracks hint dependency down to 0 over subsequent attempts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>Adaptable mental models that scale to novel system designs and interviews.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 border-t border-slate-800/80 bg-dark-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="blue" size="md">Simple 3-Step Flow</Badge>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                How CodePulse AI works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-xl bg-dark-950 border border-slate-800">
                <div className="text-2xl font-bold font-mono text-emerald-400">01</div>
                <h4 className="text-base font-bold text-white">Select a Problem</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse curated problems in Arrays, Strings, Two Pointers, Dynamic Programming, and Graph algorithms with realistic test suites.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-xl bg-dark-950 border border-slate-800">
                <div className="text-2xl font-bold font-mono text-cyan-400">02</div>
                <h4 className="text-base font-bold text-white">Code with Socratic Support</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Write Python code in Monaco Editor. When stuck, ask the Socratic tutor for subtle conceptual guidance instead of the full answer.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-xl bg-dark-950 border border-slate-800">
                <div className="text-2xl font-bold font-mono text-purple-400">03</div>
                <h4 className="text-base font-bold text-white">Track Retention Curves</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review your analytics dashboard. Monitor hint reliance drop as your independent algorithmic problem-solving instincts mature.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to experience Socratic coding?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Try the Phase 1 frontend preview now. Tour the student dashboard, problem catalog, and Monaco coding workspace in instant demo mode.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartDemo}
                leftIcon={<Sparkles className="w-4 h-4 text-dark-950" />}
              >
                Launch Demo Workspace
              </Button>
              <Link to="/signup">
                <Button variant="secondary" size="lg">
                  Create Account (Demo)
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
