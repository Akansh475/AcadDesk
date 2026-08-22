import apiClient from "../utils/apiClient";
import dayjs from "dayjs";

const MOCK_DELAY = 350;

const mockAssignments = [
  {
    id: "a1",
    subject_id: "s1",
    subject_name: "Computer Networks",
    title: "Dijkstra's Algorithm Implementation",
    due_date: dayjs().add(3, "day").toISOString(),
    erp_link: "https://erp.gehu.ac.in/assignments/a1",
    status: "Pending",
    marks: 20,
  },
  {
    id: "a2",
    subject_id: "s1",
    subject_name: "Computer Networks",
    title: "Subnetting Practice Sheet",
    due_date: dayjs().add(7, "day").toISOString(),
    erp_link: null,
    status: "Pending",
    marks: 10,
  },
  {
    id: "a3",
    subject_id: "s2",
    subject_name: "Operating Systems",
    title: "Process Scheduling Report",
    due_date: dayjs().subtract(2, "day").toISOString(),
    erp_link: "https://erp.gehu.ac.in/assignments/a3",
    status: "Overdue",
    marks: 15,
  },
  {
    id: "a4",
    subject_id: "s2",
    subject_name: "Operating Systems",
    title: "Deadlock Detection Algorithm",
    due_date: dayjs().add(5, "day").toISOString(),
    erp_link: "https://erp.gehu.ac.in/assignments/a4",
    status: "Submitted",
    marks: 20,
  },
  {
    id: "a5",
    subject_id: "s3",
    subject_name: "DBMS",
    title: "ER Diagram for Library System",
    due_date: dayjs().add(1, "day").toISOString(),
    erp_link: "https://erp.gehu.ac.in/assignments/a5",
    status: "Pending",
    marks: 15,
  },
  {
    id: "a6",
    subject_id: "s3",
    subject_name: "DBMS",
    title: "Normalization Assignment",
    due_date: dayjs().subtract(5, "day").toISOString(),
    erp_link: "https://erp.gehu.ac.in/assignments/a6",
    status: "Submitted",
    marks: 10,
  },
];

const mockExamPhases = [
  {
    id: "e1",
    type: "Mid Term Theory",
    start_date: dayjs().add(5, "day").toISOString(),
  },
  {
    id: "e2",
    type: "Mid Term Practical",
    start_date: dayjs().add(8, "day").toISOString(),
  },
  {
    id: "e3",
    type: "End Term Theory",
    start_date: dayjs().add(45, "day").toISOString(),
  },
  {
    id: "e4",
    type: "End Term Practical",
    start_date: dayjs().add(50, "day").toISOString(),
  },
];

export async function fetchAssignments(userId) {
  // const { data } = await apiClient.get(`/api/assignments/${userId}`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve([...mockAssignments]), MOCK_DELAY)
  );
}

export async function fetchExamPhases(collegeId) {
  // const { data } = await apiClient.get(`/api/exams/${collegeId}/phases`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve([...mockExamPhases]), MOCK_DELAY)
  );
}