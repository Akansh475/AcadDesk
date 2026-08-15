import axios from "axios";

const MOCKAPI_BASE = "https://6a805223ec7a640e63abaf3e.mockapi.io";

export async function getCalendarEvents(collegeId) {
  // TODO: replace with real ERP API
  const { data } = await axios.get(`${MOCKAPI_BASE}/calendar`);
  return data.filter((e) => e.college_id === collegeId);
}

export async function getAttendanceData(collegeId) {
  const { data } = await axios.get(`${MOCKAPI_BASE}/attendance`);
  return data.filter((e) => e.college_id === collegeId);
}

export async function getTodayTimetable(collegeId) {
  const { data } = await axios.get(`${MOCKAPI_BASE}/timetable`);
  return data.filter((e) => e.college_id === collegeId);
}