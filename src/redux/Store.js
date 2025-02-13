import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authApi } from "./slices/authSlice";
import { musicianApi } from "./slices/musicianSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [musicianApi.reducerPath]: musicianApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, musicianApi.middleware),
});

export default store;
