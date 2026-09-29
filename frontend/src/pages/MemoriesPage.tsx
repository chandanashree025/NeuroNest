import React, { useState, useEffect } from 'react';
import {
  BookHeart,
  Plus,
  Search,
  Calendar,
  User,
  Heart,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  Upload,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { memoriesApi, uploadPhoto } from '../services/api';
import { Memory } from '../types';

const CATEGORIES = [
  'All',
  'Family',
  'Friends',
  'Places',
  'Important Moments',
  'Daily Routine',
  'Favorites'
];

export const MemoriesPage: React.FC = () => {
  const { user, activePatient } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [person, setPerson] = useState('');
  const [relationship, setRelationship] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Family');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const targetUserId = (activePatient && user?.role === 'CAREGIVER') ? activePatient.id : (user?.id || '');

  const loadMemories = async () => {
    setIsLoading(false);
    try {
      const data = await memoriesApi.list(
        selectedCategory,
        searchQuery,
        targetUserId
      );
      setMemories(data);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [selectedCategory, searchQuery, targetUserId]);

  const handleOpenAddModal = () => {
    setEditingMemory(null);
    setTitle('');
    setPerson('');
    setRelationship('');
    setDate('');
    setCategory('Family');
    setDescription('');
    setPhotoUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mem: Memory) => {
    setEditingMemory(mem);
    setTitle(mem.title);
    setPerson(mem.person || '');
    setRelationship(mem.relationship || '');
    setDate(mem.date || '');
    setCategory(mem.category);
    setDescription(mem.description);
    setPhotoUrl(mem.photo || '');
    setIsModalOpen(true);
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSaving(true);
    try {
      const payload: Partial<Memory> = {
        title: title.trim(),
        person: person.trim() || undefined,
        relationship: relationship.trim() || undefined,
        date: date.trim() || undefined,
        category: category as any,
        description: description.trim(),
        photo: photoUrl || undefined,
      };

      if (editingMemory) {
        await memoriesApi.update(editingMemory.id, payload);
      } else {
        await memoriesApi.create(payload, targetUserId);
      }
      setIsModalOpen(false);
      loadMemories();
    } catch (err: any) {
      alert(err.message || 'Failed to save memory');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await memoriesApi.delete(id);
      loadMemories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete memory');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <BookHeart className="w-5 h-5" />
            <span>Cherished Life Moments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
            Memory Library
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-xl">
            Save and revisit meaningful memories, places, family visits, and warm life stories.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-white dark:bg-navy-850 border border-sky-100 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:bg-sky-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories or people..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-sky-200 dark:border-navy-700 bg-white dark:bg-navy-850 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Memories Grid */}
      {memories.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 space-y-4">
          <BookHeart className="w-12 h-12 text-sky-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">
            No memories found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search or category filter.'
              : 'Add your first memory card with photos, loved ones, and stories.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-2xl"
          >
            Add First Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Display if present */}
                {mem.photo ? (
                  <div className="h-48 w-full bg-slate-100 dark:bg-navy-900 overflow-hidden relative">
                    <img
                      src={mem.photo}
                      alt={mem.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-navy-900/90 text-sky-700 dark:text-sky-300 text-xs font-bold rounded-full backdrop-blur">
                      {mem.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-28 w-full bg-gradient-to-r from-sky-100 to-teal-50 dark:from-navy-800 dark:to-navy-900 p-4 flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-navy-800 text-sky-600 flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="px-3 py-1 bg-white dark:bg-navy-800 text-sky-700 dark:text-sky-300 text-xs font-bold rounded-full shadow-sm">
                      {mem.category}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                    {mem.title}
                  </h3>

                  {/* Metadata tags */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {mem.person && (
                      <span className="flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400">
                        <User className="w-3.5 h-3.5" />
                        {mem.person} {mem.relationship ? `(${mem.relationship})` : ''}
                      </span>
                    )}
                    {mem.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {mem.date}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {mem.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-sky-50 dark:border-navy-700/80 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(mem)}
                  className="p-2 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl hover:bg-sky-50 dark:hover:bg-navy-800 transition-colors"
                  title="Edit Memory"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMemory(mem.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete Memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-navy-850 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-navy-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-navy-700 mb-6">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {editingMemory ? 'Edit Memory' : 'Add New Memory'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunday Tea in the Garden"
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                    Person
                  </label>
                  <input
                    type="text"
                    value={person}
                    onChange={(e) => setPerson(e.target.value)}
                    placeholder="e.g. Anitha"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Daughter"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                    Date / Routine
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Every Sunday"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Description & Story *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share details, pleasant feelings, and special memories..."
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Photo Upload area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Memory Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
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
                  {isSaving ? 'Saving...' : 'Save Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
