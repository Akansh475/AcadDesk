import { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";

const CATEGORIES = [
  "Career",
  "Academics",
  "Skills",
  "Competitive Programming",
  "Open Source",
  "Research",
  "Personal",
];

export default function GoalForm({ onSubmit, isSubmitting, onClose }) {
  const [form, setForm] = useState({ title: "", category: "Career", deadline: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Goal title is required");
    if (!form.deadline) return setError("Deadline is required");
    setError("");
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary-600" />
            <h2 className="text-sm font-semibold text-surface-800 dark:text-slate-100">
              Set a New Goal
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mb-4 text-xs text-surface-400 dark:text-slate-500">
          AI will generate a personalized week-by-week roadmap based on your goal and academic calendar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-600 dark:text-slate-400">
              What's your goal?
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Crack Amazon SDE Internship"
              className="w-full rounded-xl border border-surface-200 bg-transparent px-4 py-2.5 text-sm text-surface-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-600 dark:text-slate-400">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-surface-200 bg-transparent px-4 py-2.5 text-sm text-surface-800 outline-none focus:border-primary-400 dark:border-slate-700 dark:text-slate-100"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-600 dark:text-slate-400">
              Target Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full rounded-xl border border-surface-200 bg-transparent px-4 py-2.5 text-sm text-surface-800 outline-none focus:border-primary-400 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Generating roadmap...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate Roadmap
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}