import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTodayTimetable,
  fetchAttendanceSummary,
  fetchUpcomingAssignments,
  fetchUpcomingExams,
} from "../api/dashboardApi";
import { useNotifications } from "./useNotifications";

const USER_ID = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
  } catch {
    return "u1";
  }
})();

export function useDashboard() {
  // ── Data queries ──
  const timetableQuery = useQuery({
    queryKey: ["timetable-today", USER_ID],
    queryFn: () => fetchTodayTimetable(USER_ID),
  });

  const attendanceQuery = useQuery({
    queryKey: ["attendance-summary", USER_ID],
    queryFn: () => fetchAttendanceSummary(USER_ID),
  });

  const assignmentsQuery = useQuery({
    queryKey: ["assignments-upcoming", USER_ID],
    queryFn: () => fetchUpcomingAssignments(USER_ID),
  });

  const examsQuery = useQuery({
    queryKey: ["exams-upcoming", USER_ID],
    queryFn: () => fetchUpcomingExams(USER_ID),
  });

  const { notifications, unreadCount } = useNotifications();

  // ── Drawer state ──
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null); // "attendance" | "assignment" | "exam" | "notification"
  const [drawerData, setDrawerData] = useState(null);

  const openDrawer = (type, data) => {
    setDrawerType(type);
    setDrawerData(data);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setDrawerType(null);
      setDrawerData(null);
    }, 300);
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  return {
    user,
    timetable: timetableQuery.data ?? [],
    timetableLoading: timetableQuery.isLoading,

    attendance: attendanceQuery.data ?? null,
    attendanceLoading: attendanceQuery.isLoading,

    assignments: assignmentsQuery.data ?? [],
    assignmentsLoading: assignmentsQuery.isLoading,

    exams: examsQuery.data ?? [],
    examsLoading: examsQuery.isLoading,

    notifications: notifications.filter((n) => !n.is_read).slice(0, 5),
    unreadCount,

    drawerOpen,
    drawerType,
    drawerData,
    openDrawer,
    closeDrawer,
  };
}