import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  CheckCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';

export const AttendanceView: React.FC = () => {
  const { classes, students, selectedClassId, setSelectedClassId, attendanceDays, saveAttendance } = useApp();

  // Selected class
  const activeClassId = selectedClassId === 'all' ? classes[0]?.id || '' : selectedClassId;

  // Selected Date (default: today's date formatted as YYYY-MM-DD)
  const todayDateString = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayDateString);

  // Students in this active class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === activeClassId);
  }, [students, activeClassId]);

  // Attendance state map: studentId -> status
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});

  // When class or date changes, load saved attendance or default to 'present'
  useEffect(() => {
    const existingDay = attendanceDays.find(
      (d) => d.classId === activeClassId && d.date === selectedDate
    );

    const initialMap: Record<string, AttendanceStatus> = {};
    if (existingDay) {
      existingDay.records.forEach((r) => {
        initialMap[r.studentId] = r.status;
      });
      // Fill any remaining students
      classStudents.forEach((s) => {
        if (!initialMap[s.id]) {
          initialMap[s.id] = 'present';
        }
      });
    } else {
      // Default all to present
      classStudents.forEach((s) => {
        initialMap[s.id] = 'present';
      });
    }
    setAttendanceState(initialMap);
  }, [activeClassId, selectedDate, attendanceDays, classStudents]);

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceState(updated);
  };

  const handleSave = () => {
    const records = classStudents.map((s) => ({
      studentId: s.id,
      status: attendanceState[s.id] || 'present',
    }));
    saveAttendance(activeClassId, selectedDate, records);
  };

  // Real-time statistics for current day
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    classStudents.forEach((s) => {
      const st = attendanceState[s.id] || 'present';
      if (st === 'present') present++;
      else if (st === 'absent') absent++;
      else if (st === 'late') late++;
      else if (st === 'excused') excused++;
    });

    return {
      total: classStudents.length,
      present,
      absent,
      late,
      excused,
    };
  }, [classStudents, attendanceState]);

  const activeClassName = classes.find((c) => c.id === activeClassId)?.name || 'Lớp';

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Điểm danh Chuyên cần môn KHTN</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn lớp và ngày học để điểm danh nhanh chóng bằng 1 chạm
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleMarkAll('present')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer border border-emerald-200"
            >
              <CheckCheck className="w-4 h-4" />
              Tất cả có mặt
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu điểm danh
            </button>
          </div>
        </div>

        {/* Selection Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
          <div className="sm:col-span-6">
            <label className="block text-xs font-medium text-slate-700 mb-1">Chọn lớp điểm danh</label>
            <select
              value={activeClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} ({c.studentCount} HS)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-medium text-slate-700 mb-1">Ngày điểm danh</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Statistics Bar as explicitly required by Section 5 of PDF */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Tổng số HS</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
          </div>
          <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-emerald-700">Có mặt</p>
            <p className="text-xl font-bold text-emerald-800 mt-0.5">{stats.present}</p>
          </div>
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-rose-700">Vắng không phép</p>
            <p className="text-xl font-bold text-rose-800 mt-0.5">{stats.absent}</p>
          </div>
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-amber-700">Đi muộn</p>
            <p className="text-xl font-bold text-amber-800 mt-0.5">{stats.late}</p>
          </div>
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <p className="text-[11px] font-medium text-blue-700">Có phép</p>
            <p className="text-xl font-bold text-blue-800 mt-0.5">{stats.excused}</p>
          </div>
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Student Roll Call List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Danh sách điểm danh lớp {activeClassName} ({classStudents.length} học sinh)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Ngày: <strong>{selectedDate}</strong>
          </span>
        </div>

        {classStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Chưa có học sinh trong lớp này. Vui lòng vào mục "Học sinh" để thêm mới.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {classStudents.map((stu, index) => {
              const currentStatus = attendanceState[stu.id] || 'present';

              return (
                <div
                  key={stu.id}
                  className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-semibold text-slate-400">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{stu.fullName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {stu.code} • {stu.gender}
                      </p>
                    </div>
                  </div>

                  {/* 4 Touch-friendly status buttons as required by Section 5 */}
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {/* Có mặt */}
                    <button
                      type="button"
                      onClick={() => handleSetStatus(stu.id, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Có mặt</span>
                    </button>

                    {/* Vắng */}
                    <button
                      type="button"
                      onClick={() => handleSetStatus(stu.id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        currentStatus === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Vắng</span>
                    </button>

                    {/* Đi muộn */}
                    <button
                      type="button"
                      onClick={() => handleSetStatus(stu.id, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        currentStatus === 'late'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Muộn</span>
                    </button>

                    {/* Có phép */}
                    <button
                      type="button"
                      onClick={() => handleSetStatus(stu.id, 'excused')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        currentStatus === 'excused'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Có phép</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Dữ liệu chuyên cần được tự động lưu cục bộ khi nhấn nút "Lưu điểm danh".
          </p>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Lưu điểm danh lớp {activeClassName}
          </button>
        </div>
      </div>
    </div>
  );
};
