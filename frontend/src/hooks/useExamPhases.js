import { useQuery } from "@tanstack/react-query";
import { fetchExamPhases } from "../api/assignmentsApi";
import { getDaysUntilExam } from "../utils/assignmentHelpers";

const COLLEGE_ID = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.college_id ?? "c1";
  } catch {
    return "c1";
  }
})();

export function useExamPhases() {
  const query = useQuery({
    queryKey: ["exam-phases", COLLEGE_ID],
    queryFn: () => fetchExamPhases(COLLEGE_ID),
  });

  const allPhases = query.data ?? [];

  // Filter out phases that have already passed
  const upcomingPhases = allPhases
    .filter((p) => getDaysUntilExam(p.start_date) >= 0)
    .sort((a, b) => getDaysUntilExam(a.start_date) - getDaysUntilExam(b.start_date));

  return {
    upcomingPhases,
    hasPhases: upcomingPhases.length > 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}