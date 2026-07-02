import apiClient from "../utils/apiClient";

export async function fetchUser(id) {
  const { data } = await apiClient.get(`/api/users/${id}`);
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await apiClient.patch(`/api/users/${id}`, payload);
  return data;
}