import { useState, useEffect, useCallback } from "react";
import { adminCoursesApi } from "../../api/adminApi";

export function useAdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Delete confirmation
  const [deleteConfirmCourse, setDeleteConfirmCourse] = useState(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminCoursesApi.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Failed to load courses.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const openCreateModal = () => {
    setSelectedCourse(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const saveCourse = async (formData) => {
    setIsSaving(true);
    try {
      if (modalMode === "create") {
        await adminCoursesApi.createCourse(formData);
      } else {
        await adminCoursesApi.updateCourse(selectedCourse.id, formData);
      }
      closeModal();
      await fetchCourses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to save course." };
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirm = (course) => {
    setDeleteConfirmCourse(course);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmCourse(null);
  };

  const confirmDeleteCourse = async () => {
    if (!deleteConfirmCourse) return;
    setIsDeleting(true);
    try {
      await adminCoursesApi.deleteCourse(deleteConfirmCourse.id);
      closeDeleteConfirm();
      await fetchCourses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete course." };
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered by search
  const filteredCourses = courses.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.department.toLowerCase().includes(q);
  });

  return {
    courses: filteredCourses,
    allCourses: courses,
    total: filteredCourses.length,
    searchTerm,
    setSearchTerm,
    isLoading,
    isSaving,
    isDeleting,
    error,
    isModalOpen,
    modalMode,
    selectedCourse,
    deleteConfirmCourse,
    openCreateModal,
    openEditModal,
    closeModal,
    saveCourse,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteCourse,
    refetch: fetchCourses,
  };
}
export default useAdminCourses;
