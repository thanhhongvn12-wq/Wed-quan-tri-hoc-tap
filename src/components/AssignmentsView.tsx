import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  X,
  Users,
  Check,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Assignment, AssignmentStatus } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const AssignmentsView: React.FC = () => {
  const { assignments, classes, addAssignment, updateAssignment, deleteAssignment, selectedClassId, setSelectedClassId } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    classId: classes[0]?.id || '',
    className: classes[0]?.name || '',
    content: '',
    assignedDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    completedCount: 0,
    totalCount: 38,
    status: 'Đang mở' as AssignmentStatus,
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    const defaultClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    setFormData({
      title: '',
      classId: defaultClass ? defaultClass.id : '',
      className: defaultClass ? defaultClass.name : '',
      content: '',
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      completedCount: 0,
      totalCount: defaultClass ? defaultClass.studentCount : 38,
      status: 'Đang mở',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormData({
      title: asg.title,
      classId: asg.classId,
      className: asg.className,
      content: asg.content,
      assignedDate: asg.assignedDate,
      dueDate: asg.dueDate,
      completedCount: asg.completedCount,
      totalCount: asg.totalCount,
      status: asg.status,
      notes: asg.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleClassChange = (cId: string) => {
    const cls = classes.find((c) => c.id === cId);
    setFormData({
      ...formData,
      classId: cId,
      className: cls ? cls.name : '',
      totalCount: cls ? cls.studentCount : 38,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData);
    } else {
      addAssignment(formData);
    }
    setIsModalOpen(false);
  };

  const handleToggleComplete = (asg: Assignment) => {
    const nextStatus: AssignmentStatus = asg.status === 'Hoàn thành' ? 'Đang mở' : 'Hoàn thành';
    updateAssignment(asg.id, {
      status: nextStatus,
      completedCount: nextStatus === 'Hoàn thành' ? asg.totalCount : asg.completedCount,
    });
  };

  const filteredAssignments = assignments.filter((a) => {
    return selectedClassId === 'all' || a.classId === selectedClassId;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Quản lý bài tập & Dự án KHTN</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Giao bài tập lý thuyết, câu hỏi trắc nghiệm và báo cáo thực hành thí nghiệm
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Lớp {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            + Tạo bài tập
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-2 py-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Chưa có bài tập nào cho lớp này. Nhấn "+ Tạo bài tập" để giao bài.
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const completionPercent = Math.round((asg.completedCount / asg.totalCount) * 100) || 0;

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-blue-100 text-blue-800">
                        {asg.className}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          asg.status === 'Hoàn thành'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : asg.status === 'Sắp hết hạn'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : asg.status === 'Đã đóng'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(asg)}
                        title="Sửa bài tập"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setAssignmentToDelete(asg)}
                        title="Xóa bài tập"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3">{asg.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {asg.content}
                  </p>

                  {asg.notes && (
                    <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong>Ghi chú:</strong> {asg.notes}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Giao: <strong>{asg.assignedDate}</strong></span>
                    <span>Hạn nộp: <strong className="text-slate-800">{asg.dueDate}</strong></span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">
                        Đã nộp: <strong>{asg.completedCount}/{asg.totalCount}</strong> học sinh
                      </span>
                      <span className="font-bold text-blue-600">{completionPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleComplete(asg)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        asg.status === 'Hoàn thành'
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {asg.status === 'Hoàn thành' ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingAssignment ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
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
                <label className="block font-medium text-slate-700 mb-1">Tiêu đề bài tập</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Báo cáo thí nghiệm sự nở vì nhiệt..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lớp giao bài</label>
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
                  <label className="block font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AssignmentStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Đang mở">Đang mở</option>
                    <option value="Sắp hết hạn">Sắp hết hạn</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã đóng">Đã đóng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nội dung / Yêu cầu chi tiết</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mô tả yêu cầu bài làm, hướng dẫn nộp bài..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ngày giao</label>
                  <input
                    type="date"
                    required
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Hạn nộp</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Số HS đã hoàn thành</label>
                  <input
                    type="number"
                    min="0"
                    max={formData.totalCount}
                    value={formData.completedCount}
                    onChange={(e) => setFormData({ ...formData, completedCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tổng số HS trong lớp</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCount}
                    onChange={(e) => setFormData({ ...formData, totalCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ghi chú thêm</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mang theo bài nộp trong tiết thực hành..."
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
                  {editingAssignment ? 'Lưu thay đổi' : 'Tạo bài tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!assignmentToDelete}
        title="Xác nhận xóa bài tập?"
        message={`Bạn có chắc chắn muốn xóa bài tập "${assignmentToDelete?.title}"?`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        onCancel={() => setAssignmentToDelete(null)}
        onConfirm={() => {
          if (assignmentToDelete) {
            deleteAssignment(assignmentToDelete.id);
            setAssignmentToDelete(null);
          }
        }}
      />
    </div>
  );
};
