import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { isPastDate } from "../../utils/taskHelpers";

const EMPTY_FORM = { title: "", description: "", due_date: "", priority: "Medium" };

export default function TaskModal({ open, task, onSave, onClose, isSaving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [titleError, setTitleError] = useState("");
  const [pastDateWarning, setPastDateWarning] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? {
              title: task.title,
              description: task.description ?? "",
              due_date: task.due_date,
              priority: task.priority,
            }
          : EMPTY_FORM
      );
      setTitleError("");
      setPastDateWarning(false);
    }
  }, [open, task]);

  if (!open) return null;

  const isEditing = Boolean(task);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && value.trim()) setTitleError("");
    if (field === "due_date") {
      setPastDateWarning(!isEditing && Boolean(value) && isPastDate(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setTitleError("Title is required");
      return;
    }
    onSave({ ...form, title: form.title.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {isEditing ? "Edit Goal" : "Add Goal"}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary-500 dark:border-slate-700 dark:text-slate-100"
              placeholder="e.g. Submit DBMS assignment"
            />
            {titleError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{titleError}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary-500 dark:border-slate-700 dark:text-slate-100"
              placeholder="Optional details"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Due Date
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={handleChange("due_date")}
                required
                className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary-500 dark:border-slate-700 dark:text-slate-100"
              />
              {pastDateWarning && (
                <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  This date has already passed, are you sure?
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={handleChange("priority")}
                className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary-500 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}