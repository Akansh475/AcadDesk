import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  Megaphone,
  Radio,
  Clock,
  Sparkles,
} from "lucide-react";
import dayjs from "dayjs";
import useAdminNotifications from "../../hooks/admin/useAdminNotifications";
import AdminModal from "./AdminModal";
import AdminConfirmDialog from "./AdminConfirmDialog";

const INITIAL_FORM = {
  title: "",
  message: "",
  type: "announcement",
};

const NOTIF_TYPE_BADGES = {
  announcement: { label: "Announcement", bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/40" },
  exam: { label: "Exam Alert", bg: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900/40" },
  holiday: { label: "Holiday Notice", bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/40" },
  event: { label: "Campus Event", bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/40" },
};

export default function AdminNotificationsTab() {
  const {
    notifications,
    total,
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
    refetch,
  } = useAdminNotifications();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      setSubmitError("");
      setFormErrors({});
      if (modalMode === "edit" && selectedNotification) {
        setFormData({
          title: selectedNotification.title || "",
          message: selectedNotification.message || "",
          type: selectedNotification.type || "announcement",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
    }
  }, [isModalOpen, modalMode, selectedNotification]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Notification title is required";
    if (!formData.message.trim()) errors.message = "Message content is required";
    if (!formData.type) errors.type = "Type is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError("");
    const res = await saveNotification(formData);
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
            <Megaphone className="text-primary-600 dark:text-primary-400" size={22} />
            Campus Broadcast Notifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Publish real-time system alerts, circulars, and notifications dispatched to all students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh notifications"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin text-primary-600" : ""} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-2xs"
          >
            <Plus size={16} />
            <span>New Broadcast</span>
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
            placeholder="Search notifications by title or message..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Categories</option>
            <option value="announcement">Announcement</option>
            <option value="exam">Exam Alert</option>
            <option value="holiday">Holiday Notice</option>
            <option value="event">Campus Event</option>
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
                <th scope="col" className="px-4 py-3 sm:px-6">Title & Summary</th>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Audience Target</th>
                <th scope="col" className="px-4 py-3">Dispatched Date</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={`sk-notif-${i}`} className="animate-pulse">
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800 mb-1.5" />
                      <div className="h-3 w-64 rounded bg-slate-100 dark:bg-slate-800/60" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="ml-auto h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
                      <Megaphone size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No notifications found
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {searchTerm || typeFilter
                        ? "Try resetting filters or search criteria."
                        : "Click 'New Broadcast' to create an announcement."}
                    </p>
                  </td>
                </tr>
              ) : (
                notifications.map((notif) => {
                  const badge = NOTIF_TYPE_BADGES[notif.type] || NOTIF_TYPE_BADGES.announcement;
                  return (
                    <tr
                      key={notif.id}
                      onClick={() => openEditModal(notif)}
                      className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {notif.title}
                        </div>
                        <div className="mt-0.5 max-w-lg truncate text-xs text-slate-400 dark:text-slate-500">
                          {notif.message}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium">
                        <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400">
                          <Radio size={12} />
                          {notif.target || "All Students"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>{dayjs(notif.created_at).format("MMM D, YYYY")}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(notif)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            title="Edit notification"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteConfirm(notif)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                            title="Delete notification"
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
          <span>Total Broadcasts: <strong>{total}</strong></span>
          <span className="text-slate-400">Click any row to edit announcement</span>
        </div>
      </div>

      {/* Add / Edit Notification Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "create" ? "Create Broadcast Announcement" : `Edit Announcement — ${selectedNotification?.title}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          {/* Broadcast Banner Callout */}
          <div className="flex items-center gap-2.5 rounded-xl border border-primary-100 bg-primary-50/70 p-3 text-xs text-primary-800 dark:border-primary-900/40 dark:bg-primary-950/40 dark:text-primary-300">
            <Radio size={16} className="text-primary-600 dark:text-primary-400 shrink-0" />
            <span>This announcement will broadcast to <strong>ALL students</strong> across all departments and academic years.</span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Broadcast Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) setFormErrors({ ...formErrors, title: null });
              }}
              placeholder="e.g. Mid-Term Theory Exam Schedule Released"
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

          {/* Category Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="announcement">General Announcement</option>
              <option value="exam">Exam Schedule & Hall Tickets</option>
              <option value="holiday">Holiday Notice</option>
              <option value="event">Campus Hackathon / Event</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Message Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (formErrors.message) setFormErrors({ ...formErrors, message: null });
              }}
              placeholder="Write the full broadcast message content..."
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                formErrors.message
                  ? "border-red-400 bg-red-50/50 focus:border-red-500 dark:border-red-500"
                  : "border-slate-200 bg-slate-50 focus:border-primary-500 dark:border-slate-700"
              }`}
            />
            {formErrors.message && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.message}</p>
            )}
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
              {modalMode === "create" ? "Dispatch Broadcast" : "Update Broadcast"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteConfirmNotification)}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteNotification}
        title={`Delete Broadcast: ${deleteConfirmNotification?.title}`}
        message={`Are you sure you want to delete broadcast '${deleteConfirmNotification?.title}'? This will unpublish the alert from student dashboards.`}
        isLoading={isDeleting}
        confirmText="Delete Broadcast"
      />
    </div>
  );
}
