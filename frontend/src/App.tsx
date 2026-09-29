import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OlderAdultDashboard } from './pages/OlderAdultDashboard';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { GamesPage } from './pages/GamesPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { CompanionPage } from './pages/CompanionPage';
import { ProgressPage } from './pages/ProgressPage';
import { AIActivityPage } from './pages/AIActivityPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { DashboardLayout } from './components/layout/DashboardLayout';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, activePatient, isLoading } = useAuth();
  const [unauthPage, setUnauthPage] = useState<'landing' | 'login' | 'signup'>('landing');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-950 text-sky-600">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-sm tracking-wider uppercase">Loading NeuroNest...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Flow
  if (!isAuthenticated) {
    if (unauthPage === 'signup') {
      return (
        <SignupPage
          onNavigateLogin={(msg) => {
            if (msg) setLoginSuccessMsg(msg);
            setUnauthPage('login');
          }}
          onNavigateHome={() => setUnauthPage('landing')}
        />
      );
    }
    if (unauthPage === 'login') {
      return (
        <LoginPage
          successMessage={loginSuccessMsg}
          onLoginSuccess={() => {
            setLoginSuccessMsg(null);
            setCurrentPage('home');
          }}
          onNavigateSignup={() => setUnauthPage('signup')}
          onNavigateHome={() => setUnauthPage('landing')}
        />
      );
    }
    return (
      <LandingPage
        onNavigateLogin={() => {
          setLoginSuccessMsg(null);
          setUnauthPage('login');
        }}
        onNavigateSignup={() => setUnauthPage('signup')}
      />
    );
  }

  // Authenticated Dashboard Flow
  return (
    <DashboardLayout currentPage={currentPage} onNavigate={(p) => setCurrentPage(p)}>
      {currentPage === 'home' && (
        user?.role === 'CAREGIVER' && !activePatient ? (
          <CaregiverDashboard onNavigate={(p) => setCurrentPage(p)} />
        ) : (
          <OlderAdultDashboard onNavigate={(p) => setCurrentPage(p)} />
        )
      )}

      {currentPage === 'games' && <GamesPage />}
      {currentPage === 'assessment' && <AssessmentPage />}
      {currentPage === 'memories' && <MemoriesPage />}
      {currentPage === 'companion' && <CompanionPage />}
      {currentPage === 'progress' && <ProgressPage />}
      {currentPage === 'ai-activity' && <AIActivityPage />}
      {currentPage === 'caregiver' && <CaregiverDashboard onNavigate={(p) => setCurrentPage(p)} />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'settings' && <SettingsPage />}
    </DashboardLayout>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
