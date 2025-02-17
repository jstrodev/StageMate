export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const endpoints = {
  register: `${API_BASE_URL}/users/register`,
  login: `${API_BASE_URL}/users/login`,
  // Add other endpoints here
}; 