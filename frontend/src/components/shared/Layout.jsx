import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/timetable": "Timetable & Tasks",
  "/study": "Study Session",
  "/attendance": "Attendance",
  "/assignments": "Assignments & Exams",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/admin": "Admin Panel",
};

export default function Layout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "AcadDesk";

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("acaddesk_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("acaddesk_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar (like VS Code)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      {/* Sidebar navigation */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main content column with header and scrollable view */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden transition-all duration-300">
        <Header
          title={title}
          isSidebarCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}