import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  className?: string;
  variant?: 'banner' | 'card' | 'inline';
}

export const MedicalDisclaimer: React.FC<Props> = ({ className = '', variant = 'banner' }) => {
  const { t } = useLanguage();

  if (variant === 'inline') {
    return (
      <p className={`text-xs text-slate-500 dark:text-slate-400 italic ${className}`}>
        * {t('disclaimer', 'NeuroNest provides memory and cognitive assistance. It does not replace professional medical care or diagnosis.')}
      </p>
    );
  }

  return (
    <div
      role="note"
      aria-label="Medical safety notice"
      className={`flex items-center gap-3 p-3.5 bg-sky-50 dark:bg-navy-800 border border-sky-200 dark:border-sky-900/50 rounded-xl text-sky-900 dark:text-sky-200 text-xs sm:text-sm ${className}`}
    >
      <ShieldAlert className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
      <span className="leading-relaxed">
        <strong>Notice:</strong> {t('disclaimer', 'NeuroNest provides memory and cognitive assistance. It does not replace professional medical care or diagnosis.')}
      </span>
    </div>
  );
};
