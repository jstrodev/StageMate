import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      const newEvent = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
      };
      state.events.push(newEvent);
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(
        (event) => event.prospectId !== action.payload
      );
    },
  },
});

export const { addEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer; 