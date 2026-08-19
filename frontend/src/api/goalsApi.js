import apiClient from "../utils/apiClient";

export async function fetchGoals(userId) {
  const { data } = await apiClient.get(`/api/goals/${userId}`);
  return data;
}

export async function createGoal(payload) {
  const { data } = await apiClient.post("/api/goals", payload);
  return data;
}

export async function deleteGoal(id) {
  const { data } = await apiClient.delete(`/api/goals/${id}`);
  return data;
}