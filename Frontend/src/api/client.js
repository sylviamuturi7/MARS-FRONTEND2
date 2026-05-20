import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add an interceptor to automatically add tokens to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;