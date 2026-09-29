import React from 'react';
import {
  Brain,
  BookHeart,
  MessageSquareHeart,
  TrendingUp,
  Users2,
  CalendarCheck,
  Play,
  ArrowRight,
  Sun,
  Sparkles,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onNavigate: (page: string) => void;
}

export const OlderAdultDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Friend';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-sky-400 via-sky-500 to-teal-400 text-white shadow-xl shadow-sky-500/15 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-sky-100 font-bold text-sm tracking-wide uppercase">
            <Sun className="w-5 h-5 text-amber-200 animate-spin-slow" />
            <span>{t('goodMorning', 'Good Morning')} ☀️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm">
            {t('goodMorning', 'Good Morning')}, {firstName}!
          </h1>
          <p className="text-lg sm:text-xl text-sky-50 font-medium pt-1">
            {t('howToSpendTime', 'How would you like to spend your time today?')}
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Today's Recommendation Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border-2 border-sky-200 dark:border-navy-700 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              {t('todayRecommendation', "Today's Recommendation")}
            </span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('sequenceRecall', 'Sequence Recall')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              "{t('sequenceRecallDesc', 'Try a short working-memory activity.')}"
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('games')}
          className="self-start md:self-center px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-500/25 flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Now</span>
        </button>
      </div>

      {/* 6 Main Action Cards */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mb-5">
          Activities & Memories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Cognitive Activities */}
          <div
            onClick={() => onNavigate('games')}
            className="p-6 sm:p-7 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg hover:border-sky-300 dark:hover:border-sky-600 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-navy-800 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t('cognitiveActivities', 'Cognitive Activities')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                7 gentle, engaging games to exercise memory, attention, and reasoning.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
              <span>Play Games</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: My Memories */}
          <div
            onClick={() => onNavigate('memories')}
            className="p-6 sm:p-7 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-600 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-navy-800 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t('myMemories', 'My Memories')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Revisit cherished life moments, favorite places, and joyful family stories.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
              <span>View Library</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Talk to NeuroNest */}
          <div
            onClick={() => onNavigate('companion')}
            className="p-6 sm:p-7 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-navy-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquareHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t('talkToNeuroNest', 'Talk to NeuroNest')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Ask questions or have a friendly chat in your own language using voice or text.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <span>Start Conversation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: My Progress */}
          <div
            onClick={() => onNavigate('progress')}
            className="p-6 sm:p-7 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-navy-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t('myProgress', 'My Progress')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                See your weekly activity streaks, completed exercises, and cognitive scores.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <span>View Progress</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Family */}
          <div
            onClick={() => onNavigate('family')}
            className="p-6 sm:p-7 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg hover:border-sky-300 dark:hover:border-sky-600 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-navy-800 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t('family', 'Family')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Photos, phone numbers, and visiting routines of your loved ones.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
              <span>View Family</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Daily Routine */}
          <div
            onClick={() => onNavigate('memories')}
            className="p-6 sm:p-7 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-navy-800 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t('dailyRoutine', 'Daily Routine')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Gentle reminders: morning park walk, afternoon tea, and family calls.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <span>View Routine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
