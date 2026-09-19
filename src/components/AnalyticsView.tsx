import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CalendarCheck,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { classes, students, assignments, setCurrentTab, selectedClassId, setSelectedClassId } = useApp();

  const [activeFilterClass, setActiveFilterClass] = useState<string>(selectedClassId || 'all');

  // Filter students based on selected class
  const currentStudents = useMemo(() => {
    if (activeFilterClass === 'all') return students;
    return students.filter((s) => s.classId === activeFilterClass);
  }, [students, activeFilterClass]);

  // Score distribution calculation
  const stats = useMemo(() => {
    const total = currentStudents.length || 1;
    const gioi = currentStudents.filter((s) => s.averageScore >= 8.0).length;
    const kha = currentStudents.filter((s) => s.averageScore >= 6.5 && s.averageScore < 8.0).length;
    const tb = currentStudents.filter((s) => s.averageScore >= 5.0 && s.averageScore < 6.5).length;
    const canChuY = currentStudents.filter((s) => s.averageScore < 5.0).length;

    const avgScore =
      currentStudents.reduce((sum, s) => sum + s.averageScore, 0) / (currentStudents.length || 1);

    const avgAttendance =
      currentStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / (currentStudents.length || 1);

    return {
      total: currentStudents.length,
      gioi,
      kha,
      tb,
      canChuY,
      gioiPct: Math.round((gioi / total) * 100),
      khaPct: Math.round((kha / total) * 100),
      tbPct: Math.round((tb / total) * 100),
      canChuYPct: Math.round((canChuY / total) * 100),
      avgScore: Math.round(avgScore * 10) / 10,
      avgAttendance: Math.round(avgAttendance * 10) / 10,
    };
  }, [currentStudents]);

  // Assignments calculation for selected class
  const classAssignments = useMemo(() => {
    if (activeFilterClass === 'all') return assignments;
    return assignments.filter((a) => a.classId === activeFilterClass);
  }, [assignments, activeFilterClass]);

  const assignmentStats = useMemo(() => {
    const totalSubmissions = classAssignments.reduce((sum, a) => sum + a.totalCount, 0);
    const completedSubmissions = classAssignments.reduce((sum, a) => sum + a.completedCount, 0);
    const rate = totalSubmissions > 0 ? Math.round((completedSubmissions / totalSubmissions) * 100) : 0;
    return {
      totalSubmissions,
      completedSubmissions,
      rate,
    };
  }, [classAssignments]);

  const activeClassName =
    activeFilterClass === 'all'
      ? 'Tất cả 8 lớp'
      : `Lớp ${classes.find((c) => c.id === activeFilterClass)?.name}`;

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Báo cáo & Thống kê học tập KHTN</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu phân tích trực quan về kết quả học tập, tỷ lệ chuyên cần và hoàn thành bài tập
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="text-xs font-semibold text-slate-700">Bộ lọc theo lớp:</label>
          <select
            value={activeFilterClass}
            onChange={(e) => {
              setActiveFilterClass(e.target.value);
              setSelectedClassId(e.target.value);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toàn bộ các lớp (Tổng hợp)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Lớp {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Điểm trung bình chung</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.avgScore}</span>
            <span className="text-xs text-emerald-600 font-semibold">/ 10 điểm</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đánh giá chung: Khá - Tốt</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tỷ lệ chuyên cần</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.avgAttendance}%</span>
            <span className="text-xs text-slate-500">đi học đủ</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Chuyên cần lớp đạt chuẩn quy định</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tỷ lệ nộp bài tập</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{assignmentStats.rate}%</span>
            <span className="text-xs text-slate-500">đã hoàn thành</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{assignmentStats.completedSubmissions} / {assignmentStats.totalSubmissions} lượt nộp</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Số HS cần chú ý</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600">{stats.canChuY}</span>
            <span className="text-xs text-slate-500">học sinh ({stats.canChuYPct}%)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cần kế hoạch phụ đạo & bù bài</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Biểu đồ Phân bố xếp loại */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Phân loại học tập ({activeClassName})</h3>
              <p className="text-xs text-slate-500">Tỷ lệ phần trăm và số lượng học sinh theo từng bậc xếp loại</p>
            </div>
          </div>

          {/* Bar representation */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700">Học sinh Giỏi (≥ 8.0)</span>
                <span>{stats.gioi} HS ({stats.gioiPct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.gioiPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-700">Học sinh Khá (6.5 - 7.9)</span>
                <span>{stats.kha} HS ({stats.khaPct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.khaPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-indigo-700">Đạt / Trung bình (5.0 - 6.4)</span>
                <span>{stats.tb} HS ({stats.tbPct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${stats.tbPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700">Chưa đạt / Cần chú ý (&lt; 5.0)</span>
                <span>{stats.canChuY} HS ({stats.canChuYPct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.canChuYPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ So sánh 8 lớp học */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">So sánh chỉ số các lớp</h3>
              <p className="text-xs text-slate-500">Tỷ lệ hoàn thành nhiệm vụ học tập theo từng lớp</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {classes.map((cls) => {
              // Calculate class students & metrics
              const stuInClass = students.filter((s) => s.classId === cls.id);
              const count = stuInClass.length;
              const classAvg =
                count > 0
                  ? Math.round(
                      (stuInClass.reduce((sum, s) => sum + s.averageScore, 0) / count) * 10
                    ) / 10
                  : 7.2;

              return (
                <div key={cls.id} className="flex items-center gap-3 text-xs">
                  <span className="w-10 font-bold text-slate-800">{cls.name}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(classAvg / 10) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-semibold text-slate-700">ĐTB {classAvg}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danh sách học sinh cần chú ý kèm kế hoạch hỗ trợ */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Danh sách chi tiết học sinh cần lưu ý ({currentStudents.filter((s) => s.status === 'Cần chú ý').length} em)
            </h3>
            <p className="text-xs text-slate-500">Học sinh có điểm kiểm tra &lt; 5.0 hoặc chuyên cần chưa đạt yêu cầu</p>
          </div>
          <button
            onClick={() => setCurrentTab('students')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Xem danh sách học sinh <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentStudents
            .filter((s) => s.status === 'Cần chú ý')
            .map((stu) => (
              <div
                key={stu.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{stu.fullName}</span>
                    <span className="px-2 py-0.5 rounded-md font-semibold bg-white border border-slate-200 text-slate-700 text-[11px]">
                      Lớp {stu.className}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    <strong>Vấn đề cần hỗ trợ:</strong> {stu.notes || 'Điểm bài tập thấp, cần phụ đạo thêm.'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Chuyên cần: {stu.attendanceRate}% • Bài tập hoàn thành: {stu.assignmentsCompleted}/{stu.assignmentsTotal}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-lg font-bold text-rose-700 bg-rose-50 border border-rose-200 inline-block">
                    ĐTB: {stu.averageScore}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
