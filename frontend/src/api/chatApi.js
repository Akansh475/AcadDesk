import apiClient from "../utils/apiClient";

export async function createSession(payload) {
  const { data } = await apiClient.post("/api/chat/sessions", payload);
  return data;
}

export async function getSessions(userId) {
  const { data } = await apiClient.get(`/api/chat/sessions/${userId}`);
  return data;
}

export async function getSession(sessionId) {
  const { data } = await apiClient.get(`/api/chat/session/${sessionId}`);
  return data;
}

export async function sendMessage(sessionId, payload) {
  const { data } = await apiClient.post(`/api/chat/session/${sessionId}/message`, payload);
  return data;
}

export async function deleteSession(sessionId) {
  const { data } = await apiClient.delete(`/api/chat/session/${sessionId}`);
  return data;
}