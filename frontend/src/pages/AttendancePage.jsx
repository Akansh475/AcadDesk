import { useAttendance } from "../hooks/useAttendance";
import AttendanceSummaryBar from "../components/attendance/AttendanceSummaryBar";
import SubjectCard from "../components/attendance/SubjectCard";
import AttendanceDrawer from "../components/attendance/AttendanceDrawer";

export default function AttendancePage() {
  const {
    summary,
    subjects,
    allSafe,
    isLoading,
    isError,
    drawerOpen,
    activeSubject,
    breakdown,
    breakdownLoading,
    breakdownError,
    refetchBreakdown,
    openDrawer,
    closeDrawer,
  } = useAttendance();

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-surface-400">Loading attendance...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-600">
          Failed to load attendance. Try again.
        </p>
      </div>
    );
  }

  // ── Empty state ──
  if (!subjects || subjects.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-surface-400">
          No attendance data available. Check back after classes begin.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

      {/* Summary bar */}
      <AttendanceSummaryBar summary={summary} />

      {/* All safe banner */}
      {allSafe && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
          ✅ All subjects are on track. Keep it up!
        </div>
      )}

      {/* Subject cards */}
      <div className="mt-6 space-y-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.subject_id}
            subject={subject}
            onClick={openDrawer}
          />
        ))}
      </div>

      {/* Attendance drawer */}
      <AttendanceDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        subject={activeSubject}
        breakdown={breakdown}
        isLoading={breakdownLoading}
        isError={breakdownError}
        onRetry={refetchBreakdown}
      />
    </div>
  );
}