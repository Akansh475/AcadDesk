import { Plus, Zap } from "lucide-react";
import TaskCard from "./TaskCard";

export default function GoalsColumn({
  tasks,
  points,
  isLoading,
  isError,
  error,
  isAtLimit,
  onAddClick,
  onToggleComplete,
  onEdit,
  onDelete,
  isMutating,
}) {
  const allCompleted =
    tasks.length > 0 &&
    tasks.every((t) => t.status === "Completed" || t.status === "COMPLETED");

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">My Goals</h2>
          {typeof points === "number" && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-2xs border transition-all ${
                points >= 0
                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                  : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
              title="Productivity Score: +5 pts per completed goal, -3 pts per overdue goal"
            >
              <Zap
                size={13}
                className={
                  points >= 0
                    ? "fill-amber-500 text-amber-500"
                    : "fill-rose-500 text-rose-500"
                }
              />
              <span>{points} pts</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onAddClick}
          disabled={isAtLimit}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 cursor-pointer"
        >
          <Plus size={14} />
          Add Task
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {error?.message || "Could not load your goals. Try again later."}
        </p>
      )}

      {!isLoading && !isError && tasks.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No goals added yet. Add your first goal to get started.
        </p>
      )}

      {!isLoading && !isError && allCompleted && (
        <p className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs font-medium text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400">
          All caught up! Add new goals to stay on track.
        </p>
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isMutating}
            />
          ))}
        </div>
      )}
    </section>
  );
}