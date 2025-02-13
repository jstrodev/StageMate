import { configureStore } from "@reduxjs/toolkit";
 main
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./slices/authSlice";
import { musicianApi } from "./slices/musicianSlice";
import authReducer from "./slices/authReducer";

import authReducer, { authApi } from "./slices/authSlice";
import { musicianApi } from "./slices/musicianSlice";
 main

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [musicianApi.reducerPath]: musicianApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, musicianApi.middleware),
});

 main
setupListeners(store.dispatch);


 main
export default store;
