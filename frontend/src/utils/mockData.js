import dayjs from "dayjs";

const today = dayjs();

export const mockTasks = [
  {
    id: "t1",
    user_id: "u1",
    title: "Submit DBMS assignment",
    description: "Normalization + ER diagram for unit 3",
    due_date: today.add(2, "day").format("YYYY-MM-DD"),
    priority: "High",
    status: "Pending",
    created_at: today.subtract(3, "day").toISOString(),
  },
  {
    id: "t2",
    user_id: "u1",
    title: "Revise OS scheduling algorithms",
    description: "",
    due_date: today.format("YYYY-MM-DD"),
    priority: "Medium",
    status: "Pending",
    created_at: today.subtract(1, "day").toISOString(),
  },
  {
    id: "t3",
    user_id: "u1",
    title: "Apply to summer internships",
    description: "Shortlist 10 product companies",
    due_date: today.subtract(1, "day").format("YYYY-MM-DD"),
    priority: "High",
    status: "Pending",
    created_at: today.subtract(5, "day").toISOString(),
  },
  {
    id: "t4",
    user_id: "u1",
    title: "Finish System Design notes",
    description: "Consistent hashing + Kafka consumer groups",
    due_date: today.add(7, "day").format("YYYY-MM-DD"),
    priority: "Low",
    status: "Completed",
    created_at: today.subtract(10, "day").toISOString(),
  },
];

export const mockCalendarEvents = [
  {
    id: "e1",
    college_id: "c1",
    title: "Mid Term Theory",
    type: "exam",
    date: today.add(5, "day").format("YYYY-MM-DD"),
    course_id: null,
  },
  {
    id: "e2",
    college_id: "c1",
    title: "DBMS Practical",
    type: "practical",
    date: today.add(8, "day").format("YYYY-MM-DD"),
    course_id: "dbms",
  },
  {
    id: "e3",
    college_id: "c1",
    title: "PBL Submission",
    type: "pbl",
    date: today.add(12, "day").format("YYYY-MM-DD"),
    course_id: null,
  },
  {
    id: "e4",
    college_id: "c1",
    title: "Founder's Day",
    type: "holiday",
    date: today.add(20, "day").format("YYYY-MM-DD"),
    course_id: null,
  },
  {
    id: "e5",
    college_id: "c1",
    title: "End Term Practical",
    type: "practical",
    date: today.add(35, "day").format("YYYY-MM-DD"),
    course_id: null,
  },
  {
    id: "e6",
    college_id: "c1",
    title: "End Term Theory",
    type: "exam",
    date: today.add(40, "day").format("YYYY-MM-DD"),
    course_id: null,
  },
];