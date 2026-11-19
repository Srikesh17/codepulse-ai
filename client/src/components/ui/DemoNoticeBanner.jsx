import React from 'react';
import { Info, Sparkles, Database } from 'lucide-react';

export default function DemoNoticeBanner({ className = '', compact = false }) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          <strong className="font-semibold">Phase 1 Frontend Preview:</strong> Demo mode active. No credentials stored.
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-dark-850 to-dark-900 border border-emerald-500/30 text-xs text-slate-300 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-400 mt-0.5 shrink-0">
          <Database className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-300">Phase 1 Architecture Notice</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300 uppercase">
              Demo Only
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Authentication is simulated client-side for immediate frontend review. Real PostgreSQL authentication, secure JWT sessions, and the Express backend will be introduced in Phase 2.
          </p>
        </div>
      </div>
    </div>
  );
}
