import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Calendar,
  FileText,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";
import AdminSidebar, { ADMIN_TABS } from "../components/admin/AdminSidebar";
import AdminStudentsTab from "../components/admin/AdminStudentsTab";
import AdminCoursesTab from "../components/admin/AdminCoursesTab";
import AdminCalendarTab from "../components/admin/AdminCalendarTab";
import AdminAssignmentsTab from "../components/admin/AdminAssignmentsTab";
import AdminAttendanceTab from "../components/admin/AdminAttendanceTab";
import AdminNotificationsTab from "../components/admin/AdminNotificationsTab";

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "students";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ADMIN_TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "students":
        return <AdminStudentsTab />;
      case "courses":
        return <AdminCoursesTab />;
      case "calendar":
        return <AdminCalendarTab />;
      case "assignments":
        return <AdminAssignmentsTab />;
      case "attendance":
        return <AdminAttendanceTab />;
      case "notifications":
        return <AdminNotificationsTab />;
      default:
        return <AdminStudentsTab />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Top Banner Notice */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-xs">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                AcadDesk Admin Console
              </h1>
              <span className="rounded-md bg-primary-50 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider text-primary-700 dark:bg-primary-950/60 dark:text-primary-400">
                Single Staff Role
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Centralized back-office management for students, curriculum, academic schedules, coursework, and broadcasts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Admin Grid: Left Sidebar + Right Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Fixed Module Navigation (3 cols) */}
        <div className="lg:col-span-3">
          <div className="sticky top-6 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
            />
          </div>
        </div>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 min-w-0">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
