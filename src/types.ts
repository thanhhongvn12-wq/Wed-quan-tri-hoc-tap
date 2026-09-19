export type StudentStatus = 'Tốt' | 'Ổn định' | 'Cần chú ý';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AssignmentStatus = 'Đang mở' | 'Sắp hết hạn' | 'Đã đóng' | 'Hoàn thành';

export type TeachingPlanStatus = 'Chưa dạy' | 'Đang thực hiện' | 'Hoàn thành';

export interface TeacherProfile {
  name: string;
  subject: string;
  school: string;
  greeting: string;
  subtitle: string;
}

export interface ClassItem {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  teacher: string;
  subject: string;
  progressPercent: number;
  activeAssignmentsCount: number;
  room?: string;
}

export interface Student {
  id: string;
  code: string;
  fullName: string;
  classId: string;
  className: string;
  gender: 'Nam' | 'Nữ';
  attendanceRate: number; // percentage, e.g., 96
  averageScore: number; // e.g., 8.2
  assignmentsCompleted: number;
  assignmentsTotal: number;
  status: StudentStatus;
  notes?: string;
  parentPhone?: string;
}

export interface AttendanceRecordItem {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceDay {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  records: AttendanceRecordItem[];
  savedAt: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  classId: string;
  tx1: number | null;
  tx2: number | null;
  midterm: number | null;
  finalExam: number | null;
  average: number | null;
  notes?: string;
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  content: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  completedCount: number;
  totalCount: number;
  status: AssignmentStatus;
  notes?: string;
}

export interface TeachingPlanItem {
  id: string;
  week: number;
  classId: string;
  className: string;
  topic: string; // Chủ đề / bài học
  objectives: string; // Mục tiêu
  status: TeachingPlanStatus;
  notes?: string;
}

export interface GradeFormulaConfig {
  txWeight: number; // e.g. 1
  midtermWeight: number; // e.g. 2
  finalWeight: number; // e.g. 3
  description: string;
}

export interface RecentActivity {
  id: string;
  text: string;
  timestamp: string;
  type: 'attendance' | 'grade' | 'assignment' | 'student';
}
