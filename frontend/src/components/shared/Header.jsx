import { useLocation, useNavigate } from "react-router-dom";
import { PanelLeft, PanelLeftOpen } from "lucide-react";
import BellIcon from "./BellIcon";

const PAGE_SUBTITLES = {
  "/dashboard": "Here's what's happening today",
  "/timetable": "Manage your tasks and academic calendar",
  "/study": "AI Socratic tutor and personal study roadmaps",
  "/attendance": "Track your subject-wise attendance",
  "/assignments": "Your upcoming assignments and exams",
  "/notifications": "Your recent alerts and updates",
  "/profile": "Your academic identity",
  "/admin": "Manage students, courses and notifications",
};

export default function Header({ title, isSidebarCollapsed, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const subtitle = PAGE_SUBTITLES[location.pathname];

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  return (
    <header className="shrink-0 relative flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95 z-20">
      {/* Left side: Toggle button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-xs hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200 transition-all"
          title={isSidebarCollapsed ? "Open sidebar (Ctrl+B)" : "Close sidebar (Ctrl+B)"}
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeft size={17} />}
        </button>
      </div>

      {/* Centered title block */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none px-4 max-w-[60%] truncate">
        <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side — bell + avatar */}
      <div className="flex items-center gap-2.5">
        <BellIcon />

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="group relative flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-linear-to-br from-primary-600 to-primary-800 text-xs font-bold text-white shadow-xs ring-2 ring-primary-500/20 hover:ring-primary-500/40 transition-all"
          title="Go to profile"
          aria-label="User Profile"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}