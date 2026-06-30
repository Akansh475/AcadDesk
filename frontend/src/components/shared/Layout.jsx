import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/timetable": "Timetable & Goals",
  "/attendance": "Attendance",
  "/assignments": "Assignments & Exams",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/admin": "Admin Panel",
};

export default function Layout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "AcadDesk";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}