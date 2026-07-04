import { AlertTriangle } from "lucide-react";

function StatBox({ label, value, valueClass = "" }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-surface-200 bg-white px-4 py-5 shadow-sm">
      <span className={`text-2xl font-bold ${valueClass}`}>{value}</span>
      <span className="mt-1 text-center text-xs text-surface-400">{label}</span>
    </div>
  );
}

export default function AttendanceSummaryBar({ summary }) {
  if (!summary) return null;

  const { total_classes_done, total_classes_held, overall_percentage, classes_remaining } = summary;
  const isAtRisk = overall_percentage < 70;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <StatBox
          label="Classes Done"
          value={total_classes_done}
          valueClass="text-surface-800"
        />
        <StatBox
          label="Total Held"
          value={total_classes_held}
          valueClass="text-surface-800"
        />
        <StatBox
          label="Overall %"
          value={`${overall_percentage}%`}
          valueClass={isAtRisk ? "text-red-600" : "text-primary-600"}
        />
        <StatBox
          label="Classes Left"
          value={classes_remaining}
          valueClass="text-surface-800"
        />
      </div>

      {isAtRisk && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} className="shrink-0" />
          Your overall attendance is at risk. Act now.
        </div>
      )}
    </div>
  );
}