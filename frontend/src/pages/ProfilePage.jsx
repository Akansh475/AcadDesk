import { useProfile } from "../hooks/useProfile";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import Toast from "../components/shared/Toast";

export default function ProfilePage() {
  const { user, isLoading, isError, isSaving, toast, savePhone, savePhoto } =
    useProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-surface-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-600">Failed to load profile. Try again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

      {/* Hero card */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 shadow-lg">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/5" />

        <div className="relative z-10">
          <ProfileAvatar user={user} onPhotoChange={savePhoto} />
        </div>
      </div>

      {/* Info cards */}
      <ProfileInfoCard
        user={user}
        onSavePhone={savePhone}
        isSaving={isSaving}
      />

      <Toast message={toast?.message} type={toast?.type} />
    </div>
  );
}