import React, { useState, useEffect } from 'react';
import { GameResult, DifficultyLevel } from '../types';
import { GameResultModal } from './GameResultModal';
import { Image as ImageIcon, RotateCcw, Clock } from 'lucide-react';
import { DifficultySelector } from '../components/common/DifficultySelector';

interface Props {
  userId: string;
  difficulty?: DifficultyLevel;
  onSaveResult: (result: GameResult) => Promise<any>;
  onBack: () => void;
}

interface SceneItem {
  icon: string;
  label: string;
}

interface QuestionItem {
  prompt: string;
  options: string[];
  correct: string;
}

const SCENES_BY_DIFFICULTY: Record<
  DifficultyLevel,
  { items: SceneItem[]; timer: number; questions: QuestionItem[] }
> = {
  Easy: {
    timer: 8,
    items: [
      { icon: '🕰️', label: 'Grandfather Clock' },
      { icon: '🌹', label: 'Red Rose' },
      { icon: '🫖', label: 'Tea Kettle' },
      { icon: '📖', label: 'Open Book' },
    ],
    questions: [
      {
        prompt: 'Was there a Tea Kettle in the scene?',
        options: ['Yes', 'No'],
        correct: 'Yes',
      },
      {
        prompt: 'Which flower was resting on the table?',
        options: ['Red Rose', 'Sunflower', 'Daisy'],
        correct: 'Red Rose',
      }
    ]
  },
  Medium: {
    timer: 10,
    items: [
      { icon: '🕰️', label: 'Grandfather Clock' },
      { icon: '🌹', label: 'Red Rose' },
      { icon: '🫖', label: 'Tea Kettle' },
      { icon: '📖', label: 'Open Book' },
      { icon: '👓', label: 'Reading Glasses' },
      { icon: '🍎', label: 'Sweet Apple' },
    ],
    questions: [
      {
        prompt: 'Was there a Tea Kettle in the scene?',
        options: ['Yes', 'No'],
        correct: 'Yes',
      },
      {
        prompt: 'Which flower was resting on the table?',
        options: ['Red Rose', 'Sunflower', 'Daisy'],
        correct: 'Red Rose',
      },
      {
        prompt: 'What was placed next to the reading book?',
        options: ['Reading Glasses', 'Coffee Mug', 'Pen'],
        correct: 'Reading Glasses',
      }
    ]
  },
  Hard: {
    timer: 12,
    items: [
      { icon: '🕰️', label: 'Grandfather Clock' },
      { icon: '🌹', label: 'Red Rose' },
      { icon: '🫖', label: 'Tea Kettle' },
      { icon: '📖', label: 'Open Book' },
      { icon: '👓', label: 'Reading Glasses' },
      { icon: '🍎', label: 'Sweet Apple' },
      { icon: '🧣', label: 'Blue Wool Scarf' },
      { icon: '☕', label: 'Porcelain Teacup' },
    ],
    questions: [
      {
        prompt: 'What color was the winter wool scarf?',
        options: ['Blue', 'Red', 'Yellow'],
        correct: 'Blue',
      },
      {
        prompt: 'Was there a pair of Reading Glasses in the room?',
        options: ['Yes', 'No'],
        correct: 'Yes',
      },
      {
        prompt: 'Which fresh fruit was placed on the table?',
        options: ['Sweet Apple', 'Pear', 'Banana'],
        correct: 'Sweet Apple',
      },
      {
        prompt: 'Which container was paired with the tea kettle?',
        options: ['Porcelain Teacup', 'Water Pitcher', 'Metal Flask'],
        correct: 'Porcelain Teacup',
      }
    ]
  }
};

export const PictureMemoryGame: React.FC<Props> = ({
  userId,
  difficulty: initialDifficulty = 'Medium',
  onSaveResult,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [phase, setPhase] = useState<'study' | 'quiz'>('study');
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const sceneData = SCENES_BY_DIFFICULTY[difficulty] || SCENES_BY_DIFFICULTY.Medium;
  const questions = sceneData.questions;

  const startNewGame = (lvl = difficulty) => {
    const data = SCENES_BY_DIFFICULTY[lvl] || SCENES_BY_DIFFICULTY.Medium;
    setPhase('study');
    setTimeLeft(data.timer);
    setQuestionIdx(0);
    setMistakes(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setFeedback(null);
    setStartTime(Date.now());
    setShowModal(false);
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (phase !== 'study') return;
    if (timeLeft <= 0) {
      setPhase('quiz');
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

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    const currentQ = questions[questionIdx];
    const isCorrect = option === currentQ.correct;

    if (isCorrect) {
      setFeedback('Correct! Great visual memory.');
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback(`Incorrect. The answer was ${currentQ.correct}.`);
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      if (questionIdx + 1 < questions.length) {
        setQuestionIdx((prev) => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        finishGame(isCorrect ? mistakes : mistakes + 1, isCorrect ? correctCount + 1 : correctCount);
      }
    }, 1400);
  };

  const finishGame = async (finalMistakes: number, finalCorrect: number) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((finalCorrect / questions.length) * 100);
    const diffBonus = difficulty === 'Hard' ? 1.2 : difficulty === 'Easy' ? 0.9 : 1.0;
    const rawScore = (accuracy * 0.85) + (finalCorrect * 8) - (finalMistakes * 8);
    const score = Math.min(100, Math.max(15, Math.round(rawScore * diffBonus)));

    const standardized: GameResult = {
      userId,
      game: 'Picture Memory',
      gameId: 'picture-memory',
      gameName: 'Picture Memory',
      cognitiveSkill: 'Visual Memory',
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
              <ImageIcon className="w-5 h-5" />
              <span>Visual Memory Exercise</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
              Picture Memory
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {phase === 'study'
                ? `Observe this cozy setting (${sceneData.items.length} items, ${difficulty} Level)`
                : `Question ${questionIdx + 1} of ${questions.length}`}
            </p>
          </div>

          <button
            onClick={() => startNewGame(difficulty)}
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
          gameName="Picture Memory"
          className="w-full min-w-0"
        />
      </div>

      {/* Main View */}
      {phase === 'study' ? (
        <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold rounded-2xl border border-amber-200 dark:border-amber-900 mb-6">
            <Clock className="w-5 h-5" />
            <span>Observe: {timeLeft}s remaining</span>
          </div>

          <div className={`grid gap-4 max-w-lg mx-auto mb-6 ${difficulty === 'Easy' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {sceneData.items.map((item, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-3xl bg-sky-50 dark:bg-navy-800 border-2 border-sky-100 dark:border-navy-700 flex flex-col items-center justify-center shadow-sm"
              >
                <span className="text-4xl sm:text-5xl mb-2">{item.icon}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Notice each object and its detail. Relax and look over the items.
          </p>
        </div>
      ) : (
        <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            {questions[questionIdx].prompt}
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-6">
            {questions[questionIdx].options.map((opt, i) => {
              const isChosen = selectedOption === opt;
              let cls = 'bg-white dark:bg-navy-850 border-sky-200 dark:border-navy-700 hover:border-sky-400 text-slate-800 dark:text-slate-100';
              if (isChosen) {
                cls = opt === questions[questionIdx].correct
                  ? 'bg-teal-100 dark:bg-teal-900 border-teal-500 text-teal-900'
                  : 'bg-rose-100 dark:bg-rose-900 border-rose-500 text-rose-900';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={selectedOption !== null}
                  className={`w-full sm:w-auto px-6 py-4 rounded-2xl border-2 font-black text-base sm:text-lg transition-all cursor-pointer shadow-sm ${cls}`}
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
