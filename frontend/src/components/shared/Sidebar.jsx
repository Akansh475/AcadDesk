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
} from "lucide-react";

import { useTheme } from "../../hooks/useTheme";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/timetable", label: "Timetable & Goals", icon: CalendarClock },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/assignments", label: "Assignments & Exams", icon: BookOpenCheck },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin Panel", icon: ShieldCheck },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6 flex items-center gap-2.5 px-2">
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
    <GraduationCap size={16} className="text-white" />
  </div>
  <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
    AcadDesk
  </span>
</div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </aside>
  );
}