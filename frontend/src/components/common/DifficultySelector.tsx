import React from 'react';
import { DifficultyLevel } from '../../types';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
  disabled?: boolean;
  className?: string;
  gameName?: string;
  showLabel?: boolean;
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Easy', 'Medium', 'Hard'];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  gameName,
  showLabel = true,
}) => {
  return (
    <div
      className={`w-full min-w-0 max-w-full space-y-1.5 box-border ${
        disabled ? 'opacity-60 pointer-events-none' : ''
      } ${className}`}
      role="group"
      aria-label={gameName ? `Difficulty selector for ${gameName}` : 'Difficulty selector'}
    >
      {showLabel && (
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Difficulty
        </span>
      )}

      {/* 3 Clickable Difficulty Buttons - Always 100% inside parent game card */}
      <div
        className="flex w-full min-w-0 max-w-full gap-1.5 sm:gap-2 select-none box-border"
        role="radiogroup"
        aria-label="Difficulty level selection"
      >
        {DIFFICULTY_LEVELS.map((level) => {
          const isSelected = value === level;

          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(level)}
              className={`flex-1 min-w-0 h-10 sm:h-11 px-2 sm:px-3 rounded-xl text-center text-xs sm:text-sm font-bold whitespace-nowrap flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 box-border ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-2 border-sky-600 dark:border-sky-400 text-sky-800 dark:text-sky-200 shadow-sm'
                  : 'bg-white dark:bg-navy-800/80 border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-navy-600 hover:bg-slate-50 dark:hover:bg-navy-800'
              }`}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
};
