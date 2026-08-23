import apiClient from "../utils/apiClient";

export async function extractFileText(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/api/questions/extract-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function generateExamQuestions(payload) {
  const { data } = await apiClient.post("/api/questions/generate", payload);
  return data;
}

export async function fetchQuestionHistory(userId) {
  const { data } = await apiClient.get(`/api/questions/history/${userId}`);
  return data;
}

export async function saveQuestionSet(payload) {
  const { data } = await apiClient.post("/api/questions/save", payload);
  return data;
}

export async function deleteQuestionSet(id, userId) {
  const { data } = await apiClient.delete(`/api/questions/${id}`, {
    params: { userId },
  });
  return data;
}
