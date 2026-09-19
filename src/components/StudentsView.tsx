import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, StudentStatus } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { ExcelImportModal } from './ExcelImportModal';

export const StudentsView: React.FC = () => {
  const { students, classes, addStudent, updateStudent, deleteStudent, selectedClassId, setSelectedClassId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    classId: classes[0]?.id || '',
    className: classes[0]?.name || '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    attendanceRate: 95,
    averageScore: 7.5,
    status: 'Ổn định' as StudentStatus,
    notes: '',
  });

  // Filter students based on search query, class, and status
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const matchSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.className.toLowerCase().includes(searchQuery.toLowerCase());

      // Class Filter
      const matchClass = selectedClassId === 'all' || s.classId === selectedClassId;

      // Status Filter
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;

      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchQuery, selectedClassId, statusFilter]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const defaultClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    const nextNum = String(students.length + 1).padStart(2, '0');
    setFormData({
      code: `HS08${nextNum}`,
      fullName: '',
      classId: defaultClass ? defaultClass.id : '',
      className: defaultClass ? defaultClass.name : '',
      gender: 'Nam',
      attendanceRate: 95,
      averageScore: 7.0,
      status: 'Ổn định',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stu: Student) => {
    setEditingStudent(stu);
    setFormData({
      code: stu.code,
      fullName: stu.fullName,
      classId: stu.classId,
      className: stu.className,
      gender: stu.gender,
      attendanceRate: stu.attendanceRate,
      averageScore: stu.averageScore,
      status: stu.status,
      notes: stu.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleClassChange = (cId: string) => {
    const cls = classes.find((c) => c.id === cId);
    setFormData({
      ...formData,
      classId: cId,
      className: cls ? cls.name : '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setIsModalOpen(false);
  };

  // Status Badge Renderer using soft colors as specified
  const renderStatusBadge = (status: StudentStatus) => {
    if (status === 'Tốt') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Tốt
        </span>
      );
    }
    if (status === 'Ổn định') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Ổn định
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Cần chú ý
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Danh sách học sinh bộ môn KHTN</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiển thị {filteredStudents.length} / {students.length} học sinh
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Nhập danh sách học sinh từ file Excel (.xlsx, .xls, .csv)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Nhập từ file Excel
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Thêm học sinh
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm học sinh theo tên, mã số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter by Class */}
          <div className="sm:col-span-3">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả các lớp ({classes.length} lớp)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Tốt">Trạng thái: Tốt</option>
              <option value="Ổn định">Trạng thái: Ổn định</option>
              <option value="Cần chú ý">Trạng thái: Cần chú ý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Students with Horizontal Scrolling support */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4 text-center">Chuyên cần</th>
                <th className="py-3 px-4 text-center">Điểm TB</th>
                <th className="py-3 px-4 text-center">Bài tập hoàn thành</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu, index) => (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{stu.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{stu.code} • {stu.gender}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-blue-700 bg-blue-50 border border-blue-100">
                        {stu.className}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <span className={`w-2 h-2 rounded-full ${stu.attendanceRate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {stu.attendanceRate}%
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          stu.averageScore >= 8.0
                            ? 'text-emerald-700 bg-emerald-50'
                            : stu.averageScore >= 6.5
                            ? 'text-blue-700 bg-blue-50'
                            : stu.averageScore >= 5.0
                            ? 'text-slate-700 bg-slate-100'
                            : 'text-rose-700 bg-rose-50 font-extrabold border border-rose-200'
                        }`}
                      >
                        {stu.averageScore.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-slate-600 font-medium">
                      {stu.assignmentsCompleted} / {stu.assignmentsTotal} bài
                    </td>

                    <td className="py-3 px-4 text-center">
                      {renderStatusBadge(stu.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(stu)}
                          title="Sửa thông tin"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(stu)}
                          title="Xóa học sinh"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? `Chỉnh sửa học sinh ${editingStudent.fullName}` : 'Thêm học sinh mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If adding new student, offer choice between manual and Excel import */}
            {!editingStudent && (
              <div className="mt-3 space-y-2.5">
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-white text-blue-700 shadow-xs text-center"
                  >
                    ✏️ Thêm 1 học sinh (Thủ công)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsExcelModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Nhập từ file Excel
                  </button>
                </div>

                {/* Excel fast-track banner */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Bạn có danh sách cả lớp?</p>
                      <p className="text-[11px] text-emerald-700">Tải file mẫu và nhập hàng loạt từ Excel (.xlsx, .xls, .csv)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsExcelModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                  >
                    Nhập Excel ngay
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mã số học sinh</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trần Văn An"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lớp học</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Trạng thái học tập</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Ổn định">Ổn định</option>
                    <option value="Cần chú ý">Cần chú ý</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Điểm trung bình (ĐTB)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.averageScore}
                    onChange={(e) => setFormData({ ...formData, averageScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tỷ lệ chuyên cần (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendanceRate}
                    onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ghi chú giáo viên bộ môn</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về học lực, nề nếp, tinh thần phát biểu..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!studentToDelete}
        title={`Xác nhận xóa học sinh ${studentToDelete?.fullName}?`}
        message={`Bạn có chắc chắn muốn xóa học sinh ${studentToDelete?.fullName} khỏi lớp ${studentToDelete?.className}? Dữ liệu điểm số liên quan của em cũng sẽ bị xóa.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        onCancel={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        defaultClassId={selectedClassId}
      />
    </div>
  );
};
