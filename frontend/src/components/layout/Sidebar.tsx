import React from 'react';
import {
  Home,
  Gamepad2,
  ClipboardCheck,
  BookHeart,
  MessageSquareHeart,
  TrendingUp,
  Cpu,
  Users2,
  User,
  Settings,
  Globe,
  Sun,
  Moon,
  LogOut,
  X,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageCode } from '../../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  isCollapsed,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

  const handleNav = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const navItems = [
    { id: 'home', label: t('home', 'Home'), icon: Home },
    { id: 'games', label: t('games', 'Games'), icon: Gamepad2 },
    { id: 'assessment', label: t('assessment', 'Assessment'), icon: ClipboardCheck },
    { id: 'memories', label: t('memories', 'Memories'), icon: BookHeart },
    { id: 'companion', label: t('companion', 'Companion'), icon: MessageSquareHeart },
    { id: 'progress', label: t('progress', 'Progress'), icon: TrendingUp },
    { id: 'ai-activity', label: t('aiActivity', 'AI Activity'), icon: Cpu },
    { id: 'caregiver', label: t('caregiver', 'Caregiver'), icon: Users2 },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-navy-900 border-r border-sky-100 dark:border-navy-700 transition-all duration-300 shadow-sm
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Brand / Logo Area */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-sky-100 dark:border-navy-700">
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                  NEURONEST
                </span>
                <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                  Cognitive Care
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                title={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 dark:bg-sky-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-navy-800 hover:text-sky-700 dark:hover:text-sky-300'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-sky-500'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Section Divider */}
          <div className="my-4 border-t border-sky-100 dark:border-navy-700/80" />

          {/* Secondary Items */}
          <button
            onClick={() => handleNav('profile')}
            title={t('profile', 'Profile')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-base font-semibold transition-all ${
              currentPage === 'profile'
                ? 'bg-sky-500 text-white shadow-md dark:bg-sky-600'
                : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-navy-800'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <User className="w-5 h-5 text-sky-500 flex-shrink-0" />
            {!isCollapsed && <span>{t('profile', 'Profile')}</span>}
          </button>

          <button
            onClick={() => handleNav('settings')}
            title={t('settings', 'Settings')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-base font-semibold transition-all ${
              currentPage === 'settings'
                ? 'bg-sky-500 text-white shadow-md dark:bg-sky-600'
                : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-navy-800'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <Settings className="w-5 h-5 text-sky-500 flex-shrink-0" />
            {!isCollapsed && <span>{t('settings', 'Settings')}</span>}
          </button>

          {/* Language Item */}
          {!isCollapsed ? (
            <div className="px-3.5 py-2">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                {t('language', 'Language')}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-sky-200 dark:border-navy-700 bg-sky-50/50 dark:bg-navy-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="dark:bg-navy-900">
                    {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <button
              onClick={() => handleNav('settings')}
              title={t('language', 'Language')}
              className="w-full flex items-center justify-center py-3 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-navy-800 rounded-2xl"
            >
              <Globe className="w-5 h-5 text-sky-500" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-navy-800 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 text-sky-600 flex-shrink-0" />
            )}
            {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* Footer Area: Logout */}
        <div className="p-4 border-t border-sky-100 dark:border-navy-700">
          <button
            onClick={logout}
            title={t('logout', 'Logout')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{t('logout', 'Logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
