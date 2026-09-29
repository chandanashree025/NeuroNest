import { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../types';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string | null;
  resetTranscript: () => void;
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

export const useSpeechRecognition = (language: LanguageCode = 'en'): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const SpeechRecognition = typeof window !== 'undefined'
    ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    : null;

  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANG_LOCALE_MAP[language] || 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const startListening = () => {
    setError(null);
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = LANG_LOCALE_MAP[language] || 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Start recognition error:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error,
    resetTranscript,
  };
};
