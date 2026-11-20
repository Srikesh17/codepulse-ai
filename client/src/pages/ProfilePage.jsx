import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Sparkles,
  Check,
  Edit2,
  Code2,
  Target,
  FileText,
  AlertCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../services/userApi';

export default function ProfilePage() {
  const { user, isDemo, updateProfile: updateAuthUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || 'Alex Rivera',
    preferredLanguage: user?.preferredLanguage || 'python',
    learningGoal: user?.learningGoal || 'Master Algorithmic Patterns',
    bio: user?.bio || '',
  });

  // Fetch full profile from API if authenticated
  useEffect(() => {
    if (isDemo) return;

    let isMounted = true;
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await userApi.getProfile();
        if (isMounted && res?.data) {
          setFormData({
            fullName: res.data.fullName || '',
            preferredLanguage: res.data.preferredLanguage || 'python',
            learningGoal: res.data.learningGoal || '',
            bio: res.data.bio || '',
          });
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isDemo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // If demo mode, save in memory / context only
    if (isDemo) {
      updateAuthUser({
        name: formData.fullName,
        fullName: formData.fullName,
        preferredLanguage: formData.preferredLanguage,
        learningGoal: formData.learningGoal,
        bio: formData.bio,
      });
      setIsEditing(false);
      setSaving(false);
      showToast('Profile updated in Demo mode.', 'info');
      return;
    }

    try {
      const res = await userApi.updateProfile(formData);
      updateAuthUser(res.data);
      setIsEditing(false);
      showToast('Profile updated successfully in PostgreSQL!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account settings, coding preferences, and learning objectives.
        </p>
      </div>

      <DemoNoticeBanner compact={!isDemo} />

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <Card className="p-6 bg-dark-900 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-2xl uppercase shadow-glow-emerald shrink-0">
            {formData.fullName.slice(0, 2) || 'ST'}
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-xl font-bold text-white truncate">{formData.fullName}</h2>
              <Badge variant={isDemo ? 'amber' : 'emerald'} size="sm">
                {isDemo ? 'Guest Demo Mode' : 'PostgreSQL Verified Account'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'student@example.com'}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-slate-300 capitalize">{formData.preferredLanguage}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[200px] text-slate-300">{formData.learningGoal || 'General Mastery'}</span>
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
                Edit Profile
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

        {/* View / Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="pt-4 border-t border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Display Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 tracking-wide">
                  Preferred Language <span className="text-emerald-400">*</span>
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-dark-900 border border-slate-700/80 text-slate-100 text-sm py-2.5 px-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="python">Python 3 (Recommended)</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
            </div>

            <Input
              label="Learning Goal"
              name="learningGoal"
              value={formData.learningGoal}
              onChange={handleChange}
              placeholder="e.g. Master Dynamic Programming for interviews"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 tracking-wide">
                Bio & Background
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share your software engineering focus, target companies, or algorithm study plan..."
                className="w-full rounded-lg bg-dark-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={saving}>
                Save to Database
              </Button>
            </div>
          </form>
        ) : (
          <div className="pt-4 border-t border-slate-800 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-dark-950 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Preferred Language</span>
                <p className="text-slate-200 font-semibold capitalize">{formData.preferredLanguage}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-dark-950 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Learning Goal</span>
                <p className="text-slate-200 font-semibold">{formData.learningGoal || 'Not specified'}</p>
              </div>
            </div>

            {formData.bio && (
              <div className="p-3.5 rounded-lg bg-dark-950 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Bio</span>
                <p className="text-slate-300 leading-relaxed">{formData.bio}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Backend & Database Persistence Architecture Info */}
      <Card className="p-6 bg-dark-900 border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Database & Persistence Architecture</h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-dark-950 border border-slate-800 flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">PostgreSQL Schemas Active</span>
              <p className="text-slate-400 mt-0.5">
                Tables <code className="text-emerald-400">users</code>, <code className="text-emerald-400">user_profiles</code>, <code className="text-emerald-400">user_activity</code>, and <code className="text-emerald-400">student_statistics</code> are configured with relational cascade foreign keys.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-dark-950 border border-slate-800 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">HttpOnly Cookie Authentication</span>
              <p className="text-slate-400 mt-0.5">
                JWT session tokens are strictly stored in HttpOnly cookies, protecting your session from XSS extraction while enabling seamless persistence on browser refreshes.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
