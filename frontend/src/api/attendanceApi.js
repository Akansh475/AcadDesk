import apiClient from "../utils/apiClient";

const MOCK_DELAY = 350;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockAttendance = {
  summary: {
    total_classes_done: 156,
    total_classes_held: 200,
    overall_percentage: 78,
    classes_remaining: 60,
  },
  subjects: [
    { subject_id: "1", subject_name: "Computer Networks",
      classes_attended: 18, classes_held: 25, percentage: 72 },
    { subject_id: "2", subject_name: "Operating Systems",
      classes_attended: 14, classes_held: 24, percentage: 58 },
    { subject_id: "3", subject_name: "DBMS",
      classes_attended: 20, classes_held: 25, percentage: 80 },
    { subject_id: "4", subject_name: "Computer Networks Lab",
      classes_attended: 8, classes_held: 10, percentage: 80 },
    { subject_id: "5", subject_name: "OS Lab",
      classes_attended: 5, classes_held: 10, percentage: 50 },
  ],
};

const mockBreakdowns = {
  "2": {
    subject_id: "2",
    subject_name: "Operating Systems",
    overall: { attended: 14, held: 24, percentage: 58 },
    monthly_breakdown: [
      {
        month: "May",
        dates_held: ["2 May","5 May","9 May","12 May","16 May","19 May"],
        dates_attended: ["2 May","5 May","9 May","16 May"],
        dates_absent: ["12 May","19 May"],
      },
      {
        month: "June",
        dates_held: ["2 Jun","4 Jun","9 Jun","11 Jun","16 Jun",
                     "18 Jun","23 Jun","25 Jun","30 Jun"],
        dates_attended: ["2 Jun","9 Jun","16 Jun","23 Jun","30 Jun"],
        dates_absent: ["4 Jun","11 Jun","18 Jun","25 Jun"],
      },
      {
        month: "July",
        dates_held: ["2 Jul","4 Jul","7 Jul","9 Jul"],
        dates_attended: ["2 Jul","7 Jul"],
        dates_absent: ["4 Jul","9 Jul"],
      },
    ],
  },
};

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchAttendance(userId) {
  // const { data } = await apiClient.get(`/api/attendance/${userId}`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockAttendance), MOCK_DELAY)
  );
}

export async function fetchSubjectBreakdown(userId, subjectId) {
  // const { data } = await apiClient.get(`/api/attendance/${userId}/${subjectId}`);
  // return data;
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const data = mockBreakdowns[subjectId];
      if (data) {
        resolve(data);
      } else {
        // Default mock for subjects without specific breakdown data
        resolve({
          subject_id: subjectId,
          subject_name: "Subject",
          overall: { attended: 0, held: 0, percentage: 0 },
          monthly_breakdown: [],
        });
      }
    }, MOCK_DELAY)
  );
}