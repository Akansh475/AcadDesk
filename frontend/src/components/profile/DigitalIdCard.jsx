import { useState } from "react";
import { GraduationCap, Copy, Check, QrCode, ShieldCheck, Sparkles } from "lucide-react";

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD"
  );
}

export default function DigitalIdCard({ user }) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = [
      `AcadDesk Student ID Card`,
      `Name: ${user?.name || "Student"}`,
      `Roll No: ${user?.university_roll_no || "N/A"}`,
      `Student ID: ${user?.student_id || "N/A"}`,
      `Course: ${user?.course || "N/A"} (${user?.branch || ""})`,
      `Year/Section: ${user?.year || ""} - ${user?.section || ""}`,
      `Campus ID: ${user?.college_id || "N/A"}`,
    ].join("\n");

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Top Label & Action */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Digital Campus Pass
          </h3>
        </div>
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors shadow-2xs cursor-pointer"
          title="Copy ID card details"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy Card</span>
            </>
          )}
        </button>
      </div>

      {/* The Physical Card Replica */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 text-white shadow-xl">
        {/* Subtle holographic foil gradient ribbon */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/15 blur-2xl" />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-primary-300">
              <GraduationCap size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-300">
                AcadDesk University
              </p>
              <p className="text-[9px] text-slate-400">Smart Student Identification</p>
            </div>
          </div>
          <span className="rounded-md bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
            VALID 2025–26
          </span>
        </div>

        {/* Card Body: Photo & Essentials */}
        <div className="relative z-10 mt-4 flex items-center gap-4">
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 border-white/20 bg-slate-800 shadow-md">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user?.name || "Student"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-600 to-emerald-700 text-lg font-bold text-white">
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-base font-bold tracking-tight text-white">
              {user?.name || "Student"}
            </h4>
            <p className="truncate text-xs font-medium text-primary-200">
              {user?.course || "B.Tech"} · {user?.branch || "Engineering"}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-200">
                Roll: {user?.university_roll_no || "—"}
              </span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-200">
                ID: {user?.student_id || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Barcode simulation & Campus ID */}
        <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">
              Campus ID
            </span>
            <span className="text-xs font-mono font-semibold text-slate-200">
              {user?.college_id || "ACAD-01"}
            </span>
          </div>

          {/* Barcode Graphic */}
          <div className="flex items-center gap-0.5 opacity-70">
            <div className="h-6 w-0.5 bg-white" />
            <div className="h-6 w-1 bg-white" />
            <div className="h-6 w-0.5 bg-white" />
            <div className="h-6 w-1.5 bg-white" />
            <div className="h-6 w-0.5 bg-white" />
            <div className="h-6 w-1 bg-white" />
            <div className="h-6 w-2 bg-white" />
            <div className="h-6 w-0.5 bg-white" />
            <div className="h-6 w-1 bg-white" />
            <div className="h-6 w-0.5 bg-white" />
            <div className="h-6 w-1.5 bg-white" />
          </div>
        </div>

        {/* Bottom security watermark */}
        <div className="mt-2 text-center">
          <p className="text-[9px] text-slate-500 font-mono tracking-widest">
            AUTHENTICATED STUDENT PASS
          </p>
        </div>
      </div>
    </div>
  );
}
