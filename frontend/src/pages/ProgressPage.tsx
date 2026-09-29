import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Brain,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { progressApi } from '../services/api';
import { ProgressSummary } from '../types';

export const ProgressPage: React.FC = () => {
  const { user, activePatient } = useAuth();
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetUserId = (activePatient && user?.role === 'CAREGIVER') ? activePatient.id : (user?.id || '');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressApi.getProgress(targetUserId);
        setProgress(data);
      } catch (err) {
        console.error('Failed to load progress:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [targetUserId]);

  if (isLoading || !progress) {
    return (
      <div className="p-12 text-center text-slate-400 animate-pulse">
        Loading progress metrics...
      </div>
    );
  }

  const domains = [
    { label: 'Memory', score: progress.memoryScore, color: 'bg-sky-500', barBg: 'bg-sky-100 dark:bg-sky-950/60' },
    { label: 'Working Memory', score: progress.workingMemoryScore, color: 'bg-teal-500', barBg: 'bg-teal-100 dark:bg-teal-950/60' },
    { label: 'Attention', score: progress.attentionScore, color: 'bg-indigo-500', barBg: 'bg-indigo-100 dark:bg-indigo-950/60' },
    { label: 'Reasoning', score: progress.reasoningScore, color: 'bg-amber-500', barBg: 'bg-amber-100 dark:bg-amber-950/60' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <TrendingUp className="w-5 h-5" />
            <span>Activity & Engagement Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
            My Progress
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-xl">
            A clear summary of your completed exercises, streaks, and cognitive engagement over time.
          </p>
        </div>

        {/* Overall Activity Score Badge */}
        <div className="p-6 bg-gradient-to-tr from-sky-500 to-teal-400 text-white rounded-3xl shadow-lg shadow-sky-500/20 text-center min-w-[200px]">
          <span className="text-xs uppercase font-extrabold tracking-wider block text-sky-100">
            Overall Activity Score
          </span>
          <span className="text-4xl sm:text-5xl font-black drop-shadow-sm">
            {Math.round(progress.overallScore)}%
          </span>
          <span className="text-[11px] block mt-1 text-sky-100 font-semibold">
            Based on active exercises
          </span>
        </div>
      </div>

      {/* 4 Cognitive Domains Progress Bars */}
      <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Cognitive Domain Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((dom) => (
            <div key={dom.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-200">{dom.label}</span>
                <span className="text-sky-600 dark:text-sky-400">{Math.round(dom.score)}%</span>
              </div>
              <div className={`w-full h-4 rounded-full ${dom.barBg} overflow-hidden`}>
                <div
                  className={`h-4 rounded-full transition-all duration-700 ${dom.color}`}
                  style={{ width: `${Math.min(100, Math.max(10, dom.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Activity Chart (7 Columns) */}
        <div className="lg:col-span-8 p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Weekly Activity
            </h3>
            <span className="text-xs text-slate-400 font-medium">Last 7 Days</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2">
            {progress.weeklyActivity.map((day, i) => {
              const maxCount = Math.max(1, ...progress.weeklyActivity.map((d) => d.activities));
              const heightPct = Math.max(15, (day.activities / maxCount) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {day.activities}
                  </span>
                  <div
                    className={`w-full max-w-[42px] rounded-2xl transition-all duration-500 ${
                      day.activities > 0
                        ? 'bg-sky-500 dark:bg-sky-600 shadow-md shadow-sky-500/20'
                        : 'bg-slate-100 dark:bg-navy-800'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {day.day}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {day.date.split(' ')[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Highlights Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">
              Completed Activities
            </span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {progress.gamesCompleted}
            </span>
            <p className="text-xs text-slate-500 mt-1">Sessions finished successfully</p>
          </div>

          <div className="p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">
              Assessments Completed
            </span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {progress.assessmentsCompleted}
            </span>
            <p className="text-xs text-slate-500 mt-1">Personalized check-ins recorded</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      {progress.recentGames.length > 0 && (
        <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Recent Activities Log
          </h3>

          <div className="divide-y divide-sky-100 dark:divide-navy-700">
            {progress.recentGames.map((g) => (
              <div key={g.id || Math.random()} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                      {g.gameName || g.game}
                    </h4>
                    {g.difficulty && (
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-lg ${
                        g.difficulty === 'Easy'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : g.difficulty === 'Hard'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                          : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                      }`}>
                        {g.difficulty}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                    {g.cognitiveSkill}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-xs text-slate-400 block">Accuracy</span>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                      {Math.round(g.accuracy)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Score</span>
                    <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                      {Math.round(g.score)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
