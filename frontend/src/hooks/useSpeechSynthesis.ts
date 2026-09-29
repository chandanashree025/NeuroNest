import { useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface UseSpeechSynthesisReturn {
  speak: (text: string, language?: LanguageCode) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

const LANG_LOCALE_MAP: Record<LanguageCode, string> = {
  en: 'en-US',
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  as: 'as-IN'
};

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = (text: string, language: LanguageCode = 'en') => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = LANG_LOCALE_MAP[language] || 'en-US';
    utterance.lang = targetLang;
    utterance.rate = 0.88; // Slightly slower, calm cadence for elderly comprehension
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang) || v.lang.startsWith(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
};
