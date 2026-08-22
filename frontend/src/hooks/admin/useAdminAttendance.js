import { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { adminAttendanceApi, adminCoursesApi } from "../../api/adminApi";

export function useAdminAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format("YYYY-MM-DD"));

  const [records, setRecords] = useState([]);
  const [hasSavedRecords, setHasSavedRecords] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message }
  const [searchTerm, setSearchTerm] = useState("");

  // Load available courses for the dropdown
  const loadCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    try {
      const data = await adminCoursesApi.getCourses();
      setCourses(data);
      if (data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0].id);
      }
    } catch (err) {
      setError("Failed to load courses list.");
    } finally {
      setIsLoadingCourses(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Fetch attendance when course or date changes
  const fetchAttendance = useCallback(async (courseId, date) => {
    if (!courseId || !date) {
      setRecords([]);
      return;
    }

    setIsLoadingAttendance(true);
    setError(null);
    setSaveStatus(null);

    try {
      const data = await adminAttendanceApi.getAttendanceByCourseAndDate(courseId, date);
      setRecords(data.records || []);
      setHasSavedRecords(Boolean(data.has_saved_records));
    } catch (err) {
      setError(err.message || "Failed to load attendance records for selected course and date.");
      setRecords([]);
    } finally {
      setIsLoadingAttendance(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseId && selectedDate) {
      fetchAttendance(selectedCourseId, selectedDate);
    }
  }, [selectedCourseId, selectedDate, fetchAttendance]);

  // Toggle single student status between 'PRESENT' and 'ABSENT'
  const toggleStudentAttendance = (studentId) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.student_id === studentId) {
          const nextStatus = rec.status === "PRESENT" ? "ABSENT" : "PRESENT";
          return { ...rec, status: nextStatus };
        }
        return rec;
      })
    );
  };

  // Mark all students present
  const markAllPresent = () => {
    setRecords((prev) => prev.map((rec) => ({ ...rec, status: "PRESENT" })));
  };

  // Mark all students absent
  const markAllAbsent = () => {
    setRecords((prev) => prev.map((rec) => ({ ...rec, status: "ABSENT" })));
  };

  // Bulk save attendance
  const saveAttendance = async () => {
    if (!selectedCourseId || !selectedDate) {
      setSaveStatus({ type: "error", message: "Please select both course and date." });
      return { success: false };
    }

    if (records.length === 0) {
      setSaveStatus({ type: "error", message: "No enrolled students to mark attendance for." });
      return { success: false };
    }

    setIsSaving(true);
    setSaveStatus(null);
    setError(null);

    try {
      const payload = {
        course_id: selectedCourseId,
        date: selectedDate,
        records: records.map((r) => ({
          student_id: r.student_id,
          status: r.status,
        })),
      };

      const result = await adminAttendanceApi.saveBulkAttendance(payload);
      setHasSavedRecords(true);
      setSaveStatus({
        type: "success",
        message: result.message || "Attendance saved successfully!",
      });
      return { success: true };
    } catch (err) {
      const msg = err.message || "Bulk save attendance failed midway. No changes were applied.";
      setError(msg);
      setSaveStatus({
        type: "error",
        message: msg,
      });
      return { success: false, error: msg };
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate live statistics
  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "PRESENT").length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  }, [records]);

  // Filter records by student search
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const q = searchTerm.toLowerCase();
    return records.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.university_roll_no.toLowerCase().includes(q) ||
        (r.section && r.section.toLowerCase().includes(q))
    );
  }, [records, searchTerm]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    selectedCourse,
    selectedDate,
    setSelectedDate,
    records: filteredRecords,
    allRecords: records,
    hasSavedRecords,
    stats,
    searchTerm,
    setSearchTerm,
    isLoadingCourses,
    isLoadingAttendance,
    isSaving,
    error,
    saveStatus,
    toggleStudentAttendance,
    markAllPresent,
    markAllAbsent,
    saveAttendance,
    refetch: () => fetchAttendance(selectedCourseId, selectedDate),
  };
}
export default useAdminAttendance;
