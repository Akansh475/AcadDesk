import {
  ClipboardCheck,
  Calendar,
  BookOpen,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Users,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import dayjs from "dayjs";
import useAdminAttendance from "../../hooks/admin/useAdminAttendance";

export default function AdminAttendanceTab() {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    selectedCourse,
    selectedDate,
    setSelectedDate,
    records,
    allRecords,
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
    refetch,
  } = useAdminAttendance();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="text-primary-600 dark:text-primary-400" size={22} />
            Bulk Attendance Marking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select a course and session date to record attendance for all enrolled students in a single bulk operation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoadingAttendance || !selectedCourseId}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh attendance records"
          >
            <RefreshCw
              size={15}
              className={isLoadingAttendance ? "animate-spin text-primary-600" : ""}
            />
          </button>
        </div>
      </div>

      {/* Top Controls: Course Selector & Date Selector */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        {/* Course Dropdown */}
        <div className="sm:col-span-6">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary-600 dark:text-primary-400" />
            <span>Select Course</span>
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={isLoadingCourses}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {courses.length === 0 ? (
              <option value="">No courses available</option>
            ) : (
              courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Date Picker */}
        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Calendar size={14} className="text-primary-600 dark:text-primary-400" />
            <span>Select Date</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            max={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Status Indicator Pill */}
        <div className="sm:col-span-2 flex flex-col justify-end">
          <div className="flex h-[38px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
            {hasSavedRecords ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} /> Recorded
              </span>
            ) : (
              <span className="text-slate-400">New Session</span>
            )}
          </div>
        </div>
      </div>

      {/* Save Status / Error Feedback */}
      {saveStatus && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-sm font-medium shadow-2xs ${
            saveStatus.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
          }`}
        >
          {saveStatus.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p>{saveStatus.message}</p>
        </div>
      )}

      {error && !saveStatus && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle size={18} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Summary Stats & Quick Toggles (When students are enrolled) */}
      {allRecords.length > 0 && !isLoadingAttendance && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          {/* Live Metrics */}
          <div className="flex items-center gap-4 flex-wrap text-xs sm:text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Total Enrolled: <strong className="text-slate-900 dark:text-slate-100">{stats.total}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Present: {stats.present}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Absent: {stats.absent}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {stats.percentage}% Present
            </span>
          </div>

          {/* Quick Actions & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter enrolled..."
                className="w-36 sm:w-44 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-7 pr-2 text-xs text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={markAllPresent}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={markAllAbsent}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-300 transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        </div>
      )}

      {/* Main Roster Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        {isLoadingAttendance ? (
          <div className="p-8 text-center">
            <RefreshCw size={24} className="mx-auto animate-spin text-primary-600 mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Loading course roster for {selectedDate}...
            </p>
          </div>
        ) : allRecords.length === 0 ? (
          // Edge Case: 0 Enrolled Students
          <div className="py-12 px-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400 mb-3">
              <Users size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No students enrolled in this course
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              There are currently no active students mapped to {selectedCourse?.code || "the selected course"}. 
              Enrolled students will appear here automatically for bulk attendance marking.
            </p>
          </div>
        ) : (
          <div>
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 flex items-center justify-between">
              <span>Student Details</span>
              <span>Attendance Status Toggle</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[500px] overflow-y-auto">
              {records.map((student) => {
                const isPresent = student.status === "PRESENT";
                return (
                  <div
                    key={student.student_id}
                    onClick={() => toggleStudentAttendance(student.student_id)}
                    className="flex items-center justify-between px-4 py-3 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer select-none"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{student.name}</span>
                        {student.section && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-2xs font-mono font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Sec {student.section}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        <span>Roll: {student.university_roll_no}</span>
                        <span>ID: {student.student_id_code}</span>
                      </div>
                    </div>

                    {/* Present / Absent Switch Toggle */}
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleStudentAttendance(student.student_id)}
                        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs ${
                          isPresent
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                            : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
                        }`}
                      >
                        {isPresent ? (
                          <>
                            <Check size={14} strokeWidth={3} />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <X size={14} strokeWidth={3} />
                            <span>Absent</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Save Action Footer */}
        {allRecords.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/80">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Click anywhere on a row or the toggle button to switch status. Changes will be saved atomically.
            </div>

            <button
              type="button"
              onClick={saveAttendance}
              disabled={isSaving || allRecords.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-all disabled:opacity-50 shadow-xs"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Saving Attendance...</span>
                </>
              ) : (
                <>
                  <ClipboardCheck size={16} />
                  <span>Save Attendance</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
