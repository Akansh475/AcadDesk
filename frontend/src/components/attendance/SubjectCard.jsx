import { bunkBudgetMessage, classesNeededMessage } from "../../utils/attendanceFormulas";

export default function SubjectCard({ subject, onClick }) {
  const { subject_name, classes_attended, classes_held, percentage } = subject;

  const isSafe = percentage >= 70;
  const isNotStarted = classes_held === 0;

  const message = isNotStarted
    ? "Semester not started yet"
    : isSafe
    ? bunkBudgetMessage(classes_attended, classes_held)
    : classesNeededMessage(classes_attended, classes_held);

  return (
    <button
      type="button"
      onClick={() => onClick(subject)}
      className={`group w-full rounded-xl border bg-white px-5 py-4 text-left shadow-sm transition-all hover:shadow-md ${
        isSafe
          ? "border-surface-200"
          : "border-l-4 border-l-red-500 border-t-surface-200 border-r-surface-200 border-b-surface-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-surface-800">
          {subject_name}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${
              isNotStarted
                ? "text-surface-400"
                : isSafe
                ? "text-primary-600"
                : "text-red-600"
            }`}
          >
            {isNotStarted ? "—" : `${percentage}%`}
          </span>
          <span className="text-base">{isSafe ? "✅" : "⚠️"}</span>
        </div>
      </div>

      <p className="mt-1 text-xs text-surface-500">
        Attended: {classes_attended} / {classes_held}
      </p>

      <p
        className={`mt-2 text-xs font-medium ${
          isSafe ? "text-surface-600" : "text-red-600"
        }`}
      >
        {isSafe ? "🎯" : "🚨"} {message}
      </p>
    </button>
  );
}