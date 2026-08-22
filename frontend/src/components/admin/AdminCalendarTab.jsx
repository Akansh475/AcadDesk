import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  Calendar as CalendarIcon,
  Tag,
  Building,
} from "lucide-react";
import dayjs from "dayjs";
import useAdminCalendar from "../../hooks/admin/useAdminCalendar";
import useAdminCourses from "../../hooks/admin/useAdminCourses";
import AdminModal from "./AdminModal";
import AdminConfirmDialog from "./AdminConfirmDialog";

const INITIAL_FORM = {
  title: "",
  type: "exam",
  date: dayjs().add(7, "day").format("YYYY-MM-DD"),
  course_id: "",
};

const EVENT_TYPE_BADGES = {
  exam: { label: "Exam", bg: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900/40" },
  practical: { label: "Practical", bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/40" },
  pbl: { label: "PBL Project", bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/40" },
  holiday: { label: "Holiday", bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/40" },
};

export default function AdminCalendarTab() {
  const {
    events,
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
    selectedEvent,
    deleteConfirmEvent,
    openCreateModal,
    openEditModal,
    closeModal,
    saveEvent,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteEvent,
    refetch,
  } = useAdminCalendar();

  const { allCourses } = useAdminCourses();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      setSubmitError("");
      setFormErrors({});
      if (modalMode === "edit" && selectedEvent) {
        setFormData({
          title: selectedEvent.title || "",
          type: selectedEvent.type || "exam",
          date: selectedEvent.date ? dayjs(selectedEvent.date).format("YYYY-MM-DD") : "",
          course_id: selectedEvent.course_id || "",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
    }
  }, [isModalOpen, modalMode, selectedEvent]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Event title is required";
    }
    if (!formData.date) {
      errors.date = "Event date is required";
    }
    if (!formData.type) {
      errors.type = "Event type is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError("");
    const res = await saveEvent(formData);
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
            <CalendarIcon className="text-primary-600 dark:text-primary-400" size={22} />
            Academic Calendar & Exam Schedules
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Schedule exams, lab practicals, PBL evaluations, and college-wide holidays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh calendar"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin text-primary-600" : ""} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-2xs"
          >
            <Plus size={16} />
            <span>Add Event</span>
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
            placeholder="Search calendar events by title or course..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Event Types</option>
            <option value="exam">Exam</option>
            <option value="practical">Practical</option>
            <option value="pbl">PBL Submission</option>
            <option value="holiday">Holiday</option>
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

      {/* Events Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">Event Title</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Event Date</th>
                <th scope="col" className="px-4 py-3">Associated Course</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`sk-cal-${i}`} className="animate-pulse">
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="ml-auto h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
                      <CalendarIcon size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No calendar events found
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {searchTerm || typeFilter
                        ? "Try clearing the search or type filters."
                        : "Click 'Add Event' to publish a new academic calendar milestone."}
                    </p>
                  </td>
                </tr>
              ) : (
                events.map((evt) => {
                  const badge = EVENT_TYPE_BADGES[evt.type] || EVENT_TYPE_BADGES.exam;
                  const isFuture = dayjs(evt.date).isAfter(dayjs(), "day");
                  const isToday = dayjs(evt.date).isSame(dayjs(), "day");

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => openEditModal(evt)}
                      className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {evt.title}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {dayjs(evt.date).format("ddd, MMM D, YYYY")}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {isToday ? (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Today</span>
                          ) : isFuture ? (
                            `In ${dayjs(evt.date).diff(dayjs(), "day")} days`
                          ) : (
                            `${dayjs().diff(dayjs(evt.date), "day")} days ago`
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                        {evt.course_id ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {evt.course_name || "Specific Course"}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">All Courses (College-wide)</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(evt)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            title="Edit event"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteConfirm(evt)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
                            title="Delete event"
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
          <span>Total Scheduled Events: <strong>{total}</strong></span>
          <span className="text-slate-400">Click any row to edit schedule details</span>
        </div>
      </div>

      {/* Add / Edit Calendar Event Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "create" ? "Add Calendar Event" : `Edit Event — ${selectedEvent?.title}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) setFormErrors({ ...formErrors, title: null });
              }}
              placeholder="e.g. Mid Term Theory Examination"
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

          {/* Type & Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Category / Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="exam">Exam (Theory / Semester)</option>
                <option value="practical">Practical / Lab Exam</option>
                <option value="pbl">Project Based Learning (PBL)</option>
                <option value="holiday">Holiday / University Closure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (formErrors.date) setFormErrors({ ...formErrors, date: null });
                }}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                  formErrors.date
                    ? "border-red-400 bg-red-50/50 focus:border-red-500 dark:border-red-500"
                    : "border-slate-200 bg-slate-50 focus:border-primary-500 dark:border-slate-700"
                }`}
              />
              {formErrors.date && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.date}</p>
              )}
            </div>
          </div>

          {/* Course Scope (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Association <span className="text-slate-400 font-normal">(Optional — leave blank for college-wide events)</span>
            </label>
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">None (College-wide / All Students)</option>
              {allCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              Holidays and general notifications should leave this blank.
            </p>
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
              {modalMode === "create" ? "Add Event" : "Update Event"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={Boolean(deleteConfirmEvent)}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteEvent}
        title={`Delete Event: ${deleteConfirmEvent?.title}`}
        message={`Are you sure you want to remove '${deleteConfirmEvent?.title}' scheduled for ${deleteConfirmEvent?.date}?`}
        isLoading={isDeleting}
        confirmText="Delete Event"
      />
    </div>
  );
}
