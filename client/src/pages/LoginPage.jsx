import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  AlertCircle,
  KeyRound,
  Info
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, exploreDemo, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setGeneralError('Invalid credentials or preview timeout. Please try again.');
    }
  };

  const handleFillDemoCreds = () => {
    setFormData({
      email: 'alex.rivera@codepulse.ai',
      password: 'DemoPassword123!',
      rememberMe: true,
    });
    setErrors({});
  };

  const handleDirectDemo = () => {
    exploreDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors shadow-glow-emerald">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">CodePulse AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-400">
            Sign in to continue your algorithmic retention training.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <DemoNoticeBanner />

        {/* Form Card */}
        <Card className="p-6 sm:p-8 space-y-6 bg-dark-900/90 border-slate-800 shadow-xl">
          {generalError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{generalError}</span>
            </div>
          )}

          {forgotPasswordMsg && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-blue-400" />
              <span>
                Password reset emails will be sent via SendGrid in Phase 2. For this preview, use the demo credentials below!
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="e.g. alex.rivera@codepulse.ai"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded bg-dark-950 border-slate-700 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-dark-900"
                />
                <span>Remember me for this session</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotPasswordMsg(true)}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In (Demo Mode)
            </Button>
          </form>

          {/* Quick Demo Credential Autofill */}
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 text-slate-400 text-[11px]">
              <div><strong className="text-slate-300">Test Account:</strong> alex.rivera@codepulse.ai</div>
              <div><strong className="text-slate-300">Pass:</strong> DemoPassword123!</div>
            </div>
            <button
              type="button"
              onClick={handleFillDemoCreds}
              className="text-xs px-2.5 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30 transition-colors whitespace-nowrap"
            >
              Autofill
            </button>
          </div>

          {/* One-click Explore Demo Button */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-900 px-2 text-slate-500 font-mono">Instant Access</span>
            </div>
          </div>

          <Button
            type="button"
            variant="subtle"
            className="w-full"
            onClick={handleDirectDemo}
            leftIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
          >
            Explore Demo Student Workspace
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Create one now
            </Link>
          </p>
        </Card>
      </div>

      {/* Footer disclaimer */}
      <div className="text-center text-xs text-slate-600 mt-8">
        CodePulse AI Prototype • Built for Technical Demonstration
      </div>
    </div>
  );
}
