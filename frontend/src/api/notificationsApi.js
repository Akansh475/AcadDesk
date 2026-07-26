import apiClient from "../utils/apiClient";

export async function fetchNotifications(userId) {
  const { data } = await apiClient.get(`/api/notifications/${userId}`);
  return data;
}

export async function markAsRead(notificationId) {
  const { data } = await apiClient.patch(`/api/notifications/${notificationId}/read`);
  return data;
}

export async function fetchUnreadCount(userId) {
  const { data } = await apiClient.get(`/api/notifications/${userId}/unread-count`);
  return data;
}