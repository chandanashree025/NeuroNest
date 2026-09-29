import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, AlertCircle, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import { GameResult } from '../types';

interface GameResultModalProps {
  isOpen: boolean;
  result: GameResult | null;
  aiRecommendation?: any;
  onReplay: () => void;
  onBackToGames: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  result,
  aiRecommendation,
  onReplay,
  onBackToGames,
}) => {
  useEffect(() => {
    if (isOpen && result && result.accuracy >= 60) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if confetti blocked
      }
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-navy-850 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-navy-700 text-center">
        {/* Trophy icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-900/40 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
          <Trophy className="w-9 h-9" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">
          Activity Completed!
        </h3>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
            {result.gameName} • {result.cognitiveSkill}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
            result.difficulty === 'Easy'
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
              : result.difficulty === 'Hard'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300'
              : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300'
          }`}>
            {result.difficulty}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-sky-50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Score</span>
            <span className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400">
              {Math.round(result.score)}
            </span>
          </div>

          <div className="p-3 bg-teal-50 dark:bg-navy-800 rounded-2xl border border-teal-100 dark:border-navy-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Accuracy</span>
            <span className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">
              {Math.round(result.accuracy)}%
            </span>
          </div>

          <div className="p-3 bg-rose-50 dark:bg-navy-800 rounded-2xl border border-rose-100 dark:border-navy-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Mistakes</span>
            <span className="text-xl sm:text-2xl font-black text-rose-500">
              {result.mistakes}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-navy-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Time</span>
            <span className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-200">
              {Math.round(result.responseTime)}s
            </span>
          </div>
        </div>

        {/* AI Cognitive Coach Feedback */}
        {aiRecommendation && (
          <div className="p-4 bg-sky-50/80 dark:bg-navy-800/80 border border-sky-200 dark:border-sky-900 rounded-2xl text-left mb-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2 mb-1.5 font-bold text-sky-700 dark:text-sky-300">
              <CheckCircle2 className="w-4 h-4 text-sky-500" />
              <span>Cognitive Coach Note</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {aiRecommendation.coach_note || "Great session! Consistent gentle cognitive exercise helps maintain mental agility."}
            </p>
            <div className="mt-2.5 pt-2 border-t border-sky-100 dark:border-navy-700 flex flex-wrap items-center justify-between gap-2 text-xs">
              {aiRecommendation.next_difficulty && (
                <span className="font-bold text-sky-900 dark:text-sky-200">
                  Recommended Difficulty: <strong className="text-teal-600 dark:text-teal-400">{aiRecommendation.next_difficulty}</strong>
                </span>
              )}
              {aiRecommendation.next_game && (
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Next Activity: <em>{aiRecommendation.next_game}</em>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onReplay}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 bg-sky-50 hover:bg-sky-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-sky-700 dark:text-sky-300 font-bold rounded-2xl border border-sky-200 dark:border-navy-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={onBackToGames}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-md shadow-sky-500/25 transition-colors"
          >
            <span>All Games</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
