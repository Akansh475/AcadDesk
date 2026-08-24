import dayjs from "dayjs";
import { Calendar, BookOpen, Clock, FileText, FileDown, AlertTriangle, Award, Info } from "lucide-react";
import { calculateAssignmentPenalty } from "../../../utils/assignmentHelpers";

export default function AssignmentDetail({ data }) {
  if (!data) return null;

  const { title, subject, due_date, description, status, marks } = data;
  const daysLeft = dayjs(due_date).startOf("day").diff(dayjs().startOf("day"), "day");
  const penalty = calculateAssignmentPenalty(marks, due_date, status);

  const dueMeta =
    daysLeft < 0
      ? { label: `Overdue by ${Math.abs(daysLeft)}d`, color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/40" }
      : daysLeft === 0
      ? { label: "Due Today", color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/40" }
      : daysLeft === 1
      ? { label: "Due Tomorrow", color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/40" }
      : { label: `${daysLeft} days left`, color: "text-primary-700 bg-primary-50 border-primary-200 dark:bg-primary-950/40 dark:text-primary-300 dark:border-primary-800/40" };

  return (
    <div className="space-y-4">
      {/* ── Basic Info Box ── */}
      <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <h3 className="text-sm font-semibold text-surface-800 dark:text-slate-100">{title}</h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-slate-400">
            <BookOpen size={13} className="shrink-0" />
            <span>{subject}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-slate-400">
            <Calendar size={13} className="shrink-0" />
            <span>{dayjs(due_date).format("D MMMM YYYY")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-slate-400">
            <Clock size={13} className="shrink-0" />
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${dueMeta.color}`}>
              {dueMeta.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Marks & Late Deduction Policy ── */}
      {marks != null && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-surface-800 dark:text-slate-200">
              <Award size={15} className="text-primary-600 dark:text-primary-400" />
              <span>Assignment Marks & Late Policy</span>
            </div>
            <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              {marks} Marks Total
            </span>
          </div>

          {penalty.isOverdue ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-300">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Late Submission Deduction Applied</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px]">
                <div>
                  <span className="text-rose-600/80 dark:text-rose-400/80">Delay: </span>
                  <span className="font-semibold">{penalty.daysOverdue} day{penalty.daysOverdue > 1 ? "s" : ""}</span>
                </div>
                <div>
                  <span className="text-rose-600/80 dark:text-rose-400/80">Deduction (2%/day): </span>
                  <span className="font-semibold">-{penalty.deductedMarks} marks ({penalty.deductionPercentage}%)</span>
                </div>
              </div>
              <div className="pt-1 font-medium">
                Max Obtainable Score: <span className="font-bold underline">{penalty.obtainableMarks} / {marks} marks</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg bg-slate-100/80 p-2.5 text-xs text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              <Info size={14} className="shrink-0 mt-0.5 text-slate-500 dark:text-slate-400" />
              <span>
                <strong>Late Submission Policy:</strong> 2% marks are deducted for every 1 day delay after the due date.
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Description ── */}
      {description && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-surface-500 dark:text-slate-400">Description</p>
          <p className="text-sm text-surface-700 dark:text-slate-300 leading-relaxed">{description}</p>
        </div>
      )}

      {/* ── Question Paper Attachment ── */}
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

      {/* ── Submission Status ── */}
      <div className="flex items-center justify-between rounded-xl border border-surface-200 px-4 py-3 dark:border-slate-800">
        <span className="text-xs text-surface-500 dark:text-slate-400">Submission Status</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          status === "Submitted"
            ? "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
            : status === "Overdue"
            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}