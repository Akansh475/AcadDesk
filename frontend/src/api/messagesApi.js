import apiClient from "../utils/apiClient";

/**
 * Send an official message from Admin to a specific student
 * @param {string} studentId
 * @param {{ subject: string, message: string, category?: string, priority?: string }} payload
 */
export async function sendMessageToStudent(studentId, payload) {
  const { data } = await apiClient.post(`/api/messages/student/${studentId}`, payload);
  return data;
}

/**
 * Fetch all admin messages received by a specific student
 * @param {string} studentId
 */
export async function fetchStudentMessages(studentId) {
  const { data } = await apiClient.get(`/api/messages/student/${studentId}`);
  return data;
}

/**
 * Mark a message as read
 * @param {string} messageId
 */
export async function markMessageAsRead(messageId) {
  const { data } = await apiClient.patch(`/api/messages/${messageId}/read`);
  return data;
}

/**
 * Delete a message
 * @param {string} messageId
 */
export async function deleteStudentMessage(messageId) {
  const { data } = await apiClient.delete(`/api/messages/${messageId}`);
  return data;
}
