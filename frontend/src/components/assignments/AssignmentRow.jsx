import dayjs from "dayjs";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { STATUS_STYLES } from "../../utils/assignmentHelpers";

export default function AssignmentRow({ assignment }) {
  const { title, due_date, status, erp_link } = assignment;
  const hasLink = Boolean(erp_link);
  const isOverdue = status === "Overdue";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
        <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
          {isOverdue && <AlertTriangle size={11} />}
          {status}
        </span>

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
  );
}