import { useState, useEffect } from "react";
import {
  Pencil,
  Check,
  X,
  Copy,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Building2,
  IdCard,
  Hash,
  ShieldCheck,
  Info,
  Clock,
  CheckCircle2,
} from "lucide-react";
import dayjs from "dayjs";

function AcademicField({ icon: Icon, label, value, copyable = false, onCopy, copiedKey, fieldKey }) {
  const isCopied = copiedKey === fieldKey;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-2xs border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            {value || "—"}
          </span>
          {copyable && value && (
            <button
              type="button"
              onClick={() => onCopy(value, fieldKey)}
              title={`Copy ${label}`}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <Check size={13} className="text-emerald-500" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfileInfoCard({ user, onSavePhone, isSaving }) {
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (!editingPhone) {
      setPhone(user?.phone ?? "");
      setPhoneError("");
    }
  }, [user?.phone, editingPhone]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStartEdit = () => {
    setPhone(user?.phone ?? "");
    setPhoneError("");
    setEditingPhone(true);
  };

  const handleCancelEdit = () => {
    setEditingPhone(false);
    setPhoneError("");
    setPhone(user?.phone ?? "");
  };

  const handleSavePhone = async (e) => {
    if (e) e.preventDefault();
    setPhoneError("");

    if (!phone.trim()) {
      setPhoneError("Phone number cannot be empty");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setPhoneError("Please enter a valid 10-digit number");
      return;
    }

    const err = await onSavePhone(phone.trim());
    if (err) {
      setPhoneError(err);
      return;
    }
    setEditingPhone(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSavePhone(e);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const memberSince = user?.created_at
    ? dayjs(user.created_at).format("MMMM YYYY")
    : "August 2024";

  return (
    <div className="space-y-6">
      {/* 1. Academic Identity Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/80 dark:text-primary-400">
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Academic Identity & Registry
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Official records managed by University Registrar
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={13} />
            Verified Records
          </span>
        </div>

        {/* Notice Info Box */}
        <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 p-3 text-xs text-primary-800 dark:text-primary-300 border border-primary-100 dark:border-primary-900/60">
          <Info size={16} className="shrink-0 mt-0.5 text-primary-600 dark:text-primary-400" />
          <p className="leading-relaxed">
            Institutional credentials (Roll No, Course, Year) are locked to maintain academic transcript integrity. For official revisions, contact the Academic Affairs cell.
          </p>
        </div>

        {/* Academic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <AcademicField
            icon={Hash}
            label="University Roll No"
            value={user?.university_roll_no}
            copyable
            onCopy={handleCopy}
            copiedKey={copiedKey}
            fieldKey="roll"
          />
          <AcademicField
            icon={IdCard}
            label="Student ID"
            value={user?.student_id}
            copyable
            onCopy={handleCopy}
            copiedKey={copiedKey}
            fieldKey="id"
          />
          <AcademicField
            icon={GraduationCap}
            label="Course / Degree"
            value={user?.course}
          />
          <AcademicField
            icon={BookOpen}
            label="Branch / Department"
            value={user?.branch}
          />
          <AcademicField
            icon={Calendar}
            label="Academic Year"
            value={user?.year}
          />
          <AcademicField
            icon={Layers}
            label="Class Section"
            value={user?.section ? `Section ${user.section}` : null}
          />
          <AcademicField
            icon={Building2}
            label="College / Campus Code"
            value={user?.college_id}
          />
          <AcademicField
            icon={CheckCircle2}
            label="Enrollment Status"
            value="Active Full-Time Student"
          />
        </div>
      </div>

      {/* 2. Contact Information Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Contact & Communication
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Your communication channels for alerts & reminders
              </p>
            </div>
          </div>

          {!editingPhone && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Pencil size={12} className="text-primary-600 dark:text-primary-400" />
              Edit Phone
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Address */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                University Email
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/70">
                <Check size={10} />
                Verified
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user?.email || "—"}
                </span>
              </div>
              {user?.email && (
                <button
                  type="button"
                  onClick={() => handleCopy(user.email, "email")}
                  title="Copy email"
                  className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {copiedKey === "email" ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              )}
            </div>
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              Primary recipient for academic notifications & alerts
            </p>
          </div>

          {/* Mobile Phone */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Mobile Phone
              </span>
              {editingPhone ? (
                <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400">
                  Editing mode
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  SMS & Urgent alerts
                </span>
              )}
            </div>

            {editingPhone ? (
              <div className="mt-2 space-y-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone size={14} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onKeyDown={handleKeyDown}
                    maxLength={10}
                    autoFocus
                    placeholder="Enter 10-digit number"
                    className="w-full rounded-xl border border-primary-300 dark:border-primary-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-14 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none ring-2 ring-primary-100 dark:ring-primary-950"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] font-mono text-slate-400">
                    {phone.length}/10
                  </span>
                </div>

                {phoneError && (
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span>⚠️ {phoneError}</span>
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={13} />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePhone}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-700 disabled:opacity-60 transition-all cursor-pointer"
                  >
                    <Check size={13} />
                    {isSaving ? "Saving..." : "Save Phone"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {user?.phone ? (
                      `+91 ${user.phone}`
                    ) : (
                      <span className="italic text-slate-400 font-normal">Not provided</span>
                    )}
                  </span>
                </div>
                {user?.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(user.phone, "phone")}
                    title="Copy phone"
                    className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedKey === "phone" ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            )}

            {!editingPhone && (
              <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                Click "Edit Phone" above to update your contact number
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Account & System Information Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Account Status & Security
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              System access level and enrollment history
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Account Role
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-950/80 dark:text-primary-300">
                {user?.role || "STUDENT"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Member Since
            </span>
            <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
              {memberSince}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Portal Access
            </span>
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active & Synced
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}