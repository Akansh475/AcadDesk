import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAsRead, fetchUnreadCount } from "../api/notificationsApi";

const USER_ID = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
  } catch {
    return "u1";
  }
})();

const NOTIFICATIONS_KEY = ["notifications", USER_ID];
const UNREAD_COUNT_KEY  = ["notifications-unread", USER_ID];

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => fetchNotifications(USER_ID),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => markAsRead(id),

    // Optimistic update — mark as read immediately in UI
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_KEY);

      queryClient.setQueryData(NOTIFICATIONS_KEY, (old) =>
        old?.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );

      // Also optimistically decrement unread count
      queryClient.setQueryData(UNREAD_COUNT_KEY, (old) =>
        old ? { count: Math.max(0, old.count - 1) } : old
      );

      return { previous };
    },

    // Revert on failure
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    refetch: notificationsQuery.refetch,
    markAsRead: (id) => markReadMutation.mutate(id),
  };
}

export function useUnreadCount() {
  const query = useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: () => fetchUnreadCount(USER_ID),
    refetchInterval: 60_000, // poll every 60s to keep badge fresh
  });

  return {
    count: query.data?.count ?? 0,
    isError: query.isError,
  };
}