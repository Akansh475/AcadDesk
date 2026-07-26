import dayjs from "dayjs";
import { BookOpen, FileText } from "lucide-react";

function getDaysLeft(date) {
  const diff = dayjs(date).startOf("day").diff(dayjs().startOf("day"), "day");
  if (diff === 0) return { label: "Today", color: "text-red-600" };
  if (diff === 1) return { label: "Tomorrow", color: "text-orange-500" };
  if (diff < 0) return { label: "Overdue", color: "text-red-600" };
  return { label: `${diff} days left`, color: "text-surface-500" };
}

function DeadlineItem({ item, type, onClick }) {
  const { label, color } = getDaysLeft(item.due_date ?? item.date);
  const isExam = type === "exam";

  return (
    <button
      type="button"
      onClick={() => onClick(type, item)}
      className="flex w-full items-start gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:shadow-md"
    >
      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
        isExam ? "bg-red-50" : "bg-primary-50"
      }`}>
        {isExam
          ? <BookOpen size={14} className="text-red-500" />
          : <FileText size={14} className="text-primary-600" />
        }
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-surface-800">
          {item.title ?? item.subject}
        </p>
        <p className="text-xs text-surface-400">{item.subject ?? "Exam"}</p>
      </div>

      <span className={`shrink-0 text-xs font-medium ${color}`}>{label}</span>
    </button>
  );
}

export default function UpcomingDeadlines({
  assignments,
  exams,
  isLoadingAssignments,
  isLoadingExams,
  onItemClick,
}) {
  const isLoading = isLoadingAssignments || isLoadingExams;

  // Merge and sort by date
  const merged = [
    ...assignments.map((a) => ({ ...a, _type: "assignment" })),
    ...exams.map((e) => ({ ...e, _type: "exam", due_date: e.date })),
  ].sort((a, b) => dayjs(a.due_date).diff(dayjs(b.due_date)));

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-surface-700">Upcoming</h3>
        {merged.length > 0 && (
          <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600">
            {merged.length} items
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

      {!isLoading && merged.length === 0 && (
        <p className="py-6 text-center text-sm text-surface-400">
          You're all caught up! No upcoming deadlines. ✅
        </p>
      )}

      {!isLoading && merged.length > 0 && (
        <div className="space-y-2">
          {merged.map((item) => (
            <DeadlineItem
              key={item.id}
              item={item}
              type={item._type}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}