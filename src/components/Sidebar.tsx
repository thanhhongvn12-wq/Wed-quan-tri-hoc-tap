import React from 'react';
import {
  LayoutDashboard,
  School,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  FileText,
  CalendarDays,
  BarChart3,
  Settings,
  X,
  UserCheck,
} from 'lucide-react';
import { NavTab, useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenSettings }) => {
  const { currentTab, setCurrentTab, teacher } = useApp();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; num: number }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" />, num: 1 },
    { id: 'classes', label: 'Lớp học', icon: <School className="w-5 h-5" />, num: 2 },
    { id: 'students', label: 'Học sinh', icon: <Users className="w-5 h-5" />, num: 3 },
    { id: 'attendance', label: 'Chuyên cần', icon: <CalendarCheck className="w-5 h-5" />, num: 4 },
    { id: 'grades', label: 'Điểm số', icon: <FileSpreadsheet className="w-5 h-5" />, num: 5 },
    { id: 'assignments', label: 'Bài tập', icon: <FileText className="w-5 h-5" />, num: 6 },
    { id: 'teaching-plan', label: 'Kế hoạch giảng dạy', icon: <CalendarDays className="w-5 h-5" />, num: 7 },
    { id: 'analytics', label: 'Thống kê', icon: <BarChart3 className="w-5 h-5" />, num: 8 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / App Title */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20">
              KHTN
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                QUẢN TRỊ HỌC TẬP
              </h1>
              <p className="text-[11px] font-semibold text-blue-600 tracking-wide">
                KHOA HỌC TỰ NHIÊN THCS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Danh mục quản lý
          </p>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-blue-200/60 text-blue-800' : 'text-slate-400 bg-slate-100'
                  }`}
                >
                  {item.num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Section required by Page 2 of specifications */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs border border-blue-200">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    {teacher.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Giáo viên {teacher.subject}
                  </p>
                  <p className="text-[11px] font-medium text-blue-600 leading-tight">
                    {teacher.school}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenSettings}
                title="Tùy chỉnh thông tin & Cấu hình"
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
