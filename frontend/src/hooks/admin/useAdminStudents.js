import { useState, useEffect, useCallback, useRef } from "react";
import { adminStudentsApi } from "../../api/adminApi";

export function useAdminStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCheckingRecords, setIsCheckingRecords] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Delete confirmation state
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState(null);
  const [deleteWarning, setDeleteWarning] = useState(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to page 1 on search change
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminStudentsApi.getStudents({
        page,
        limit,
        search: debouncedSearch,
        branch: branchFilter,
        year: yearFilter,
      });
      setStudents(data.students);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Failed to load students list.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, branchFilter, yearFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Open Create Modal
  const openCreateModal = () => {
    setSelectedStudent(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Save student (create or edit)
  const saveStudent = async (formData) => {
    setIsSaving(true);
    try {
      if (modalMode === "create") {
        await adminStudentsApi.createStudent(formData);
      } else {
        await adminStudentsApi.updateStudent(selectedStudent.id, formData);
      }
      closeModal();
      await fetchStudents();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to save student." };
    } finally {
      setIsSaving(false);
    }
  };

  // Open Delete Confirm with warning check
  const openDeleteConfirm = async (student) => {
    setDeleteConfirmStudent(student);
    setIsCheckingRecords(true);
    setDeleteWarning(null);

    try {
      const recordInfo = await adminStudentsApi.checkStudentHasRecords(student.id);
      if (recordInfo.hasAttendance || recordInfo.hasAssignments) {
        setDeleteWarning("This will remove all associated data. Continue?");
      }
    } catch {
      setDeleteWarning("This will remove all associated data. Continue?");
    } finally {
      setIsCheckingRecords(false);
    }
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmStudent(null);
    setDeleteWarning(null);
  };

  // Confirm delete
  const confirmDeleteStudent = async () => {
    if (!deleteConfirmStudent) return;
    setIsDeleting(true);
    try {
      await adminStudentsApi.deleteStudent(deleteConfirmStudent.id);
      closeDeleteConfirm();
      await fetchStudents();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete student." };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    students,
    total,
    page,
    limit,
    totalPages,
    searchTerm,
    setSearchTerm,
    branchFilter,
    setBranchFilter,
    yearFilter,
    setYearFilter,
    setPage,
    isLoading,
    isSaving,
    isDeleting,
    isCheckingRecords,
    error,
    isModalOpen,
    modalMode,
    selectedStudent,
    deleteConfirmStudent,
    deleteWarning,
    openCreateModal,
    openEditModal,
    closeModal,
    saveStudent,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteStudent,
    refetch: fetchStudents,
  };
}
export default useAdminStudents;
