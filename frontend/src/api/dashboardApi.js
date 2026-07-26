import dayjs from "dayjs";

const MOCK_DELAY = 350;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockTimetableToday = [
  { id: "t1", subject: "Computer Networks", time: "9:00 AM", room: "Room 301", teacher: "Dr. Sharma" },
  { id: "t2", subject: "Operating Systems", time: "10:30 AM", room: "Room 204", teacher: "Prof. Gupta" },
  { id: "t3", subject: "DBMS", time: "12:00 PM", room: "Room 102", teacher: "Dr. Mehta" },
  { id: "t4", subject: "Computer Networks Lab", time: "2:00 PM", room: "Lab 3", teacher: "Dr. Sharma" },
];

const mockAttendanceSummary = {
  overall_percentage: 69,
  total_classes_done: 65,
  total_classes_held: 94,
  subjects: [
    { subject_id: "1", subject_name: "Computer Networks", classes_attended: 18, classes_held: 25, percentage: 72 },
    { subject_id: "2", subject_name: "Operating Systems", classes_attended: 14, classes_held: 24, percentage: 58 },
    { subject_id: "3", subject_name: "DBMS", classes_attended: 20, classes_held: 25, percentage: 80 },
    { subject_id: "4", subject_name: "Computer Networks Lab", classes_attended: 8, classes_held: 10, percentage: 80 },
    { subject_id: "5", subject_name: "OS Lab", classes_attended: 5, classes_held: 10, percentage: 50 },
  ],
};

const mockAssignments = [
  {
    id: "a1",
    title: "ER Diagram for Library System",
    subject: "DBMS",
    due_date: dayjs().add(2, "day").toISOString(),
    status: "Pending",
    description: "Design a complete ER diagram for a library management system with all entities and relationships.",
  },
  {
    id: "a2",
    title: "Dijkstra's Algorithm Implementation",
    subject: "Computer Networks",
    due_date: dayjs().add(5, "day").toISOString(),
    status: "Pending",
    description: "Implement Dijkstra's shortest path algorithm in C++ and demonstrate with sample input/output.",
  },
  {
    id: "a3",
    title: "Process Scheduling Report",
    subject: "Operating Systems",
    due_date: dayjs().add(7, "day").toISOString(),
    status: "Pending",
    description: "Write a report comparing FCFS, SJF, and Round Robin scheduling algorithms with examples.",
  },
];

const mockExams = [
  {
    id: "e1",
    subject: "Computer Networks",
    date: dayjs().add(5, "day").toISOString(),
    time: "10:00 AM",
    room: "Hall A",
    syllabus: "Unit 1-3: OSI Model, TCP/IP, Routing Algorithms, Subnetting",
  },
  {
    id: "e2",
    subject: "Operating Systems",
    date: dayjs().add(7, "day").toISOString(),
    time: "2:00 PM",
    room: "Hall B",
    syllabus: "Unit 1-4: Process Management, Memory Management, Deadlocks, File Systems",
  },
  {
    id: "e3",
    subject: "DBMS",
    date: dayjs().add(10, "day").toISOString(),
    time: "10:00 AM",
    room: "Hall A",
    syllabus: "Unit 1-3: ER Model, Normalization, SQL, Transactions",
  },
];

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchTodayTimetable(userId) {
  // const { data } = await apiClient.get(`/api/timetable/${userId}/today`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve([...mockTimetableToday]), MOCK_DELAY)
  );
}

export async function fetchAttendanceSummary(userId) {
  // const { data } = await apiClient.get(`/api/attendance/${userId}/summary`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ...mockAttendanceSummary }), MOCK_DELAY)
  );
}

export async function fetchUpcomingAssignments(userId) {
  // const { data } = await apiClient.get(`/api/assignments/${userId}/upcoming`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve([...mockAssignments]), MOCK_DELAY)
  );
}

export async function fetchUpcomingExams(userId) {
  // const { data } = await apiClient.get(`/api/exams/${userId}/upcoming`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve([...mockExams]), MOCK_DELAY)
  );
}