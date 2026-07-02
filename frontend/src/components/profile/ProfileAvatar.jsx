import { useRef, useState } from "react";
import { Camera } from "lucide-react";

function getInitials(name) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileAvatar({ user, onPhotoChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    const err = await onPhotoChange(file);
    if (err) setError(err);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl ring-4 ring-primary-100 transition-all hover:ring-primary-300"
          aria-label="Change profile photo"
        >
          {user?.profile_photo ? (
            <img
              src={user.profile_photo}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 to-primary-700 text-2xl font-bold text-white">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={18} className="text-white" />
            <span className="text-[10px] font-medium text-white">Change</span>
          </div>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="text-center">
  <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
  <p className="mt-0.5 text-sm text-primary-100">{user?.course} · {user?.branch}</p>
  <div className="mt-2 flex items-center justify-center gap-2">
    <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white">
      {user?.year}
    </span>
    <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium text-white/80">
      {user?.section}
    </span>
  </div>
</div>
    </div>
  );
}