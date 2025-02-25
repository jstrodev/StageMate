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

const BASE_URL = "/api";

export const endpoints = {
  login: `${BASE_URL}/users/login`,
  register: `${BASE_URL}/users/register`,
  musicians: `${BASE_URL}/musicians/all`,
  prospects: `${BASE_URL}/prospects/add`,
  updateUser: `${BASE_URL}/users/update`,
};

export const updateUserApi = async (token, data) => {
  return axios.put(endpoints.updateUser, data, { // ✅ Use the defined endpoint
    headers: {
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json",
    },
  });
};
