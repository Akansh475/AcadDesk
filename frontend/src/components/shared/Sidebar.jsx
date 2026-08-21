import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  CalendarClock,
  ClipboardCheck,
  BookOpenCheck,
  Bell,
  ShieldCheck,
  Sun,
  Moon,
  GraduationCap,
  Sparkles,
  PanelLeftClose,
} from "lucide-react";

import { useTheme } from "../../hooks/useTheme";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/timetable", label: "Timetable & Tasks", icon: CalendarClock },
  { to: "/study", label: "Study Session", icon: Sparkles },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/assignments", label: "Assignments & Exams", icon: BookOpenCheck },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin Panel", icon: ShieldCheck },
];

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`relative flex h-screen flex-col border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 ${
        isCollapsed
          ? "w-0 -translate-x-full border-r-0 p-0 overflow-hidden opacity-0 pointer-events-none"
          : "w-60 shrink-0 border-r px-3 py-5 opacity-100"
      }`}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 shrink-0">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
            AcadDesk
          </span>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Close sidebar (Ctrl+B)"
          aria-label="Close sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <Icon size={16} strokeWidth={2} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
      >
        {theme === "dark" ? <Sun size={16} className="shrink-0" /> : <Moon size={16} className="shrink-0" />}
        <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </button>
    </aside>
  );
}