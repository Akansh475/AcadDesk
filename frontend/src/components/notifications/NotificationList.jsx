import { RefreshCw } from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationList({
  notifications,
  isLoading,
  isError,
  onMarkRead,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-surface-200 bg-surface-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="text-sm text-surface-500">
          Could not load notifications. Try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-100"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl">🎉</p>
        <p className="mt-2 text-sm font-medium text-surface-700">
          You're all caught up!
        </p>
        <p className="mt-0.5 text-xs text-surface-400">
          No new notifications in the last 7 days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
}