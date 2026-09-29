import React, { useState, useEffect } from 'react';
import {
  Users2,
  Brain,
  BookHeart,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  Info,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { caregiverApi } from '../services/api';
import { PatientCard } from '../types';

interface Props {
  onNavigate: (page: string) => void;
}

export const CaregiverDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user, setActivePatient } = useAuth();
  const [patients, setPatients] = useState<PatientCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Link Patient modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [patientEmail, setPatientEmail] = useState('');
  const [patientRelation, setPatientRelation] = useState('Father');
  const [isLinking, setIsLinking] = useState(false);

  // Insights Modal
  const [selectedPatientInsights, setSelectedPatientInsights] = useState<any>(null);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);

  const loadPatients = async () => {
    try {
      const data = await caregiverApi.getPatients();
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleLinkPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientEmail.trim()) return;

    setIsLinking(true);
    try {
      await caregiverApi.linkPatient(patientEmail.trim(), patientRelation);
      setIsLinkModalOpen(false);
      setPatientEmail('');
      loadPatients();
    } catch (err: any) {
      alert(err.message || 'Failed to link patient');
    } finally {
      setIsLinking(false);
    }
  };

  const handleViewPatient = (patient: PatientCard, page: string) => {
    setActivePatient(patient);
    onNavigate(page);
  };

  const handleOpenInsights = async (patient: PatientCard) => {
    try {
      const insights = await caregiverApi.getPatientInsights(patient.id);
      setSelectedPatientInsights(insights);
      setIsInsightsModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch insights');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
            <Users2 className="w-5 h-5" />
            <span>Care Network Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
            Caregiver Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-xl">
            Monitor cognitive engagement, upload family memories, and review constructive AI insights for your loved ones.
          </p>
        </div>

        <button
          onClick={() => setIsLinkModalOpen(true)}
          className="px-6 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Connect Family Member</span>
        </button>
      </div>

      {/* Patients Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          My Family Members
        </h2>

        {patients.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 space-y-4">
            <Users2 className="w-12 h-12 text-teal-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">
              No family members connected yet
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Link an Older Adult account using their email address to manage their memories and track engagement.
            </p>
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-2xl"
            >
              Connect First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patients.map((pat) => (
              <div
                key={pat.id}
                className="p-6 sm:p-7 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Patient Profile Details */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-teal-400 text-white font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-sky-500/20 overflow-hidden">
                    {pat.profile_photo ? (
                      <img src={pat.profile_photo} alt={pat.name} className="w-full h-full object-cover" />
                    ) : (
                      pat.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 truncate">
                        {pat.name}
                      </h3>
                      <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold rounded-full border border-teal-200 dark:border-teal-800">
                        {pat.relationship}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {pat.age ? `${pat.age} years old • ` : ''}{pat.email}
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-sky-50/50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Recent Activity</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">
                      {pat.recent_activity || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Activity Score</span>
                    <span className="text-sm font-black text-sky-600 dark:text-sky-400">
                      {Math.round(pat.overall_progress)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Memories</span>
                    <span className="text-sm font-black text-teal-600 dark:text-teal-400">
                      {pat.memory_count} saved
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => handleViewPatient(pat, 'progress')}
                    className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-1 border border-sky-200 dark:border-navy-700 cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Progress</span>
                  </button>

                  <button
                    onClick={() => handleViewPatient(pat, 'memories')}
                    className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-1 border border-sky-200 dark:border-navy-700 cursor-pointer"
                  >
                    <BookHeart className="w-3.5 h-3.5" />
                    <span>Memories</span>
                  </button>

                  <button
                    onClick={() => handleViewPatient(pat, 'family')}
                    className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-1 border border-sky-200 dark:border-navy-700 cursor-pointer"
                  >
                    <Users2 className="w-3.5 h-3.5" />
                    <span>Family</span>
                  </button>

                  <button
                    onClick={() => handleOpenInsights(pat)}
                    className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center gap-1 border border-teal-200 dark:border-teal-800 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI Insights</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Patient Modal */}
      {isLinkModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-navy-850 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-navy-700">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-navy-700 mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Connect Family Member
              </h3>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLinkPatient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Family Member's Account Email *
                </label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="e.g. elderly@neuronest.org"
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Relationship *
                </label>
                <input
                  type="text"
                  required
                  value={patientRelation}
                  onChange={(e) => setPatientRelation(e.target.value)}
                  placeholder="e.g. Father, Mother, Spouse"
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLinking}
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-500/25"
                >
                  {isLinking ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Caregiver Insights Modal */}
      {isInsightsModalOpen && selectedPatientInsights && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-navy-850 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-teal-100 dark:border-navy-700 max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-navy-700">
              <div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Non-Diagnostic Overview
                </span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  Insights: {selectedPatientInsights.patientName}
                </h3>
              </div>
              <button
                onClick={() => setIsInsightsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Insights bullets */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span>Cognitive Engagement Observations</span>
              </h4>

              {selectedPatientInsights.insights && selectedPatientInsights.insights.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedPatientInsights.insights.map((ins: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-teal-50/70 dark:bg-navy-800 rounded-2xl border border-teal-100 dark:border-teal-900/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No activity insights available for this period.</p>
              )}
            </div>

            {/* Non-diagnostic notice */}
            <p className="text-xs text-slate-400 italic">
              * NeuroNest insights are designed for personalization and routine support, and do not constitute a medical diagnosis or treatment plan.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setIsInsightsModalOpen(false)}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
