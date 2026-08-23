import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Check,
  Lightbulb,
  Clock,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";

export default function QuestionCard({
  question,
  index,
  viewMode = "interactive", // "interactive" | "exam_sheet"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyQuestion = (e) => {
    e.stopPropagation();
    const text = `Q${index + 1}. [${question.marks} Marks] ${question.question}\n(Topic: ${question.topic} | Bloom Level: ${question.bloom_level})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color mapping based on marks
  const getMarksBadgeColor = (marks) => {
    if (marks <= 3) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    }
    if (marks <= 6) {
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
    }
    return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20";
  };

  const getBloomBadgeColor = (level) => {
    const l = (level || "").toLowerCase();
    if (l.includes("evaluat") || l.includes("creat")) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    }
    if (l.includes("analy")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20";
    }
    if (l.includes("appl")) {
      return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20";
    }
    return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  // If in pure exam sheet mode (no answers expanded by default, formatted like an exam paper)
  if (viewMode === "exam_sheet") {
    return (
      <div className="rounded-xl border border-surface-200 bg-white p-4.5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
              Q{index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-surface-900 leading-relaxed dark:text-slate-100">
                {question.question}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-surface-400 dark:text-slate-500">
                <span className="font-medium text-surface-600 dark:text-slate-400">
                  Topic: {question.topic}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {question.estimated_time}
                </span>
                <span>•</span>
                <span>{question.bloom_level} Level</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${getMarksBadgeColor(
                question.marks
              )}`}
            >
              {question.marks} Marks
            </span>
            <button
              type="button"
              onClick={handleCopyQuestion}
              className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Copy Question"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:border-surface-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Question Header Card */}
      <div className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
              Q{index + 1}
            </span>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-surface-900 leading-relaxed dark:text-slate-100">
                {question.question}
              </h3>
              {/* Badges / Meta */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getMarksBadgeColor(
                    question.marks
                  )}`}
                >
                  <Award size={10} className="inline mr-1 -mt-0.5" />
                  {question.marks} Marks
                </span>

                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${getBloomBadgeColor(
                    question.bloom_level
                  )}`}
                >
                  <Layers size={10} className="inline mr-1 -mt-0.5" />
                  {question.bloom_level}
                </span>

                <span className="rounded-md border border-surface-200 bg-surface-50 px-2 py-0.5 text-[10px] font-medium text-surface-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {question.type}
                </span>

                <span className="flex items-center gap-1 rounded-md border border-surface-200 bg-surface-50 px-2 py-0.5 text-[10px] text-surface-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  <Clock size={10} />
                  {question.estimated_time}
                </span>

                <span className="text-[11px] font-medium text-primary-600 dark:text-primary-400 pl-1">
                  #{question.topic}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-start">
            <button
              type="button"
              onClick={handleCopyQuestion}
              className="flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs font-medium text-surface-600 hover:border-surface-300 hover:bg-surface-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Copy Question"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 transition-colors"
            >
              <span>{isOpen ? "Hide Model Answer" : "View Model Answer"}</span>
              {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Model Answer & Marking Scheme */}
      {isOpen && (
        <div className="border-t border-surface-100 bg-surface-50/60 p-5 space-y-4 dark:border-slate-800/80 dark:bg-slate-900/50">
          {/* Model Answer Body */}
          <div className="rounded-xl border border-surface-200 bg-white p-4.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-surface-800 uppercase tracking-wider dark:text-slate-200">
                <Sparkles size={13} className="text-primary-600 dark:text-primary-400" />
                Model Answer & Theoretical Key Points
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(question.model_answer);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[11px] text-primary-600 hover:underline flex items-center gap-1"
              >
                <Copy size={11} /> Copy Answer
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-xs text-surface-700 leading-relaxed dark:text-slate-300 whitespace-pre-line font-normal">
              {question.model_answer}
            </div>
          </div>

          {/* Marking Scheme Breakdown */}
          {question.marking_scheme && question.marking_scheme.length > 0 && (
            <div className="rounded-xl border border-surface-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="block text-xs font-bold text-surface-800 uppercase tracking-wider dark:text-slate-200 mb-2.5">
                Evaluation & Marking Scheme Breakdown ({question.marks} Marks)
              </span>
              <ul className="space-y-1.5">
                {question.marking_scheme.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-surface-600 dark:text-slate-400"
                  >
                    <CheckCircle2
                      size={13}
                      className="text-emerald-600 shrink-0 mt-0.5 dark:text-emerald-400"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exam Pro-Tip */}
          {question.exam_tip && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-3.5 dark:border-amber-500/20 dark:bg-amber-500/5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                <Lightbulb size={13} />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                  Exam Pro-Tip & Scoring Strategy:
                </p>
                <p className="mt-0.5 text-xs text-amber-800 leading-relaxed dark:text-amber-400/90">
                  {question.exam_tip}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
