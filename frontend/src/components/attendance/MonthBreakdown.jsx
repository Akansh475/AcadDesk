export default function MonthBreakdown({ month }) {
  const { month: monthName, dates_held, dates_attended, dates_absent } = month;
  const attendedSet = new Set(dates_attended);

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">
          {monthName}
        </p>
        <span className="text-xs text-surface-500">
          {dates_attended.length}/{dates_held.length} attended
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {dates_held.map((date) => {
          const attended = attendedSet.has(date);
          return (
            <div
              key={date}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                attended
                  ? "border-primary-200 bg-primary-50 text-primary-700"
                  : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              <span>{attended ? "✅" : "❌"}</span>
              <span>{date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}