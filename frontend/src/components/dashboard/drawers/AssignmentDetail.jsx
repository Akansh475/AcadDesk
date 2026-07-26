import dayjs from "dayjs";
import { Calendar, BookOpen, Clock } from "lucide-react";

export default function AssignmentDetail({ data }) {
  if (!data) return null;

  const { title, subject, due_date, description, status } = data;
  const daysLeft = dayjs(due_date).startOf("day").diff(dayjs().startOf("day"), "day");

  const dueMeta =
    daysLeft < 0 ? { label: "Overdue", color: "text-red-600 bg-red-50 border-red-200" }
    : daysLeft === 0 ? { label: "Due Today", color: "text-red-600 bg-red-50 border-red-200" }
    : daysLeft === 1 ? { label: "Due Tomorrow", color: "text-orange-600 bg-orange-50 border-orange-200" }
    : { label: `${daysLeft} days left`, color: "text-primary-700 bg-primary-50 border-primary-200" };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-4">
        <h3 className="text-sm font-semibold text-surface-800">{title}</h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <BookOpen size={13} />
            <span>{subject}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <Calendar size={13} />
            <span>{dayjs(due_date).format("D MMMM YYYY")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <Clock size={13} />
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${dueMeta.color}`}>
              {dueMeta.label}
            </span>
          </div>
        </div>
      </div>

      {description && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-surface-500">Description</p>
          <p className="text-sm text-surface-700 leading-relaxed">{description}</p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-surface-200 px-4 py-3">
        <span className="text-xs text-surface-500">Submission Status</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          status === "Submitted"
            ? "bg-primary-50 text-primary-700"
            : "bg-yellow-50 text-yellow-700"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}