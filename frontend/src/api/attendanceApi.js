import apiClient from "../utils/apiClient";

export async function fetchAttendance(userId) {
  const { data } = await apiClient.get(`/api/attendance/${userId}`);
  return data;
}

export async function fetchSubjectBreakdown(userId, subjectId) {
  const { data } = await apiClient.get(`/api/attendance/${userId}/${subjectId}`);
  return data;
}