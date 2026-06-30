import apiClient from "../utils/apiClient";
import { mockCalendarEvents } from "../utils/mockData";

const MOCK_DELAY_MS = 300;
const SIMULATE_ERROR = false; // flip true locally to test the error state

export async function fetchAcademicCalendar(collegeId) {
  // const { data } = await apiClient.get(`/api/calendar/${collegeId}`);
  // return data;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_ERROR) {
        reject(new Error("Could not load academic calendar."));
        return;
      }
      resolve(mockCalendarEvents.filter((e) => e.college_id === collegeId));
    }, MOCK_DELAY_MS);
  });
}