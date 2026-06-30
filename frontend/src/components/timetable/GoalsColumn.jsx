import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

export default function GoalsColumn({
  tasks,
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
  const allCompleted = tasks.length > 0 && tasks.every((t) => t.status === "Completed");

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">My Goals</h2>
        <button
          type="button"
          onClick={onAddClick}
          disabled={isAtLimit}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
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