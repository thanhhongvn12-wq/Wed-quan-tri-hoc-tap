import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  BookOpen,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeachingPlanItem, TeachingPlanStatus } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const TeachingPlanView: React.FC = () => {
  const { teachingPlans, classes, addTeachingPlan, updateTeachingPlan, deleteTeachingPlan, selectedClassId, setSelectedClassId } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TeachingPlanItem | null>(null);
  const [planToDelete, setPlanToDelete] = useState<TeachingPlanItem | null>(null);

  const [formData, setFormData] = useState({
    week: 1,
    classId: classes[0]?.id || '',
    className: classes[0]?.name || '',
    topic: '',
    objectives: '',
    status: 'Chưa dạy' as TeachingPlanStatus,
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    const defaultClass = classes.find((c) => c.id === selectedClassId) || classes[0];
    setFormData({
      week: 4,
      classId: defaultClass ? defaultClass.id : '',
      className: defaultClass ? defaultClass.name : '',
      topic: '',
      objectives: '',
      status: 'Chưa dạy',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: TeachingPlanItem) => {
    setEditingPlan(plan);
    setFormData({
      week: plan.week,
      classId: plan.classId,
      className: plan.className,
      topic: plan.topic,
      objectives: plan.objectives,
      status: plan.status,
      notes: plan.notes || '',
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
    if (editingPlan) {
      updateTeachingPlan(editingPlan.id, formData);
    } else {
      addTeachingPlan(formData);
    }
    setIsModalOpen(false);
  };

  const filteredPlans = teachingPlans.filter((p) => {
    const matchClass = selectedClassId === 'all' || p.classId === selectedClassId;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchClass && matchStatus;
  }).sort((a, b) => a.week - b.week);

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Kế hoạch & Phân phối chương trình KHTN</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi kế hoạch bài giảng, mục tiêu cần đạt và tiến độ từng tuần
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chưa dạy">Chưa dạy</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Thêm kế hoạch
          </button>
        </div>
      </div>

      {/* Teaching Plan Timeline / List */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Không có bài dạy nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredPlans.map((plan) => {
            let badgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
            let icon = <Clock className="w-3.5 h-3.5" />;

            if (plan.status === 'Hoàn thành') {
              badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              icon = <CheckCircle2 className="w-3.5 h-3.5" />;
            } else if (plan.status === 'Đang thực hiện') {
              badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
              icon = <BookOpen className="w-3.5 h-3.5" />;
            }

            return (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-semibold text-blue-500">Tuần</span>
                    <span className="text-xl font-bold">{plan.week}</span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-800">
                        Lớp {plan.className}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeBg}`}>
                        {icon}
                        {plan.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {plan.topic}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-700">Mục tiêu bài dạy:</strong> {plan.objectives}
                    </p>

                    {plan.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        <strong>Ghi chú:</strong> {plan.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    title="Sửa kế hoạch"
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlanToDelete(plan)}
                    title="Xóa kế hoạch"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Teaching Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingPlan ? 'Chỉnh sửa kế hoạch bài học' : 'Thêm kế hoạch bài dạy mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tuần học</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    required
                    value={formData.week}
                    onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
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
                  <label className="block font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TeachingPlanStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Chưa dạy">Chưa dạy</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chủ đề / Bài học</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bài 6: Đơn chất và hợp chất - Phân tử..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mục tiêu cần đạt</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Kiến thức, kỹ năng thực hành thí nghiệm, năng lực tự chủ..."
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ghi chú đồ dùng / thiết bị</label>
                <input
                  type="text"
                  placeholder="Dụng cụ thí nghiệm, hóa chất cần chuẩn bị..."
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
                  {editingPlan ? 'Lưu thay đổi' : 'Thêm kế hoạch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!planToDelete}
        title="Xác nhận xóa kế hoạch giảng dạy?"
        message={`Bạn có chắc muốn xóa bài học "${planToDelete?.topic}" khỏi kế hoạch tuần ${planToDelete?.week}?`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        onCancel={() => setPlanToDelete(null)}
        onConfirm={() => {
          if (planToDelete) {
            deleteTeachingPlan(planToDelete.id);
            setPlanToDelete(null);
          }
        }}
      />
    </div>
  );
};
