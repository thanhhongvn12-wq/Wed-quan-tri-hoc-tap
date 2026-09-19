import React from 'react';
import {
  School,
  Users,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const { teacher, classes, students, assignments, setCurrentTab, activities, setSelectedClassId } = useApp();

  const totalClasses = classes.length;
  // Calculate total students across classes (using either aggregate or sum of registered students)
  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const activeAssignments = assignments.filter((a) => a.status === 'Đang mở' || a.status === 'Sắp hết hạn').length;
  const attentionStudents = students.filter((s) => s.status === 'Cần chú ý');

  // Academic score distribution
  const scoreDistribution = {
    gioi: students.filter((s) => s.averageScore >= 8.0).length,
    kha: students.filter((s) => s.averageScore >= 6.5 && s.averageScore < 8.0).length,
    trungBinh: students.filter((s) => s.averageScore >= 5.0 && s.averageScore < 6.5).length,
    canChuY: students.filter((s) => s.averageScore < 5.0).length,
  };

  // Average assignment completion rate
  const totalAssignedSubmissions = assignments.reduce((sum, a) => sum + a.totalCount, 0);
  const totalCompletedSubmissions = assignments.reduce((sum, a) => sum + a.completedCount, 0);
  const assignmentCompletionRate =
    totalAssignedSubmissions > 0 ? Math.round((totalCompletedSubmissions / totalAssignedSubmissions) * 100) : 0;

  // Upcoming assignments
  const upcomingAssignments = assignments.filter((a) => a.status === 'Sắp hết hạn' || a.status === 'Đang mở').slice(0, 3);

  // Teaching schedule / immediate tasks
  const todayTasks = [
    { time: '07:30 - 09:05', title: 'Tiết 1-2: Lớp 8A1', desc: 'Bài 3: Định luật bảo toàn khối lượng (Phòng TN Hóa)', room: 'Phòng 201' },
    { time: '09:20 - 10:55', title: 'Tiết 3-4: Lớp 9A2', desc: 'Bài 5: Khúc xạ ánh sáng (Phòng thực hành Lý)', room: 'Phòng 302' },
    { time: '14:00 - 15:30', title: 'Sinh hoạt chuyên môn', desc: 'Họp tổ bộ môn Khoa học tự nhiên - KHTN 8 & 9', room: 'Văn phòng tổ' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting required by spec */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-medium mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Học kỳ I • Năm học 2026 - 2027</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {teacher.greeting || `Xin chào, Cô ${teacher.name}`}
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
              {teacher.subtitle || 'Tổng quan hoạt động giảng dạy môn Khoa học tự nhiên'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('attendance')}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Điểm danh hôm nay
            </button>
            <button
              onClick={() => setCurrentTab('grades')}
              className="px-4 py-2 bg-blue-800/80 hover:bg-blue-800 text-white font-medium text-xs rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Vào điểm
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards as specified */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Số lớp đang dạy */}
        <div
          onClick={() => setCurrentTab('classes')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Số lớp đang dạy</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{totalClasses}</span>
            <span className="text-xs text-slate-500">lớp (Khối 8 & 9)</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Xem danh sách lớp <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Tổng số học sinh */}
        <div
          onClick={() => setCurrentTab('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng số học sinh</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500">học sinh quản lý</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Quản lý hồ sơ học sinh <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Bài tập đang giao */}
        <div
          onClick={() => setCurrentTab('assignments')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bài tập đang giao</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{activeAssignments}</span>
            <span className="text-xs text-slate-500">bài tập đang mở</span>
          </div>
          <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Xem tiến độ nộp bài <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Học sinh cần chú ý */}
        <div
          onClick={() => setCurrentTab('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Học sinh cần chú ý</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{attentionStudents.length}</span>
            <span className="text-xs text-slate-500">em cần bồi dưỡng</span>
          </div>
          <div className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Kế hoạch hỗ trợ <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Charts Section as explicitly required by Section 2 of PDF */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Biểu đồ 1: Phân bố kết quả học tập */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Phân bố kết quả học tập</h3>
              <p className="text-xs text-slate-500">Dựa trên kết quả tổng kết môn KHTN</p>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md">
              {students.length} mẫu
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Giỏi (≥ 8.0)
                </span>
                <span className="text-slate-700">{scoreDistribution.gioi} HS ({Math.round((scoreDistribution.gioi / students.length) * 100)}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(scoreDistribution.gioi / students.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-blue-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Khá (6.5 - 7.9)
                </span>
                <span className="text-slate-700">{scoreDistribution.kha} HS ({Math.round((scoreDistribution.kha / students.length) * 100)}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(scoreDistribution.kha / students.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-indigo-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                  Đạt / Trung bình (5.0 - 6.4)
                </span>
                <span className="text-slate-700">{scoreDistribution.trungBinh} HS ({Math.round((scoreDistribution.trungBinh / students.length) * 100)}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${(scoreDistribution.trungBinh / students.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-rose-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Chưa đạt / Cần chú ý (&lt; 5.0)
                </span>
                <span className="text-slate-700">{scoreDistribution.canChuY} HS ({Math.round((scoreDistribution.canChuY / students.length) * 100)}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${(scoreDistribution.canChuY / students.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ 2: Tỷ lệ hoàn thành bài tập */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tỷ lệ hoàn thành bài tập</h3>
                <p className="text-xs text-slate-500">Tiến độ nộp bài các bài tập KHTN</p>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 rounded-md">
                {assignments.length} bài giao
              </span>
            </div>

            <div className="flex items-center justify-center py-3">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    className="stroke-slate-100"
                    strokeWidth="3.2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    className="stroke-blue-600 transition-all duration-1000 ease-out"
                    strokeWidth="3.2"
                    strokeDasharray="97.4"
                    strokeDashoffset={97.4 - (97.4 * assignmentCompletionRate) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold text-slate-900">{assignmentCompletionRate}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">Đã hoàn thành</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-xl">
              <p className="text-[11px] text-slate-500">Đã nộp bài</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{totalCompletedSubmissions} lượt</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <p className="text-[11px] text-slate-500">Chưa nộp</p>
              <p className="text-sm font-bold text-amber-600 mt-0.5">{totalAssignedSubmissions - totalCompletedSubmissions} lượt</p>
            </div>
          </div>
        </div>

        {/* Biểu đồ 3: Chuyên cần theo lớp */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chuyên cần theo lớp</h3>
              <p className="text-xs text-slate-500">Tỷ lệ đi học đầy đủ tháng này</p>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 rounded-md">
              TB: 94.5%
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {classes.slice(0, 5).map((cls) => {
              // Simulated average attendance rate for each class
              const rate = cls.name === '8A1' ? 98 : cls.name === '8A2' ? 95 : cls.name === '8A3' ? 96 : cls.name === '8A4' ? 88 : 97;
              return (
                <div key={cls.id} className="flex items-center gap-3 text-xs">
                  <span className="w-9 font-semibold text-slate-700">{cls.name}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rate >= 95 ? 'bg-blue-600' : rate >= 90 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-medium text-slate-700">{rate}%</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentTab('attendance')}
            className="w-full mt-4 text-center text-xs font-medium text-blue-600 hover:text-blue-700 py-1.5 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer"
          >
            Xem chi tiết chuyên cần 8 lớp →
          </button>
        </div>
      </div>

      {/* 4 Bottom Sections as explicitly requested:
          1. Lịch dạy / công việc gần đây
          2. Bài tập sắp đến hạn
          3. Hoạt động gần đây
          4. Học sinh cần chú ý
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Khu vực 1: Lịch dạy / công việc gần đây */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Lịch dạy & Công việc gần đây</h3>
            </div>
            <button
              onClick={() => setCurrentTab('teaching-plan')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Kế hoạch giảng dạy →
            </button>
          </div>

          <div className="space-y-3">
            {todayTasks.map((task, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3"
              >
                <div className="px-2 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-medium text-slate-600 whitespace-nowrap">
                  {task.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                    <span className="text-[11px] font-medium text-slate-500">{task.room}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 truncate">{task.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khu vực 2: Bài tập sắp đến hạn */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Bài tập sắp đến hạn</h3>
            </div>
            <button
              onClick={() => setCurrentTab('assignments')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Tất cả bài tập →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingAssignments.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Không có bài tập nào sắp đến hạn.</p>
            ) : (
              upcomingAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-800 rounded-md">
                        {asg.className}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{asg.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>Hạn nộp: <strong className="text-slate-700">{asg.dueDate}</strong></span>
                      <span>•</span>
                      <span>Đã nộp: <strong className="text-emerald-700">{asg.completedCount}/{asg.totalCount}</strong></span>
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${
                      asg.status === 'Sắp hết hạn'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khu vực 3: Hoạt động gần đây */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hoạt động gần đây</h3>
            </div>
            <span className="text-xs text-slate-400">Tự động cập nhật</span>
          </div>

          <div className="space-y-2.5">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="leading-snug">{act.text}</p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khu vực 4: Học sinh cần chú ý */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Học sinh cần chú ý</h3>
            </div>
            <button
              onClick={() => setCurrentTab('students')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Hồ sơ học sinh →
            </button>
          </div>

          <div className="space-y-2.5">
            {attentionStudents.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">Tất cả học sinh đều đang học tập tốt.</p>
            ) : (
              attentionStudents.slice(0, 4).map((stu) => (
                <div
                  key={stu.id}
                  className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{stu.fullName}</span>
                      <span className="px-1.5 py-0.5 bg-white text-slate-600 border border-slate-200 rounded text-[11px]">
                        {stu.className}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-0.5 line-clamp-1">
                      {stu.notes || 'Điểm số hoặc chuyên cần cần hỗ trợ thêm'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-md font-semibold text-rose-700 bg-rose-50 border border-rose-200">
                      ĐTB: {stu.averageScore}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
