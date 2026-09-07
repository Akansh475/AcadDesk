import { useProfile } from "../hooks/useProfile";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import ProfileStats from "../components/profile/AcademicStats";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import DigitalIdCard from "../components/profile/DigitalIdCard";
import AcademicShortcuts from "../components/profile/AcademicShortcuts";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import Toast from "../components/shared/Toast";
import { AlertTriangle, RefreshCw, HelpCircle, ShieldCheck, Mail } from "lucide-react";

export default function ProfilePage() {
  const {
    user,
    isLoading,
    isError,
    refetch,
    isSaving,
    toast,
    savePhone,
    savePhoto,
    removePhoto,
  } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/80 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm mb-4">
          <AlertTriangle size={26} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Failed to load profile
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          We encountered a connection issue while fetching your academic profile records.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-700 transition-all cursor-pointer"
        >
          <RefreshCw size={15} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
      {/* 1. Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-800 dark:from-primary-900 dark:via-slate-900 dark:to-emerald-950 p-6 sm:p-8 shadow-lg border border-primary-500/20">
        {/* Background decorative atmospheric effects */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-300/10 blur-2xl" />
        <div className="pointer-events-none absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        {/* Decorative Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10">
          <ProfileAvatar
            user={user}
            onPhotoChange={savePhoto}
            onPhotoRemove={removePhoto}
            isSaving={isSaving}
          />
        </div>
      </div>

      {/* 2. Key Academic Highlights / Metric Strip */}
      <ProfileStats user={user} />

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3 width on desktop): Primary Records & Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Academic Registry & Editable Phone */}
          <ProfileInfoCard
            user={user}
            onSavePhone={savePhone}
            isSaving={isSaving}
          />

          {/* Quick Hub Shortcuts */}
          <AcademicShortcuts />
        </div>

        {/* Right Column (1/3 width on desktop): Digital Pass & Institutional Support */}
        <div className="space-y-6">
          {/* Digital Campus Identity Pass */}
          <DigitalIdCard user={user} />

          {/* Registrar Help & Assistance Notice Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
                <HelpCircle size={15} />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Registrar Assistance
              </h4>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Need to correct your Roll Number, change section, or verify course credits? Academic registry modifications require in-person or official email authentication.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500">Registry Office</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Admin Block, Room 104</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500">Official Support</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">registrar@acaddesk.edu</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500">Office Hours</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Mon–Fri: 09:00 – 16:30</span>
              </div>
            </div>
          </div>

          {/* Verification & System Integrity Seal */}
          <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/60 to-primary-50/40 p-4 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-primary-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  FERPA & Institutional Privacy Protected
                </h5>
                <p className="mt-1 text-[11px] leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
                  Your academic records, attendance history, and grades are encrypted and strictly confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <Toast message={toast?.message} type={toast?.type} />
    </div>
  );
}