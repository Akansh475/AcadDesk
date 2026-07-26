import { Clock, MapPin } from "lucide-react";

function ClassCard({ cls }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col items-center justify-center rounded-lg bg-primary-50 px-3 py-2 text-center">
        <span className="text-xs font-semibold text-primary-700">
          {cls.time.split(" ")[0]}
        </span>
        <span className="text-[10px] text-primary-500">
          {cls.time.split(" ")[1]}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-surface-800">
          {cls.subject}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-surface-400">
            <MapPin size={11} />
            {cls.room}
          </span>
          <span className="text-xs text-surface-400">{cls.teacher}</span>
        </div>
      </div>
    </div>
  );
}

export default function TodayTimetable({ timetable, isLoading }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={15} className="text-primary-600" />
        <h3 className="text-sm font-semibold text-surface-700">Today's Classes</h3>
        {timetable.length > 0 && (
          <span className="ml-auto rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
            {timetable.length} classes
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-100" />
          ))}
        </div>
      )}

      {!isLoading && timetable.length === 0 && (
        <p className="py-6 text-center text-sm text-surface-400">
          No classes scheduled today 🎉
        </p>
      )}

      {!isLoading && timetable.length > 0 && (
        <div className="space-y-2">
          {timetable.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
}