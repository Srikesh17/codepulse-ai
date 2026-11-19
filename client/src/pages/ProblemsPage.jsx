import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Code2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { SAMPLE_PROBLEMS } from '../data/problems';

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const topics = ['All', 'Arrays', 'Strings', 'Hashing', 'Two Pointers', 'Dynamic Programming'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredProblems = SAMPLE_PROBLEMS.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(search.toLowerCase()) ||
      prob.topic.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || prob.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || prob.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

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
        <Badge variant="cyan" size="md">
          {filteredProblems.length} of {SAMPLE_PROBLEMS.length} Problems
        </Badge>
      </div>

      <DemoNoticeBanner />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-dark-900 p-4 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by title, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Topics */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-emerald-500 text-dark-950 font-semibold'
                  : 'bg-dark-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16 bg-dark-900 rounded-xl border border-slate-800 space-y-2">
            <p className="text-slate-400 text-sm">No problems found matching your criteria.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedTopic('All');
                setSelectedDifficulty('All');
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              hoverEffect
              className="p-5 bg-dark-900 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors">
                    {problem.title}
                  </h3>
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
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                    {problem.topic}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {problem.description.replace(/[`\n]/g, ' ')}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  {problem.acceptance} acceptance
                </span>
                <Link to={`/practice/${problem.id}`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Solve Problem
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
