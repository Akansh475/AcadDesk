import { useNotifications } from "../hooks/useNotifications";
import NotificationList from "../components/notifications/NotificationList";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    refetch,
    markAsRead,
  } = useNotifications();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-surface-800 dark:text-slate-100">
            Last 7 days
          </h2>
          {unreadCount > 0 && (
            <p className="mt-0.5 text-xs text-surface-400">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Notification list */}
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        isError={isError}
        onMarkRead={markAsRead}
        onRetry={refetch}
      />
    </div>
  );
}