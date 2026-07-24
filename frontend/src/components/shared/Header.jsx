import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import BellIcon from "./BellIcon";



const PAGE_SUBTITLES = {
  "/dashboard": "Here's what's happening today",
  "/timetable": "Manage your goals and academic calendar",
  "/attendance": "Track your subject-wise attendance",
  "/assignments": "Your upcoming assignments and exams",
  "/notifications": "Your recent alerts and updates",
  "/profile": "Your academic identity",
  "/admin": "Manage students, courses and notifications",
};

export default function Header({ title }) {
  const location = useLocation();
  const subtitle = PAGE_SUBTITLES[location.pathname];

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    
    <header className="relative flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      
      {/* Centered title block */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* Left spacer to balance right side */}
      <div className="w-24" />

      {/* Right side — bell + avatar */}
      <div className="flex items-center gap-3">
       <BellIcon />

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}