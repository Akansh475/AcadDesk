import dayjs from "dayjs";
import { ExternalLink, AlertTriangle, FileDown, Clock } from "lucide-react";
import { STATUS_STYLES, calculateAssignmentPenalty } from "../../utils/assignmentHelpers";

export default function AssignmentRow({ assignment }) {
  const { title, due_date, status, erp_link, marks } = assignment;
  const hasLink = Boolean(erp_link);
  const isOverdue = status === "Overdue" || status === "OVERDUE";
  const isPending = status === "Pending" || status === "PENDING";
  const daysLeft = dayjs(due_date).startOf("day").diff(dayjs().startOf("day"), "day");
  const showApproachingWarning = marks != null && isPending && daysLeft >= 0 && daysLeft <= 3;
  const daysText = daysLeft === 0 ? "today" : daysLeft === 1 ? "1 day" : `${daysLeft} days`;

  const penalty = calculateAssignmentPenalty(marks, due_date, status);

  return (
    <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700">
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
          {/* Marks badge */}
          {marks != null && (
            <span className="rounded-lg bg-surface-100 px-2 py-0.5 text-xs font-semibold text-surface-600 dark:bg-slate-800 dark:text-slate-300">
              {marks} pts
            </span>
          )}

          {/* Status badge */}
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
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

      {/* Overdue delay penalty banner */}
      {penalty.isOverdue && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-medium text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle size={13} className="shrink-0 text-rose-600 dark:text-rose-400" />
            <span>
              Delayed by <strong>{penalty.daysOverdue} day{penalty.daysOverdue > 1 ? "s" : ""}</strong> ({penalty.deductionPercentage}% deducted at 2%/day · -{penalty.deductedMarks} marks)
            </span>
          </div>
          {marks != null && (
            <span className="rounded-md bg-rose-100/90 px-2 py-0.5 font-bold text-rose-700 dark:bg-rose-900/60 dark:text-rose-200">
              Current Max: {penalty.obtainableMarks} / {marks} marks
            </span>
          )}
        </div>
      )}

      {/* Approaching deadline warning */}
      {!penalty.isOverdue && showApproachingWarning && (
        <div className="flex items-center justify-between border-t border-amber-200 bg-amber-50/80 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              Worth <strong>{marks} marks</strong> — due in {daysText}. (2% marks deducted per day of delay)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}