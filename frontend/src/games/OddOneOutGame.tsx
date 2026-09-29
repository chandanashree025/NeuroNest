import React, { useState, useEffect } from 'react';
import { GameResult, DifficultyLevel } from '../types';
import { GameResultModal } from './GameResultModal';
import { Eye, RotateCcw } from 'lucide-react';
import { DifficultySelector } from '../components/common/DifficultySelector';

interface Props {
  userId: string;
  difficulty?: DifficultyLevel;
  onSaveResult: (result: GameResult) => Promise<any>;
  onBack: () => void;
}

interface PuzzleRound {
  question: string;
  items: { text: string; icon: string; isOdd: boolean; reason: string }[];
}

const PUZZLES_BY_DIFFICULTY: Record<DifficultyLevel, PuzzleRound[]> = {
  Easy: [
    {
      question: "Which item does not belong with fruits?",
      items: [
        { text: "Apple", icon: "🍎", isOdd: false, reason: "Fruit" },
        { text: "Banana", icon: "🍌", isOdd: false, reason: "Fruit" },
        { text: "Car", icon: "🚗", isOdd: true, reason: "A vehicle (others are delicious fruits)" },
        { text: "Orange", icon: "🍊", isOdd: false, reason: "Fruit" },
      ]
    },
    {
      question: "Which one is not a gentle pet animal?",
      items: [
        { text: "Puppy", icon: "🐶", isOdd: false, reason: "Gentle Pet" },
        { text: "Airplane", icon: "✈️", isOdd: true, reason: "An aircraft (others are cuddly animal friends)" },
        { text: "Kitten", icon: "🐱", isOdd: false, reason: "Gentle Pet" },
        { text: "Bunny", icon: "🐰", isOdd: false, reason: "Gentle Pet" },
      ]
    },
    {
      question: "Which item is not kitchen drinkware?",
      items: [
        { text: "Teacup", icon: "☕", isOdd: false, reason: "Drinkware" },
        { text: "Bicycle", icon: "🚲", isOdd: true, reason: "A bicycle is for riding outside" },
        { text: "Water Glass", icon: "🥛", isOdd: false, reason: "Drinkware" },
        { text: "Coffee Mug", icon: "🍵", isOdd: false, reason: "Drinkware" },
      ]
    },
    {
      question: "Which item is not a blooming flower?",
      items: [
        { text: "Rose", icon: "🌹", isOdd: false, reason: "Flower" },
        { text: "Sunflower", icon: "🌻", isOdd: false, reason: "Flower" },
        { text: "Hammer", icon: "🔨", isOdd: true, reason: "A tool (others are garden flowers)" },
        { text: "Tulip", icon: "🌷", isOdd: false, reason: "Flower" },
      ]
    }
  ],
  Medium: [
    {
      question: "Which item does not belong with sweet fruits?",
      items: [
        { text: "Apple", icon: "🍎", isOdd: false, reason: "Fruit" },
        { text: "Banana", icon: "🍌", isOdd: false, reason: "Fruit" },
        { text: "Carrot", icon: "🥕", isOdd: true, reason: "Vegetable (others are sweet fruits)" },
        { text: "Orange", icon: "🍊", isOdd: false, reason: "Fruit" },
      ]
    },
    {
      question: "Spot the one that is different in category:",
      items: [
        { text: "Sparrow", icon: "🐦", isOdd: false, reason: "Bird" },
        { text: "Goldfish", icon: "🐠", isOdd: true, reason: "Swims in water (others fly in the sky)" },
        { text: "Pigeon", icon: "🕊️", isOdd: false, reason: "Bird" },
        { text: "Eagle", icon: "🦅", isOdd: false, reason: "Bird" },
      ]
    },
    {
      question: "Which item is used for a different purpose?",
      items: [
        { text: "Teacup", icon: "🍵", isOdd: false, reason: "Kitchen drinkware" },
        { text: "Coffee Mug", icon: "☕", isOdd: false, reason: "Kitchen drinkware" },
        { text: "Water Glass", icon: "🥛", isOdd: false, reason: "Kitchen drinkware" },
        { text: "Wristwatch", icon: "⌚", isOdd: true, reason: "Wearable timekeeper" },
      ]
    },
    {
      question: "Find the odd one out:",
      items: [
        { text: "Violin", icon: "🎻", isOdd: false, reason: "String musical instrument" },
        { text: "Guitar", icon: "🎸", isOdd: false, reason: "String musical instrument" },
        { text: "Bicycle", icon: "🚲", isOdd: true, reason: "Vehicle for travel" },
        { text: "Cello", icon: "🪕", isOdd: false, reason: "String musical instrument" },
      ]
    }
  ],
  Hard: [
    {
      question: "Spot the subtle acoustic musical difference:",
      items: [
        { text: "Violin", icon: "🎻", isOdd: false, reason: "String instrument" },
        { text: "Guitar", icon: "🎸", isOdd: false, reason: "String instrument" },
        { text: "Saxophone", icon: "🎷", isOdd: true, reason: "Wind brass instrument (others produce sound via strings)" },
        { text: "Cello", icon: "🪕", isOdd: false, reason: "String instrument" },
      ]
    },
    {
      question: "Which fruit has a subtly different botanical classification?",
      items: [
        { text: "Orange", icon: "🍊", isOdd: false, reason: "Citrus fruit" },
        { text: "Lemon", icon: "🍋", isOdd: false, reason: "Citrus fruit" },
        { text: "Green Apple", icon: "🍏", isOdd: true, reason: "Pome core fruit (others are citrus hesperidia)" },
        { text: "Lime", icon: "🍈", isOdd: false, reason: "Citrus fruit" },
      ]
    },
    {
      question: "Which vessel does not navigate on water?",
      items: [
        { text: "Sailboat", icon: "⛵", isOdd: false, reason: "Watercraft" },
        { text: "Canoe", icon: "🛶", isOdd: false, reason: "Watercraft" },
        { text: "Helicopter", icon: "🚁", isOdd: true, reason: "Air rotary craft (others float on water)" },
        { text: "Cruise Ship", icon: "🚢", isOdd: false, reason: "Watercraft" },
      ]
    },
    {
      question: "Which geometric shape has no straight edges?",
      items: [
        { text: "Triangle", icon: "🔺", isOdd: false, reason: "Polygon with straight lines" },
        { text: "Square", icon: "🟥", isOdd: false, reason: "Polygon with straight lines" },
        { text: "Pentagon", icon: "🛑", isOdd: false, reason: "Polygon with straight lines" },
        { text: "Circle", icon: "⚪", isOdd: true, reason: "Curved shape with zero straight edges" },
      ]
    }
  ]
};

