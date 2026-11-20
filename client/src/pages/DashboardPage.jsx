import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Brain,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Clock,
  Award,
  AlertCircle,
  Inbox
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/dashboardApi';
import { SAMPLE_PROBLEMS } from '../data/problems';

export default function DashboardPage() {
  const { user, isDemo } = useAuth();
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [activityData, setActivityData] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    // If in demo guest preview mode, provide local demo values without calling server
    if (isDemo) {
      setOverviewData({
        user: { fullName: user?.name || 'Alex Rivera (Guest Demo)' },
        statistics: {
          problemsSolved: 14,
          totalAttempts: 42,
          hintsUsed: 28,
          currentStreak: 5,
        },
      });
      setActivityData([
        {
          id: 'demo-1',
          eventType: 'problem_hint_used',
          metadata: { problem: 'Two Sum', hintLevel: 1 },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'demo-2',
          eventType: 'practice_session_started',
          metadata: { problem: 'Container With Most Water' },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [overviewRes, activityRes] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.getActivity(10),
      ]);

      setOverviewData(overviewRes?.data || null);
      setActivityData(activityRes?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data from backend server.');
    } finally {
      setLoading(false);
    }
  }, [isDemo, user?.name]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived statistics (with zero defaults for real new accounts)
  const stats = overviewData?.statistics || {
    problemsSolved: 0,
    totalAttempts: 0,
    hintsUsed: 0,
    currentStreak: 0,
  };

  const statCards = [
    {
      label: 'Problems Solved',
      value: stats.problemsSolved,
      subtext: isDemo ? '+3 this week (demo)' : 'Verified completed in DB',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      label: 'Total Attempts',
      value: stats.totalAttempts,
      subtext: isDemo ? '82% success rate' : 'Submissions recorded',
      icon: Code2,
      color: 'text-cyan-400',
    },
    {
      label: 'Hints Used',
      value: stats.hintsUsed,
      subtext: isDemo ? 'Avg 1.2 per problem' : 'Socratic nudges requested',
      icon: Brain,
      color: 'text-purple-400',
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} Days`,
      subtext: isDemo ? 'Best: 12 days' : 'Active practice streak',
      icon: Flame,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {overviewData?.user?.fullName || user?.name || user?.fullName || 'Student'}
            </h1>
            <Badge variant={isDemo ? 'amber' : 'emerald'} size="sm" dot>
              {isDemo ? 'Demo Mode' : 'PostgreSQL Connected'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isDemo
              ? 'Guest preview mode active. Register a student account for permanent PostgreSQL persistence.'
              : 'Persistent student account backed by Express and PostgreSQL.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isDemo && (
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
              leftIcon={<RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh Data
            </Button>
          )}
          <Link to="/practice/two-sum">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue Learning
            </Button>
          </Link>
        </div>
      </div>

      <DemoNoticeBanner compact={!isDemo} />

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="danger" size="sm" onClick={fetchDashboardData}>
            Retry
          </Button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-5 space-y-2 bg-dark-900 border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-slate-800/80 rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
              )}
              <div className="text-[11px] text-slate-500">{stat.subtext}</div>
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

        {/* Recent Activity from PostgreSQL */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Database Activity Stream</h2>
            <span className="text-[11px] font-mono text-slate-500">PostgreSQL</span>
          </div>

          <Card className="p-4 bg-dark-900 border-slate-800 space-y-4">
            {loading ? (
              <div className="space-y-3 py-2">
                <div className="h-12 bg-dark-950 rounded-lg animate-pulse" />
                <div className="h-12 bg-dark-950 rounded-lg animate-pulse" />
                <div className="h-12 bg-dark-950 rounded-lg animate-pulse" />
              </div>
            ) : activityData.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">No practice activity logged yet.</p>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                  Solve problems in the workspace to build your persistent event log.
                </p>
                <div className="pt-2">
                  <Link to="/problems">
                    <Button variant="subtle" size="sm">
                      Start First Problem
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activityData.map((act) => {
                  const formatType = (t) => {
                    if (t === 'user_registered') return 'Account Created';
                    if (t === 'user_logged_in') return 'Signed In';
                    if (t === 'user_profile_updated') return 'Profile Updated';
                    return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                  };

                  const formattedDate = new Date(act.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={act.id}
                      className="p-3 rounded-lg bg-dark-950 border border-slate-800/80 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-400 font-mono text-[11px]">
                          {formatType(act.eventType)}
                        </span>
                        <span className="text-[10px] text-slate-500">{formattedDate}</span>
                      </div>
                      {act.metadata && Object.keys(act.metadata).length > 0 && (
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {JSON.stringify(act.metadata)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80">
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View Analytics Charts (Demo Preview) →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
