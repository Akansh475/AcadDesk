import apiClient from "../utils/apiClient";
import { mockTasks } from "../utils/mockData";

// Mock store lives in module scope so it persists across calls during
// this session. Swap each function body for the commented apiClient
// call once the backend is live — the hook layer won't need to change.
let tasks = [...mockTasks];
const MOCK_DELAY_MS = 300;

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));

export async function fetchTasks(userId) {
  // const { data } = await apiClient.get(`/api/tasks/${userId}`);
  // return data;
  return delay(tasks.filter((t) => t.user_id === userId));
}

export async function createTask(payload) {
  // const { data } = await apiClient.post("/api/tasks", payload);
  // return data;
  const newTask = {
    id: `t${Date.now()}`,
    status: "Pending",
    created_at: new Date().toISOString(),
    ...payload,
  };
  tasks = [...tasks, newTask];
  return delay(newTask);
}

export async function updateTask(id, payload) {
  // const { data } = await apiClient.patch(`/api/tasks/${id}`, payload);
  // return data;
  let updated = null;
  tasks = tasks.map((t) => {
    if (t.id === id) {
      updated = { ...t, ...payload };
      return updated;
    }
    return t;
  });
  if (!updated) throw new Error("Task not found");
  return delay(updated);
}

export async function deleteTask(id) {
  // const { data } = await apiClient.delete(`/api/tasks/${id}`);
  // return data;
  tasks = tasks.filter((t) => t.id !== id);
  return delay({ success: true });
}