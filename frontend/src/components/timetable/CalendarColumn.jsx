import dayjs from "dayjs";
import { CALENDAR_BADGE_CLASSES } from "../../utils/taskHelpers";

const TYPE_LABELS = {
  exam: "Exam",
  practical: "Practical",
  pbl: "PBL",
  holiday: "Holiday",
};

export default function CalendarColumn({ groupedEvents, hasEvents, isLoading, isError, error }) {
  return (
    <section className="flex-1">
      <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Academic Calendar
      </h2>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {error?.message || "Could not load academic calendar. Try again later."}
        </p>
      )}

      {!isLoading && !isError && !hasEvents && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No upcoming academic events found.
        </p>
      )}

      {!isLoading && !isError && hasEvents && (
        <div className="space-y-6">
          {groupedEvents.map((group) => (
            <div key={group.month}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {group.month}
              </p>
              <div className="space-y-2">
                {group.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-12 shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {dayjs(event.date).format("MMM D")}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        {event.title}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CALENDAR_BADGE_CLASSES[event.type]}`}
                    >
                      {TYPE_LABELS[event.type] ?? event.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}