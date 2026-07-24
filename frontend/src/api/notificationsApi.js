import apiClient from "../utils/apiClient";
import dayjs from "dayjs";

const MOCK_DELAY = 300;

let mockNotifications = [
  {
    id: "n1",
    user_id: "u1",
    source: "erp",
    type: "exam",
    title: "Mid Term Exam scheduled - 12 July",
    message: "Mid term theory exams begin from 12th July. Check your timetable for subject-wise schedule.",
    created_at: dayjs().subtract(2, "hour").toISOString(),
    is_read: false,
  },
  {
    id: "n2",
    user_id: "u1",
    source: "system",
    type: "attendance",
    title: "Attendance dropped below 70% in Operating Systems",
    message: "Your attendance in Operating Systems is now 58%. Attend the next 10 classes to recover.",
    created_at: dayjs().subtract(5, "hour").toISOString(),
    is_read: false,
  },
  {
    id: "n3",
    user_id: "u1",
    source: "system",
    type: "attendance",
    title: "Attendance at risk in OS Lab",
    message: "Your OS Lab attendance is 50%. Immediate action required.",
    created_at: dayjs().subtract(1, "day").toISOString(),
    is_read: false,
  },
  {
    id: "n4",
    user_id: "u1",
    source: "erp",
    type: "holiday",
    title: "Republic Day Holiday - 26 January",
    message: "The college will remain closed on 26th January on account of Republic Day.",
    created_at: dayjs().subtract(2, "day").toISOString(),
    is_read: true,
  },
  {
    id: "n5",
    user_id: "u1",
    source: "erp",
    type: "event",
    title: "Hackathon registration open",
    message: "TechFest Hackathon registrations are open. Last date to register is 20th July.",
    created_at: dayjs().subtract(3, "day").toISOString(),
    is_read: true,
  },
  {
    id: "n6",
    user_id: "u1",
    source: "erp",
    type: "announcement",
    title: "PBL submission deadline extended",
    message: "The PBL submission deadline has been extended to 25th July due to popular demand.",
    created_at: dayjs().subtract(5, "day").toISOString(),
    is_read: true,
  },
];

export async function fetchNotifications(userId) {
  // const { data } = await apiClient.get(`/api/notifications/${userId}`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => {
      const sevenDaysAgo = dayjs().subtract(7, "day");
      const filtered = mockNotifications
        .filter((n) => dayjs(n.created_at).isAfter(sevenDaysAgo))
        .sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)));
      resolve([...filtered]);
    }, MOCK_DELAY)
  );
}

export async function markAsRead(notificationId) {
  // const { data } = await apiClient.patch(`/api/notifications/${notificationId}/read`);
  // return data;
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const index = mockNotifications.findIndex((n) => n.id === notificationId);
      if (index === -1) return reject(new Error("Not found"));
      mockNotifications[index] = { ...mockNotifications[index], is_read: true };
      resolve({ ...mockNotifications[index] });
    }, MOCK_DELAY)
  );
}

export async function fetchUnreadCount(userId) {
  // const { data } = await apiClient.get(`/api/notifications/${userId}/unread-count`);
  // return data;
  return new Promise((resolve) =>
    setTimeout(() => {
      const count = mockNotifications.filter((n) => !n.is_read).length;
      resolve({ count });
    }, MOCK_DELAY)
  );
}