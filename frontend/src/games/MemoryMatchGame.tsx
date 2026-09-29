import React, { useState, useEffect } from 'react';
import { GameResult, DifficultyLevel } from '../types';
import { GameResultModal } from './GameResultModal';
import { RotateCcw, Brain, Sparkles } from 'lucide-react';

interface Props {
  userId: string;
  difficulty?: DifficultyLevel;
  onSaveResult: (result: GameResult) => Promise<any>;
  onBack: () => void;
}

interface CardItem {
  id: number;
  pairId: number;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ALL_SYMBOLS = [
  { symbol: '☕', label: 'Warm Tea' },
  { symbol: '🌻', label: 'Sunflower' },
  { symbol: '🏡', label: 'Cozy Home' },
  { symbol: '🕊️', label: 'Peace Dove' },
  { symbol: '🌳', label: 'Green Tree' },
  { symbol: '🍎', label: 'Sweet Apple' },
  { symbol: '🌊', label: 'Calm Ocean' },
  { symbol: '🎶', label: 'Soft Music' },
];

export const MemoryMatchGame: React.FC<Props> = ({
  userId,
  difficulty: initialDifficulty = 'Medium',
  onSaveResult,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [matches, setMatches] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const getPairsCount = (lvl: DifficultyLevel): number => {
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

  const initGame = (lvl = difficulty) => {
    const pairsCount = getPairsCount(lvl);
    const activeSymbols = ALL_SYMBOLS.slice(0, pairsCount);

    const deck: CardItem[] = [];
    let idCounter = 0;
    activeSymbols.forEach((item, index) => {
      deck.push({ id: idCounter++, pairId: index, symbol: item.symbol, label: item.label, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, pairId: index, symbol: item.symbol, label: item.label, isFlipped: false, isMatched: false });
    });

    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMistakes(0);
    setMatches(0);
    setStartTime(Date.now());
    setIsProcessing(false);
    setShowModal(false);
    setResult(null);
  };

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    initGame(newLevel);
  };

  const handleCardClick = (index: number) => {
    if (isProcessing) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setSelectedCards([]);
          setIsProcessing(false);
          const newMatches = matches + 1;
          setMatches(newMatches);

          const pairsCount = getPairsCount(difficulty);
          if (newMatches === pairsCount) {
            handleGameComplete(mistakes);
          }
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setSelectedCards([]);
          setIsProcessing(false);
          setMistakes((prev) => prev + 1);
        }, 1000);
      }
    }
  };

  const handleGameComplete = async (finalMistakes: number) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const pairsCount = getPairsCount(difficulty);
    const totalAttempts = pairsCount + finalMistakes;
    const accuracy = Math.round((pairsCount / Math.max(1, totalAttempts)) * 100);
    const difficultyMultiplier = difficulty === 'Hard' ? 1.15 : difficulty === 'Easy' ? 0.9 : 1.0;
    const rawScore = 100 - (finalMistakes * 6) - Math.min(20, elapsedSeconds / 3);
    const score = Math.min(100, Math.max(15, Math.round(rawScore * difficultyMultiplier)));

    const standardized: GameResult = {
      userId,
      game: 'Memory Match',
      gameId: 'memory-match',
      gameName: 'Memory Match',
      cognitiveSkill: 'Episodic Memory',
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

  const pairsCount = getPairsCount(difficulty);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <Brain className="w-5 h-5" />
            <span>Episodic Memory Exercise</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Memory Match
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Tap cards to find matching gentle pairs ({pairsCount} pairs for {difficulty} level).
          </p>
        </div>

        {/* Difficulty Selector and Restart */}
        <div className="flex flex-wrap items-center gap-3">
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

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Pairs</span>
            <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
              {matches} / {pairsCount}
            </span>
          </div>

          <button
            onClick={() => initGame(difficulty)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-sky-200 dark:border-navy-700 hover:bg-sky-100"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={`grid gap-3 sm:gap-4 ${difficulty === 'Easy' ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'}`}>
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            disabled={card.isFlipped || card.isMatched || isProcessing}
            aria-label={card.isFlipped || card.isMatched ? card.label : 'Hidden Card'}
            className={`h-24 sm:h-32 rounded-3xl flex flex-col items-center justify-center p-2 sm:p-3 text-center transition-all duration-300 border-2 select-none ${
              card.isMatched
                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-800 opacity-90 scale-95'
                : card.isFlipped
                ? 'bg-sky-50 dark:bg-navy-800 border-sky-400 dark:border-sky-500 shadow-md scale-100'
                : 'bg-white dark:bg-navy-800/90 border-sky-100 dark:border-navy-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md cursor-pointer'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <>
                <span className="text-3xl sm:text-4xl mb-1">{card.symbol}</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-full">
                  {card.label}
                </span>
              </>
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-sky-100 dark:bg-navy-700 text-sky-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </button>
        ))}
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
