import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  Users,
  GraduationCap,
  Mail,
  Hash,
  Phone,
  BookOpen,
} from "lucide-react";
import useAdminStudents from "../../hooks/admin/useAdminStudents";
import AdminModal from "./AdminModal";
import AdminConfirmDialog from "./AdminConfirmDialog";
import AdminPagination from "./AdminPagination";

const INITIAL_FORM = {
  name: "",
  email: "",
  university_roll_no: "",
  student_id: "",
  branch: "Computer Science",
  course: "B.Tech CSE",
  year: "3rd Year",
  section: "A",
  cgpa: "8.00",
  phone: "",
};

export default function AdminStudentsTab() {
  const {
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
    refetch,
  } = useAdminStudents();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Sync form data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setSubmitError("");
      setFormErrors({});
      if (modalMode === "edit" && selectedStudent) {
        setFormData({
          name: selectedStudent.name || "",
          email: selectedStudent.email || "",
          university_roll_no: selectedStudent.university_roll_no || "",
          student_id: selectedStudent.student_id || "",
          branch: selectedStudent.branch || "Computer Science",
          course: selectedStudent.course || "B.Tech CSE",
          year: selectedStudent.year || "3rd Year",
          section: selectedStudent.section || "A",
          cgpa: selectedStudent.cgpa || "",
          phone: selectedStudent.phone || "",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
    }
  }, [isModalOpen, modalMode, selectedStudent]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Student name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Invalid email format";
    }
    if (!formData.university_roll_no.trim()) {
      errors.university_roll_no = "University roll number is required";
    }
    if (!formData.branch.trim()) errors.branch = "Branch is required";
    if (!formData.year.trim()) errors.year = "Year is required";
    if (!formData.section.trim()) errors.section = "Section is required";

    if (formData.cgpa) {
      const num = parseFloat(formData.cgpa);
      if (isNaN(num) || num < 0 || num > 10) {
        errors.cgpa = "CGPA must be between 0.00 and 10.00";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError("");
    const res = await saveStudent(formData);
    if (!res.success) {
      setSubmitError(res.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar with filters and Add button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="text-primary-600 dark:text-primary-400" size={22} />
            Student Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage student registrations, academic info, and database records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin text-primary-600" : ""} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-2xs"
          >
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, student ID, or email..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={branchFilter}
            onChange={(e) => {
              setBranchFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Branches</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Comm.">Electronics & Comm.</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle size={18} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">Student Info</th>
                <th scope="col" className="px-4 py-3">Roll & ID</th>
                <th scope="col" className="px-4 py-3">Branch & Year</th>
                <th scope="col" className="px-4 py-3 text-center">Sec / CGPA</th>
                <th scope="col" className="px-4 py-3">Phone</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 mb-1.5" />
                      <div className="h-3 w-40 rounded bg-slate-100 dark:bg-slate-800/60" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 mb-1" />
                      <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800/60" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 mb-1" />
                      <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800/60" />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="mx-auto h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="ml-auto h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
                      <Users size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No students found
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {searchTerm || branchFilter || yearFilter
                        ? "Try clearing filters or search query to find students."
                        : "Click 'Add Student' to register the first student."}
                    </p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => openEditModal(student)}
                    className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {student.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <Mail size={12} />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {student.university_roll_no}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {student.student_id}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {student.branch}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {student.year}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Sec {student.section || "A"}
                      </span>
                      {student.cgpa && (
                        <div className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {student.cgpa} CGPA
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      {student.phone || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(student)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                          title="Edit student"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(student)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                          title="Delete student"
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

        {/* Server-Side Pagination Footer */}
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={limit}
          onPageChange={(newPage) => setPage(newPage)}
          itemName="students"
        />
      </div>

      {/* Add / Edit Student Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "create" ? "Add New Student" : `Edit Student — ${selectedStudent?.name}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
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

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rahul.sharma@gehu.ac.in"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                  formErrors.email
                    ? "border-red-400 bg-red-50/50 focus:border-red-500 dark:border-red-500"
                    : "border-slate-200 bg-slate-50 focus:border-primary-500 dark:border-slate-700"
                }`}
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.email}</p>
              )}
            </div>

            {/* University Roll No */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                University Roll No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.university_roll_no}
                onChange={(e) => setFormData({ ...formData, university_roll_no: e.target.value })}
                placeholder="e.g. 210120101001"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 font-mono focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                  formErrors.university_roll_no
                    ? "border-red-400 bg-red-50/50 focus:border-red-500 dark:border-red-500"
                    : "border-slate-200 bg-slate-50 focus:border-primary-500 dark:border-slate-700"
                }`}
              />
              {formErrors.university_roll_no && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {formErrors.university_roll_no}
                </p>
              )}
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student ID / ERP ID
              </label>
              <input
                type="text"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                placeholder="e.g. STU2021001"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch / Major <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm.">Electronics & Comm.</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            {/* Year & Section */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Section <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CGPA (0.00 - 10.00)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g. 8.45"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {formErrors.cgpa && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.cgpa}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
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
              {modalMode === "create" ? "Create Student" : "Save Changes"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Student Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteConfirmStudent)}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteStudent}
        title={`Delete Student: ${deleteConfirmStudent?.name}`}
        message={`Are you sure you want to delete student ${deleteConfirmStudent?.name} (${deleteConfirmStudent?.university_roll_no})?`}
        warning={deleteWarning}
        isLoading={isDeleting}
        confirmText="Delete Student"
      />
    </div>
  );
}
