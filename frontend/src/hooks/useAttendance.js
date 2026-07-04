import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAttendance, fetchSubjectBreakdown } from "../api/attendanceApi";

const USER_ID = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
  } catch {
    return "u1";
  }
})();

export function useAttendance() {
  const attendanceQuery = useQuery({
    queryKey: ["attendance", USER_ID],
    queryFn: () => fetchAttendance(USER_ID),
  });

  const [activeSubject, setActiveSubject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const breakdownQuery = useQuery({
    queryKey: ["attendance-breakdown", USER_ID, activeSubject?.subject_id],
    queryFn: () => fetchSubjectBreakdown(USER_ID, activeSubject.subject_id),
    enabled: Boolean(activeSubject),
  });

  const openDrawer = (subject) => {
    setActiveSubject(subject);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setActiveSubject(null), 300); // wait for close animation
  };

  const summary = attendanceQuery.data?.summary ?? null;
  const subjects = attendanceQuery.data?.subjects ?? [];
  const allSafe = subjects.length > 0 && subjects.every((s) => s.percentage >= 70);

  return {
    summary,
    subjects,
    allSafe,
    isLoading: attendanceQuery.isLoading,
    isError: attendanceQuery.isError,

    drawerOpen,
    activeSubject,
    breakdown: breakdownQuery.data ?? null,
    breakdownLoading: breakdownQuery.isLoading,
    breakdownError: breakdownQuery.isError,
    refetchBreakdown: breakdownQuery.refetch,

    openDrawer,
    closeDrawer,
  };
}