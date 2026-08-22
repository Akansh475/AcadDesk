import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  FileText,
  Clock,
  Award,
  BookOpen,
  UploadCloud,
  FileDown,
  X,
  Paperclip,
  CheckCircle2,
} from "lucide-react";
import dayjs from "dayjs";
import useAdminAssignments from "../../hooks/admin/useAdminAssignments";
import useAdminCourses from "../../hooks/admin/useAdminCourses";
import AdminModal from "./AdminModal";
import AdminConfirmDialog from "./AdminConfirmDialog";

const INITIAL_FORM = {
  title: "",
  course_id: "",
  due_date: dayjs().add(5, "day").format("YYYY-MM-DD"),
  marks: "20",
  description: "",
  file_name: null,
  file_size: null,
  file_url: null,
};

// Helper to format bytes to human-readable size
function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function AdminAssignmentsTab() {
  const {
    assignments,
    total,
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
    refetch,
  } = useAdminAssignments();

  const { allCourses } = useAdminCourses();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      setSubmitError("");
      setFormErrors({});
      setIsDragOver(false);

      if (modalMode === "edit" && selectedAssignment) {
        setFormData({
          title: selectedAssignment.title || "",
          course_id: selectedAssignment.course_id || (allCourses[0]?.id ?? ""),
          due_date: selectedAssignment.due_date ? dayjs(selectedAssignment.due_date).format("YYYY-MM-DD") : "",
          marks: selectedAssignment.marks !== undefined ? String(selectedAssignment.marks) : "20",
          description: selectedAssignment.description || "",
          file_name: selectedAssignment.file_name || null,
          file_size: selectedAssignment.file_size || null,
          file_url: selectedAssignment.file_url || null,
        });
      } else {
        setFormData({
          ...INITIAL_FORM,
          course_id: allCourses[0]?.id || "",
        });
      }
    }
  }, [isModalOpen, modalMode, selectedAssignment, allCourses]);

  const handleFileUpload = (file) => {
    if (!file) return;

    // Validate PDF type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFormErrors((prev) => ({ ...prev, file: "Please upload a valid PDF document (.pdf)" }));
      return;
    }

    // Validate size (max 20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFormErrors((prev) => ({ ...prev, file: "PDF file size must be less than 20MB" }));
      return;
    }

    // Clear error
    setFormErrors((prev) => ({ ...prev, file: null }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        file_name: file.name,
        file_size: formatBytes(file.size),
        file_url: e.target.result, // base64 Data URL for viewing & downloading
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      file_name: null,
      file_size: null,
      file_url: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadPDF = (assignment, e) => {
    if (e) e.stopPropagation();
    if (!assignment.file_name) return;

    if (assignment.file_url && assignment.file_url.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = assignment.file_url;
      link.download = assignment.file_name;
      link.click();
    } else {
      // Create a fallback sample downloadable assignment document blob
      const content = `%PDF-1.4\n% AcadDesk Assignment Document: ${assignment.title}\nCourse: ${assignment.course_name}\nDue Date: ${assignment.due_date}\nMarks: ${assignment.marks}\nInstructions:\n${assignment.description || "Refer to lecture notes."}`;
      const blob = new Blob([content], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = assignment.file_name || `${assignment.title}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Assignment title is required";
    if (!formData.course_id) errors.course_id = "Please select a course";
    if (!formData.due_date) errors.due_date = "Due date is required";
    if (!formData.marks || isNaN(parseInt(formData.marks, 10)) || parseInt(formData.marks, 10) < 1) {
      errors.marks = "Marks must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError("");
    const res = await saveAssignment(formData);
    if (!res.success) {
      setSubmitError(res.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-primary-600 dark:text-primary-400" size={22} />
            Assignments & Coursework
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Publish coursework deliverables, attach question papers/PDFs, and set deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh assignments"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin text-primary-600" : ""} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-2xs"
          >
            <Plus size={16} />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments by title, course, or description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Courses</option>
            {allCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle size={18} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">Assignment Info</th>
                <th scope="col" className="px-4 py-3">Course / Subject</th>
                <th scope="col" className="px-4 py-3">PDF Attachment</th>
                <th scope="col" className="px-4 py-3">Due Date</th>
                <th scope="col" className="px-4 py-3 text-center">Marks</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={`sk-asg-${i}`} className="animate-pulse">
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800 mb-1.5" />
                      <div className="h-3 w-64 rounded bg-slate-100 dark:bg-slate-800/60" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="mx-auto h-4 w-10 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="ml-auto h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
                      <FileText size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No assignments found
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {searchTerm || courseFilter
                        ? "Try resetting filters or search criteria."
                        : "Click 'Add Assignment' to assign coursework with a PDF question sheet."}
                    </p>
                  </td>
                </tr>
              ) : (
                assignments.map((asg) => {
                  const isOverdue = dayjs(asg.due_date).isBefore(dayjs(), "day");
                  const hasPdf = Boolean(asg.file_name);

                  return (
                    <tr
                      key={asg.id}
                      onClick={() => openEditModal(asg)}
                      className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex items-center gap-2">
                          <span>{asg.title}</span>
                          {hasPdf && (
                            <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-2xs font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                              PDF
                            </span>
                          )}
                        </div>
                        {asg.description && (
                          <div className="mt-0.5 max-w-md truncate text-xs text-slate-400 dark:text-slate-500">
                            {asg.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <BookOpen size={12} className="text-slate-400" />
                          {asg.course_name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs" onClick={(e) => e.stopPropagation()}>
                        {hasPdf ? (
                          <button
                            type="button"
                            onClick={(e) => handleDownloadPDF(asg, e)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-primary-950/40 dark:hover:text-primary-300 transition-colors"
                            title={`Download ${asg.file_name}`}
                          >
                            <FileDown size={13} className="text-red-500" />
                            <span className="max-w-[120px] truncate">{asg.file_name}</span>
                            {asg.file_size && (
                              <span className="text-2xs text-slate-400">({asg.file_size})</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-2xs">No PDF attached</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <Clock size={13} className="text-slate-400" />
                          {dayjs(asg.due_date).format("MMM D, YYYY")}
                        </div>
                        <div className={`mt-0.5 font-medium ${isOverdue ? "text-red-500" : "text-slate-400 dark:text-slate-500"}`}>
                          {isOverdue ? "Closed / Past Due" : `Due in ${dayjs(asg.due_date).diff(dayjs(), "day")} days`}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-950/50 dark:text-primary-400">
                          <Award size={12} />
                          {asg.marks} pts
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(asg)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            title="Edit assignment"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteConfirm(asg)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                            title="Delete assignment"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 flex items-center justify-between">
          <span>Total Assignments: <strong>{total}</strong></span>
          <span className="text-slate-400">Click any row to edit assignment settings or replace PDF</span>
        </div>
      </div>

      {/* Add / Edit Assignment Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "create" ? "Publish New Assignment" : `Edit Assignment — ${selectedAssignment?.title}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) setFormErrors({ ...formErrors, title: null });
              }}
              placeholder="e.g. Dijkstra's Routing Algorithm Implementation"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                formErrors.title
                  ? "border-red-400 bg-red-50/50 focus:border-red-500 dark:border-red-500"
                  : "border-slate-200 bg-slate-50 focus:border-primary-500 dark:border-slate-700"
              }`}
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.title}</p>
            )}
          </div>

          {/* Course & Marks */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course / Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Marks / Points <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                placeholder="20"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {formErrors.marks && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.marks}</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Submission Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {formErrors.due_date && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.due_date}</p>
            )}
          </div>

          {/* PDF Question Paper Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Paperclip size={14} className="text-primary-600 dark:text-primary-400" />
                <span>Assignment PDF Document / Question Paper</span>
              </span>
              <span className="text-2xs text-slate-400 font-normal">Optional (Max 20MB)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {formData.file_name ? (
              // Selected PDF Card
              <div className="flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/60 p-3 dark:border-primary-900/50 dark:bg-primary-950/30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formData.file_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formData.file_size || "PDF Document"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400 transition-colors"
                    title="Remove PDF"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              // Dropzone Area
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? "border-primary-500 bg-primary-50/50 dark:border-primary-400 dark:bg-primary-950/30"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                }`}
              >
                <UploadCloud className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-1" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Click to select PDF or drag & drop file here
                </p>
                <p className="mt-0.5 text-2xs text-slate-400 dark:text-slate-500">
                  Supports .pdf files up to 20MB
                </p>
              </div>
            )}

            {formErrors.file && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.file}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Instructions & Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide assignment objectives, submission guidelines, or question references..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
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
              {modalMode === "create" ? "Publish Assignment" : "Save Changes"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteConfirmAssignment)}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteAssignment}
        title={`Delete Assignment: ${deleteConfirmAssignment?.title}`}
        message={`Are you sure you want to delete assignment '${deleteConfirmAssignment?.title}'? Any attached PDF question papers will also be removed.`}
        isLoading={isDeleting}
        confirmText="Delete Assignment"
      />
    </div>
  );
}
