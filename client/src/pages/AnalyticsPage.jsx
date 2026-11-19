import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Brain, Award, Info, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';

export default function AnalyticsPage() {
  const weeklyData = [
    { day: 'Mon', attempts: 4, hints: 2 },
    { day: 'Tue', attempts: 7, hints: 3 },
    { day: 'Wed', attempts: 5, hints: 1 },
    { day: 'Thu', attempts: 8, hints: 4 },
    { day: 'Fri', attempts: 6, hints: 2 },
    { day: 'Sat', attempts: 9, hints: 2 },
    { day: 'Sun', attempts: 3, hints: 1 },
  ];

  const difficultyData = [
    { name: 'Easy', count: 8, color: '#10b981' },
    { name: 'Medium', count: 5, color: '#f59e0b' },
    { name: 'Hard', count: 1, color: '#ef4444' },
  ];

  const hintDependencyData = [
    { week: 'W1', avgHints: 2.8 },
    { week: 'W2', avgHints: 2.4 },
    { week: 'W3', avgHints: 1.9 },
    { week: 'W4', avgHints: 1.2 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Retention & Learning Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data insights on problem-solving autonomy and cognitive retention curves.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">Sample Data Preview</Badge>
        </div>
      </div>

      <DemoNoticeBanner />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="p-5 bg-dark-900 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Weekly Practice Activity</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="attempts" fill="#10b981" name="Attempts" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hints" fill="#06b6d4" name="Hints Used" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Problems by Difficulty */}
        <Card className="p-5 bg-dark-900 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Solved by Difficulty</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">14 Solved Total</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs">
            {difficultyData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300 font-medium">{d.name}:</span>
                <span className="text-slate-500 font-mono">{d.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Hint Reliance Curve */}
        <Card className="p-5 bg-dark-900 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Hint Reliance Trajectory</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">-57% Dependency</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hintDependencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 4]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgHints"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#a855f7' }}
                  name="Avg Hints / Problem"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Downwards trajectory demonstrates developing algorithmic autonomy.
          </p>
        </Card>

        {/* Socratic vs Direct Method Comparison */}
        <Card className="p-5 bg-dark-900 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Socratic vs Direct Concept Retention</h3>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-dark-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Socratic Guided Session Retention</span>
                <span className="text-emerald-400 font-mono">92%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Problems solved with progressive inquiry retain 3x longer over 30-day re-tests.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-dark-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Direct Concept Review Retention</span>
                <span className="text-cyan-400 font-mono">64%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '64%' }} />
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Direct concept definitions provide fast review but lower recall durability.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
