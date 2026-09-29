import React, { useState } from 'react';
import { HeartHandshake, UserPlus, Lock, Mail, User, Globe, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode } from '../types';

interface SignupPageProps {
  onNavigateLogin: (msg?: string) => void;
  onNavigateHome: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateLogin,
  onNavigateHome,
}) => {
  const { signup } = useAuth();
  const { supportedLanguages } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>('en');
  const [role, setRole] = useState<'OLDER_ADULT' | 'CAREGIVER'>('OLDER_ADULT');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name,
        email,
        password,
        confirm_password: confirmPassword,
        age: age ? Number(age) : undefined,
        preferred_language: preferredLanguage,
        role,
      });

      // Show message and redirect to login (no auto-login)
      onNavigateLogin('Your account has been created successfully. Please log in.');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
          Create your NeuroNest account
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Begin your journey with personalized cognitive support
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-navy-850 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-sky-100 dark:border-navy-700">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
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
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
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
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                  />
                </div>
              </div>
            </div>

            {/* Age & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 72"
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Preferred Language
                </label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-base cursor-pointer"
                  >
                    {supportedLanguages.map((l) => (
                      <option key={l.code} value={l.code} className="dark:bg-navy-900">
                        {l.nativeLabel} ({l.label})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('OLDER_ADULT')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    role === 'OLDER_ADULT'
                      ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-2 ring-sky-300'
                      : 'border-sky-100 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="block font-black text-base">Older Adult</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Engage in activities, memory recall & companion
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CAREGIVER')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    role === 'CAREGIVER'
                      ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-300'
                      : 'border-sky-100 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="block font-black text-base">Caregiver</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Support family members, upload photos & view trends
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold text-lg shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigateLogin()}
                className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
