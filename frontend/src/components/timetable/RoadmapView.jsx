import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Sparkles, Target } from "lucide-react";
import dayjs from "dayjs";

function WeekCard({ week }) {
  const [expanded, setExpanded] = useState(week.week_number === 1);

  return (
    <div className="rounded-xl border border-surface-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
            {week.week_number}
          </span>
          <span className="text-sm font-medium text-surface-800 dark:text-slate-100">
            {week.focus}
          </span>
        </div>
        {expanded
          ? <ChevronUp size={15} className="shrink-0 text-surface-400" />
          : <ChevronDown size={15} className="shrink-0 text-surface-400" />
        }
      </button>

      {expanded && (
        <div className="border-t border-surface-100 px-4 pb-4 pt-3 dark:border-slate-800">
          <ul className="space-y-2">
            {week.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-slate-400">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                {task}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function RoadmapView({ goals, onDelete, isDeleting }) {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="space-y-6">
      {goals.map((goal) => (
        <div key={goal.id} className="rounded-2xl border border-surface-200 bg-surface-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          {/* Goal header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <Target size={15} className="mt-0.5 shrink-0 text-primary-600" />
              <div>
                <h3 className="text-sm font-semibold text-surface-800 dark:text-slate-100">
                  {goal.title}
                </h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                    {goal.category}
                  </span>
                  <span className="text-xs text-surface-400">
                    Due {dayjs(goal.deadline).format("D MMM YYYY")}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-surface-400">
                    <Sparkles size={11} />
                    {goal.roadmap?.length} week roadmap
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDelete(goal.id)}
              disabled={isDeleting}
              className="shrink-0 rounded-lg p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Week cards */}
          <div className="space-y-2">
            {goal.roadmap?.map((week) => (
              <WeekCard key={week.id} week={week} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}