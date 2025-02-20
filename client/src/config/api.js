const BASE_URL = "http://localhost:3000/api";

export const endpoints = {
  login: `${BASE_URL}/users/login`,
  register: `${BASE_URL}/users/register`,
  musicians: `${BASE_URL}/musicians/all`,
  prospects: `${BASE_URL}/prospects/add`,
  // Add other endpoints here
};
