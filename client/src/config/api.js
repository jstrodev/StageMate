// const BASE_URL = "/api";

// export const endpoints = {
//   login: `${BASE_URL}/users/login`,
//   register: `${BASE_URL}/users/register`,
//   musicians: `${BASE_URL}/musicians/all`,
//   prospects: `${BASE_URL}/prospects/add`,
//   updateUser: `${BASE_URL}/users/update`,
// };

// export const updateUserApi = async (token, data) => {
//   return axios.put("/api/users/update", data, {
//     headers: {
//       Authorization: `Bearer ${token}`, 
//       "Content-Type": "application/json",
//     },
//   });
// };
import axios from "axios"; // ✅ Ensure axios is imported

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://stagemate.onrender.com' 
  : 'http://localhost:3000';

export const endpoints = {
  login: `${baseURL}/api/users/login`,
  register: `${baseURL}/api/users/register`,
  musicians: `${baseURL}/api/musicians/all`,
  prospects: `${baseURL}/api/prospects/add`,
  updateUser: `${baseURL}/api/users/update`,
};

// Axios configuration for authenticated requests
export const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// API helper functions
export const updateUserApi = async (token, data) => {
  const response = await fetch(`${baseURL}/api/users/update`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  
  return response.json();
};

export const fetchMusicians = async () => {
  const response = await fetch(`${baseURL}/api/musicians/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch musicians');
  }
  return response.json();
};

export const addProspect = async (token, musicianId) => {
  const response = await fetch(`${baseURL}/api/prospects/add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ musicianId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add prospect');
  }
  
  return response.json();
};
