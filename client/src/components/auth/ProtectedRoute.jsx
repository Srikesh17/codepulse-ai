import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, initialLoading } = useAuth();
  const location = useLocation();

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-xl blur-lg bg-emerald-500/20 -z-10 animate-pulse" />
        </div>
        <p className="text-xs font-mono text-slate-400">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve intended destination after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
