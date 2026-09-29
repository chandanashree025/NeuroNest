import React, { useState } from 'react';
import {
  Brain,
  Play,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gamesApi } from '../services/api';
import { GameResult, DifficultyLevel } from '../types';

import { MemoryMatchGame } from '../games/MemoryMatchGame';
import { SequenceRecallGame } from '../games/SequenceRecallGame';
import { OddOneOutGame } from '../games/OddOneOutGame';
import { PatternCompletionGame } from '../games/PatternCompletionGame';
import { WordRecallGame } from '../games/WordRecallGame';
import { PictureMemoryGame } from '../games/PictureMemoryGame';
import { NumberOrderingGame } from '../games/NumberOrderingGame';

interface GameCardMeta {
  id: string;
  name: string;
  skill: string;
  category: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
}

const ALL_GAMES: GameCardMeta[] = [
  {
    id: 'memory-match',
    name: 'Memory Match',
    skill: 'Episodic Memory',
    category: 'Memory',
    description: 'Flip and match calm pairs of comforting illustrations.',
    duration: '3 mins',
    icon: '🌻',
    color: 'from-sky-400 to-sky-600',
  },
  {
    id: 'sequence-recall',
    name: 'Sequence Recall',
    skill: 'Working Memory',
    category: 'Working Memory',
    description: 'Watch gently glowing sequence patterns and repeat them.',
    duration: '2 mins',
    icon: '✨',
    color: 'from-teal-400 to-teal-600',
  },
  {
    id: 'odd-one-out',
    name: 'Odd One Out',
    skill: 'Attention',
    category: 'Attention',
    description: 'Identify the item or shape that differs from the rest.',
    duration: '2 mins',
    icon: '🔍',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'pattern-completion',
    name: 'Pattern Completion',
    skill: 'Reasoning',
    category: 'Reasoning',
    description: 'Discover the missing item in logical progressive sequences.',
    duration: '3 mins',
    icon: '🧩',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    id: 'word-recall',
    name: 'Word Recall',
    skill: 'Verbal Memory',
    category: 'Memory',
    description: 'Read and memorize pleasant everyday words, then recall them.',
    duration: '3 mins',
    icon: '📖',
    color: 'from-rose-400 to-rose-600',
  },
  {
    id: 'picture-memory',
    name: 'Picture Memory',
    skill: 'Visual Memory',
    category: 'Memory',
    description: 'Study a cozy everyday scene and answer observational questions.',
    duration: '3 mins',
    icon: '🖼️',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    id: 'number-ordering',
    name: 'Number Ordering',
    skill: 'Attention & Reasoning',
    category: 'Attention & Reasoning',
    description: 'Tap numbers in ascending order across a relaxed grid.',
    duration: '2 mins',
    icon: '🔢',
    color: 'from-cyan-400 to-blue-600',
  },
];

