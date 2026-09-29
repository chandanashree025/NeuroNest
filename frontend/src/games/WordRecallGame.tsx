import React, { useState, useEffect } from 'react';
import { GameResult, DifficultyLevel } from '../types';
import { GameResultModal } from './GameResultModal';
import { BookOpen, RotateCcw, Clock, Check } from 'lucide-react';

interface Props {
  userId: string;
  difficulty?: DifficultyLevel;
  onSaveResult: (result: GameResult) => Promise<any>;
  onBack: () => void;
}

const ALL_WORDS_POOL = [
  'Garden', 'Sunshine', 'River', 'Harmony',
  'Breeze', 'Meadow', 'Starlight', 'Blossom'
];

const DISTRACTORS_POOL = [
  'Mountain', 'Candle', 'Clock', 'Window',
  'Teapot', 'Compass', 'Lantern', 'Sparrow'
];

export const WordRecallGame: React.FC<Props> = ({
  userId,
  difficulty: initialDifficulty = 'Medium',
  onSaveResult,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [phase, setPhase] = useState<'study' | 'recall'>('study');
  const [timeLeft, setTimeLeft] = useState(8);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [recallWords, setRecallWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [result, setResult] = useState<GameResult | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const getWordCountAndTimer = (lvl: DifficultyLevel) => {
    switch (lvl) {
      case 'Easy':
        return { count: 4, seconds: 8 };
      case 'Hard':
        return { count: 8, seconds: 14 };
      case 'Medium':
      default:
        return { count: 6, seconds: 10 };
    }
  };

  const startNewGame = (lvl = difficulty) => {
    const { count, seconds } = getWordCountAndTimer(lvl);
    const chosenTargets = ALL_WORDS_POOL.slice(0, count);
    const chosenDistractors = DISTRACTORS_POOL.slice(0, count);

    setTargetWords(chosenTargets);
    setPhase('study');
    setTimeLeft(seconds);
    setSelectedWords([]);
    setMistakes(0);
    setStartTime(Date.now());
    setShowModal(false);

    const combined = [...chosenTargets, ...chosenDistractors].sort(() => Math.random() - 0.5);
    setRecallWords(combined);
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (phase !== 'study') return;
    if (timeLeft <= 0) {
      setPhase('recall');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    startNewGame(newLevel);
  };

  const handleToggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      if (selectedWords.length < targetWords.length) {
        setSelectedWords([...selectedWords, word]);
      }
    }
  };

  const handleSubmitRecall = async () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    let correct = 0;
    let wrong = 0;

    selectedWords.forEach((word) => {
      if (targetWords.includes(word)) {
        correct += 1;
      } else {
        wrong += 1;
      }
    });

    const missed = targetWords.length - correct;
    const totalMistakes = wrong + missed;
    const accuracy = Math.round((correct / targetWords.length) * 100);
    const diffBonus = difficulty === 'Hard' ? 1.2 : difficulty === 'Easy' ? 0.9 : 1.0;
    const rawScore = (correct * (100 / targetWords.length)) - (wrong * 10);
    const score = Math.min(100, Math.max(15, Math.round(rawScore * diffBonus)));

    const standardized: GameResult = {
      userId,
      game: 'Word Recall',
      gameId: 'word-recall',
      gameName: 'Word Recall',
      cognitiveSkill: 'Verbal Memory',
      difficulty,
      score,
      accuracy,
      mistakes: totalMistakes,
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
            <BookOpen className="w-5 h-5" />
            <span>Verbal Memory Exercise</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Word Recall
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {phase === 'study'
              ? `Memorize the ${targetWords.length} words (${difficulty} Level)`
              : `Select the ${targetWords.length} words you memorized`}
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
            onClick={() => startNewGame(difficulty)}
            className="p-2.5 rounded-2xl bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-navy-700"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Study / Recall View */}
      {phase === 'study' ? (
        <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold rounded-2xl border border-amber-200 dark:border-amber-900 mb-6">
            <Clock className="w-5 h-5" />
            <span>Memorize: {timeLeft}s remaining</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto mb-6">
            {targetWords.map((word, i) => (
              <span
                key={i}
                className="px-5 py-3 rounded-2xl bg-sky-50 dark:bg-navy-800 border-2 border-sky-300 dark:border-sky-600 text-lg sm:text-xl font-black text-sky-900 dark:text-sky-100 shadow-sm"
              >
                {word}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Take a deep breath and read each word softly. They will disappear when the timer finishes.
          </p>
        </div>
      ) : (
        <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm text-center">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-6">
            Tap the {targetWords.length} words you saw ({selectedWords.length} / {targetWords.length} selected):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
            {recallWords.map((word, i) => {
              const isSelected = selectedWords.includes(word);
              return (
                <button
                  key={i}
                  onClick={() => handleToggleWord(word)}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25'
                      : 'bg-sky-50/50 dark:bg-navy-800 border-sky-100 dark:border-navy-700 text-slate-700 dark:text-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span className="truncate">{word}</span>
                  {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmitRecall}
            disabled={selectedWords.length === 0}
            className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-md shadow-sky-500/25 transition-transform hover:scale-105"
          >
            Submit {selectedWords.length} Words
          </button>
        </div>
      )}

      <GameResultModal
        isOpen={showModal}
        result={result}
        aiRecommendation={aiRecommendation}
        onReplay={() => startNewGame(difficulty)}
        onBackToGames={onBack}
      />
    </div>
  );
};
