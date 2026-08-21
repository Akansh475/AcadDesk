import { useLocation } from "react-router-dom";
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
      {/* Left side: Toggle button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors"
          title={isSidebarCollapsed ? "Open sidebar (Ctrl+B)" : "Close sidebar (Ctrl+B)"}
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeft size={18} />}
        </button>
      </div>

      {/* Centered title block */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

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