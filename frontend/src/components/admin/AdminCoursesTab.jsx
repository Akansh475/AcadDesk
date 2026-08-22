import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Building,
  Layers,
} from "lucide-react";
import dayjs from "dayjs";
import useAdminCourses from "../../hooks/admin/useAdminCourses";
import AdminModal from "./AdminModal";
import AdminConfirmDialog from "./AdminConfirmDialog";

const INITIAL_FORM = {
  code: "",
  name: "",
  department: "Computer Science",
  college_id: "c1",
};

export default function AdminCoursesTab() {
  const {
    courses,
    total,
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
    refetch,
  } = useAdminCourses();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      setSubmitError("");
      setFormErrors({});
      if (modalMode === "edit" && selectedCourse) {
        setFormData({
          code: selectedCourse.code || "",
          name: selectedCourse.name || "",
          department: selectedCourse.department || "Computer Science",
          college_id: selectedCourse.college_id || "c1",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
    }
  }, [isModalOpen, modalMode, selectedCourse]);

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) {
      errors.code = "Course code is required (e.g. CS301)";
    }
    if (!formData.name.trim()) {
      errors.name = "Course name is required (e.g. Database Management Systems)";
    }
    if (!formData.department.trim()) {
      errors.department = "Department is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError("");
    const res = await saveCourse(formData);
    if (!res.success) {
      // If error is duplicate code, handle as inline error specifically
      if (res.error.toLowerCase().includes("course code already exists")) {
        setFormErrors((prev) => ({ ...prev, code: "Course code already exists" }));
      } else {
        setSubmitError(res.error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="text-primary-600 dark:text-primary-400" size={22} />
            Course Curriculum Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Define academic courses, subject codes, and departmental syllabi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh courses"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin text-primary-600" : ""} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-2xs"
          >
            <Plus size={16} />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by code, name, or department..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle size={18} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Courses Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">Course Code</th>
                <th scope="col" className="px-4 py-3">Course Name</th>
                <th scope="col" className="px-4 py-3">Department</th>
                <th scope="col" className="px-4 py-3">College Scope</th>
                <th scope="col" className="px-4 py-3">Created</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`sk-${i}`} className="animate-pulse">
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="ml-auto h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
                      <BookOpen size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No courses found
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {searchTerm
                        ? "No courses matching your search keyword."
                        : "Click 'Add Course' to create the first curriculum course."}
                    </p>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    onClick={() => openEditModal(course)}
                    className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 sm:px-6">
                      <span className="inline-flex items-center rounded-md bg-primary-50 px-2.5 py-1 text-xs font-mono font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-100 dark:border-primary-900/40">
                        {course.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {course.name}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Layers size={13} className="text-slate-400" />
                        {course.department || "Computer Science"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {course.college_id}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 dark:text-slate-500">
                      {course.created_at ? dayjs(course.created_at).format("MMM D, YYYY") : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(course)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                          title="Edit course"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(course)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                          title="Delete course"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 flex items-center justify-between">
          <span>Total Courses: <strong>{total}</strong></span>
          <span className="text-slate-400">Click any row to view / edit details</span>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "create" ? "Add New Course" : `Edit Course — ${selectedCourse?.code}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          {/* Course Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => {
                setFormData({ ...formData, code: e.target.value });
                if (formErrors.code) setFormErrors({ ...formErrors, code: null });
              }}
              placeholder="e.g. CS301"
              className={`w-full uppercase font-mono rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                formErrors.code
                  ? "border-red-400 bg-red-50/50 focus:border-red-500 dark:border-red-500"
                  : "border-slate-200 bg-slate-50 focus:border-primary-500 dark:border-slate-700"
              }`}
            />
            {formErrors.code && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{formErrors.code}</p>
            )}
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course / Subject Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: null });
              }}
              placeholder="e.g. Database Management Systems"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                formErrors.name
                  ? "border-red-400 bg-red-50/50 focus:border-red-500 dark:border-red-500"
                  : "border-slate-200 bg-slate-50 focus:border-primary-500 dark:border-slate-700"
              }`}
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.name}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Comm.">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Basic Sciences & Humanities">Basic Sciences & Humanities</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors disabled:opacity-50 shadow-xs"
            >
              {isSaving && <RefreshCw size={15} className="animate-spin" />}
              {modalMode === "create" ? "Add Course" : "Update Course"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Course Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteConfirmCourse)}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteCourse}
        title={`Delete Course: ${deleteConfirmCourse?.code}`}
        message={`Are you sure you want to delete course ${deleteConfirmCourse?.code} (${deleteConfirmCourse?.name})?`}
        isLoading={isDeleting}
        confirmText="Delete Course"
      />
    </div>
  );
}
