import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClassesView } from './components/ClassesView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { GradebookView } from './components/GradebookView';
import { AssignmentsView } from './components/AssignmentsView';
import { TeachingPlanView } from './components/TeachingPlanView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/Toast';

const MainLayout: React.FC = () => {
  const { currentTab, teacher } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Settings & Configuration Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-200">
        {/* Header */}
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'classes' && <ClassesView />}
          {currentTab === 'students' && <StudentsView />}
          {currentTab === 'attendance' && <AttendanceView />}
          {currentTab === 'grades' && <GradebookView />}
          {currentTab === 'assignments' && <AssignmentsView />}
          {currentTab === 'teaching-plan' && <TeachingPlanView />}
          {currentTab === 'analytics' && <AnalyticsView />}

          {/* Educational Environment Footer */}
          <footer className="mt-12 py-6 border-t border-slate-200/80 text-center text-xs text-slate-400">
            <p className="font-medium text-slate-600">
              Hệ thống Quản trị Học tập – Khoa học tự nhiên THCS
            </p>
            <p className="mt-1">
              Giáo viên: {teacher.name} • {teacher.school} • Dữ liệu lưu an toàn trên trình duyệt cá nhân (localStorage)
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
