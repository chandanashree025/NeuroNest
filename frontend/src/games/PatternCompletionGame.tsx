import React, { useState } from 'react';
import { GameResult, DifficultyLevel } from '../types';
import { GameResultModal } from './GameResultModal';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface Props {
  userId: string;
  difficulty?: DifficultyLevel;
  onSaveResult: (result: GameResult) => Promise<any>;
  onBack: () => void;
}

interface PatternRound {
  sequence: string[];
  options: string[];
  answer: string;
  hint: string;
}

const PATTERNS_BY_DIFFICULTY: Record<DifficultyLevel, PatternRound[]> = {
  Easy: [
    {
      sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'],
      options: ['🔵', '🟡', '🟢', '🔴'],
      answer: '🔵',
      hint: 'The pattern simply alternates between red and blue.'
    },
    {
      sequence: ['1', '2', '3', '4'],
      options: ['5', '6', '7', '8'],
      answer: '5',
      hint: 'Basic counting up by 1.'
    },
    {
      sequence: ['☀️', '🌙', '☀️', '🌙'],
      options: ['☀️', '⭐', '☁️', '🌧️'],
      answer: '☀️',
      hint: 'Day sun follows night moon.'
    },
    {
      sequence: ['10', '20', '30', '40'],
      options: ['45', '50', '60', '70'],
      answer: '50',
      hint: 'Counting up by 10s.'
    }
  ],
  Medium: [
    {
      sequence: ['2', '4', '6', '8'],
      options: ['9', '10', '12', '14'],
      answer: '10',
      hint: 'Each number increases by 2.'
    },
    {
      sequence: ['🌱', '🌿', '🌳', '🌱', '🌿'],
      options: ['🌳', '🍂', '🌾', '🌸'],
      answer: '🌳',
      hint: 'The plant growth cycle repeats: sprout, leaves, tree.'
    },
    {
      sequence: ['5', '10', '15', '20'],
      options: ['22', '25', '30', '35'],
      answer: '25',
      hint: 'Counting up by 5s.'
    },
    {
      sequence: ['🟥', '🟦', '🟩', '🟥', '🟦'],
      options: ['🟩', '🟨', '🟧', '🟪'],
      answer: '🟩',
      hint: 'Three colors repeat in order: red, blue, green.'
    }
  ],
  Hard: [
    {
      sequence: ['2', '4', '8', '16'],
      options: ['24', '30', '32', '36'],
      answer: '32',
      hint: 'Each number doubles (multiplied by 2).'
    },
    {
      sequence: ['1', '3', '6', '10'],
      options: ['13', '14', '15', '16'],
      answer: '15',
      hint: 'The difference grows by 1 each time (+2, +3, +4, +5).'
    },
    {
      sequence: ['🟢', '🔺', '🟢', '🔺', '🔺', '🟢'],
      options: ['🔺', '🟢', '⭐', '🔷'],
      answer: '🔺',
      hint: 'The triangles grow in repetition (1 triangle, 2 triangles, 3 triangles).'
    },
    {
      sequence: ['100', '90', '81', '73'],
      options: ['64', '65', '66', '67'],
      answer: '66',
      hint: 'The subtraction decreases step-by-step: -10, -9, -8, then -7.'
    }
  ]
};

