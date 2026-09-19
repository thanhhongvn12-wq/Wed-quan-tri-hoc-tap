import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  AlertCircle,
  Save,
  Sliders,
  Filter,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GradebookView: React.FC = () => {
  const {
    classes,
    students,
    grades,
    updateGrade,
    selectedClassId,
    setSelectedClassId,
    formulaConfig,
    showToast,
  } = useApp();

  const [activeClass, setActiveClass] = useState<string>(
    selectedClassId === 'all' ? classes[0]?.id || '' : selectedClassId
  );

  // Filter students for the active class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === activeClass);
  }, [students, activeClass]);

  const handleScoreChange = (
    gradeId: string,
    field: 'tx1' | 'tx2' | 'midterm' | 'finalExam',
    valueStr: string
  ) => {
    if (valueStr.trim() === '') {
      updateGrade(gradeId, field, null);
      return;
    }
    const val = parseFloat(valueStr);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      updateGrade(gradeId, field, val);
    }
  };

  const activeClassName = classes.find((c) => c.id === activeClass)?.name || '';

  return (
    <div className="space-y-6">
      {/* Top Header & Formula Notice required by Section 6 of PDF */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Bảng điểm môn Khoa học tự nhiên</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhập và chỉnh sửa trực tiếp điểm kiểm tra thường xuyên, giữa kỳ và cuối kỳ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Chọn lớp:</label>
            <select
              value={activeClass}
              onChange={(e) => {
                setActiveClass(e.target.value);
                setSelectedClassId(e.target.value);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-blue-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Explicit notice required by page 6 */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              Ghi chú công thức tính điểm minh họa:
            </p>
            <p className="text-blue-800 leading-relaxed">
              Điểm TB = [Điểm TX1 × {formulaConfig.txWeight} + Điểm TX2 × {formulaConfig.txWeight} + Giữa kỳ × {formulaConfig.midtermWeight} + Cuối kỳ × {formulaConfig.finalWeight}] / {(formulaConfig.txWeight * 2) + formulaConfig.midtermWeight + formulaConfig.finalWeight}.
              Giáo viên có thể bấm mục <strong>Cài đặt & Dữ liệu</strong> ở góc trên để điều chỉnh lại hệ số này theo quy định hiện hành của trường.
            </p>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Bảng điểm Lớp {activeClassName}
            </h3>
            <span className="text-xs text-slate-500 font-medium">({classStudents.length} học sinh)</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Màu đỏ nhẹ: Học sinh có kết quả cần chú ý (ĐTB &lt; 5.0)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4 text-center w-28">TX 1 (hs {formulaConfig.txWeight})</th>
                <th className="py-3 px-4 text-center w-28">TX 2 (hs {formulaConfig.txWeight})</th>
                <th className="py-3 px-4 text-center w-28">Giữa kỳ (hs {formulaConfig.midtermWeight})</th>
                <th className="py-3 px-4 text-center w-28">Cuối kỳ (hs {formulaConfig.finalWeight})</th>
                <th className="py-3 px-4 text-center w-28">Điểm TB</th>
                <th className="py-3 px-4 text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Chưa có học sinh trong lớp {activeClassName}.
                  </td>
                </tr>
              ) : (
                classStudents.map((stu, index) => {
                  const g = grades.find((gr) => gr.studentId === stu.id) || {
                    id: 'temp-' + stu.id,
                    studentId: stu.id,
                    classId: stu.classId,
                    tx1: null,
                    tx2: null,
                    midterm: null,
                    finalExam: null,
                    average: stu.averageScore,
                  };

                  const isAttentionNeeded = (g.average !== null && g.average < 5.0) || stu.averageScore < 5.0;

                  return (
                    <tr
                      key={stu.id}
                      className={`transition-colors ${
                        isAttentionNeeded ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{stu.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{stu.code}</div>
                      </td>

                      {/* TX 1 */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="-"
                          value={g.tx1 !== null && g.tx1 !== undefined ? g.tx1 : ''}
                          onChange={(e) => handleScoreChange(g.id, 'tx1', e.target.value)}
                          className="w-16 px-2 py-1.5 text-center font-semibold bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </td>

                      {/* TX 2 */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="-"
                          value={g.tx2 !== null && g.tx2 !== undefined ? g.tx2 : ''}
                          onChange={(e) => handleScoreChange(g.id, 'tx2', e.target.value)}
                          className="w-16 px-2 py-1.5 text-center font-semibold bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </td>

                      {/* Giữa kỳ */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="-"
                          value={g.midterm !== null && g.midterm !== undefined ? g.midterm : ''}
                          onChange={(e) => handleScoreChange(g.id, 'midterm', e.target.value)}
                          className="w-16 px-2 py-1.5 text-center font-semibold bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </td>

                      {/* Cuối kỳ */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="-"
                          value={g.finalExam !== null && g.finalExam !== undefined ? g.finalExam : ''}
                          onChange={(e) => handleScoreChange(g.id, 'finalExam', e.target.value)}
                          className="w-16 px-2 py-1.5 text-center font-semibold bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </td>

                      {/* Điểm trung bình */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-bold text-sm px-2.5 py-1 rounded-lg inline-block ${
                            isAttentionNeeded
                              ? 'bg-rose-100 text-rose-700 border border-rose-300 font-extrabold'
                              : g.average && g.average >= 8.0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          {g.average !== null && g.average !== undefined ? g.average.toFixed(1) : '-'}
                        </span>
                      </td>

                      {/* Xếp loại */}
                      <td className="py-3 px-4 text-center">
                        {g.average !== null && g.average !== undefined ? (
                          g.average >= 8.0 ? (
                            <span className="font-semibold text-emerald-700">Giỏi</span>
                          ) : g.average >= 6.5 ? (
                            <span className="font-semibold text-blue-700">Khá</span>
                          ) : g.average >= 5.0 ? (
                            <span className="font-medium text-slate-600">Đạt</span>
                          ) : (
                            <span className="font-bold text-rose-600 flex items-center justify-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Cần chú ý
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400">Chưa đủ điểm</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            Mỗi khi bạn thay đổi một điểm số, hệ thống sẽ tự động tính lại Điểm Trung Bình và lưu ngay vào bộ nhớ trình duyệt.
          </p>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Tự động lưu
          </span>
        </div>
      </div>
    </div>
  );
};
