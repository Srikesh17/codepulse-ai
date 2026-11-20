import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { problemApi } from '../services/problemApi';
import { SAMPLE_PROBLEMS } from '../data/problems';

const TOPICS = ['All', 'Arrays', 'Strings', 'Hashing', 'Two Pointers', 'Sliding Window', 'Binary Search', 'Stack', 'Recursion', 'Trees', 'Dynamic Programming'];
const DIFFICULTIES = ['All', 'easy', 'medium', 'hard'];

function difficultyLabel(d) {
  if (!d) return '';
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function difficultyVariant(d) {
  if (d === 'easy') return 'emerald';
  if (d === 'medium') return 'amber';
  return 'red';
}

// Convert backend problem shape → display-ready shape
function normalize(p) {
  return {
    id: p.slug || p.id,
    slug: p.slug || p.id,
    title: p.title,
    difficulty: (p.difficulty || '').toLowerCase(),
    topic: Array.isArray(p.topics) ? p.topics[0] : (p.topic || ''),
    topics: p.topics || (p.topic ? [p.topic] : []),
    description: p.description || '',
    acceptance: p.acceptance || '—',
  };
}

export default function ProblemsPage() {
  const { isDemo } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'All');

  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isDemo) {
      // Demo mode: filter mock data locally
      const filtered = SAMPLE_PROBLEMS.filter((p) => {
        const diff = p.difficulty?.toLowerCase() || '';
        const sel = selectedDifficulty.toLowerCase();
        const matchSearch =
          !search ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.topic || '').toLowerCase().includes(search.toLowerCase());
        const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
        const matchDiff = selectedDifficulty === 'All' || diff === sel;
        return matchSearch && matchTopic && matchDiff;
      });
      setProblems(filtered.map(normalize));
      setTotal(filtered.length);
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    try {
      const res = await problemApi.listProblems({
        search: search || undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        topic: selectedTopic !== 'All' ? selectedTopic : undefined,
      });

      const list = res?.data?.problems || [];
      setProblems(list.map(normalize));
      setTotal(res?.data?.total ?? list.length);
      setUsingMockData(false);
    } catch {
      // Backend unavailable — fall back to mock data with local filtering
      const filtered = SAMPLE_PROBLEMS.filter((p) => {
        const diff = p.difficulty?.toLowerCase() || '';
        const sel = selectedDifficulty.toLowerCase();
        const matchSearch =
          !search ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.topic || '').toLowerCase().includes(search.toLowerCase());
        const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
        const matchDiff = selectedDifficulty === 'All' || diff === sel;
        return matchSearch && matchTopic && matchDiff;
      });
      setProblems(filtered.map(normalize));
      setTotal(filtered.length);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, [isDemo, search, selectedTopic, selectedDifficulty]);

  // Sync URL query params
  useEffect(() => {
    const p = {};
    if (search) p.search = search;
    if (selectedTopic !== 'All') p.topic = selectedTopic;
    if (selectedDifficulty !== 'All') p.difficulty = selectedDifficulty;
    setSearchParams(p, { replace: true });
  }, [search, selectedTopic, selectedDifficulty, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(fetchProblems, 300);
    return () => clearTimeout(timer);
  }, [fetchProblems]);

  const resetFilters = () => {
    setSearch('');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curated Problem Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Master core algorithmic patterns with progressive Socratic coaching.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {usingMockData && (
            <Badge variant="amber" size="sm" dot>Demo Data</Badge>
          )}
          <Badge variant="cyan" size="md">
            {loading ? '…' : `${total} Problem${total !== 1 ? 's' : ''}`}
          </Badge>
        </div>
      </div>

      <DemoNoticeBanner />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-dark-900 p-4 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or topic…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDifficulty === d
                  ? 'bg-emerald-500 text-dark-950 font-semibold'
                  : 'bg-dark-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {d === 'All' ? 'All' : difficultyLabel(d)}
            </button>
          ))}
        </div>

        {/* Topic Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-cyan-500 text-dark-950 font-semibold'
                  : 'bg-dark-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          <span className="ml-3 text-sm text-slate-400">Loading problems…</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="danger" size="sm" onClick={fetchProblems} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Retry
          </Button>
        </div>
      )}

      {/* Problem Cards */}
      {!loading && (
        <div className="space-y-3">
          {problems.length === 0 ? (
            <div className="text-center py-16 bg-dark-900 rounded-xl border border-slate-800 space-y-2">
              <p className="text-slate-400 text-sm">No problems match your criteria.</p>
              <button onClick={resetFilters} className="text-xs text-emerald-400 hover:underline">
                Reset all filters
              </button>
            </div>
          ) : (
            problems.map((problem) => (
              <Card
                key={problem.slug}
                hoverEffect
                className="p-5 bg-dark-900 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors">
                      {problem.title}
                    </h3>
                    <Badge variant={difficultyVariant(problem.difficulty)} size="sm">
                      {difficultyLabel(problem.difficulty)}
                    </Badge>
                    {problem.topics.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {(problem.description || '').replace(/[`\n]/g, ' ')}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {problem.acceptance !== '—' && (
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      {problem.acceptance} acceptance
                    </span>
                  )}
                  <Link to={`/practice/${problem.slug}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Solve
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
