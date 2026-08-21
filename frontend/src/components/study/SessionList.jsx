import dayjs from "dayjs";
import { BookOpen, Plus, MessageSquare } from "lucide-react";

export default function SessionList({
  sessions,
  activeSessionId,
  onSelect,
  onNew,
  isLoading,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-slate-400">
          Sessions
        </h3>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10"
        >
          <Plus size={12} />
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-2 p-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-100 dark:bg-slate-800" />
            ))}
          </div>
        )}

        {!isLoading && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4">
            <MessageSquare size={20} className="text-surface-300" />
            <p className="text-xs text-surface-400">
              No sessions yet. Start one!
            </p>
          </div>
        )}

        {!isLoading && sessions.length > 0 && (
          <div className="space-y-1 p-2">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const firstMsg = session.messages?.[0];

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelect(session.id)}
                  className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-500/10"
                      : "hover:bg-surface-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-500/20">
                    <BookOpen size={13} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs font-semibold ${
                      isActive ? "text-primary-700 dark:text-primary-400" : "text-surface-800 dark:text-slate-100"
                    }`}>
                      {session.subject_name}
                    </p>
                    <p className="truncate text-[10px] text-surface-400 dark:text-slate-500">
                      {firstMsg ? firstMsg.content.slice(0, 40) + "..." : "No messages yet"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-surface-300 dark:text-slate-600">
                      {dayjs(session.created_at).format("D MMM, h:mm A")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}