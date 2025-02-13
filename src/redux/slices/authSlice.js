/**
 * authSlice.js
 *
 * Purpose:
 * Handles authentication state with JWT. Manages the user's login status and
 * token storage, and provides actions for login, logout, and user management.
 */

import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://your-api-url.com/api", // Update with actual API URL
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/users/register",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => ({
        user: response.user,
        token: response.token,
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/users/me",
      }),
      providesTags: ["User"],
    }),
    addMusician: builder.mutation({
      query: (musicianId) => ({
        url: `/musicians/${musicianId}/add`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    deleteMusician: builder.mutation({
      query: (musicianId) => ({
        url: `/musicians/${musicianId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state?.auth?.user ?? null;
export const selectCurrentToken = (state) => state?.auth?.token ?? null;

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useAddMusicianMutation,
  useDeleteMusicianMutation,
} = authApi;

export default authSlice.reducer;
