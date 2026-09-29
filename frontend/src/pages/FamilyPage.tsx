import React, { useState, useEffect } from 'react';
import {
  Users2,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Heart,
  X,
  Sparkles,
  Phone,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { familyApi, uploadPhoto } from '../services/api';
import { FamilyMember } from '../types';

export const FamilyPage: React.FC = () => {
  const { user, activePatient } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [description, setDescription] = useState('');
  const [importantMemories, setImportantMemories] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const targetUserId = (activePatient && user?.role === 'CAREGIVER') ? activePatient.id : (user?.id || '');

  const loadFamily = async () => {
    try {
      const data = await familyApi.list(targetUserId);
      setFamilyMembers(data);
    } catch (err) {
      console.error('Failed to load family members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFamily();
  }, [targetUserId]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setRelationship('');
    setDescription('');
    setImportantMemories('');
    setPhotoUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: FamilyMember) => {
    setEditingMember(m);
    setName(m.name);
    setRelationship(m.relationship);
    setDescription(m.description || '');
    setImportantMemories(m.important_memories || '');
    setPhotoUrl(m.photo || '');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadPhoto(file);
      setPhotoUrl(uploaded.url);
    } catch (err: any) {
      alert(err.message || 'Photo upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) return;

    setIsSaving(true);
    try {
      const payload: Partial<FamilyMember> = {
        name: name.trim(),
        relationship: relationship.trim(),
        description: description.trim() || undefined,
        important_memories: importantMemories.trim() || undefined,
        photo: photoUrl || undefined,
      };

      if (editingMember) {
        await familyApi.update(editingMember.id, payload);
      } else {
        await familyApi.create(payload, targetUserId);
      }

      setIsModalOpen(false);
      loadFamily();
    } catch (err: any) {
      alert(err.message || 'Failed to save family member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;
    try {
      await familyApi.delete(id);
      loadFamily();
    } catch (err: any) {
      alert(err.message || 'Failed to delete member');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <Users2 className="w-5 h-5" />
            <span>Family & Loved Ones</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
            Family Members
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-xl">
            Keep family relationships, visiting routines, and special memories fresh and accessible.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Members Grid */}
      {familyMembers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 space-y-4">
          <Users2 className="w-12 h-12 text-sky-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">
            No family members registered yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Add children, grandchildren, siblings, or caregivers to help with recognition and routines.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-2xl"
          >
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="h-44 w-full bg-gradient-to-tr from-sky-100 via-sky-50 to-teal-50 dark:from-navy-850 dark:to-navy-900 flex items-center justify-center relative overflow-hidden">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-sky-500 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-sky-500/25">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute top-3 right-3 px-3.5 py-1 bg-white/90 dark:bg-navy-900/90 text-sky-700 dark:text-sky-300 text-xs font-bold rounded-full shadow-sm backdrop-blur">
                    {member.relationship}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                      {member.name}
                    </h3>
                    <p className="text-xs uppercase font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                      {member.relationship}
                    </p>
                  </div>

                  {member.description && (
                    <div className="p-3.5 bg-sky-50/60 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong className="block text-sky-900 dark:text-sky-200 mb-0.5">Routine & Notes:</strong>
                      {member.description}
                    </div>
                  )}

                  {member.important_memories && (
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
                      " {member.important_memories} "
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-sky-50 dark:border-navy-700/80 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-2 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl hover:bg-sky-50 dark:hover:bg-navy-800"
                  title="Edit Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Delete Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Family Member Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-navy-850 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-navy-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-navy-700 mb-6">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {editingMember ? 'Edit Family Member' : 'Add Family Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anitha"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    required
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Daughter"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Description / Visiting Schedule
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Usually visits on Sunday afternoon and calls Wednesday evening."
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Important Memories & Shared Topics
                </label>
                <textarea
                  rows={3}
                  value={importantMemories}
                  onChange={(e) => setImportantMemories(e.target.value)}
                  placeholder="e.g. Loves gardening together, fond of traditional South Indian sweets, visited Mysore palace in 2021."
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Family Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200"
                  />
                  {isUploading && <span className="text-xs text-sky-600 animate-pulse">Uploading...</span>}
                </div>
                {photoUrl && (
                  <div className="mt-3 relative w-24 h-24 rounded-2xl overflow-hidden border border-sky-200">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-1 right-1 p-1 bg-navy-900/80 text-white rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm shadow-md shadow-sky-500/25"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
