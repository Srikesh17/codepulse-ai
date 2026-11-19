import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Brain,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  Award
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_PROBLEMS } from '../data/problems';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Problems Solved', value: user?.problemsSolved || '14', change: '+3 this week', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Total Attempts', value: '42', change: '82% success rate', icon: Code2, color: 'text-cyan-400' },
    { label: 'Hints Used', value: '28', change: 'Avg 1.2 per problem', icon: Brain, color: 'text-purple-400' },
    { label: 'Current Streak', value: `${user?.streakDays || 5} Days`, change: 'Best: 12 days', icon: Flame, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Student'}
            </h1>
            <Badge variant="emerald" size="sm" dot>Demo Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ready to train your algorithmic intuition today? Socratic guidance is standing by.
          </p>
        </div>

        <Link to="/practice/two-sum">
          <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue Learning
          </Button>
        </Link>
      </div>

      <DemoNoticeBanner />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-5 space-y-2 bg-dark-900 border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
              <div className="text-[11px] text-slate-500">{stat.change}</div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity & Recommended Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Coding Problems */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recommended for You</h2>
            <Link to="/problems" className="text-xs text-emerald-400 hover:text-emerald-300">
              Browse all 10 problems →
            </Link>
          </div>

          <div className="space-y-3">
            {SAMPLE_PROBLEMS.slice(0, 4).map((prob) => (
              <Card key={prob.id} hoverEffect className="p-4 bg-dark-900 border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{prob.title}</span>
                    <Badge
                      variant={
                        prob.difficulty === 'Easy'
                          ? 'emerald'
                          : prob.difficulty === 'Medium'
                          ? 'amber'
                          : 'red'
                      }
                      size="sm"
                    >
                      {prob.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-slate-400">Topic: {prob.topic}</span>
                    <span>•</span>
                    <span className="text-slate-500 font-mono">Acceptance: {prob.acceptance}</span>
                  </div>
                </div>

                <Link to={`/practice/${prob.id}`}>
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Solve
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Socratic Activity */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Recent Socratic Insights</h2>
          <Card className="p-4 bg-dark-900 border-slate-800 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400">Two Sum</span>
                <span className="text-slate-500 text-[11px]">Today</span>
              </div>
              <p className="text-xs text-slate-300 bg-dark-950 p-2.5 rounded-lg border border-slate-800">
                "Used Level 1 hint on complement lookups. Solved in 14 minutes with O(N) space."
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400">Container With Most Water</span>
                <span className="text-slate-500 text-[11px]">Yesterday</span>
              </div>
              <p className="text-xs text-slate-300 bg-dark-950 p-2.5 rounded-lg border border-slate-800">
                "Identified two-pointer convergence invariant independently."
              </p>
            </div>

            <div className="pt-2">
              <Link to="/analytics">
                <Button variant="subtle" size="sm" className="w-full">
                  View Full Analytics
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
