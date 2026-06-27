import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 45000
});

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function startInterview(payload) {
  const { data } = await api.post("/interview/start", payload);
  return data;
}

export async function submitAnswer(sessionId, payload) {
  const { data } = await api.post(`/interview/${sessionId}/answer`, payload);
  return data;
}

export async function evaluateInterview(sessionId) {
  const { data } = await api.post(`/interview/${sessionId}/evaluate`);
  return data;
}

export function getApiError(error) {
  return error?.response?.data?.message || error?.message || "Something went wrong.";
}
