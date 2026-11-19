import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight, Sparkles, BookOpen, Brain, Terminal, Shield } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, exploreDemo, logout } = useAuth();
  const navigate = useNavigate();

  const handleExploreDemo = () => {
    exploreDemo();
    navigate('/dashboard');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors shadow-glow-emerald">
              <Activity className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">CodePulse</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#socratic-method"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Socratic Coach
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              How It Works
            </a>
            <Link
              to="/problems"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>Problems</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 border border-slate-700">Preview</span>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Go to Workspace
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={handleExploreDemo}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Explore Demo
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-dark-950 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Features
            </a>
            <a
              href="#socratic-method"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Socratic Coach
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              How It Works
            </a>
            <Link
              to="/problems"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1 flex items-center justify-between"
            >
              <span>Problems</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">10 Problems</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Go to Workspace
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-center text-xs text-slate-400 py-2 hover:text-slate-200"
                >
                  Logout ({user?.name || 'Demo'})
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="subtle"
                  className="w-full"
                  onClick={handleExploreDemo}
                  leftIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
                >
                  Explore Demo Student Workspace
                </Button>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
