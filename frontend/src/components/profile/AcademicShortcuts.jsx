import { Link } from "react-router-dom";
import { Calendar, ShieldCheck, FileText, Sparkles, Bell, ArrowRight } from "lucide-react";

const SHORTCUTS = [
  {
    title: "Timetable & Tasks",
    description: "Daily routine, classes & goal planner",
    path: "/timetable",
    icon: Calendar,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80",
  },
  {
    title: "Attendance Tracker",
    description: "Subject-wise percentage & status",
    path: "/attendance",
    icon: ShieldCheck,
    color: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/80",
  },
  {
    title: "Assignments & Exams",
    description: "Submissions, phase tests & schedules",
    path: "/assignments",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80",
  },
  {
    title: "AI Study Tutor",
    description: "Socratic Q&A and learning roadmaps",
    path: "/study",
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80",
  },
];

export default function AcademicShortcuts() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-primary-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Academic Quick Hub
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Fast Navigation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SHORTCUTS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-primary-200/80 bg-slate-50/50 hover:bg-white dark:border-slate-800/60 dark:bg-slate-950/40 dark:hover:bg-slate-800/60 transition-all duration-200 shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {item.description}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={14}
                className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
