/**
 * authSlice.js
 *
 * Purpose:
 * Handles authentication state with JWT. Manages the user's login status and
 * token storage, and provides actions for login and logout.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null, // Parse user from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log("Setting credentials:", action.payload);
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
