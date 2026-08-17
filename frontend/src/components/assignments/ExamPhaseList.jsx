import { Calendar, RefreshCw } from "lucide-react";
import { getDaysUntilExam } from "../../utils/assignmentHelpers";
import dayjs from "dayjs";

const PHASE_ICONS = {
  "Mid Term Theory": "📝",
  "Mid Term Practical": "🔬",
  "End Term Theory": "📚",
  "End Term Practical": "⚗️",
};

function getDaysColor(days) {
  if (days <= 5) return "text-red-600 dark:text-red-400";
  if (days <= 15) return "text-orange-500 dark:text-orange-400";
  return "text-primary-600 dark:text-primary-400";
}

export default function ExamPhaseList({ upcomingPhases, hasPhases, isLoading, isError, onRetry }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2">
        <Calendar size={15} className="text-primary-600" />
        <h3 className="text-sm font-semibold text-surface-700 dark:text-slate-200">
          Upcoming Exams
        </h3>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-100 dark:bg-slate-800" />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-xs text-surface-500">Could not load exam dates. Try again.</p>
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-100"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && !hasPhases && (
        <p className="py-6 text-center text-xs text-surface-400">
          Exam dates not announced yet.
        </p>
      )}

      {!isLoading && !isError && hasPhases && (
        <div className="space-y-3">
          {upcomingPhases.map((phase) => {
            const daysLeft = getDaysUntilExam(phase.start_date);
            return (
              <div
                key={phase.id}
                className="flex items-start justify-between gap-2 rounded-xl border border-surface-100 bg-surface-50 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start gap-2">
                  <span className="text-base">{PHASE_ICONS[phase.type] ?? "📅"}</span>
                  <div>
                    <p className="text-xs font-semibold text-surface-700 dark:text-slate-200">
                      {phase.type}
                    </p>
                    <p className="mt-0.5 text-xs text-surface-400">
                      {dayjs(phase.start_date).format("D MMM YYYY")}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-bold ${getDaysColor(daysLeft)}`}>
                  {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}