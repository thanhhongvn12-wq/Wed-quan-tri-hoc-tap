import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ACTIVITIES,
  INITIAL_ASSIGNMENTS,
  INITIAL_CLASSES,
  INITIAL_FORMULA_CONFIG,
  INITIAL_GRADES,
  INITIAL_STUDENTS,
  INITIAL_TEACHER,
  INITIAL_TEACHING_PLAN,
} from '../data/initialData';
import {
  Assignment,
  AttendanceDay,
  AttendanceStatus,
  ClassItem,
  GradeFormulaConfig,
  GradeItem,
  RecentActivity,
  Student,
  TeacherProfile,
  TeachingPlanItem,
} from '../types';

export type NavTab =
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'attendance'
  | 'grades'
  | 'assignments'
  | 'teaching-plan'
  | 'analytics';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface AppContextType {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  teacher: TeacherProfile;
  updateTeacher: (profile: Partial<TeacherProfile>) => void;
  classes: ClassItem[];
  addClass: (newClass: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, updated: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;
  students: Student[];
  addStudent: (newStudent: Omit<Student, 'id' | 'assignmentsCompleted' | 'assignmentsTotal'>) => void;
  addMultipleStudents: (newStudents: Array<Omit<Student, 'id' | 'assignmentsCompleted' | 'assignmentsTotal'>>) => number;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  grades: GradeItem[];
  updateGrade: (id: string, field: keyof GradeItem, value: number | null | string) => void;
  formulaConfig: GradeFormulaConfig;
  updateFormulaConfig: (config: GradeFormulaConfig) => void;
  assignments: Assignment[];
  addAssignment: (newAsg: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updated: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  teachingPlans: TeachingPlanItem[];
  addTeachingPlan: (plan: Omit<TeachingPlanItem, 'id'>) => void;
  updateTeachingPlan: (id: string, updated: Partial<TeachingPlanItem>) => void;
  deleteTeachingPlan: (id: string) => void;
  attendanceDays: AttendanceDay[];
  saveAttendance: (classId: string, date: string, records: { studentId: string; status: AttendanceStatus }[]) => void;
  activities: RecentActivity[];
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TEACHER: 'khtn_teacher_profile_v1',
  CLASSES: 'khtn_classes_v1',
  STUDENTS: 'khtn_students_v1',
  GRADES: 'khtn_grades_v1',
  ASSIGNMENTS: 'khtn_assignments_v1',
  TEACHING_PLAN: 'khtn_teaching_plan_v1',
  ATTENDANCE: 'khtn_attendance_days_v1',
  FORMULA: 'khtn_grade_formula_v1',
  ACTIVITIES: 'khtn_activities_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load state from localStorage or initialData
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEACHER);
    return saved ? JSON.parse(saved) : INITIAL_TEACHER;
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [grades, setGrades] = useState<GradeItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [teachingPlans, setTeachingPlans] = useState<TeachingPlanItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEACHING_PLAN);
    return saved ? JSON.parse(saved) : INITIAL_TEACHING_PLAN;
  });

  const [attendanceDays, setAttendanceDays] = useState<AttendanceDay[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : [];
  });

  const [formulaConfig, setFormulaConfig] = useState<GradeFormulaConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FORMULA);
    return saved ? JSON.parse(saved) : INITIAL_FORMULA_CONFIG;
  });

  const [activities, setActivities] = useState<RecentActivity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Save to localStorage when state updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacher));
  }, [teacher]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHING_PLAN, JSON.stringify(teachingPlans));
  }, [teachingPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceDays));
  }, [attendanceDays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FORMULA, JSON.stringify(formulaConfig));
  }, [formulaConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (text: string, type: 'attendance' | 'grade' | 'assignment' | 'student') => {
    const newAct: RecentActivity = {
      id: 'act-' + Date.now(),
      text,
      timestamp: 'Vừa xong',
      type,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 9)]);
  };

  const updateTeacher = (profile: Partial<TeacherProfile>) => {
    setTeacher((prev) => ({ ...prev, ...profile }));
    showToast('Đã cập nhật thông tin giáo viên thành công');
  };

  const addClass = (newClass: Omit<ClassItem, 'id'>) => {
    const id = 'cls-' + newClass.name.toLowerCase().replace(/\s+/g, '-');
    const item: ClassItem = { ...newClass, id };
    setClasses((prev) => [...prev, item]);
    addActivity(`Đã thêm lớp học mới: ${item.name}`, 'student');
    showToast(`Đã thêm lớp ${item.name} thành công`);
  };

  const updateClass = (id: string, updated: Partial<ClassItem>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('Đã cập nhật thông tin lớp học');
  };

  const deleteClass = (id: string) => {
    const cls = classes.find((c) => c.id === id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
    // Also remove associated students and grades
    setStudents((prev) => prev.filter((s) => s.classId !== id));
    setGrades((prev) => prev.filter((g) => g.classId !== id));
    showToast(`Đã xóa lớp ${cls ? cls.name : id} và học sinh liên quan`);
  };

  const addStudent = (newStudent: Omit<Student, 'id' | 'assignmentsCompleted' | 'assignmentsTotal'>) => {
    const id = 'stu-' + Date.now();
    const item: Student = {
      ...newStudent,
      id,
      assignmentsCompleted: 0,
      assignmentsTotal: 6,
    };
    setStudents((prev) => [...prev, item]);

    // Also initialize grade entry
    const newGrade: GradeItem = {
      id: 'grd-' + Date.now(),
      studentId: id,
      classId: item.classId,
      tx1: null,
      tx2: null,
      midterm: null,
      finalExam: null,
      average: item.averageScore || null,
    };
    setGrades((prev) => [...prev, newGrade]);

    // Update class count
    setClasses((prev) =>
      prev.map((c) => (c.id === item.classId ? { ...c, studentCount: c.studentCount + 1 } : c))
    );

    addActivity(`Đã thêm học sinh mới: ${item.fullName} (${item.className})`, 'student');
    showToast(`Đã thêm học sinh ${item.fullName} thành công`);
  };

  const addMultipleStudents = (
    newStudentsList: Array<Omit<Student, 'id' | 'assignmentsCompleted' | 'assignmentsTotal'>>
  ): number => {
    if (!newStudentsList || newStudentsList.length === 0) return 0;
    const baseTime = Date.now();
    const createdStudents: Student[] = [];
    const createdGrades: GradeItem[] = [];
    const classCountDeltas: Record<string, number> = {};

    newStudentsList.forEach((s, idx) => {
      const id = `stu-${baseTime}-${idx}`;
      const item: Student = {
        ...s,
        id,
        assignmentsCompleted: 0,
        assignmentsTotal: 6,
      };
      createdStudents.push(item);

      createdGrades.push({
        id: `grd-${baseTime}-${idx}`,
        studentId: id,
        classId: item.classId,
        tx1: null,
        tx2: null,
        midterm: null,
        finalExam: null,
        average: item.averageScore !== undefined ? item.averageScore : null,
      });

      classCountDeltas[item.classId] = (classCountDeltas[item.classId] || 0) + 1;
    });

    setStudents((prev) => [...prev, ...createdStudents]);
    setGrades((prev) => [...prev, ...createdGrades]);
    setClasses((prev) =>
      prev.map((c) =>
        classCountDeltas[c.id]
          ? { ...c, studentCount: c.studentCount + classCountDeltas[c.id] }
          : c
      )
    );

    addActivity(`Đã nhập danh sách ${createdStudents.length} học sinh từ file Excel`, 'student');
    showToast(`Đã nhập thành công ${createdStudents.length} học sinh từ file Excel!`, 'success');
    return createdStudents.length;
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updatedItem = { ...s, ...updated };
          // Keep status in sync if score changes
          if (updated.averageScore !== undefined) {
            if (updated.averageScore >= 8.0) updatedItem.status = 'Tốt';
            else if (updated.averageScore >= 6.0) updatedItem.status = 'Ổn định';
            else updatedItem.status = 'Cần chú ý';
          }
          return updatedItem;
        }
        return s;
      })
    );
    showToast('Đã cập nhật thông tin học sinh');
  };

  const deleteStudent = (id: string) => {
    const stu = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
    if (stu) {
      setClasses((prev) =>
        prev.map((c) => (c.id === stu.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c))
      );
    }
    showToast(`Đã xóa học sinh ${stu ? stu.fullName : ''}`);
  };

  // Helper to calculate student average score
  const calculateAverage = (tx1: number | null, tx2: number | null, mid: number | null, fin: number | null) => {
    const scores: { val: number; weight: number }[] = [];
    if (tx1 !== null && !isNaN(tx1)) scores.push({ val: tx1, weight: formulaConfig.txWeight });
    if (tx2 !== null && !isNaN(tx2)) scores.push({ val: tx2, weight: formulaConfig.txWeight });
    if (mid !== null && !isNaN(mid)) scores.push({ val: mid, weight: formulaConfig.midtermWeight });
    if (fin !== null && !isNaN(fin)) scores.push({ val: fin, weight: formulaConfig.finalWeight });

    if (scores.length === 0) return null;
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    const weightedSum = scores.reduce((sum, s) => sum + s.val * s.weight, 0);
    return Math.round((weightedSum / totalWeight) * 10) / 10;
  };

  const updateGrade = (id: string, field: keyof GradeItem, value: number | null | string) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, [field]: value };
          const newAvg = calculateAverage(updated.tx1, updated.tx2, updated.midterm, updated.finalExam);
          updated.average = newAvg;

          // Sync student average score & status
          if (newAvg !== null) {
            setStudents((stuList) =>
              stuList.map((s) => {
                if (s.id === g.studentId) {
                  let status: Student['status'] = s.status;
                  if (newAvg >= 8.0) status = 'Tốt';
                  else if (newAvg >= 5.5) status = 'Ổn định';
                  else status = 'Cần chú ý';
                  return { ...s, averageScore: newAvg, status };
                }
                return s;
              })
            );
          }
          return updated;
        }
        return g;
      })
    );
    showToast('Đã lưu điểm số');
    addActivity('Đã cập nhật bảng điểm môn Khoa học tự nhiên', 'grade');
  };

  const updateFormulaConfig = (config: GradeFormulaConfig) => {
    setFormulaConfig(config);
    // Recalculate all student grades with new formula
    setGrades((prev) =>
      prev.map((g) => {
        const scores: { val: number; weight: number }[] = [];
        if (g.tx1 !== null && !isNaN(g.tx1)) scores.push({ val: g.tx1, weight: config.txWeight });
        if (g.tx2 !== null && !isNaN(g.tx2)) scores.push({ val: g.tx2, weight: config.txWeight });
        if (g.midterm !== null && !isNaN(g.midterm)) scores.push({ val: g.midterm, weight: config.midtermWeight });
        if (g.finalExam !== null && !isNaN(g.finalExam)) scores.push({ val: g.finalExam, weight: config.finalWeight });

        if (scores.length === 0) return g;
        const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
        const weightedSum = scores.reduce((sum, s) => sum + s.val * s.weight, 0);
        const newAvg = Math.round((weightedSum / totalWeight) * 10) / 10;
        return { ...g, average: newAvg };
      })
    );
    showToast('Đã cập nhật hệ số công thức tính điểm');
  };

  const addAssignment = (newAsg: Omit<Assignment, 'id'>) => {
    const item: Assignment = {
      ...newAsg,
      id: 'asg-' + Date.now(),
    };
    setAssignments((prev) => [item, ...prev]);
    // update class active assignment count
    setClasses((prev) =>
      prev.map((c) => (c.id === item.classId ? { ...c, activeAssignmentsCount: c.activeAssignmentsCount + 1 } : c))
    );
    addActivity(`Đã giao bài tập mới: ${item.title} cho lớp ${item.className}`, 'assignment');
    showToast(`Đã tạo bài tập "${item.title}"`);
  };

  const updateAssignment = (id: string, updated: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    showToast('Đã cập nhật bài tập');
  };

  const deleteAssignment = (id: string) => {
    const asg = assignments.find((a) => a.id === id);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    if (asg) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === asg.classId ? { ...c, activeAssignmentsCount: Math.max(0, c.activeAssignmentsCount - 1) } : c
        )
      );
    }
    showToast('Đã xóa bài tập');
  };

  const addTeachingPlan = (plan: Omit<TeachingPlanItem, 'id'>) => {
    const item: TeachingPlanItem = {
      ...plan,
      id: 'tp-' + Date.now(),
    };
    setTeachingPlans((prev) => [...prev, item]);
    showToast('Đã thêm kế hoạch giảng dạy');
  };

  const updateTeachingPlan = (id: string, updated: Partial<TeachingPlanItem>) => {
    setTeachingPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Đã cập nhật kế hoạch giảng dạy');
  };

  const deleteTeachingPlan = (id: string) => {
    setTeachingPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('Đã xóa kế hoạch bài học');
  };

  const saveAttendance = (
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus }[]
  ) => {
    const className = classes.find((c) => c.id === classId)?.name || classId;
    const existingIndex = attendanceDays.findIndex((d) => d.classId === classId && d.date === date);
    const newDay: AttendanceDay = {
      id: 'att-' + classId + '-' + date,
      classId,
      date,
      records,
      savedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    if (existingIndex >= 0) {
      setAttendanceDays((prev) => {
        const copy = [...prev];
        copy[existingIndex] = newDay;
        return copy;
      });
    } else {
      setAttendanceDays((prev) => [newDay, ...prev]);
    }

    const presentCount = records.filter((r) => r.status === 'present').length;
    addActivity(`Đã lưu điểm danh lớp ${className} ngày ${date} (${presentCount}/${records.length} có mặt)`, 'attendance');
    showToast(`Đã lưu dữ liệu điểm danh lớp ${className} thành công!`);
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.TEACHER);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.GRADES);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.TEACHING_PLAN);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.FORMULA);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);

    setTeacher(INITIAL_TEACHER);
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setGrades(INITIAL_GRADES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setTeachingPlans(INITIAL_TEACHING_PLAN);
    setAttendanceDays([]);
    setFormulaConfig(INITIAL_FORMULA_CONFIG);
    setActivities(INITIAL_ACTIVITIES);

    showToast('Đã khôi phục toàn bộ dữ liệu mẫu ban đầu!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        teacher,
        updateTeacher,
        classes,
        addClass,
        updateClass,
        deleteClass,
        students,
        addStudent,
        addMultipleStudents,
        updateStudent,
        deleteStudent,
        selectedClassId,
        setSelectedClassId,
        grades,
        updateGrade,
        formulaConfig,
        updateFormulaConfig,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        teachingPlans,
        addTeachingPlan,
        updateTeachingPlan,
        deleteTeachingPlan,
        attendanceDays,
        saveAttendance,
        activities,
        toasts,
        showToast,
        removeToast,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