export const GamesPage: React.FC = () => {
  const { user, activePatient } = useAuth();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<string, DifficultyLevel>>({
    'memory-match': 'Medium',
    'sequence-recall': 'Medium',
    'odd-one-out': 'Medium',
    'pattern-completion': 'Medium',
    'word-recall': 'Medium',
    'picture-memory': 'Medium',
    'number-ordering': 'Medium',
  });

  const targetUserId = (activePatient && user?.role === 'CAREGIVER') ? activePatient.id : (user?.id || 'demo-user');

  const handleSelectDifficulty = (gameId: string, level: DifficultyLevel) => {
    setSelectedDifficulties((prev) => ({
      ...prev,
      [gameId]: level,
    }));
  };

  const handleSaveResult = async (result: GameResult) => {
    return gamesApi.submitResult(result);
  };

  // If a game is active, render the dedicated game component with selected difficulty
  if (activeGameId) {
    const currentDifficulty = selectedDifficulties[activeGameId] || 'Medium';

    return (
      <div className="space-y-6">
        <button
          onClick={() => setActiveGameId(null)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-navy-850 rounded-2xl border border-sky-100 dark:border-navy-700 text-sky-700 dark:text-sky-300 font-bold text-sm hover:bg-sky-50 dark:hover:bg-navy-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Activities</span>
        </button>

        {activeGameId === 'memory-match' && (
          <MemoryMatchGame
            userId={targetUserId}
            difficulty={currentDifficulty}
            onSaveResult={handleSaveResult}
            onBack={() => setActiveGameId(null)}
          />
        )}
        {activeGameId === 'sequence-recall' && (
          <SequenceRecallGame
            userId={targetUserId}
            difficulty={currentDifficulty}
            onSaveResult={handleSaveResult}
            onBack={() => setActiveGameId(null)}
          />
        )}
        {activeGameId === 'odd-one-out' && (
          <OddOneOutGame
            userId={targetUserId}
            difficulty={currentDifficulty}
            onSaveResult={handleSaveResult}
            onBack={() => setActiveGameId(null)}
          />
        )}
        {activeGameId === 'pattern-completion' && (
          <PatternCompletionGame
            userId={targetUserId}
            difficulty={currentDifficulty}
            onSaveResult={handleSaveResult}
            onBack={() => setActiveGameId(null)}
          />
        )}
        {activeGameId === 'word-recall' && (
          <WordRecallGame
            userId={targetUserId}
            difficulty={currentDifficulty}
            onSaveResult={handleSaveResult}
            onBack={() => setActiveGameId(null)}
          />
        )}
        {activeGameId === 'picture-memory' && (
          <PictureMemoryGame
            userId={targetUserId}
            difficulty={currentDifficulty}
            onSaveResult={handleSaveResult}
            onBack={() => setActiveGameId(null)}
          />
        )}
        {activeGameId === 'number-ordering' && (
          <NumberOrderingGame
            userId={targetUserId}
            difficulty={currentDifficulty}
            onSaveResult={handleSaveResult}
            onBack={() => setActiveGameId(null)}
          />
        )}
      </div>
    );
  }

  // Games Hub list view
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <Brain className="w-5 h-5" />
            <span>Cognitive Fitness Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
            Cognitive Activities
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl">
            Gentle exercises scientifically designed for older adults to stimulate memory, attention, working memory, and reasoning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 bg-sky-50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700 text-center">
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">7</span>
            <span className="block text-xs font-semibold text-slate-500">Activities</span>
          </div>
          <div className="p-4 bg-teal-50 dark:bg-navy-800 rounded-2xl border border-teal-100 dark:border-navy-700 text-center">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">3</span>
            <span className="block text-xs font-semibold text-slate-500">Levels Each</span>
          </div>
        </div>
      </div>

      {/* Grid of 7 games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_GAMES.map((game) => {
          const currentDifficulty = selectedDifficulties[game.id] || 'Medium';

          return (
            <div
              key={game.id}
              className="p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg hover:border-sky-300 dark:hover:border-sky-600 transition-all flex flex-col justify-between group space-y-5"
            >
              <div className="space-y-4">
                {/* Icon & Cognitive Ability Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl p-2 rounded-2xl bg-sky-50 dark:bg-navy-800 border border-sky-100 dark:border-navy-700">
                    {game.icon}
                  </span>
                  <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold rounded-full">
                    {game.skill}
                  </span>
                </div>

                {/* Game Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {game.duration}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">Gentle Pacing</span>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-sky-100 dark:border-navy-800">
                {/* Difficulty Selector: Easy, Medium, Hard */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Difficulty Level
                    </span>
                    <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400">
                      {currentDifficulty}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((lvl) => {
                      const isSelected = currentDifficulty === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleSelectDifficulty(game.id, lvl)}
                          className={`py-2.5 px-3 text-xs sm:text-sm font-extrabold rounded-2xl border transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-sky-500 text-white border-sky-500 shadow-sm ring-2 ring-sky-300 dark:ring-sky-700 scale-102'
                              : 'bg-sky-50/70 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-sky-100 dark:border-navy-700 hover:bg-sky-100 dark:hover:bg-navy-700'
                          }`}
                          aria-pressed={isSelected}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Start Game Button */}
                <button
                  onClick={() => setActiveGameId(game.id)}
                  className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Game</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
