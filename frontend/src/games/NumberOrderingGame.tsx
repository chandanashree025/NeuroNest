import React, { useState, useEffect } from 'react';
import { GameResult, DifficultyLevel } from '../types';
import { GameResultModal } from './GameResultModal';
import { Binary, RotateCcw, Check } from 'lucide-react';

interface Props {
  userId: string;
  difficulty?: DifficultyLevel;
  onSaveResult: (result: GameResult) => Promise<any>;
  onBack: () => void;
}

interface NumberTile {
  num: number;
  isCompleted: boolean;
}

export const NumberOrderingGame: React.FC<Props> = ({
  userId,
  difficulty: initialDifficulty = 'Medium',
  onSaveResult,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [tiles, setTiles] = useState<NumberTile[]>([]);
  const [nextExpected, setNextExpected] = useState<number>(1);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [result, setResult] = useState<GameResult | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getNumberCount = (lvl: DifficultyLevel): number => {
    switch (lvl) {
      case 'Easy':
        return 4;
      case 'Hard':
        return 8;
      case 'Medium':
      default:
        return 6;
    }
  };

  const totalNumbers = getNumberCount(difficulty);

  const initGame = (lvl = difficulty) => {
    const count = getNumberCount(lvl);
    const nums: number[] = [];
    for (let i = 1; i <= count; i++) {
      nums.push(i);
    }
    // Shuffle
    const shuffled = [...nums].sort(() => Math.random() - 0.5);
    setTiles(shuffled.map((n) => ({ num: n, isCompleted: false })));
    setNextExpected(1);
    setMistakes(0);
    setStartTime(Date.now());
    setShowModal(false);
  };

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  const handleDifficultyChange = (lvl: DifficultyLevel) => {
    setDifficulty(lvl);
  };

  const handleTileClick = (num: number) => {
    if (num === nextExpected) {
      const newTiles = tiles.map((t) => (t.num === num ? { ...t, isCompleted: true } : t));
      setTiles(newTiles);

      if (num === totalNumbers) {
        finishGame(mistakes);
      } else {
        setNextExpected(num + 1);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  const finishGame = async (finalMistakes: number) => {
    const count = getNumberCount(difficulty);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((count / (count + finalMistakes)) * 100);
    const diffBonus = difficulty === 'Hard' ? 1.2 : difficulty === 'Easy' ? 0.9 : 1.0;
    const rawScore = (accuracy * 0.85) + 15 - (finalMistakes * 6) - Math.min(15, elapsedSeconds / 3);
    const score = Math.min(100, Math.max(15, Math.round(rawScore * diffBonus)));

    const standardized: GameResult = {
      userId,
      game: 'Number Ordering',
      gameId: 'number-ordering',
      gameName: 'Number Ordering',
      cognitiveSkill: 'Attention & Reasoning',
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
            <Binary className="w-5 h-5" />
            <span>Attention & Sequential Reasoning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Number Ordering
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Tap numbers in ascending order from 1 to {totalNumbers} ({difficulty} level).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty buttons */}
          <div className="flex items-center gap-1 bg-sky-50 dark:bg-navy-800 p-1 rounded-2xl border border-sky-200 dark:border-navy-700">
            {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleDifficultyChange(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  difficulty === lvl
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => initGame(difficulty)}
            className="p-2.5 rounded-2xl bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-navy-700 hover:bg-sky-100 transition-colors"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Target indicator banner */}
      <div className="p-4 bg-sky-50 dark:bg-navy-800 rounded-2xl border border-sky-200 dark:border-navy-700 text-center flex items-center justify-center gap-2">
        <span className="text-base font-semibold text-slate-600 dark:text-slate-300">
          Find and tap next number:
        </span>
        <span className="text-2xl font-black text-sky-600 dark:text-sky-400 px-3 py-0.5 bg-white dark:bg-navy-900 rounded-xl shadow-xs">
          {nextExpected}
        </span>
      </div>

      {/* Grid */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm">
        <div
          className={`grid gap-4 mx-auto ${
            difficulty === 'Easy'
              ? 'grid-cols-2 max-w-xs'
              : difficulty === 'Medium'
              ? 'grid-cols-3 max-w-sm'
              : 'grid-cols-4 max-w-md'
          }`}
        >
          {tiles.map((tile) => (
            <button
              key={tile.num}
              onClick={() => handleTileClick(tile.num)}
              disabled={tile.isCompleted}
              className={`h-24 sm:h-28 rounded-3xl text-3xl sm:text-4xl font-black flex items-center justify-center transition-all cursor-pointer border-2 ${
                tile.isCompleted
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 text-teal-600 opacity-60 scale-95 cursor-default'
                  : 'bg-white dark:bg-navy-800 border-sky-100 dark:border-navy-700 text-slate-800 dark:text-slate-100 hover:border-sky-400 hover:shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              {tile.isCompleted ? <Check className="w-8 h-8 text-teal-600" /> : tile.num}
            </button>
          ))}
        </div>
      </div>

      <GameResultModal
        isOpen={showModal}
        result={result}
        aiRecommendation={aiRecommendation}
        onReplay={() => initGame(difficulty)}
        onBackToGames={onBack}
      />
    </div>
  );
};
