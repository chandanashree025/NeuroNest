import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Globe,
  Type,
  Eye,
  Sliders,
  Mic,
  Volume2,
  Bell,
  Lock,
  LogOut,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, TextSize } from '../context/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { authApi } from '../services/api';
import { LanguageCode } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    highContrast,
    toggleHighContrast,
    reduceAnimation,
    toggleReduceAnimation,
  } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();

  // Settings states
  const [voiceInput, setVoiceInput] = useState(true);
  const [tts, setTts] = useState(true);
  const [activityReminders, setActivityReminders] = useState(true);
  const [caregiverNotifications, setCaregiverNotifications] = useState(true);
  const [memoryPermissions, setMemoryPermissions] = useState('Caregivers & Self');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await authApi.getSettings();
        if (s) {
          if (s.text_size) setTextSize(s.text_size as TextSize);
          if (s.voice_input_enabled !== undefined) setVoiceInput(s.voice_input_enabled);
          if (s.tts_enabled !== undefined) setTts(s.tts_enabled);
          if (s.activity_reminders !== undefined) setActivityReminders(s.activity_reminders);
          if (s.caregiver_notifications !== undefined) setCaregiverNotifications(s.caregiver_notifications);
          if (s.memory_permissions) setMemoryPermissions(s.memory_permissions);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSavePreferences = async () => {
    try {
      await authApi.updateSettings({
        text_size: textSize,
        high_contrast: highContrast,
        reduce_animation: reduceAnimation,
        voice_input_enabled: voiceInput,
        tts_enabled: tts,
        activity_reminders: activityReminders,
        caregiver_notifications: caregiverNotifications,
        memory_permissions: memoryPermissions,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Preferences & Accessibility
          </span>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
            Settings
          </h1>
        </div>

        <button
          onClick={handleSavePreferences}
          className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-sky-500/25"
        >
          <Check className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {/* 1. APPEARANCE */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sun className="w-4 h-4 text-sky-500" />
          <span>Appearance</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border-2 font-bold text-base flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-300'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            <div className="text-left">
              <span className="block">Light Mode</span>
              <span className="text-xs font-normal text-slate-500">Default bright calm theme</span>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border-2 font-bold text-base flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-sky-500 bg-navy-800 text-white ring-2 ring-sky-400'
                : 'border-navy-700 text-slate-400 hover:bg-navy-900'
            }`}
          >
            <Moon className="w-6 h-6 text-sky-400" />
            <div className="text-left">
              <span className="block">Dark Mode</span>
              <span className="text-xs font-normal text-slate-400">Calm dark navy / blue</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. LANGUAGE */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-500" />
          <span>Language</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {supportedLanguages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 dark:bg-navy-800 text-sky-900 dark:text-sky-200 font-black ring-2 ring-sky-300'
                    : 'border-sky-100 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 font-semibold hover:border-sky-300'
                }`}
              >
                <span className="block text-base">{l.nativeLabel}</span>
                <span className="text-xs text-slate-400">{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACCESSIBILITY */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-500" />
          <span>Accessibility</span>
        </h3>

        {/* Text Sizing */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-2">
            Text Size
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'normal', label: 'Normal', preview: 'A' },
              { id: 'large', label: 'Large', preview: 'A+' },
              { id: 'extra_large', label: 'Extra Large', preview: 'A++' },
            ].map((ts) => (
              <button
                key={ts.id}
                onClick={() => setTextSize(ts.id as TextSize)}
                className={`p-4 rounded-2xl border-2 font-bold transition-all text-center ${
                  textSize === ts.id
                    ? 'border-sky-500 bg-sky-50 dark:bg-navy-800 text-sky-900 dark:text-sky-200 ring-2 ring-sky-300'
                    : 'border-sky-100 dark:border-navy-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="block text-xl font-black mb-1">{ts.preview}</span>
                <span className="text-xs">{ts.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-sky-100 dark:border-navy-700">
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">High Contrast Mode</h4>
            <p className="text-xs text-slate-400">Emphasizes borders, button outlines, and text readability</p>
          </div>
          <button
            onClick={toggleHighContrast}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-colors ${
              highContrast
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {highContrast ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Reduce Animation */}
        <div className="flex items-center justify-between pt-4 border-t border-sky-100 dark:border-navy-700">
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Reduce Animation</h4>
            <p className="text-xs text-slate-400">Reduces screen movement and sliding transitions</p>
          </div>
          <button
            onClick={toggleReduceAnimation}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-colors ${
              reduceAnimation
                ? 'bg-teal-500 text-white font-black'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {reduceAnimation ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 4. VOICE */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Mic className="w-4 h-4 text-sky-500" />
          <span>Voice</span>
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-sky-100 dark:border-navy-700">
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Voice Input (Microphone)</h4>
            <p className="text-xs text-slate-400">Speak naturally to the AI companion</p>
          </div>
          <button
            onClick={() => setVoiceInput(!voiceInput)}
            className={`px-5 py-2 rounded-xl text-xs font-bold ${
              voiceInput ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-400'
            }`}
          >
            {voiceInput ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Text-to-Speech (Voice Output)</h4>
            <p className="text-xs text-slate-400">Read assistant responses aloud in a calm voice</p>
          </div>
          <button
            onClick={() => setTts(!tts)}
            className={`px-5 py-2 rounded-xl text-xs font-bold ${
              tts ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-400'
            }`}
          >
            {tts ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* 5. NOTIFICATIONS */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-500" />
          <span>Notifications</span>
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-sky-100 dark:border-navy-700">
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Activity Reminders</h4>
            <p className="text-xs text-slate-400">Gentle prompts for daily morning or afternoon cognitive games</p>
          </div>
          <button
            onClick={() => setActivityReminders(!activityReminders)}
            className={`px-5 py-2 rounded-xl text-xs font-bold ${
              activityReminders ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-400'
            }`}
          >
            {activityReminders ? 'On' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Caregiver Notifications</h4>
            <p className="text-xs text-slate-400">Weekly progress summaries shared with linked family caregivers</p>
          </div>
          <button
            onClick={() => setCaregiverNotifications(!caregiverNotifications)}
            className={`px-5 py-2 rounded-xl text-xs font-bold ${
              caregiverNotifications ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-400'
            }`}
          >
            {caregiverNotifications ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* 6. PRIVACY & LOGOUT */}
      <div className="p-6 sm:p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-sky-500" />
          <span>Privacy & Account</span>
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-sky-100 dark:border-navy-700">
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Memory Permissions</h4>
            <p className="text-xs text-slate-400">Control who can view and upload family photos</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 bg-sky-50 dark:bg-navy-800 rounded-xl text-sky-700 dark:text-sky-300">
            {memoryPermissions}
          </span>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm text-rose-600 dark:text-rose-400">Account Session</h4>
            <p className="text-xs text-slate-400">Sign out of NeuroNest on this device</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-sm rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
