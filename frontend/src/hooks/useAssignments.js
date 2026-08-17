import { useQuery } from "@tanstack/react-query";
import { fetchAssignments } from "../api/assignmentsApi";
import { groupAssignmentsBySubject } from "../utils/assignmentHelpers";

export function useAssignments() {
  const USER_ID = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
    } catch {
      return "u1";
    }
  })();

  const query = useQuery({
    queryKey: ["assignments", USER_ID],
    queryFn: () => fetchAssignments(USER_ID),
  });

  const assignments = query.data ?? [];
  const grouped = groupAssignmentsBySubject(assignments);
  const hasAssignments = assignments.length > 0;

  return {
    grouped,
    hasAssignments,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}