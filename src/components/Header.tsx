import React from 'react';
import { Menu, Settings, Calendar, Download, School } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenSettings }) => {
  const { currentTab, teacher } = useApp();

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Tổng quan giảng dạy', subtitle: 'Báo cáo nhanh tình hình học tập và hoạt động bộ môn' },
    classes: { title: 'Quản lý Lớp học', subtitle: 'Danh sách các lớp giảng dạy môn Khoa học tự nhiên' },
    students: { title: 'Quản lý Học sinh', subtitle: 'Hồ sơ học tập, theo dõi chuyên cần và kết quả' },
    attendance: { title: 'Điểm danh Chuyên cần', subtitle: 'Ghi nhận chuyên cần từng buổi học nhanh chóng' },
    grades: { title: 'Quản lý Điểm số', subtitle: 'Nhập điểm thường xuyên, giữa kỳ, cuối kỳ môn KHTN' },
    assignments: { title: 'Quản lý Bài tập', subtitle: 'Giao bài tập, dự án thực hành và theo dõi nộp bài' },
    'teaching-plan': { title: 'Kế hoạch Giảng dạy', subtitle: 'Phân phối chương trình và tiến độ bài học theo tuần' },
    analytics: { title: 'Báo cáo & Thống kê', subtitle: 'Biểu đồ phân bố kết quả học tập và chỉ số chuyên cần' },
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Quản trị Học tập', subtitle: 'Khoa học tự nhiên THCS' };

  // Current formatted Vietnamese date
  const todayStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const handleExportStandaloneHTML = () => {
    // Generate an all-in-one standalone HTML file containing the entire app interface so the teacher can open it locally anywhere
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
              {currentInfo.title}
            </h2>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {teacher.school}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="capitalize">{todayStr}</span>
        </div>

        {/* Quick Print/Export */}
        <button
          onClick={handleExportStandaloneHTML}
          title="In hoặc Lưu PDF báo cáo"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">In / Xuất PDF</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cài đặt & Dữ liệu</span>
        </button>
      </div>
    </header>
  );
};
