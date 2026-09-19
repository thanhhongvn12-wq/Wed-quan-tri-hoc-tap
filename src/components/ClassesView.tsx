import React, { useState } from 'react';
import {
  Plus,
  School,
  Users,
  BookOpen,
  FileText,
  Percent,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassItem } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const ClassesView: React.FC = () => {
  const { classes, addClass, updateClass, deleteClass, setCurrentTab, setSelectedClassId, teacher } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    grade: 8,
    studentCount: 35,
    teacher: teacher.name,
    subject: teacher.subject,
    progressPercent: 70,
    activeAssignmentsCount: 1,
    room: 'Phòng học bộ môn',
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: 8,
      studentCount: 35,
      teacher: teacher.name,
      subject: teacher.subject,
      progressPercent: 70,
      activeAssignmentsCount: 1,
      room: 'Phòng học bộ môn',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ClassItem) => {
    setEditingClass(c);
    setFormData({
      name: c.name,
      grade: c.grade,
      studentCount: c.studentCount,
      teacher: c.teacher,
      subject: c.subject,
      progressPercent: c.progressPercent,
      activeAssignmentsCount: c.activeAssignmentsCount,
      room: c.room || 'Phòng học bộ môn',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateClass(editingClass.id, formData);
    } else {
      addClass(formData);
    }
    setIsModalOpen(false);
  };

  const handleViewStudentsOfClass = (classId: string) => {
    setSelectedClassId(classId);
    setCurrentTab('students');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Danh sách các lớp giảng dạy</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng {classes.length} lớp học môn Khoa học tự nhiên (Khối 8 và Khối 9)
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Thêm lớp
        </button>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
          >
            <div>
              {/* Header card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {cls.name}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Lớp {cls.name}</h3>
                    <p className="text-xs text-slate-500">{cls.room || 'Phòng học chung'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    title="Sửa thông tin lớp"
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setClassToDelete(cls)}
                    title="Xóa lớp học"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Class attributes specified by Section 3 */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Sĩ số:
                  </span>
                  <span className="font-semibold text-slate-800">{cls.studentCount} học sinh</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Môn học:
                  </span>
                  <span className="font-medium text-slate-700">{cls.subject}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Bài tập đang giao:
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-semibold text-indigo-700 bg-indigo-50">
                    {cls.activeAssignmentsCount} bài
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Tiến độ chương trình:</span>
                    <span className="font-bold text-blue-600">{cls.progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${cls.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleViewStudentsOfClass(cls.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 rounded-xl transition-colors cursor-pointer"
              >
                <span>Xem chi tiết học sinh</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingClass ? `Chỉnh sửa lớp ${editingClass.name}` : 'Thêm lớp học mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tên lớp học</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 8A5, 9A6..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sĩ số học sinh</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Môn giảng dạy</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phòng học</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tiến độ chương trình (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progressPercent}
                    onChange={(e) => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Số bài tập đang giao</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.activeAssignmentsCount}
                    onChange={(e) => setFormData({ ...formData, activeAssignmentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
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
                  {editingClass ? 'Lưu cập nhật' : 'Thêm lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Class as explicitly required by Section 3 of PDF */}
      <ConfirmModal
        isOpen={!!classToDelete}
        title={`Xác nhận xóa lớp ${classToDelete?.name}?`}
        message={`Bạn có chắc chắn muốn xóa lớp ${classToDelete?.name}? Thao tác này cũng sẽ xóa các học sinh và bảng điểm thuộc lớp này để tránh xung đột dữ liệu.`}
        confirmText="Xác nhận xóa"
        cancelText="Không xóa"
        onCancel={() => setClassToDelete(null)}
        onConfirm={() => {
          if (classToDelete) {
            deleteClass(classToDelete.id);
            setClassToDelete(null);
          }
        }}
      />
    </div>
  );
};
