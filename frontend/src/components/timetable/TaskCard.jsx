import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { getCountdownMeta, PRIORITY_DOT_CLASSES } from "../../utils/taskHelpers";

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete, isBusy }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isCompleted = task.status === "Completed" || task.status === "COMPLETED";
  const countdown = getCountdownMeta(task.due_date);

  const countdownClasses =
    countdown.tone === "danger" && !isCompleted
      ? "text-red-600 dark:text-red-400 font-medium"
      : "text-slate-500 dark:text-slate-400";

  return (
    <div
      className={`group relative flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors dark:border-slate-800 dark:bg-slate-900 ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        aria-label={isCompleted ? "Mark as pending" : "Mark as complete"}
        onClick={() => onToggleComplete(task)}
        disabled={isBusy}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer ${
          isCompleted
            ? "border-primary-600 bg-primary-600 text-white"
            : "border-slate-300 hover:border-primary-400 dark:border-slate-600 dark:hover:border-primary-500"
        }`}
      >
        {isCompleted && <Check size={13} strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT_CLASSES[task.priority] ?? "bg-slate-400"}`}
            aria-hidden="true"
          />
          <p
            className={`text-sm font-medium text-slate-800 dark:text-slate-100 ${
              isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""
            }`}
          >
            {task.title}
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          <span className={countdownClasses}>{countdown.label}</span>
          <span className="text-[10px] text-slate-300 dark:text-slate-700">•</span>
          {isCompleted ? (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              +5 pts earned
            </span>
          ) : countdown.daysLeft < 0 ? (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
              -3 pts overdue
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              +5 pts
            </span>
          )}
        </div>
      </div>

      {confirmingDelete ? (
        <div className="flex shrink-0 items-center gap-1.5 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Sure?</span>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={isBusy}
            className="rounded-md bg-red-50 px-2 py-1 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="rounded-md px-2 py-1 font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            No
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            aria-label="Edit task"
            onClick={() => onEdit(task)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            aria-label="Delete task"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}