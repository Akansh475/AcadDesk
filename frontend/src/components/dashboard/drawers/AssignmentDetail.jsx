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
          <p className="mb-1.5 text-xs font-medium text-surface-500 dark:text-slate-400">Description</p>
          <p className="text-sm text-surface-700 dark:text-slate-300 leading-relaxed">{description}</p>
        </div>
      )}

      {data.file_name && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-2 text-xs font-medium text-surface-500 dark:text-slate-400">Attached Question Paper</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-surface-800 dark:text-slate-200">
                  {data.file_name}
                </p>
                {data.file_size && (
                  <p className="text-2xs text-surface-400 dark:text-slate-500">{data.file_size}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (data.file_url && data.file_url.startsWith("data:")) {
                  const link = document.createElement("a");
                  link.href = data.file_url;
                  link.download = data.file_name;
                  link.click();
                } else {
                  const content = `%PDF-1.4\n% AcadDesk Assignment Document: ${title}`;
                  const blob = new Blob([content], { type: "application/pdf" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = data.file_name;
                  link.click();
                  setTimeout(() => URL.revokeObjectURL(url), 2000);
                }
              }}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-2xs"
            >
              <FileDown size={14} />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-surface-200 px-4 py-3 dark:border-slate-800">
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