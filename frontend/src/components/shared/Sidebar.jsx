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
  LogOut,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useUnreadCount } from "../../hooks/useNotifications";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/timetable", label: "Timetable & Tasks", icon: CalendarClock },
      { to: "/study", label: "Study Session", icon: Sparkles, badge: "AI" },
    ],
  },
  {
    title: "Academics",
    items: [
      { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
      { to: "/assignments", label: "Assignments & Exams", icon: BookOpenCheck },
    ],
  },
  {
    title: "Account & System",
    items: [
      { to: "/notifications", label: "Notifications", icon: Bell, isNotification: true },
      { to: "/profile", label: "Profile", icon: User },
      { to: "/admin", label: "Admin Panel", icon: ShieldCheck, badge: "Staff" },
    ],
  },
];

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { logout, getUser } = useAuth();
  const { count: unreadCount, isError } = useUnreadCount();

  const user = getUser();
  const hasNotifications = !isError && unreadCount > 0;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <aside
      className={`relative flex h-full max-h-screen flex-col border-r border-slate-200/80 bg-white shadow-xs dark:border-slate-800/80 dark:bg-slate-950 transition-all duration-300 ease-in-out select-none z-30 ${
        isCollapsed
          ? "w-0 -translate-x-full border-r-0 p-0 overflow-hidden opacity-0 pointer-events-none"
          : "w-64 shrink-0 opacity-100"
      }`}
    >
      {/* ── Brand Header ── */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-sm shadow-primary-500/25 ring-1 ring-primary-400/30 shrink-0">
            <GraduationCap size={18} className="text-white drop-shadow-xs" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              AcadDesk
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Academic Hub
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Close sidebar (Ctrl+B)"
          aria-label="Close sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* ── Scrollable Navigation ── */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-4.5 custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400/90 dark:text-slate-500/90">
              {group.title}
            </div>

            {group.items.map(({ to, label, icon: Icon, badge, isNotification }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary-50/90 text-primary-800 font-semibold border border-primary-200/70 shadow-xs dark:bg-primary-950/50 dark:text-primary-300 dark:border-primary-800/40"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        size={17}
                        strokeWidth={isActive ? 2.3 : 1.9}
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                        }`}
                      />
                      <span className="truncate">{label}</span>
                    </div>

                    {/* Right-side badges */}
                    {isNotification && hasNotifications && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-xs">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}

                    {badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          badge === "AI"
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer / User Profile & Actions ── */}
      <div className="shrink-0 border-t border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800/70 dark:bg-slate-900/40">
        {/* User Card */}
        <NavLink
          to="/profile"
          className="group flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-white hover:shadow-xs dark:hover:bg-slate-800/80"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary-600 to-primary-800 text-xs font-bold text-white shadow-xs">
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-slate-800 group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white">
                {user?.name || "Student User"}
              </span>
              <span className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                {user?.department || user?.email || "Student Portal"}
              </span>
            </div>
          </div>
        </NavLink>

        {/* Bottom Utility Row */}
        <div className="mt-2.5 flex items-center justify-between gap-1.5 px-1 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex flex-1 items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-xs dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all"
            title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
          >
            {theme === "dark" ? (
              <Sun size={15} className="shrink-0 text-amber-500" />
            ) : (
              <Moon size={15} className="shrink-0 text-slate-400" />
            )}
            <span className="truncate">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}