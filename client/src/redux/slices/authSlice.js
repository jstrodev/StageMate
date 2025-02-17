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
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
