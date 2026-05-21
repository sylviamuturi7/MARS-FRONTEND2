import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://mars-api-o24g.onrender.com",
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