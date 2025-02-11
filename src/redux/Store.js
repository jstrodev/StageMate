import { configureStore } from "@reduxjs/toolkit";
import { bookApi } from "./slices/bookSlice";
import { authApi } from "./slices/authSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  preloadedState: {
    auth: {
      token: localStorage.getItem('token') || null,
      user: null,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(bookApi.middleware)
      .concat(authApi.middleware),
});