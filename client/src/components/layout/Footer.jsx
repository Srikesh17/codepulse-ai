import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Cpu, Code2, BookOpen, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">CodePulse AI</span>
            </Link>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              Socratic Coding & Retention Coach. Designed to eliminate passive answer copying and build deep mental models for technical interviews and real-world software engineering.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Phase 1 Frontend Prototype
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                React + Vite + Tailwind
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                Monaco Editor Ready
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/problems" className="hover:text-emerald-400 transition-colors">
                  Problem Catalog
                </Link>
              </li>
              <li>
                <a href="#socratic-method" className="hover:text-emerald-400 transition-colors">
                  Socratic Methodology
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-emerald-400 transition-colors">
                  Demo Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Roadmap */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Roadmap (7 Phases)
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Phase 1: Frontend UI & Editor</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span>Phase 2: Express + PostgreSQL Auth</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span>Phase 3: Socratic Gemini AI Tutor</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span>Phase 4: Sandboxed Code Execution</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom banner & copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400/80" />
            <span>
              Demo Notice: This application is a client-side prototype. No personal data or credentials are submitted to external servers.
            </span>
          </div>
          <div>
            © {new Date().getFullYear()} CodePulse AI. Built for technical portfolio demonstration.
          </div>
        </div>
      </div>
    </footer>
  );
}