export const PatternCompletionGame: React.FC<Props> = ({
  userId,
  difficulty: initialDifficulty = 'Medium',
  onSaveResult,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const patterns = PATTERNS_BY_DIFFICULTY[difficulty] || PATTERNS_BY_DIFFICULTY.Medium;
  const pattern = patterns[currentIdx] || patterns[0];

  const resetGame = (lvl = difficulty) => {
    setCurrentIdx(0);
    setMistakes(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setFeedback(null);
    setStartTime(Date.now());
    setShowModal(false);
  };

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    resetGame(newLevel);
  };

  const handleChoose = (opt: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);

    if (opt === pattern.answer) {
      setFeedback(`Correct! Excellent logical reasoning.`);
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback(`Not quite. The answer was ${pattern.answer}. ${pattern.hint}`);
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIdx + 1 < patterns.length) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        finishGame(opt === pattern.answer ? mistakes : mistakes + 1, opt === pattern.answer ? correctCount + 1 : correctCount);
      }
    }, 1400);
  };

  const finishGame = async (finalMistakes: number, finalCorrect: number) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((finalCorrect / patterns.length) * 100);
    const diffBonus = difficulty === 'Hard' ? 1.2 : difficulty === 'Easy' ? 0.9 : 1.0;
    const rawScore = (accuracy * 0.85) + (finalCorrect * 6) - (finalMistakes * 8);
    const score = Math.min(100, Math.max(15, Math.round(rawScore * diffBonus)));

    const standardized: GameResult = {
      userId,
      game: 'Pattern Completion',
      gameId: 'pattern-completion',
      gameName: 'Pattern Completion',
      cognitiveSkill: 'Reasoning',
      difficulty,
      score,
      accuracy,
      mistakes: finalMistakes,
      responseTime: elapsedSeconds,
      timestamp: new Date().toISOString()
    };

    setResult(standardized);
    try {
      const resp = await onSaveResult(standardized);
      if (resp && resp.aiRecommendation) {
        setAiRecommendation(resp.aiRecommendation);
      }
    } catch (e) {
      console.error(e);
    }
    setShowModal(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm mb-1">
            <Lightbulb className="w-5 h-5" />
            <span>Cognitive Reasoning Exercise</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Pattern Completion
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Puzzle {currentIdx + 1} of {patterns.length} ({difficulty} Level)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Level Switcher */}
          <div className="flex items-center gap-1 p-1 bg-sky-50 dark:bg-navy-800 rounded-2xl border border-sky-200 dark:border-navy-700">
            {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleDifficultyChange(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  difficulty === lvl
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-sky-600'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => resetGame(difficulty)}
            className="p-2.5 rounded-2xl bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-navy-700"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm text-center">
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-6">
          Find what comes next in the sequence:
        </h3>

        {/* Sequence Display */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          {pattern.sequence.map((item, i) => (
            <div
              key={i}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-50 dark:bg-navy-800 border-2 border-sky-200 dark:border-navy-700 flex items-center justify-center text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 shadow-sm"
            >
              {item}
            </div>
          ))}

          {/* Missing tile placeholder */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-dashed border-amber-400 text-amber-500 flex items-center justify-center text-2xl font-black animate-pulse">
            ?
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
          {pattern.options.map((opt, i) => {
            const isChosen = selectedOption === opt;
            let cls = 'bg-white dark:bg-navy-850 border-sky-200 dark:border-navy-700 hover:border-sky-400';
            if (isChosen) {
              cls = opt === pattern.answer
                ? 'bg-teal-100 dark:bg-teal-900 border-teal-500 text-teal-900 ring-4 ring-teal-300'
                : 'bg-rose-100 dark:bg-rose-900 border-rose-500 text-rose-900 ring-4 ring-rose-300';
            }

            return (
              <button
                key={i}
                onClick={() => handleChoose(opt)}
                disabled={selectedOption !== null}
                className={`h-16 sm:h-20 rounded-2xl border-2 text-2xl sm:text-3xl font-black flex items-center justify-center transition-all cursor-pointer shadow-sm ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className="p-3 bg-sky-50 dark:bg-navy-800 rounded-2xl border border-sky-200 dark:border-navy-700 text-sm font-semibold text-sky-800 dark:text-sky-300">
            {feedback}
          </div>
        )}
      </div>

      <GameResultModal
        isOpen={showModal}
        result={result}
        aiRecommendation={aiRecommendation}
        onReplay={() => resetGame(difficulty)}
        onBackToGames={onBack}
      />
    </div>
  );
};
