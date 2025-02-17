import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import musicianReducer from "./slices/musicianSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    musicians: musicianReducer,
  },
});
