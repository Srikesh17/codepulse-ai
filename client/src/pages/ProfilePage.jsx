import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Sparkles, Check, Edit2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name });
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your student account settings and training profile.
        </p>
      </div>

      <DemoNoticeBanner />

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile display name updated successfully in local session.</span>
        </div>
      )}

      {/* Main Profile Card */}
      <Card className="p-6 bg-dark-900 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-2xl uppercase shadow-glow-emerald">
            {name.slice(0, 2) || 'ST'}
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-xl font-bold text-white">{name}</h2>
              <Badge variant="emerald" size="sm">
                {user?.role || 'Frontend Demo Student'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'alex.rivera@codepulse.ai'}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {user?.joinedDate || 'November 2026'}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">
                {user?.problemsSolved || 14} Problems Completed
              </span>
            </div>
          </div>

          <div>
            {!isEditing ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Name
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="pt-4 border-t border-slate-800 space-y-4">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Account Settings / Phase 2 Scope */}
      <Card className="p-6 bg-dark-900 border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">System Architecture & Persistence Status</h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-dark-950 border border-slate-800 flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Phase 1 Session Persistence</span>
              <p className="text-slate-400 mt-0.5">
                Current profile edits and draft code in Monaco are preserved via your browser's <code className="text-emerald-400">localStorage</code>.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-dark-950 border border-slate-800 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Phase 2 PostgreSQL Integration</span>
              <p className="text-slate-400 mt-0.5">
                Real student accounts, password hashing with bcrypt, session tokens, and relational database schema will be activated in Prompt 2.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
