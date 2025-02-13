import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./slices/authSlice";
import { musicianApi } from "./slices/musicianSlice";
import authReducer from "./slices/authReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [musicianApi.reducerPath]: musicianApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, musicianApi.middleware),
});

setupListeners(store.dispatch);

export default store;
