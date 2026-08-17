import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAsRead, fetchUnreadCount } from "../api/notificationsApi";

export function useNotifications() {
  const USER_ID = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
    } catch {
      return "u1";
    }
  })();

  const queryClient = useQueryClient();
  const NOTIFICATIONS_KEY = ["notifications", USER_ID];
  const UNREAD_COUNT_KEY = ["notifications-unread", USER_ID];

  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => fetchNotifications(USER_ID),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_KEY);
      queryClient.setQueryData(NOTIFICATIONS_KEY, (old) =>
        old?.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      queryClient.setQueryData(UNREAD_COUNT_KEY, (old) =>
        old ? { count: Math.max(0, old.count - 1) } : old
      );
      return { previous };
    },
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
  const USER_ID = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
    } catch {
      return "u1";
    }
  })();

  const query = useQuery({
    queryKey: ["notifications-unread", USER_ID],
    queryFn: () => fetchUnreadCount(USER_ID),
    refetchInterval: 60_000,
  });

  return {
    count: query.data?.count ?? 0,
    isError: query.isError,
  };
}