export const OddOneOutGame: React.FC<Props> = ({
  userId,
  difficulty: initialDifficulty = 'Medium',
  onSaveResult,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const puzzles = PUZZLES_BY_DIFFICULTY[difficulty] || PUZZLES_BY_DIFFICULTY.Medium;
  const currentPuzzle = puzzles[currentRoundIdx] || puzzles[0];

  const resetGame = (lvl = difficulty) => {
    setCurrentRoundIdx(0);
    setMistakes(0);
    setCorrectCount(0);
    setSelectedIdx(null);
    setFeedback(null);
    setStartTime(Date.now());
    setShowModal(false);
  };

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    resetGame(newLevel);
  };

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    const chosen = currentPuzzle.items[idx];
    if (chosen.isOdd) {
      setFeedback(`Correct! ${chosen.text} is the odd one: ${chosen.reason}`);
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback(`Not quite. Look closely at the category differences.`);
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentRoundIdx + 1 < puzzles.length) {
        setCurrentRoundIdx((prev) => prev + 1);
        setSelectedIdx(null);
        setFeedback(null);
      } else {
        finishGame(chosen.isOdd ? mistakes : mistakes + 1, chosen.isOdd ? correctCount + 1 : correctCount);
      }
    }, 1400);
  };

  const finishGame = async (finalMistakes: number, finalCorrect: number) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((finalCorrect / puzzles.length) * 100);
    const diffBonus = difficulty === 'Hard' ? 1.2 : difficulty === 'Easy' ? 0.9 : 1.0;
    const rawScore = (accuracy * 0.85) + (finalCorrect * 5) - (finalMistakes * 8);
    const score = Math.min(100, Math.max(15, Math.round(rawScore * diffBonus)));

    const standardized: GameResult = {
      userId,
      game: 'Odd One Out',
      gameId: 'odd-one-out',
      gameName: 'Odd One Out',
      cognitiveSkill: 'Attention',
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
      <div className="p-5 sm:p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm mb-1">
              <Eye className="w-5 h-5" />
              <span>Visual Attention Exercise</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
              Odd One Out
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Question {currentRoundIdx + 1} of {puzzles.length} ({difficulty} Level)
            </p>
          </div>

          <button
            onClick={() => resetGame(difficulty)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-navy-800 text-[#243447] dark:text-slate-200 border border-[#E8E4DC] dark:border-navy-700 hover:bg-[#F2ECE1] dark:hover:bg-navy-700 font-bold text-xs transition-colors self-end sm:self-center cursor-pointer"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        </div>

        {/* Difficulty Selector */}
        <DifficultySelector
          value={difficulty}
          onChange={handleDifficultyChange}
          gameName="Odd One Out"
          className="w-full min-w-0"
        />
      </div>

      {/* Main Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm text-center">
        <h3 className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200 mb-6">
          {currentPuzzle.question}
        </h3>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          {currentPuzzle.items.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            let btnClass = 'bg-sky-50/50 dark:bg-navy-800 border-sky-100 dark:border-navy-700 hover:border-sky-300';
            if (isSelected) {
              btnClass = item.isOdd
                ? 'bg-teal-100 dark:bg-teal-900/60 border-teal-500 text-teal-900 ring-4 ring-teal-300'
                : 'bg-rose-100 dark:bg-rose-900/60 border-rose-500 text-rose-900 ring-4 ring-rose-300';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedIdx !== null}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${btnClass}`}
              >
                <span className="text-5xl mb-2">{item.icon}</span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className="p-3 bg-sky-50 dark:bg-navy-800 rounded-2xl border border-sky-200 dark:border-navy-700 text-sm font-semibold text-sky-800 dark:text-sky-300 animate-in fade-in">
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
