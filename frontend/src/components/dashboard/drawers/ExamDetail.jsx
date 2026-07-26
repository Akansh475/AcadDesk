import dayjs from "dayjs";
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";

export default function ExamDetail({ data }) {
  if (!data) return null;

  const { subject, date, time, room, syllabus } = data;
  const daysLeft = dayjs(date).startOf("day").diff(dayjs().startOf("day"), "day");

  const dueMeta =
    daysLeft <= 0 ? { label: "Today", color: "text-red-600 bg-red-50 border-red-200" }
    : daysLeft === 1 ? { label: "Tomorrow", color: "text-orange-600 bg-orange-50 border-orange-200" }
    : daysLeft <= 3 ? { label: `${daysLeft} days away`, color: "text-orange-600 bg-orange-50 border-orange-200" }
    : { label: `${daysLeft} days away`, color: "text-primary-700 bg-primary-50 border-primary-200" };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-4">
        <h3 className="text-sm font-semibold text-surface-800">{subject}</h3>
        <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${dueMeta.color}`}>
          {dueMeta.label}
        </span>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <Calendar size={13} />
            <span>{dayjs(date).format("dddd, D MMMM YYYY")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <Clock size={13} />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <MapPin size={13} />
            <span>{room}</span>
          </div>
        </div>
      </div>

      {syllabus && (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <BookOpen size={13} className="text-surface-400" />
            <p className="text-xs font-medium text-surface-500">Syllabus / Topics</p>
          </div>
          <p className="text-sm text-surface-700 leading-relaxed">{syllabus}</p>
        </div>
      )}
    </div>
  );
}