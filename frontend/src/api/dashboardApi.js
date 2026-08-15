import apiClient from "../utils/apiClient";

export async function fetchTodayTimetable(userId) {
  const { data } = await apiClient.get(`/api/timetable/${userId}/today`);
  return data;
};


export async function fetchAttendanceSummary(userId) {
  const { data } = await apiClient.get(`/api/attendance/${userId}`);
  return {
    ...data.summary,
    subjects: data.subjects,
  };
}

export async function fetchUpcomingAssignments(userId) {
  const { data } = await apiClient.get(`/api/assignments/${userId}/upcoming`);
  return data;
}

export async function fetchUpcomingExams(userId) {
  const { data } = await apiClient.get(`/api/exams/${userId}/upcoming`);
  return data;
}