import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import musicianReducer from "./slices/musicianSlice";
import prospectReducer from "./slices/prospectSlice";
import eventReducer from "./slices/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    musicians: musicianReducer,
    prospects: prospectReducer,
    events: eventReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Add this to debug initial state
console.log("Initial Redux State:", store.getState());
