import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldAlert,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import DemoNoticeBanner from '../components/ui/DemoNoticeBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, exploreDemo, loading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Password strength indicators
  const hasMinLength = formData.password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordStrong = hasMinLength && hasLetter && hasNumber;

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordStrong) {
      newErrors.password = 'Password must be 8+ chars and contain both letters and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms to register';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signup(formData.fullName, formData.email, formData.password);
      showToast('Account created successfully! Welcome to CodePulse AI.', 'success');
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      if (err.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: 'An account with this email address already exists.',
        }));
      } else if (err.details) {
        setErrors(err.details);
      } else {
        setGeneralError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleQuickDemo = () => {
    exploreDemo();
    showToast('Entered student workspace in Demo Preview mode.', 'info');
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Create your student account</h2>
          <p className="text-xs text-slate-400">
            Real Express + PostgreSQL authentication now active.
          </p>
        </div>

        {/* Notice Banner */}
        <DemoNoticeBanner compact />

        {/* Form Card */}
        <Card className="p-6 sm:p-8 space-y-6 bg-dark-900/90 border-slate-800 shadow-xl">
          {generalError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              name="fullName"
              placeholder="e.g. Alex Rivera"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              leftIcon={<User className="w-4 h-4" />}
              required
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Min. 8 characters with letters & numbers"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                required
                autoComplete="new-password"
              />

              {/* Password strength checklist */}
              {formData.password && (
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>8+ chars</span>
                  </div>
                  <div className={`flex items-center gap-1 ${hasLetter ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>Letters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>Numbers</span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              autoComplete="new-password"
            />

            <div className="space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded bg-dark-950 border-slate-700 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-dark-900"
                />
                <span>
                  I agree to create a persistent student profile backed by the CodePulse Express & PostgreSQL service.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-400 pl-6">{errors.agreeTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          {/* Quick Bypass / Explore Demo */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-900 px-2 text-slate-500 font-mono">Or explore without account</span>
            </div>
          </div>

          <Button
            type="button"
            variant="subtle"
            className="w-full"
            onClick={handleQuickDemo}
            leftIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
          >
            Explore Demo Student Workspace
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Log in here
            </Link>
          </p>
        </Card>
      </div>

      {/* Footer disclaimer */}
      <div className="text-center text-xs text-slate-600 mt-8">
        CodePulse AI • Phase 2 Backend Foundation & PostgreSQL
      </div>
    </div>
  );
}
