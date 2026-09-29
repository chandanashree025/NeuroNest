import React, { useState } from 'react';
import { HeartHandshake, LogIn, Lock, Mail, AlertCircle, Sparkles, UserRound, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigateSignup: () => void;
  onNavigateHome: () => void;
  onLoginSuccess: () => void;
  successMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateSignup,
  onNavigateHome,
  onLoginSuccess,
  successMessage,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Welcome123!');
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: demoEmail, password: 'Welcome123!' });
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div
          onClick={onNavigateHome}
          className="inline-flex items-center gap-3 cursor-pointer group mb-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
            NEURONEST
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to access your memory library and cognitive activities
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-navy-850 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-sky-100 dark:border-navy-700">
          {/* Success banner from signup */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setForgotMsg(!forgotMsg)}
                className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {forgotMsg && (
              <p className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-sky-50 dark:bg-navy-800 rounded-xl">
                For security, your primary caregiver or administrative support can reset passwords from Settings or Support.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold text-lg shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          {/* Quick Demo Login Helpers */}
          <div className="mt-6 pt-6 border-t border-sky-100 dark:border-navy-700 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Test Accounts:
            </span>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('elderly@neuronest.org')}
                className="flex-1 py-2.5 px-3 bg-sky-50 hover:bg-sky-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-bold border border-sky-200 dark:border-navy-700 flex items-center justify-center gap-1.5"
              >
                <UserRound className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Older Adult Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('caregiver@neuronest.org')}
                className="flex-1 py-2.5 px-3 bg-teal-50 hover:bg-teal-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-teal-700 dark:text-teal-300 rounded-xl text-xs font-bold border border-teal-200 dark:border-navy-700 flex items-center justify-center gap-1.5"
              >
                <HeartPulse className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Caregiver Demo</span>
              </button>
            </div>
          </div>

          {/* Signup link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              New to NeuroNest?{' '}
              <button
                type="button"
                onClick={onNavigateSignup}
                className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
