import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareHeart,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { aiApi } from '../services/api';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { ChatMessage, LanguageCode } from '../types';

export const CompanionPage: React.FC = () => {
  const { user, activePatient } = useAuth();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const targetUserId = (activePatient && user?.role === 'CAREGIVER') ? activePatient.id : (user?.id || '');

  // Speech hooks
  const { isListening, transcript, startListening, stopListening, isSupported: isMicSupported, resetTranscript } = useSpeechRecognition(language);
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: isTtsSupported } = useSpeechSynthesis();

  // Load prior conversation history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await aiApi.getConversations(targetUserId);
        if (history && history.length > 0) {
          setMessages(
            history.map((h: any) => ({
              id: h.id,
              role: h.role,
              content: h.content,
              language: h.language,
              timestamp: h.timestamp
            }))
          );
        } else {
          // Initial gentle greeting
          const welcomeMsg: ChatMessage = {
            id: 'init-msg',
            role: 'assistant',
            content: `Hello! I am your NeuroNest companion. Ask me anything about your family, visiting schedules, or pleasant memories.`,
            language: 'en',
            timestamp: new Date().toISOString()
          };
          setMessages([welcomeMsg]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadChatHistory();
  }, [targetUserId]);

  // When speech transcript updates, update input
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isSending) return;

    if (isListening) {
      stopListening();
    }

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: query,
      language: language,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    resetTranscript();
    setIsSending(true);

    try {
      const resp = await aiApi.chat(query, language, targetUserId);
      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: resp.response,
        language: resp.language || language,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Speak aloud if TTS enabled
      if (ttsEnabled && isTtsSupported) {
        speak(resp.response, (resp.language as LanguageCode) || language);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: "I'm having a brief connection issue. Please try asking again in a moment.",
        language: 'en',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        handleSendMessage(transcript);
      }
    } else {
      startListening();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm mb-1">
            <MessageSquareHeart className="w-5 h-5" />
            <span>TALK TO NEURONEST</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Intelligent Companion
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Answers are grounded in your stored family records and personal memories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Companion Language Picker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-navy-800 border border-sky-200 dark:border-navy-700 rounded-2xl text-xs font-semibold">
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label="Companion language"
              className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="dark:bg-navy-900">
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* TTS Read-Aloud Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setTtsEnabled(!ttsEnabled);
            }}
            title={ttsEnabled ? "Text-to-speech enabled (Click to mute)" : "Click to enable spoken responses"}
            className={`p-2.5 rounded-2xl border transition-colors ${
              ttsEnabled
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-400 border-slate-200 dark:border-navy-700'
            }`}
          >
            {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-bold text-slate-400 flex-shrink-0">Try asking:</span>
        <button
          onClick={() => handleSendMessage("When does my daughter usually visit?")}
          className="px-3 py-1.5 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-semibold rounded-full border border-sky-200 dark:border-navy-700 hover:bg-sky-100 whitespace-nowrap cursor-pointer"
        >
          "When does my daughter usually visit?"
        </button>
        <button
          onClick={() => handleSendMessage("Tell me about our trip to Mysore palace.")}
          className="px-3 py-1.5 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-semibold rounded-full border border-sky-200 dark:border-navy-700 hover:bg-sky-100 whitespace-nowrap cursor-pointer"
        >
          "Tell me about our trip to Mysore palace."
        </button>
        <button
          onClick={() => handleSendMessage("What cognitive game should I play today?")}
          className="px-3 py-1.5 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-semibold rounded-full border border-sky-200 dark:border-navy-700 hover:bg-sky-100 whitespace-nowrap cursor-pointer"
        >
          "What cognitive game should I play?"
        </button>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm p-4 sm:p-6 h-[460px] flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                    isUser
                      ? 'bg-sky-500'
                      : 'bg-gradient-to-tr from-sky-600 to-teal-500'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] space-y-1.5`}>
                  <div
                    className={`p-4 rounded-3xl text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? 'bg-sky-500 text-white rounded-tr-none'
                        : 'bg-sky-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 border border-sky-100 dark:border-navy-700 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>

                  {/* Read aloud action button for assistant messages */}
                  {!isUser && isTtsSupported && (
                    <div className="flex items-center gap-2 pl-2">
                      <button
                        onClick={() => speak(msg.content, (msg.language as LanguageCode) || language)}
                        className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Read aloud</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-teal-500 text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 bg-sky-50 dark:bg-navy-800 rounded-3xl border border-sky-100 dark:border-navy-700 text-sm text-sky-600 dark:text-sky-400 font-semibold animate-pulse">
                Thinking and checking memory records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-sky-100 dark:border-navy-700/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            {isMicSupported && (
              <button
                type="button"
                onClick={handleMicToggle}
                title={isListening ? "Listening... click to stop" : "Speak to NeuroNest"}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 animate-bounce'
                    : 'bg-sky-50 dark:bg-navy-800 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-navy-700 hover:bg-sky-100'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Type or speak to NeuroNest..."}
              className="flex-1 px-4 py-3.5 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md shadow-sky-500/25 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
