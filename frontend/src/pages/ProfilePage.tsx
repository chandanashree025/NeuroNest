import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Globe,
  Lock,
  Edit2,
  Check,
  X,
  Camera,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi, uploadPhoto } from '../services/api';
import { LanguageCode } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { supportedLanguages } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState<number | ''>(user?.age || '');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(user?.preferred_language || 'en');
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo || '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Change Password Modal
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [isSavingPw, setIsSavingPw] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const res = await uploadPhoto(file);
      setProfilePhoto(res.url);
      await authApi.updateMe({ profile_photo: res.url });
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Photo upload failed');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateMe({
        name: name.trim(),
        age: age ? Number(age) : undefined,
        preferred_language: preferredLanguage,
      });
      await refreshUser();
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);
    setIsSavingPw(true);
    try {
      await authApi.changePassword({ old_password: oldPassword, new_password: newPassword });
      setPwSuccess('Password changed successfully!');
      setTimeout(() => {
        setIsPwModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setPwSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPwError(err.message || 'Failed to change password');
    } finally {
      setIsSavingPw(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Account Management
          </span>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
            My Profile
          </h1>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-bold text-sm rounded-2xl border border-sky-200 dark:border-navy-700 hover:bg-sky-100"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-2xl"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="p-8 bg-white dark:bg-navy-850 rounded-3xl border border-sky-100 dark:border-navy-700 shadow-sm space-y-8">
        {/* Photo Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-400 to-teal-400 text-white font-black text-4xl flex items-center justify-center shadow-lg shadow-sky-500/20 overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>

            <label className="absolute bottom-0 right-0 p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {user?.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold rounded-full">
                {user?.role === 'OLDER_ADULT' ? 'Older Adult' : 'Caregiver'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Member since {new Date(user?.created_at || Date.now()).toLocaleDateString([], { month: 'short', year: 'numeric' })}
              </span>
            </div>
            {isUploadingPhoto && (
              <p className="text-xs text-sky-600 animate-pulse">Uploading photo...</p>
            )}
          </div>
        </div>

        {/* Profile Details or Edit Form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sky-100 dark:border-navy-700">
            <div className="p-4 bg-sky-50/50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Email</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
            </div>

            <div className="p-4 bg-sky-50/50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Age</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">{user?.age || 'Not specified'}</span>
            </div>

            <div className="p-4 bg-sky-50/50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Role</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                {user?.role === 'OLDER_ADULT' ? 'Older Adult' : 'Caregiver'}
              </span>
            </div>

            <div className="p-4 bg-sky-50/50 dark:bg-navy-800 rounded-2xl border border-sky-100 dark:border-navy-700">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Preferred Language</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200 uppercase">
                {user?.preferred_language || 'English'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-sky-100 dark:border-navy-700">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code} className="dark:bg-navy-900">
                      {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl text-slate-500 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-500/25"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Change Password Button */}
        <div className="pt-6 border-t border-sky-100 dark:border-navy-700 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Security & Password</h4>
            <p className="text-xs text-slate-400">Update your account login password</p>
          </div>
          <button
            onClick={() => setIsPwModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-50 dark:bg-navy-800 text-sky-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-sky-200 dark:border-navy-700 hover:bg-sky-100"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPwModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-navy-850 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-navy-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-navy-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Change Password
              </h3>
              <button
                onClick={() => setIsPwModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl">
                {pwSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-navy-700 bg-sky-50/40 dark:bg-navy-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPwModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPw}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl"
                >
                  {isSavingPw ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
