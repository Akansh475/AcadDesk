import dayjs from "dayjs";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { STATUS_STYLES } from "../../utils/assignmentHelpers";

export default function AssignmentRow({ assignment }) {
  const { title, due_date, status, erp_link, marks } = assignment;
  const hasLink = Boolean(erp_link);
  const isOverdue = status === "Overdue";
  const isPending = status === "Pending" || status === "PENDING";
  const daysLeft = dayjs(due_date).startOf("day").diff(dayjs().startOf("day"), "day");
  const showWarning = marks != null && isPending && daysLeft >= 0 && daysLeft <= 3;
  const daysText = daysLeft === 1 ? "1 day" : `${daysLeft} days`;

  return (
    <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-surface-800 dark:text-slate-100">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-surface-400 dark:text-slate-500">
            Due {dayjs(due_date).format("D MMM YYYY")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Status badge */}
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
            {isOverdue && <AlertTriangle size={11} />}
            {status}
          </span>

          {/* PDF Attachment download */}
          {assignment.file_name && (
            <button
              type="button"
              onClick={() => {
                if (assignment.file_url && assignment.file_url.startsWith("data:")) {
                  const link = document.createElement("a");
                  link.href = assignment.file_url;
                  link.download = assignment.file_name;
                  link.click();
                } else {
                  const content = `%PDF-1.4\n% AcadDesk Assignment: ${assignment.title}\nDue: ${assignment.due_date}`;
                  const blob = new Blob([content], { type: "application/pdf" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = assignment.file_name || `${assignment.title}.pdf`;
                  link.click();
                  setTimeout(() => URL.revokeObjectURL(url), 2000);
                }
              }}
              title={`Download PDF: ${assignment.file_name}`}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/80 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/60 dark:text-red-300 transition-colors"
            >
              <FileDown size={13} />
              <span>PDF</span>
            </button>
          )}

          {/* ERP link */}
          {hasLink ? (
            <a
              href={erp_link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in ERP"
              className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600 dark:hover:bg-slate-800"
            >
              <ExternalLink size={14} />
            </a>
          ) : (
            <span
              title="Link not available"
              className="cursor-not-allowed rounded-lg p-1.5 text-surface-200 dark:text-slate-700"
            >
              <ExternalLink size={14} />
            </span>
          )}
        </div>
      </div>

      {showWarning && (
        <div className="border-t border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-medium text-yellow-700 dark:border-yellow-900/40 dark:bg-yellow-950/30 dark:text-yellow-400">
          ⚠️ Worth {marks} marks — due in {daysText}. Don't delay!
        </div>
      )}
    </div>
  );
}