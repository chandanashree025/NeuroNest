import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Eye,
  Brain,
  Share2,
  Zap,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../services/api';
import { AIActivity } from '../types';

export const AIActivityPage: React.FC = () => {
  const { user, activePatient } = useAuth();
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const targetUserId = (activePatient && user?.role === 'CAREGIVER') ? activePatient.id : (user?.id || '');

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await aiApi.getActivities(targetUserId);
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [targetUserId]);

  const agents = [
    { name: 'AI Orchestrator', role: 'Coordinates specialized sub-agents and plans workflows.', color: 'border-sky-400 bg-sky-50 dark:bg-navy-800' },
    { name: 'Cognitive Coach', role: 'Evaluates exercise accuracy, pacing, and difficulty adjustment.', color: 'border-teal-400 bg-teal-50 dark:bg-navy-800' },
    { name: 'Personal Memory Agent', role: 'Grounded retrieval of loved ones, routines, and life memories.', color: 'border-indigo-400 bg-indigo-50 dark:bg-navy-800' },
    { name: 'Companion Agent', role: 'Maintains warm, multilingual, respectful conversational dialogue.', color: 'border-pink-400 bg-pink-50 dark:bg-navy-800' },
    { name: 'Guardian Agent', role: 'Strict safety guardrails, fatigue prevention, and medical boundaries.', color: 'border-amber-400 bg-amber-50 dark:bg-navy-800' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <Cpu className="w-5 h-5" />
            <span>Multi-Agent System Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
            NeuroNest Intelligence
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-xl">
            See how our 5 specialized AI agents collaborate across Observe, Reason, Delegate, Act, and Learn to personalize your cognitive support.
          </p>
        </div>

        <button
          onClick={loadActivities}
          className="flex items-center gap-2 px-5 py-3 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-bold text-sm rounded-2xl border border-sky-200 dark:border-navy-700 hover:bg-sky-100"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refresh Trace</span>
        </button>
      </div>

      {/* 5 Agent Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          The 5 Specialized Agents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {agents.map((ag) => (
            <div
              key={ag.name}
              className={`p-4 rounded-3xl border-2 shadow-sm space-y-2 ${ag.color}`}
            >
              <div className="flex items-center gap-1.5 font-black text-sm text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>{ag.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {ag.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Trace Stream */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Live Agent Decision Trace
        </h2>

        {activities.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 text-slate-500">
            No agent activities recorded yet. Complete a cognitive game or chat with the companion to see live reasoning traces!
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100 dark:border-navy-700">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      {act.agent}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {act.activity_name}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* 6 Workflow Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* OBSERVE */}
                  <div className="p-4 bg-sky-50/50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-300">
                      <Eye className="w-3.5 h-3.5 text-sky-500" />
                      <span>Observe</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {act.observation}
                    </p>
                  </div>

                  {/* REASON */}
                  <div className="p-4 bg-teal-50/50 dark:bg-navy-800 rounded-2xl border border-teal-100 dark:border-navy-700 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                      <Brain className="w-3.5 h-3.5 text-teal-500" />
                      <span>Reason</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {act.reasoning}
                    </p>
                  </div>

                  {/* DELEGATE / AGENT */}
                  <div className="p-4 bg-indigo-50/50 dark:bg-navy-800 rounded-2xl border border-indigo-100 dark:border-navy-700 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                      <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Delegate</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      Task assigned to <strong>{act.agent}</strong> for specialized handling.
                    </p>
                  </div>

                  {/* ACT */}
                  <div className="p-4 bg-amber-50/50 dark:bg-navy-800 rounded-2xl border border-amber-100 dark:border-navy-700 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Act</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {act.action}
                    </p>
                  </div>

                  {/* RESULT */}
                  <div className="p-4 bg-emerald-50/50 dark:bg-navy-800 rounded-2xl border border-emerald-100 dark:border-navy-700 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Result</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {act.result}
                    </p>
                  </div>

                  {/* LEARN */}
                  <div className="p-4 bg-violet-50/50 dark:bg-navy-800 rounded-2xl border border-violet-100 dark:border-navy-700 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-violet-700 dark:text-violet-300">
                      <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
                      <span>Learn</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {act.learning}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
