import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import musicianReducer from "./slices/musicianSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    musicians: musicianReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Add this to debug initial state
console.log("Initial Redux State:", store.getState());
