import { RefreshCw } from "lucide-react";
import Drawer from "../shared/Drawer";
import MonthBreakdown from "./MonthBreakdown";

export default function AttendanceDrawer({
  open,
  onClose,
  subject,
  breakdown,
  isLoading,
  isError,
  onRetry,
}) {
  const subtitle = breakdown
    ? `Overall: ${breakdown.overall.attended}/${breakdown.overall.held} → ${breakdown.overall.percentage}%`
    : subject
    ? `${subject.classes_attended}/${subject.classes_held} → ${subject.percentage}%`
    : "";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={subject?.subject_name ?? "Attendance Breakdown"}
      subtitle={subtitle}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-surface-400">Loading breakdown...</p>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-sm text-surface-500">
            Could not load breakdown. Try again.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-100"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && breakdown?.monthly_breakdown?.length === 0 && (
        <p className="py-12 text-center text-sm text-surface-400">
          No attendance records found for this subject.
        </p>
      )}

      {/* Month breakdown list */}
      {!isLoading && !isError && breakdown?.monthly_breakdown?.length > 0 && (
        <div>
          {breakdown.monthly_breakdown.map((month) => (
            <MonthBreakdown key={month.month} month={month} />
          ))}
        </div>
      )}
    </Drawer>
  );
}