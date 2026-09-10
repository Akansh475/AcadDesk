import apiClient from "../utils/apiClient";

export async function fetchTasks(userId) {
  const { data } = await apiClient.get(`/api/tasks/${userId}`);
  if (data && typeof data.points === "number") {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.points = data.points;
      localStorage.setItem("user", JSON.stringify(stored));
      window.dispatchEvent(new CustomEvent("userUpdated", { detail: { points: data.points } }));
    } catch {}
  }
  return data;
}

export async function createTask(payload) {
  const { data } = await apiClient.post("/api/tasks", payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await apiClient.patch(`/api/tasks/${id}`, payload);
  if (data && typeof data.userPoints === "number") {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.points = data.userPoints;
      localStorage.setItem("user", JSON.stringify(stored));
      window.dispatchEvent(
        new CustomEvent("userUpdated", {
          detail: { points: data.userPoints, delta: data.pointsDelta },
        })
      );
    } catch {}
  }
  return data;
}

export async function deleteTask(id) {
  const { data } = await apiClient.delete(`/api/tasks/${id}`);
  return data;
}