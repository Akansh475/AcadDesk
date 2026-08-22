import { useState, useEffect, useCallback } from "react";
import { adminAssignmentsApi } from "../../api/adminApi";

export function useAdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [courseFilter, setCourseFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Delete confirmation
  const [deleteConfirmAssignment, setDeleteConfirmAssignment] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAssignmentsApi.getAssignments();
      setAssignments(data);
    } catch (err) {
      setError(err.message || "Failed to load assignments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const openCreateModal = () => {
    setSelectedAssignment(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const saveAssignment = async (formData) => {
    setIsSaving(true);
    try {
      if (modalMode === "create") {
        await adminAssignmentsApi.createAssignment(formData);
      } else {
        await adminAssignmentsApi.updateAssignment(selectedAssignment.id, formData);
      }
      closeModal();
      await fetchAssignments();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to save assignment." };
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirm = (assignment) => {
    setDeleteConfirmAssignment(assignment);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmAssignment(null);
  };

  const confirmDeleteAssignment = async () => {
    if (!deleteConfirmAssignment) return;
    setIsDeleting(true);
    try {
      await adminAssignmentsApi.deleteAssignment(deleteConfirmAssignment.id);
      closeDeleteConfirm();
      await fetchAssignments();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete assignment." };
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (courseFilter && a.course_id !== courseFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        (a.course_name && a.course_name.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return {
    assignments: filteredAssignments,
    allAssignments: assignments,
    total: filteredAssignments.length,
    courseFilter,
    setCourseFilter,
    searchTerm,
    setSearchTerm,
    isLoading,
    isSaving,
    isDeleting,
    error,
    isModalOpen,
    modalMode,
    selectedAssignment,
    deleteConfirmAssignment,
    openCreateModal,
    openEditModal,
    closeModal,
    saveAssignment,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteAssignment,
    refetch: fetchAssignments,
  };
}
export default useAdminAssignments;
