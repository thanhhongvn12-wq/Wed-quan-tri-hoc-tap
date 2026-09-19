import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  RotateCcw,
  Users,
  ChevronRight,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';
import { Student, StudentStatus } from '../types';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClassId?: string;
}

interface ParsedStudentRow {
  code: string;
  fullName: string;
  classId: string;
  className: string;
  gender: 'Nam' | 'Nữ';
  attendanceRate: number;
  averageScore: number;
  status: StudentStatus;
  notes: string;
  isValid: boolean;
  error?: string;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  defaultClassId,
}) => {
  const { classes, addMultipleStudents, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [targetClassId, setTargetClassId] = useState<string>(
    defaultClassId && defaultClassId !== 'all' ? defaultClassId : classes[0]?.id || ''
  );
  const [overrideClass, setOverrideClass] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  // Function to download standard Excel template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'STT': 1,
        'Mã học sinh': 'HS0821',
        'Họ và tên': 'Nguyễn Văn An',
        'Giới tính': 'Nam',
        'Lớp': '8A1',
        'Điểm TB': 8.2,
        'Chuyên cần (%)': 98,
        'Ghi chú': 'Học sinh chăm ngoan, tích cực xây dựng bài',
      },
      {
        'STT': 2,
        'Mã học sinh': 'HS0822',
        'Họ và tên': 'Trần Thị Mai',
        'Giới tính': 'Nữ',
        'Lớp': '8A1',
        'Điểm TB': 7.6,
        'Chuyên cần (%)': 95,
        'Ghi chú': 'Hoàn thành tốt bài tập thí nghiệm',
      },
      {
        'STT': 3,
        'Mã học sinh': 'HS0823',
        'Họ và tên': 'Lê Quốc Bảo',
        'Giới tính': 'Nam',
        'Lớp': '8A1',
        'Điểm TB': 6.5,
        'Chuyên cần (%)': 92,
        'Ghi chú': 'Cần rèn thêm kỹ năng tính toán KHTN',
      },
      {
        'STT': 4,
        'Mã học sinh': 'HS0824',
        'Họ và tên': 'Phạm Thu Hằng',
        'Giới tính': 'Nữ',
        'Lớp': '8A1',
        'Điểm TB': 9.1,
        'Chuyên cần (%)': 100,
        'Ghi chú': 'Học sinh xuất sắc môn Khoa học tự nhiên',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 6 },  // STT
      { wch: 14 }, // Mã học sinh
      { wch: 24 }, // Họ và tên
      { wch: 12 }, // Giới tính
      { wch: 10 }, // Lớp
      { wch: 12 }, // Điểm TB
      { wch: 16 }, // Chuyên cần (%)
      { wch: 36 }, // Ghi chú
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_Hoc_Sinh');

    XLSX.writeFile(workbook, 'Mau_Danh_Sach_Hoc_Sinh_KHTN.xlsx');
    showToast('Đã tải xuống file Excel mẫu thành công!', 'success');
  };

  // Helper to find column value by matching potential header names
  const findValue = (row: Record<string, any>, possibleKeys: string[]): any => {
    const keys = Object.keys(row);
    for (const pKey of possibleKeys) {
      const match = keys.find(
        (k) => k.trim().toLowerCase() === pKey.trim().toLowerCase()
      );
      if (match && row[match] !== undefined && row[match] !== null) {
        return row[match];
      }
    }
    return undefined;
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          showToast('File không có dữ liệu học sinh', 'error');
          setIsProcessing(false);
          return;
        }

        const fallbackClass = classes.find((c) => c.id === targetClassId) || classes[0];

        const rows: ParsedStudentRow[] = rawJson.map((row, idx) => {
          // Identify Full Name
          const rawName = findValue(row, [
            'Họ và tên',
            'Họ tên',
            'Họ và tên học sinh',
            'Họ và tên đệm và tên',
            'FullName',
            'Full Name',
            'Name',
            'Tên',
          ]);
          const fullName = rawName ? String(rawName).trim() : '';

          // Identify Code
          const rawCode = findValue(row, [
            'Mã học sinh',
            'Mã số',
            'Mã HS',
            'MaHS',
            'Code',
            'Mã',
            'SBD',
          ]);
          const code = rawCode
            ? String(rawCode).trim()
            : `HS${String(idx + 1).padStart(3, '0')}`;

          // Identify Gender
          const rawGender = findValue(row, ['Giới tính', 'Phái', 'Gender', 'Sex']);
          let gender: 'Nam' | 'Nữ' = 'Nam';
          if (rawGender) {
            const gStr = String(rawGender).trim().toLowerCase();
            if (gStr.includes('nữ') || gStr.includes('female') || gStr === 'f') {
              gender = 'Nữ';
            }
          }

          // Identify Class
          const rawClass = findValue(row, ['Lớp', 'Lớp học', 'Class', 'ClassName']);
          let resolvedClass = fallbackClass;
          if (!overrideClass && rawClass) {
            const classText = String(rawClass).trim().toLowerCase();
            const matched = classes.find(
              (c) =>
                c.name.toLowerCase() === classText ||
                classText.includes(c.name.toLowerCase())
            );
            if (matched) {
              resolvedClass = matched;
            }
          }

          // Identify Average Score
          const rawScore = findValue(row, [
            'Điểm TB',
            'Điểm trung bình',
            'ĐTB',
            'Điểm',
            'Score',
            'Average',
          ]);
          let averageScore = 7.0;
          if (rawScore !== undefined && rawScore !== '') {
            const parsedScore = parseFloat(String(rawScore).replace(',', '.'));
            if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 10) {
              averageScore = Math.round(parsedScore * 10) / 10;
            }
          }

          // Identify Attendance
          const rawAtt = findValue(row, [
            'Chuyên cần (%)',
            'Chuyên cần',
            'Tỷ lệ chuyên cần',
            'Attendance',
          ]);
          let attendanceRate = 95;
          if (rawAtt !== undefined && rawAtt !== '') {
            const parsedAtt = parseFloat(String(rawAtt).replace('%', ''));
            if (!isNaN(parsedAtt) && parsedAtt >= 0 && parsedAtt <= 100) {
              attendanceRate = Math.round(parsedAtt);
            }
          }

          // Identify Notes
          const rawNotes = findValue(row, ['Ghi chú', 'Nhận xét', 'Note', 'Notes']);
          const notes = rawNotes ? String(rawNotes).trim() : '';

          // Status calculation
          let status: StudentStatus = 'Ổn định';
          if (averageScore >= 8.0) status = 'Tốt';
          else if (averageScore < 5.0) status = 'Cần chú ý';

          const isValid = fullName.length > 0;
          const error = !isValid ? 'Thiếu họ và tên học sinh' : undefined;

          return {
            code,
            fullName,
            classId: resolvedClass.id,
            className: resolvedClass.name,
            gender,
            attendanceRate,
            averageScore,
            status,
            notes,
            isValid,
            error,
          };
        });

        setParsedRows(rows);
        setIsProcessing(false);
        showToast(`Đã đọc ${rows.length} dòng dữ liệu từ file Excel`, 'info');
      } catch (error) {
        console.error('Error reading excel file:', error);
        showToast('Có lỗi xảy ra khi đọc file Excel. Vui lòng kiểm tra lại định dạng file!', 'error');
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setParsedRows([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validRows = parsedRows.filter((r) => r.isValid);

  const handleConfirmImport = () => {
    if (validRows.length === 0) {
      showToast('Không có học sinh hợp lệ để nhập vào hệ thống', 'warning');
      return;
    }

    const studentsToImport = validRows.map((r) => ({
      code: r.code,
      fullName: r.fullName,
      classId: r.classId,
      className: r.className,
      gender: r.gender,
      attendanceRate: r.attendanceRate,
      averageScore: r.averageScore,
      status: r.status,
      notes: r.notes,
    }));

    addMultipleStudents(studentsToImport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nhập danh sách học sinh bằng file Excel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hỗ trợ định dạng file .xlsx, .xls hoặc .csv với mẫu chuẩn bộ môn KHTN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs text-slate-700">
          {/* Download sample & Class assignment row */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Chưa có file mẫu chuẩn của bộ môn?
              </p>
              <p className="text-[11px] text-emerald-700">
                Tải về file Excel mẫu đã định dạng sẵn các cột: Mã HS, Họ tên, Giới tính, Lớp, Điểm TB...
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Download className="w-4 h-4" />
              Tải file Excel mẫu (.xlsx)
            </button>
          </div>

          {/* Config row before upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lớp học áp dụng:
              </label>
              <select
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.studentCount} HS hiện tại)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={overrideClass}
                  onChange={(e) => setOverrideClass(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Áp dụng tất cả học sinh vào lớp đã chọn ở trên (bỏ qua cột lớp trong file)
                </span>
              </label>
            </div>
          </div>

          {/* Dropzone area */}
          {parsedRows.length === 0 ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Kéo thả file Excel vào đây hoặc click để chọn file
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Hỗ trợ file .xlsx, .xls hoặc .csv (dung lượng tối đa 10MB)
              </p>
            </div>
          ) : (
            /* Preview table of parsed students */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">File đang mở:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 font-bold text-blue-700">
                    {fileName}
                  </span>
                  <span className="text-slate-500">
                    ({validRows.length}/{parsedRows.length} học sinh hợp lệ)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Chọn file khác
                </button>
              </div>

              {/* Table Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">STT</th>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Giới tính</th>
                      <th className="py-2.5 px-3">Lớp</th>
                      <th className="py-2.5 px-3 text-center">Điểm TB</th>
                      <th className="py-2.5 px-3 text-center">Chuyên cần</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {parsedRows.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          !row.isValid
                            ? 'bg-rose-50/60 text-rose-800'
                            : index % 2 === 0
                            ? 'bg-white'
                            : 'bg-slate-50/40'
                        }
                      >
                        <td className="py-2 px-3 text-center text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-medium text-slate-600">
                          {row.code}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {row.fullName || (
                            <span className="text-rose-600 italic">Trống tên</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-600">{row.gender}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[11px]">
                            {row.className}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-800">
                          {row.averageScore}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-600">
                          {row.attendanceRate}%
                        </td>
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Hợp lệ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-[11px]">
                              <AlertCircle className="w-3.5 h-3.5" /> {row.error}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {parsedRows.length > 0
              ? `Sẵn sàng nhập ${validRows.length} học sinh vào hệ thống quản lý KHTN.`
              : 'Hãy chọn hoặc kéo thả file Excel để xem trước dữ liệu.'}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={validRows.length === 0}
              onClick={handleConfirmImport}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Xác nhận nhập ({validRows.length} học sinh)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
