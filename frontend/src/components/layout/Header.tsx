import React from 'react';
import { Menu, Sun, Moon, Globe, Type, Users, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageCode } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, activePatient, setActivePatient } = useAuth();
  const { theme, toggleTheme, textSize, setTextSize, highContrast, toggleHighContrast } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();

  const cycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('extra_large');
    else setTextSize('normal');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 bg-white/95 dark:bg-navy-850/95 backdrop-blur border-b border-sky-100 dark:border-navy-700 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <Menu className="w-6 h-6" />
        </button>

        {activePatient && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 rounded-full text-xs sm:text-sm text-sky-900 dark:text-sky-200">
            <Users className="w-4 h-4 text-sky-600" />
            <span>Viewing: <strong>{activePatient.name}</strong></span>
            <button
              onClick={() => setActivePatient(null)}
              className="ml-1 text-sky-600 hover:text-sky-800 dark:text-sky-300 font-bold underline"
              title="Return to your caregiver view"
            >
              (Switch)
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Text Size Accessibility Toggle */}
        <button
          onClick={cycleTextSize}
          title={`Current Text Size: ${textSize.replace('_', ' ')}. Click to enlarge.`}
          aria-label="Adjust font size"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-800 text-xs sm:text-sm font-semibold text-sky-900 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-navy-700"
        >
          <Type className="w-4 h-4 text-sky-600" />
          <span className="hidden sm:inline">Size:</span>
          <span>{textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++'}</span>
        </button>

        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          title={highContrast ? "Disable High Contrast" : "Enable High Contrast"}
          aria-label="Toggle high contrast"
          className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
            highContrast
              ? 'bg-amber-400 text-slate-950 border-amber-500'
              : 'border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden md:inline">Contrast</span>
        </button>

        {/* Language Selector */}
        <div className="relative flex items-center">
          <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400 absolute left-2.5 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            aria-label="Select preferred language"
            className="pl-8 pr-3 py-1.5 rounded-xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code} className="dark:bg-navy-900">
                {l.nativeLabel} ({l.label})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Light/Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 sm:p-2.5 rounded-xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-800 text-slate-700 dark:text-yellow-400 hover:bg-sky-100 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-sky-700" />}
        </button>

        {/* User Avatar / Profile link */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-sky-100 dark:border-navy-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-semibold tracking-wider">
                {user.role === 'OLDER_ADULT' ? 'Senior' : 'Caregiver'}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
