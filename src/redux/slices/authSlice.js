/**
 * authSlice.js
 *
 * Purpose:
 * Handles authentication state with JWT. Manages the user's login status and
 * token storage, and provides actions for login and logout.
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
    baseUrl: "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api",
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
      transformResponse: (response) => {
        return {
          user: response.user,
          token: response.token,
        };
      },
      invalidatesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/users/me",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["User"],
    }),
    returnBook: builder.mutation({
      query: (bookId) => ({
        url: `/reservations/${bookId}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["User", "Books"],
    }),
    checkoutBook: builder.mutation({
      query: (bookId) => ({
        url: `/books/${bookId}/checkout`,
        method: "POST",
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
  useReturnBookMutation,
  useCheckoutBookMutation,
} = authApi;

export default authSlice.reducer;