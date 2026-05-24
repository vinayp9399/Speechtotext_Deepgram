import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  timeout: 120_000, 
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";
    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  }
);


export const uploadAudio = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("audio", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

export const getTranscriptions = (params = {}) =>
  api.get("/transcriptions", { params });

export const getTranscription = (id) => api.get(`/transcriptions/${id}`);

export const deleteTranscription = (id) =>
  api.delete(`/transcriptions/${id}`);

export default api;
