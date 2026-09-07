import { useRef, useState } from "react";
import { Camera, Trash2, Check, Copy, ShieldCheck } from "lucide-react";

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

export default function ProfileAvatar({ user, onPhotoChange, onPhotoRemove, isSaving }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const err = await onPhotoChange(file);
    if (err) setError(err);
    e.target.value = "";
  };

  const handleRemovePhoto = async (e) => {
    e.stopPropagation();
    if (!onPhotoRemove) return;
    setError("");
    const err = await onPhotoRemove();
    if (err) setError(err);
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
        {/* Avatar Container */}
        <div
          className="relative group shrink-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30 dark:ring-white/15 bg-gradient-to-br from-primary-400 to-primary-700 transition-all duration-300 group-hover:ring-primary-200">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user?.name || "Student"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold tracking-tight text-white select-none">
                {getInitials(user?.name)}
              </div>
            )}

            {/* Hover overlay for changing photo */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isSaving}
              aria-label="Upload new profile photo"
              className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 backdrop-blur-xs text-white transition-opacity duration-200 cursor-pointer ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Camera size={20} className="animate-pulse text-white" />
              <span className="text-[11px] font-semibold tracking-wide text-white/90">
                {isSaving ? "Updating..." : "Change"}
              </span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Action pill: Remove photo button (if custom photo is active) */}
          {user?.profile_photo && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isSaving}
              title="Remove profile photo"
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow-md border border-white/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          )}

          {/* Quick upload camera icon button for touch / mobile */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="md:hidden absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-800 shadow-md border border-white/40 cursor-pointer"
            aria-label="Change photo"
          >
            <Camera size={14} />
          </button>
        </div>

        {/* Identity & Metadata Details */}
        <div className="flex-1 text-center md:text-left text-white">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-medium text-primary-50 mb-2 border border-white/15">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>Active Student · Session 2025–26</span>
          </div>

          {/* Name & verification */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-xs">
              {user?.name || "Student"}
            </h1>
            <span
              title="Verified Institutional Student Record"
              className="inline-flex items-center text-primary-200"
            >
              <ShieldCheck size={22} className="text-emerald-300" />
            </span>
          </div>

          {/* Course & Branch */}
          <p className="mt-1 text-sm sm:text-base font-medium text-primary-100/90">
            {user?.course || "Undergraduate"} {user?.branch ? `— ${user.branch}` : ""}
          </p>

          {/* Clickable Quick-Copy Pills */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center md:justify-start gap-2">
            {/* University Roll Number */}
            {user?.university_roll_no && (
              <button
                type="button"
                onClick={() => copyToClipboard(user.university_roll_no, "roll")}
                title="Click to copy University Roll Number"
                className="group flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-medium text-white transition-colors border border-white/15 cursor-pointer"
              >
                <span className="text-primary-200">Roll:</span>
                <span className="font-mono">{user.university_roll_no}</span>
                {copiedKey === "roll" ? (
                  <Check size={12} className="text-emerald-300" />
                ) : (
                  <Copy size={11} className="text-white/60 group-hover:text-white" />
                )}
              </button>
            )}

            {/* Student ID */}
            {user?.student_id && (
              <button
                type="button"
                onClick={() => copyToClipboard(user.student_id, "id")}
                title="Click to copy Student ID"
                className="group flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-medium text-white transition-colors border border-white/15 cursor-pointer"
              >
                <span className="text-primary-200">ID:</span>
                <span className="font-mono">{user.student_id}</span>
                {copiedKey === "id" ? (
                  <Check size={12} className="text-emerald-300" />
                ) : (
                  <Copy size={11} className="text-white/60 group-hover:text-white" />
                )}
              </button>
            )}

            {/* Year & Section Badges */}
            {user?.year && (
              <span className="rounded-lg bg-black/20 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-white/90 border border-white/10">
                {user.year}
              </span>
            )}
            {user?.section && (
              <span className="rounded-lg bg-black/20 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-white/90 border border-white/10">
                Sec {user.section}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-xl bg-red-500/20 border border-red-400/30 px-3.5 py-2 text-xs font-medium text-red-100 flex items-center gap-2">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
}