import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-800 dark:text-slate-100 transition-colors flex">
      {/* Vertical Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        <footer className="p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <MedicalDisclaimer variant="banner" />
          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
            NeuroNest © {new Date().getFullYear()} • Personal Memory & Cognitive Assistance Platform
          </p>
        </footer>
      </div>
    </div>
  );
};
