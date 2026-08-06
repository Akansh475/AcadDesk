import apiClient from "../utils/apiClient";

export async function fetchTodayTimetable(userId) {
  // Timetable comes from ERP — mock for now
  // const { data } = await apiClient.get(`/api/timetable/${userId}/today`);
  return new Promise((resolve) =>
    setTimeout(() => resolve([
      { id: "t1", subject: "Computer Networks", time: "9:00 AM", room: "Room 301", teacher: "Dr. Sharma" },
      { id: "t2", subject: "Operating Systems", time: "10:30 AM", room: "Room 204", teacher: "Prof. Gupta" },
      { id: "t3", subject: "DBMS", time: "12:00 PM", room: "Room 102", teacher: "Dr. Mehta" },
      { id: "t4", subject: "Computer Networks Lab", time: "2:00 PM", room: "Lab 3", teacher: "Dr. Sharma" },
    ]), 350)
  );
}

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