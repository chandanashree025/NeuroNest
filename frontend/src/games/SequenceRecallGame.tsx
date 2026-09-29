import React, { useState, useEffect } from 'react';
import { GameResult, DifficultyLevel } from '../types';
import { GameResultModal } from './GameResultModal';
import { Brain, Play, RotateCcw } from 'lucide-react';
import { DifficultySelector } from '../components/common/DifficultySelector';

interface Props {
  userId: string;
  difficulty?: DifficultyLevel;
  onSaveResult: (result: GameResult) => Promise<any>;
  onBack: () => void;
}

const TILES = [
  { id: 0, label: 'Sky Blue', color: 'bg-sky-400', activeColor: 'bg-sky-200 ring-8 ring-sky-300' },
  { id: 1, label: 'Teal', color: 'bg-teal-400', activeColor: 'bg-teal-200 ring-8 ring-teal-300' },
  { id: 2, label: 'Amber', color: 'bg-amber-400', activeColor: 'bg-amber-200 ring-8 ring-amber-300' },
  { id: 3, label: 'Violet', color: 'bg-violet-400', activeColor: 'bg-violet-200 ring-8 ring-violet-300' },
];

export const SequenceRecallGame: React.FC<Props> = ({
  userId,
  difficulty: initialDifficulty = 'Medium',
  onSaveResult,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [mistakes, setMistakes] = useState<number>(0);
  const [correctRounds, setCorrectRounds] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [result, setResult] = useState<GameResult | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Difficulty sequence length configurations:
  // Easy: 2 rounds of 3 and 4 items
  // Medium: 2 rounds of 5 and 6 items
  // Hard: 3 rounds of 7, 8, and 9 items
  const getRoundLengths = (lvl: DifficultyLevel): number[] => {
    switch (lvl) {
      case 'Easy':
        return [3, 4];
      case 'Hard':
        return [7, 8, 9];
      case 'Medium':
      default:
        return [5, 6];
    }
  };

  const roundLengths = getRoundLengths(difficulty);
  const totalRounds = roundLengths.length;

  const startNewGame = (lvl = difficulty) => {
    setRound(1);
    setMistakes(0);
    setCorrectRounds(0);
    setGameStarted(true);
    setStartTime(Date.now());
    setShowModal(false);
    setResult(null);
    startRound(1, lvl);
  };

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    setGameStarted(false);
    setShowModal(false);
  };

  const startRound = (roundNum: number, lvl = difficulty) => {
    const lengths = getRoundLengths(lvl);
    const len = lengths[roundNum - 1] || 4;
    const newSeq: number[] = [];
    for (let i = 0; i < len; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);
    setUserStep(0);
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    await new Promise((res) => setTimeout(res, 500));

    // Pace: slightly faster on hard, calm on easy/medium
    const flashDuration = difficulty === 'Hard' ? 500 : 650;
    const gapDuration = difficulty === 'Hard' ? 200 : 250;

    for (let i = 0; i < seq.length; i++) {
      setActiveTile(seq[i]);
      await new Promise((res) => setTimeout(res, flashDuration));
      setActiveTile(null);
      await new Promise((res) => setTimeout(res, gapDuration));
    }

    setIsShowingSequence(false);
  };

  const handleTileClick = async (tileId: number) => {
    if (isShowingSequence || !gameStarted) return;

    setActiveTile(tileId);
    setTimeout(() => setActiveTile(null), 250);

    if (tileId === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        setCorrectRounds((prev) => prev + 1);
        if (round >= totalRounds) {
          finishGame(mistakes, correctRounds + 1);
        } else {
          setRound((prev) => prev + 1);
          setTimeout(() => {
            startRound(round + 1);
          }, 800);
        }
      }
    } else {
      setMistakes((prev) => prev + 1);
      setActiveTile(-1);
      setTimeout(() => {
        setActiveTile(null);
        if (round >= totalRounds) {
          finishGame(mistakes + 1, correctRounds);
        } else {
          setRound((prev) => prev + 1);
          startRound(round + 1);
        }
      }, 700);
    }
  };

  const finishGame = async (totalMistakes: number, totalCorrect: number) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((totalCorrect / totalRounds) * 100);
    const diffBonus = difficulty === 'Hard' ? 1.2 : difficulty === 'Easy' ? 0.9 : 1.0;
    const rawScore = (accuracy * 0.8) + (totalCorrect * 8) - (totalMistakes * 10);
    const score = Math.min(100, Math.max(15, Math.round(rawScore * diffBonus)));

    const standardized: GameResult = {
      userId,
      game: 'Sequence Recall',
      gameId: 'sequence-recall',
      gameName: 'Sequence Recall',
      cognitiveSkill: 'Working Memory',
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
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
          <Brain className="w-5 h-5" />
          <span>Working Memory Exercise</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
          Sequence Recall
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Watch the lighted pattern carefully, then repeat it ({roundLengths.join(' & ')} items on {difficulty} level).
        </p>

        {/* Difficulty Selector */}
        <DifficultySelector
          value={difficulty}
          onChange={handleDifficultyChange}
          disabled={isShowingSequence}
          gameName="Sequence Recall"
          className="text-left w-full min-w-0"
        />

        {gameStarted && (
          <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-sky-100 dark:border-navy-700">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Round: <strong className="text-sky-600">{round} / {totalRounds}</strong>
            </span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Step: <strong className="text-teal-600">{userStep} / {sequence.length}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 2x2 Button Grid */}
      <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm mx-auto">
          {TILES.map((tile) => {
            const isHighlighted = activeTile === tile.id;
            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                disabled={isShowingSequence || !gameStarted}
                aria-label={`Tile ${tile.label}`}
                className={`h-32 sm:h-36 rounded-3xl transition-all duration-150 transform flex items-center justify-center shadow-lg ${
                  tile.color
                } ${
                  isHighlighted ? tile.activeColor + ' scale-105' : 'hover:opacity-90 active:scale-95'
                } ${
                  isShowingSequence ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className="text-white font-black text-lg drop-shadow">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Prompt */}
        <div className="text-center mt-6">
          {!gameStarted ? (
            <button
              onClick={() => startNewGame(difficulty)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-sky-500/30 transition-transform hover:scale-105"
            >
              <Play className="w-6 h-6" />
              <span>Start {difficulty} Recall</span>
            </button>
          ) : isShowingSequence ? (
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400 animate-pulse">
              👀 Watch the light pattern...
            </span>
          ) : (
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
              👉 Your turn! Tap the sequence.
            </span>
          )}
        </div>
      </div>

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
