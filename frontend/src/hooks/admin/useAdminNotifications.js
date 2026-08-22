import { useState, useEffect, useCallback } from "react";
import { adminNotificationsApi } from "../../api/adminApi";

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Delete confirmation
  const [deleteConfirmNotification, setDeleteConfirmNotification] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminNotificationsApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const openCreateModal = () => {
    setSelectedNotification(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (notif) => {
    setSelectedNotification(notif);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const saveNotification = async (formData) => {
    setIsSaving(true);
    try {
      if (modalMode === "create") {
        await adminNotificationsApi.createNotification(formData);
      } else {
        await adminNotificationsApi.updateNotification(selectedNotification.id, formData);
      }
      closeModal();
      await fetchNotifications();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to save notification." };
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirm = (notif) => {
    setDeleteConfirmNotification(notif);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmNotification(null);
  };

  const confirmDeleteNotification = async () => {
    if (!deleteConfirmNotification) return;
    setIsDeleting(true);
    try {
      await adminNotificationsApi.deleteNotification(deleteConfirmNotification.id);
      closeDeleteConfirm();
      await fetchNotifications();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete notification." };
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (typeFilter && n.type !== typeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    total: filteredNotifications.length,
    typeFilter,
    setTypeFilter,
    searchTerm,
    setSearchTerm,
    isLoading,
    isSaving,
    isDeleting,
    error,
    isModalOpen,
    modalMode,
    selectedNotification,
    deleteConfirmNotification,
    openCreateModal,
    openEditModal,
    closeModal,
    saveNotification,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteNotification,
    refetch: fetchNotifications,
  };
}
export default useAdminNotifications;
