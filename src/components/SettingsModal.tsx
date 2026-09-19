import React, { useState } from 'react';
import {
  Settings,
  X,
  User,
  GraduationCap,
  Calculator,
  RotateCcw,
  Download,
  AlertCircle,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from './ConfirmModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    teacher,
    updateTeacher,
    formulaConfig,
    updateFormulaConfig,
    resetToDemoData,
    showToast,
    classes,
    students,
    grades,
    assignments,
    teachingPlans,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'formula' | 'storage'>('profile');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: teacher.name,
    subject: teacher.subject,
    school: teacher.school,
    greeting: teacher.greeting,
    subtitle: teacher.subtitle,
  });

  const [formulaForm, setFormulaForm] = useState({
    txWeight: formulaConfig.txWeight,
    midtermWeight: formulaConfig.midtermWeight,
    finalWeight: formulaConfig.finalWeight,
    description: formulaConfig.description,
  });

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher(profileForm);
    onClose();
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormulaConfig({
      ...formulaForm,
      txWeight: Number(formulaForm.txWeight),
      midtermWeight: Number(formulaForm.midtermWeight),
      finalWeight: Number(formulaForm.finalWeight),
    });
    onClose();
  };

  const handleExportJSON = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      teacher,
      classes,
      students,
      grades,
      assignments,
      teachingPlans,
      formulaConfig,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DuLieu_KHTN_${teacher.school.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file dự phòng dữ liệu JSON');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Cấu hình hệ thống & Dữ liệu</h2>
                <p className="text-xs text-slate-500">Tùy chỉnh thông tin giáo viên, quy chế điểm và sao lưu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-100 mt-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Thông tin giáo viên
            </button>
            <button
              onClick={() => setActiveTab('formula')}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'formula'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Công thức tính điểm
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'storage'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Lưu trữ & Khôi phục
            </button>
          </div>

          {/* Tab Content */}
          <div className="overflow-y-auto py-4 flex-1 pr-1 space-y-4">
            {activeTab === 'profile' && (
              <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Họ và tên Giáo viên
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Môn giảng dạy
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.subject}
                      onChange={(e) => setProfileForm({ ...profileForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Trường THCS
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.school}
                      onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Lời chào trang Tổng quan
                  </label>
                  <input
                    type="text"
                    value={profileForm.greeting}
                    onChange={(e) => setProfileForm({ ...profileForm, greeting: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Dòng phụ đề trang Tổng quan
                  </label>
                  <input
                    type="text"
                    value={profileForm.subtitle}
                    onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-800">
                  <GraduationCap className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <p>
                    Thông tin hiển thị này sẽ được cập nhật đồng bộ ở thanh tiêu đề, chân sidebar và trang tổng quan.
                  </p>
                </div>
              </form>
            )}

            {activeTab === 'formula' && (
              <form id="formula-form" onSubmit={handleSaveFormula} className="space-y-4">
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Lưu ý quan trọng theo yêu cầu tài liệu:</p>
                    <p className="mt-0.5 leading-relaxed">
                      Công thức tính điểm trung bình chỉ mang tính chất minh họa. Giáo viên có thể tùy ý điều chỉnh hệ số các cột kiểm tra thường xuyên, giữa kỳ và cuối kỳ cho phù hợp với thông tư/quy chế thực tế tại trường.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Hệ số Thường xuyên (TX)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={formulaForm.txWeight}
                      onChange={(e) => setFormulaForm({ ...formulaForm, txWeight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-center focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Hệ số Giữa kỳ (GK)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={formulaForm.midtermWeight}
                      onChange={(e) => setFormulaForm({ ...formulaForm, midtermWeight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-center focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Hệ số Cuối kỳ (CK)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={formulaForm.finalWeight}
                      onChange={(e) => setFormulaForm({ ...formulaForm, finalWeight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-center focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ghi chú mô tả công thức
                  </label>
                  <textarea
                    rows={3}
                    value={formulaForm.description}
                    onChange={(e) => setFormulaForm({ ...formulaForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Cơ chế lưu trữ cục bộ (localStorage)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Theo yêu cầu kỹ thuật, toàn bộ thông tin lớp học, học sinh, bảng điểm và bài tập được lưu trực tiếp trên trình duyệt của máy tính này. Khi tải lại trang dữ liệu vẫn còn. Dữ liệu mang tính chất cá nhân hỗ trợ công tác giảng dạy của giáo viên.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    Xuất file sao lưu (.JSON)
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    Khôi phục dữ liệu demo mẫu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Đóng
            </button>
            {activeTab === 'profile' && (
              <button
                type="submit"
                form="profile-form"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu thay đổi
              </button>
            )}
            {activeTab === 'formula' && (
              <button
                type="submit"
                form="formula-form"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Áp dụng công thức
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Khôi phục dữ liệu mẫu ban đầu?"
        message="Hành động này sẽ khôi phục lại danh sách 8 lớp học và các học sinh giả định ban đầu. Mọi chỉnh sửa mới của bạn sẽ được đặt lại. Bạn có chắc chắn muốn tiếp tục?"
        confirmText="Đồng ý khôi phục"
        cancelText="Không, giữ dữ liệu"
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetToDemoData();
          onClose();
        }}
      />
    </>
  );
};
