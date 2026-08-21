import { useState } from "react";
import { BookOpen, AlertTriangle, Plus } from "lucide-react";

const DEFAULT_SUBJECTS = [
  "Computer Networks",
  "Operating Systems",
  "DBMS",
  "Computer Networks Lab",
  "OS Lab",
  "Data Structures",
  "Algorithms",
  "Software Engineering",
];

export default function SubjectSelector({ subjects, onStart, isStarting }) {
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  // Use attendance subjects if available, else defaults
  const subjectList = subjects?.length > 0
    ? subjects
    : DEFAULT_SUBJECTS.map((name) => ({ subject_name: name, percentage: null }));

  const handleStart = () => {
    const subjectName = showCustom ? custom.trim() : selected;
    if (!subjectName) return;

    const subjectData = subjectList.find((s) => s.subject_name === subjectName);
    onStart({
      subject_name: subjectName,
      attendance_percentage: subjectData?.percentage ?? 100,
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-500/20">
            <BookOpen size={22} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-base font-semibold text-surface-800 dark:text-slate-100">
            Start a Study Session
          </h2>
          <p className="text-xs text-surface-400">
            Pick a subject and your AI tutor will guide you through doubts using the Socratic method.
          </p>
        </div>

        <div className="space-y-3">
          {!showCustom && (
            <div className="grid grid-cols-1 gap-2">
              {subjectList.map((s) => {
                const name = s.subject_name ?? s;
                const pct = s.percentage ?? null;
                const isAtRisk = pct !== null && pct < 70;
                const isSelected = selected === name;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelected(name)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                      isSelected
                        ? "border-primary-400 bg-primary-50 dark:border-primary-500 dark:bg-primary-500/10"
                        : "border-surface-200 bg-white hover:border-primary-200 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <span className="text-sm font-medium text-surface-800 dark:text-slate-100">
                      {name}
                    </span>
                    {pct !== null && (
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        isAtRisk ? "text-red-600" : "text-primary-600"
                      }`}>
                        {isAtRisk && <AlertTriangle size={11} />}
                        {pct}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {showCustom && (
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. Discrete Mathematics"
              autoFocus
              className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          )}

          <button
            type="button"
            onClick={() => { setShowCustom((v) => !v); setSelected(""); setCustom(""); }}
            className="flex w-full items-center justify-center gap-1.5 text-xs text-primary-600 hover:underline"
          >
            <Plus size={12} />
            {showCustom ? "Pick from list instead" : "Enter a different subject"}
          </button>

          <button
            type="button"
            onClick={handleStart}
            disabled={isStarting || (!selected && !custom.trim())}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {isStarting ? "Starting..." : "Start Session"}
          </button>
        </div>
      </div>
    </div>
  );
}