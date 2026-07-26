import dayjs from "dayjs";
import { GraduationCap } from "lucide-react";

function getGreeting() {
  const hour = dayjs().hour();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function WelcomeBar({ user }) {
  const greeting = getGreeting();
  const today = dayjs().format("dddd, D MMMM YYYY");
  const firstName = user?.name?.split(" ")[0] ?? "Student";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-6 shadow-lg">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-6 right-24 h-28 w-28 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-primary-200">{today}</p>
          <h2 className="mt-1 text-xl font-bold text-white">
            {greeting}, {firstName} 👋
          </h2>
          <p className="mt-0.5 text-sm text-primary-100">
            {user?.course ?? "B.Tech"} · {user?.branch ?? ""} · {user?.year ?? ""}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white backdrop-blur-sm">
          {user?.profile_photo ? (
            <img
              src={user.profile_photo}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            getInitials(user?.name)
          )}
        </div>
      </div>

      {/* Quick info pills */}
      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {user?.student_id && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            ID: {user.student_id}
          </span>
        )}
        {user?.section && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            Section: {user.section}
          </span>
        )}
        {user?.university_roll_no && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            Roll: {user.university_roll_no}
          </span>
        )}
      </div>
    </div>
  );
}