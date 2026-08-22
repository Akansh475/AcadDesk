import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  ClipboardCheck,
  Megaphone,
  Sparkles,
} from "lucide-react";

export const ADMIN_TABS = [
  { id: "students", label: "Students", icon: Users, description: "Manage student profiles & enrollments" },
  { id: "courses", label: "Courses", icon: BookOpen, description: "Manage college curriculum & codes" },
  { id: "calendar", label: "Academic Calendar", icon: Calendar, description: "Exam dates, holidays & schedules" },
  { id: "assignments", label: "Assignments", icon: FileText, description: "Course tasks & deadlines" },
  { id: "attendance", label: "Bulk Attendance", icon: ClipboardCheck, description: "Mark course attendance by date" },
  { id: "notifications", label: "Notifications", icon: Megaphone, description: "Broadcast alerts to students" },
];

export default function AdminSidebar({ activeTab, onSelectTab, counts = {} }) {
  return (
    <nav className="flex flex-col gap-1 w-full" aria-label="Admin Navigation Tabs">
      <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Back Office Modules
      </div>
      {ADMIN_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = counts[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all text-left ${
              isActive
                ? "bg-primary-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                size={18}
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <div className="truncate">
                <div className="truncate font-medium">{tab.label}</div>
              </div>
            </div>

            {count !== undefined && (
              <span
                className={`ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                  isActive
                    ? "bg-primary-700/80 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {typeof count === "number" ? count.toLocaleString() : count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
