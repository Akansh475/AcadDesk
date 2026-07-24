import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const TYPE_ICONS = {
  exam:         "📝",
  holiday:      "🎉",
  event:        "🚀",
  announcement: "📢",
  attendance:   "⚠️",
};

export default function NotificationItem({ notification, onMarkRead }) {
  // Skip rendering if title or message is missing
  if (!notification?.title || !notification?.message) return null;

  const { id, title, message, type, created_at, is_read } = notification;

  const handleClick = () => {
    if (!is_read) onMarkRead(id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all hover:shadow-sm ${
        is_read
          ? "border-surface-200 bg-white"
          : "border-primary-100 bg-primary-50/40 dark:border-primary-500/20 dark:bg-primary-500/5"
      }`}
    >
      {/* Unread dot */}
      <div className="mt-1.5 flex w-2 shrink-0 items-start justify-center">
        {!is_read && (
          <span className="h-2 w-2 rounded-full bg-primary-500" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-sm">{TYPE_ICONS[type] ?? "🔔"}</span>
          <p
            title={title}
            className={`truncate text-sm ${
              is_read
                ? "font-normal text-surface-700"
                : "font-semibold text-surface-800 dark:text-slate-100"
            }`}
          >
            {title}
          </p>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-surface-500 dark:text-slate-400">
          {message}
        </p>
        <p className="mt-1.5 text-xs text-surface-400 dark:text-slate-500">
          {dayjs(created_at).fromNow()}
        </p>
      </div>
    </button>
  );
}