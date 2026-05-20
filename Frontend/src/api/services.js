import apiClient from "./client";

// Authentication Endpoints
export const authService = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
};

// Students Endpoints
export const studentService = {
  getAll: () => apiClient.get("/students"),
  create: (data) => apiClient.post("/students", data),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`),
};

// Department Endpoints
export const deptService = {
  getAll: () => apiClient.get("/departments"),
};