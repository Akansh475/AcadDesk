import dayjs from "dayjs";

// TODO: replace this with real ERP API calls when available
// e.g. const response = await axios.get(`${ERP_BASE_URL}/calendar/${collegeId}`);

export async function getCalendarEvents(collegeId) {
  const today = dayjs();

  return [
    {
      id: "e1",
      college_id: collegeId,
      title: "Mid Term Theory",
      type: "EXAM",
      date: today.add(5, "day").toISOString(),
      course_id: null,
    },
    {
      id: "e2",
      college_id: collegeId,
      title: "DBMS Practical",
      type: "PRACTICAL",
      date: today.add(8, "day").toISOString(),
      course_id: "dbms",
    },
    {
      id: "e3",
      college_id: collegeId,
      title: "PBL Submission",
      type: "PBL",
      date: today.add(12, "day").toISOString(),
      course_id: null,
    },
    {
      id: "e4",
      college_id: collegeId,
      title: "Founder's Day",
      type: "HOLIDAY",
      date: today.add(20, "day").toISOString(),
      course_id: null,
    },
    {
      id: "e5",
      college_id: collegeId,
      title: "End Term Practical",
      type: "PRACTICAL",
      date: today.add(35, "day").toISOString(),
      course_id: null,
    },
    {
      id: "e6",
      college_id: collegeId,
      title: "End Term Theory",
      type: "EXAM",
      date: today.add(40, "day").toISOString(),
      course_id: null,
    },
  ];
}