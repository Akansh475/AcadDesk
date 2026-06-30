import { useQuery } from "@tanstack/react-query";
import { fetchAcademicCalendar } from "../api/calendarApi";
import { groupEventsByMonth } from "../utils/taskHelpers";

export function useAcademicCalendar(collegeId) {
  const query = useQuery({
    queryKey: ["academic-calendar", collegeId],
    queryFn: () => fetchAcademicCalendar(collegeId),
    enabled: Boolean(collegeId),
  });

  const events = query.data ?? [];

  return {
    groupedEvents: groupEventsByMonth(events),
    hasEvents: events.length > 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}