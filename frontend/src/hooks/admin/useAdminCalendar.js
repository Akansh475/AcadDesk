import { useState, useEffect, useCallback } from "react";
import { adminCalendarApi } from "../../api/adminApi";

export function useAdminCalendar() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Delete confirmation
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminCalendarApi.getCalendarEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || "Failed to load calendar events.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openCreateModal = () => {
    setSelectedEvent(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const saveEvent = async (formData) => {
    setIsSaving(true);
    try {
      if (modalMode === "create") {
        await adminCalendarApi.createCalendarEvent(formData);
      } else {
        await adminCalendarApi.updateCalendarEvent(selectedEvent.id, formData);
      }
      closeModal();
      await fetchEvents();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to save calendar event." };
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirm = (event) => {
    setDeleteConfirmEvent(event);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmEvent(null);
  };

  const confirmDeleteEvent = async () => {
    if (!deleteConfirmEvent) return;
    setIsDeleting(true);
    try {
      await adminCalendarApi.deleteCalendarEvent(deleteConfirmEvent.id);
      closeDeleteConfirm();
      await fetchEvents();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete calendar event." };
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredEvents = events.filter((e) => {
    if (typeFilter && e.type !== typeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        (e.course_name && e.course_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return {
    events: filteredEvents,
    allEvents: events,
    total: filteredEvents.length,
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
    selectedEvent,
    deleteConfirmEvent,
    openCreateModal,
    openEditModal,
    closeModal,
    saveEvent,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteEvent,
    refetch: fetchEvents,
  };
}
export default useAdminCalendar;
