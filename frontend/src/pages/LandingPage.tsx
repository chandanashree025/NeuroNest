import React from 'react';
import {
  HeartHandshake,
  Brain,
  BookHeart,
  Users2,
  MessageSquareHeart,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import { LanguageCode } from '../types';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onNavigateSignup,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-navy-900/90 backdrop-blur border-b border-sky-100 dark:border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                NEURONEST
              </span>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Cognitive & Memory Care
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            <a href="#home" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Home</a>
            <a href="#features" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">How It Works</a>
            <a href="#caregivers" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">For Caregivers</a>
            <a href="#about" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">About</a>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-800 text-slate-600 dark:text-yellow-400"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-sky-700" />}
            </button>

            <button
              onClick={onNavigateLogin}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-navy-800 transition-colors"
            >
              Login
            </button>

            <button
              onClick={onNavigateSignup}
              className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/25 transition-transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-xs sm:text-sm font-bold text-sky-800 dark:text-sky-200">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Personal Memory & Cognitive Assistance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Personalized Memory & Cognitive Support
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              NeuroNest helps older adults stay engaged, connected, and supported through personalized cognitive activities, meaningful memories, and an intelligent companion.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onNavigateSignup}
                className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-3 transition-transform hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-navy-800 hover:bg-sky-50 dark:hover:bg-navy-700 text-sky-800 dark:text-sky-200 font-bold text-lg rounded-2xl border-2 border-sky-200 dark:border-navy-700 flex items-center justify-center gap-2 transition-colors"
              >
                Explore NeuroNest
              </a>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-teal-500" /> Multilingual AI Voice
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-teal-500" /> Private Family Photos
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-teal-500" /> Elder-Friendly Interface
              </span>
            </div>
          </div>

          {/* Healthcare/AI Illustration graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md p-6 bg-gradient-to-tr from-sky-100 via-sky-50 to-teal-50 dark:from-navy-800 dark:to-navy-850 rounded-3xl border border-sky-200 dark:border-navy-700 shadow-2xl">
              {/* Graphic cards */}
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl shadow-md border border-sky-100 dark:border-navy-700 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center text-2xl">
                    🌻
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Sunday Garden Memory</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">"Anitha brought warm tea and fresh flowers."</p>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl shadow-md border border-sky-100 dark:border-navy-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Today's Focus</p>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Sequence Recall</h4>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/80 text-teal-600 border border-teal-200 dark:border-teal-800 text-xs font-bold rounded-full">
                    95% Accuracy
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-r from-sky-500 to-teal-500 rounded-2xl text-white shadow-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <MessageSquareHeart className="w-4 h-4" />
                    <span>NeuroNest Companion</span>
                  </div>
                  <p className="text-sm font-medium italic">
                    "Your daughter Anitha usually visits on Sunday afternoon. Would you like to review your photos together?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-navy-900 border-y border-sky-100 dark:border-navy-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider text-xs">
              Comprehensive Wellbeing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Designed for Dignity, Connection, and Cognitive Health
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Every feature is built around the daily realities of older adults and the peace of mind of family caregivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 bg-sky-50/50 dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cognitive Activities
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Personalized activities for memory, attention, working memory and reasoning with gentle pacing and cheerful encouragement.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-sky-50/50 dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                <BookHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Memory Support
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Store and revisit meaningful personal memories, life stories, favorite places, and cherished routines with high readability.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-sky-50/50 dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                <Users2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Family Connections
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Help caregivers preserve important family memories, photos, schedules, and relationships so elders never feel disconnected.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 bg-sky-50/50 dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <MessageSquareHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Companion
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Talk naturally with NeuroNest in multiple Indian languages with voice input and text-to-speech grounded strictly in true family memories.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 bg-sky-50/50 dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Progress Insights
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Understand activity participation and performance over time without diagnostic labels, highlighting consistency and engagement.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 bg-sky-50/50 dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Personalized AI
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Recommendations adapt to the user's activity history through our 5-agent architecture (Observe, Reason, Delegate, Act, Learn).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider text-xs">
            Simple 6-Step Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            How NeuroNest Works
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            A seamless experience created for older adults to use independently or with caregiver support.
          </p>
        </div>

        {/* 6 Step Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Create Your Account', desc: 'Sign up easily as an Older Adult or a Caregiver managing loved ones.' },
            { step: '02', title: 'Set Up Your Profile', desc: 'Choose your preferred language from 8 options and comfortable text sizing.' },
            { step: '03', title: 'Add Memories & Family', desc: 'Save cherished photos, relatives, and visiting routines securely.' },
            { step: '04', title: 'Complete Cognitive Activities', desc: 'Enjoy 7 tailored cognitive games targeting memory, attention, and reasoning.' },
            { step: '05', title: 'Talk to NeuroNest', desc: 'Ask about relatives or daily routines using natural text or speech.' },
            { step: '06', title: 'Receive Personalized Support', desc: 'Daily recommendations adapt dynamically based on your participation.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm relative group hover:border-sky-300 transition-colors"
            >
              <div className="text-4xl font-black text-sky-200 dark:text-navy-700 mb-3">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* For Caregivers Section */}
      <section id="caregivers" className="py-20 bg-sky-50 dark:bg-navy-900 border-t border-sky-100 dark:border-navy-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider text-xs">
                For Family & Professional Caregivers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Peace of Mind and Thoughtful Insights
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Caregivers can link to multiple family members, upload family photos, record visiting routines, and observe engagement trends without intrusive medical alarms.
              </p>
              <ul className="space-y-3 text-slate-700 dark:text-slate-200 text-sm font-semibold">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-500" />
                  Manage multiple older adults from one centralized portal
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-500" />
                  Update family photos and important memories anytime
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-500" />
                  Receive constructive, non-diagnostic AI activity suggestions
                </li>
              </ul>
              <div>
                <button
                  onClick={onNavigateSignup}
                  className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-base rounded-2xl shadow-md shadow-sky-500/25 transition-transform hover:scale-105"
                >
                  Join as Caregiver
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-navy-700">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Caregiver Overview</span>
                <span className="text-xs bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full font-bold">2 Patients Connected</span>
              </div>
              <div className="p-4 bg-sky-50/60 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700">
                <p className="text-xs font-bold text-sky-800 dark:text-sky-300 mb-1">AI Caregiver Insight:</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  "Recent activity shows lower participation in working-memory activities. Consider encouraging a short sequence session."
                </p>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white dark:bg-navy-900 rounded-2xl border border-sky-100 dark:border-navy-700">
                <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Ramesh Sharma (Father)</h4>
                  <p className="text-xs text-slate-500">Last active today • Memory Match completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          About NeuroNest
        </h2>
        <p className="max-w-3xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          NeuroNest was created to foster joyful engagement, cognitive empowerment, and warm intergenerational bonds. By combining modern cognitive exercises with strictly grounded personal memories, we provide a trustworthy everyday companion for older adults.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-navy-900 border-t border-sky-100 dark:border-navy-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <MedicalDisclaimer variant="banner" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} NEURONEST. All rights reserved.</span>
            <span>Personal Memory & Cognitive Assistance Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
