import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { assessmentApi } from '../services/api';
import { AssessmentResult } from '../types';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const AssessmentPage: React.FC = () => {
  const { user, activePatient } = useAuth();
  const [step, setStep] = useState<number>(0); // 0: intro, 1: memory, 2: working memory, 3: attention, 4: reasoning, 5: summary
  const [pastAssessments, setPastAssessments] = useState<AssessmentResult[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  // Assessment task states
  const [memAns, setMemAns] = useState<string[]>([]);
  const [wmAns, setWmAns] = useState<string>('');
  const [attAns, setAttAns] = useState<string>('');
  const [reasAns, setReasAns] = useState<string>('');

  const [finalResult, setFinalResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const targetUserId = (activePatient && user?.role === 'CAREGIVER') ? activePatient.id : (user?.id || '');

  const loadHistory = async () => {
    try {
      const res = await assessmentApi.getResults(targetUserId);
      setPastAssessments(res);
      if (res.length > 0 && step === 0) {
        setFinalResult(res[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [targetUserId]);

  const startAssessment = () => {
    setMemAns([]);
    setWmAns('');
    setAttAns('');
    setReasAns('');
    setStep(1);
    setFinalResult(null);
  };

  const handleFinishAssessment = async (
    calculatedScores: { memory: number; workingMemory: number; attention: number; reasoning: number }
  ) => {
    setIsSubmitting(true);
    try {
      const resp = await assessmentApi.submit({
        memory_score: calculatedScores.memory,
        working_memory_score: calculatedScores.workingMemory,
        attention_score: calculatedScores.attention,
        reasoning_score: calculatedScores.reasoning
      }, targetUserId);

      setFinalResult(resp.result);
      setStep(5);
      loadHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <ClipboardCheck className="w-5 h-5" />
            <span>Activity Personalization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
            Cognitive Assessment
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-xl">
            A calm, 4-step check-in to personalize your daily activities across memory, attention, and reasoning.
          </p>
        </div>

        {step === 0 && (
          <button
            onClick={startAssessment}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-500/25 flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Assessment</span>
          </button>
        )}
      </div>

      {/* Progress tracker */}
      {step >= 1 && step <= 4 && (
        <div className="p-4 bg-white dark:bg-navy-850 rounded-2xl border border-sky-100 dark:border-navy-700">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Domain 1: Episodic Memory'}
              {step === 2 && 'Domain 2: Working Memory'}
              {step === 3 && 'Domain 3: Attention'}
              {step === 4 && 'Domain 4: Reasoning'}
            </span>
          </div>
          <div className="w-full bg-sky-100 dark:bg-navy-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-sky-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Memory */}
      {step === 1 && (
        <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Domain 1: Memory Recall
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Imagine you went shopping yesterday for: <strong>Tea</strong>, <strong>Apples</strong>, and <strong>Bread</strong>.
            Which items were on your list? (Select all 3)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Tea', 'Oranges', 'Bread', 'Apples', 'Milk', 'Rice'].map((item) => {
              const selected = memAns.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => {
                    if (selected) setMemAns(memAns.filter((x) => x !== item));
                    else setMemAns([...memAns, item]);
                  }}
                  className={`p-4 rounded-2xl border-2 font-bold text-base transition-all ${
                    selected
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-sky-50/50 dark:bg-navy-800 border-sky-200 dark:border-navy-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={memAns.length === 0}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center gap-2"
            >
              <span>Next Domain</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Working Memory */}
      {step === 2 && (
        <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Domain 2: Working Memory
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            If you hear the numbers: <strong className="text-2xl text-sky-600">4 — 9 — 2</strong>, what are they in <em>reverse</em> order?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['2 - 9 - 4', '4 - 2 - 9', '9 - 4 - 2'].map((choice) => (
              <button
                key={choice}
                onClick={() => setWmAns(choice)}
                className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                  wmAns === choice
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-sky-50/50 dark:bg-navy-800 border-sky-200 dark:border-navy-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(3)}
              disabled={!wmAns}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center gap-2"
            >
              <span>Next Domain</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Attention */}
      {step === 3 && (
        <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Domain 3: Attention & Visual Focus
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Which row below contains exclusively circles (⚪)?
          </p>

          <div className="space-y-3">
            {[
              { id: 'A', text: 'Row A: ⚪  ⚪  ⬛  ⚪' },
              { id: 'B', text: 'Row B: ⚪  ⚪  ⚪  ⚪' },
              { id: 'C', text: 'Row C: ⚪  🔺  ⚪  ⚪' },
            ].map((row) => (
              <button
                key={row.id}
                onClick={() => setAttAns(row.id)}
                className={`w-full p-4 rounded-2xl border-2 font-bold text-base text-left transition-all ${
                  attAns === row.id
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-sky-50/50 dark:bg-navy-800 border-sky-200 dark:border-navy-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {row.text}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(4)}
              disabled={!attAns}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center gap-2"
            >
              <span>Next Domain</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Reasoning */}
      {step === 4 && (
        <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Domain 4: Cognitive Reasoning
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Complete the analogy: <strong>Bird is to Sky</strong> as <strong>Fish is to ...</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Water', 'Forest', 'Mountain'].map((choice) => (
              <button
                key={choice}
                onClick={() => setReasAns(choice)}
                className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                  reasAns === choice
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-sky-50/50 dark:bg-navy-800 border-sky-200 dark:border-navy-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                // Calculate scores deterministically
                const memScore = memAns.includes('Tea') && memAns.includes('Apples') && memAns.includes('Bread') && memAns.length === 3 ? 95 : memAns.length >= 2 ? 75 : 60;
                const wmScore = wmAns === '2 - 9 - 4' ? 95 : 65;
                const attScore = attAns === 'B' ? 95 : 60;
                const reasScore = reasAns === 'Water' ? 95 : 65;
                handleFinishAssessment({
                  memory: memScore,
                  workingMemory: wmScore,
                  attention: attScore,
                  reasoning: reasScore
                });
              }}
              disabled={!reasAns || isSubmitting}
              className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold rounded-2xl flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Calculating...' : 'Complete Assessment'}</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5 or Step 0 with prior results: Activity Performance Summary */}
      {(step === 5 || (step === 0 && finalResult)) && finalResult && (
        <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Assessment Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                Activity Performance Summary
              </h2>
            </div>

            <button
              onClick={startAssessment}
              className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-sky-200 dark:border-navy-700 hover:bg-sky-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Check-in
            </button>
          </div>

          {/* Domain % Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-sky-50/70 dark:bg-navy-800 rounded-3xl border border-sky-100 dark:border-navy-700 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Memory</span>
              <span className="text-3xl font-black text-sky-600 dark:text-sky-400">
                {Math.round(finalResult.memoryScore)}%
              </span>
            </div>

            <div className="p-5 bg-teal-50/70 dark:bg-navy-800 rounded-3xl border border-teal-100 dark:border-navy-700 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Working Memory</span>
              <span className="text-3xl font-black text-teal-600 dark:text-teal-400">
                {Math.round(finalResult.workingMemoryScore)}%
              </span>
            </div>

            <div className="p-5 bg-indigo-50/70 dark:bg-navy-800 rounded-3xl border border-indigo-100 dark:border-navy-700 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Attention</span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {Math.round(finalResult.attentionScore)}%
              </span>
            </div>

            <div className="p-5 bg-amber-50/70 dark:bg-navy-800 rounded-3xl border border-amber-100 dark:border-navy-700 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Reasoning</span>
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {Math.round(finalResult.reasoningScore)}%
              </span>
            </div>
          </div>

          {/* Personalized Activity Suggestions */}
          <div className="p-6 bg-sky-50 dark:bg-navy-800/90 rounded-3xl border border-sky-200 dark:border-sky-900/60 space-y-3">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-base">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>Personalized Activity Suggestions</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {finalResult.suggestions || "Maintain episodic memory through weekly Word Recall exercises • Practice gentle Sequence Recall to support working memory."}
            </p>
          </div>

          {/* Strict Safety Disclaimer Banner */}
          <div className="p-4 bg-amber-50 dark:bg-navy-800 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">
              This activity summary is for personalization and is not a medical diagnosis.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
