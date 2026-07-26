import { ShieldCheck, ShieldAlert } from "lucide-react";

function SubjectRow({ subject, onClick }) {
  const isSafe = subject.percentage >= 70;
  return (
    <button
      type="button"
      onClick={() => onClick(subject)}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-surface-50"
    >
      <span className="truncate text-xs text-surface-700">{subject.subject_name}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold ${isSafe ? "text-primary-600" : "text-red-600"}`}>
          {subject.percentage}%
        </span>
        {isSafe ? (
          <ShieldCheck size={13} className="text-primary-500" />
        ) : (
          <ShieldAlert size={13} className="text-red-500" />
        )}
      </div>
    </button>
  );
}

export default function AttendanceSummaryWidget({ attendance, isLoading, onSubjectClick }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-surface-100" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-lg bg-surface-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
        <p className="text-center text-sm text-surface-400">No attendance data yet.</p>
      </div>
    );
  }

  const { overall_percentage, total_classes_done, total_classes_held, subjects } = attendance;
  const isAtRisk = overall_percentage < 70;
  const atRiskCount = subjects.filter((s) => s.percentage < 70).length;

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-surface-700">Attendance</h3>
        <span
          className={`text-lg font-bold ${isAtRisk ? "text-red-600" : "text-primary-600"}`}
        >
          {overall_percentage}%
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-surface-100">
        <div
          className={`h-full rounded-full transition-all ${isAtRisk ? "bg-red-500" : "bg-primary-500"}`}
          style={{ width: `${overall_percentage}%` }}
        />
      </div>
      <p className="mb-4 text-xs text-surface-400">
        {total_classes_done} of {total_classes_held} classes attended
      </p>

      {/* At risk warning */}
      {atRiskCount > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <ShieldAlert size={13} className="shrink-0 text-red-500" />
          <p className="text-xs text-red-700">
            {atRiskCount} subject{atRiskCount > 1 ? "s" : ""} below 70%
          </p>
        </div>
      )}

      {/* Subject list */}
      <div className="divide-y divide-surface-100">
        {subjects.map((subject) => (
          <SubjectRow
            key={subject.subject_id}
            subject={subject}
            onClick={onSubjectClick}
          />
        ))}
      </div>
    </div>
  );
}