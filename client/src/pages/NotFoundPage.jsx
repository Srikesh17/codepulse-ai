import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-glow-emerald">
        <Activity className="w-8 h-8" />
      </div>
      <span className="text-emerald-400 font-mono text-sm uppercase tracking-wider font-semibold">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4 tracking-tight">
        Lost in Algorithmic Space
      </h1>
      <p className="text-slate-400 max-w-md text-sm mb-8 leading-relaxed">
        The page or problem you requested could not be found. Check the URL or return to the landing page or student workspace.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
