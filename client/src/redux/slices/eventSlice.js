// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   events: [],
// };

// const eventSlice = createSlice({
//   name: "events",
//   initialState,
//   reducers: {
//     addEvent: (state, action) => {
//       const newEvent = {
//         ...action.payload,
//         id: action.payload.id || Date.now().toString(),
//       };
//       state.events.push(newEvent);
//     },
//     removeEvent: (state, action) => {
//       state.events = state.events.filter(
//         (event) => event.prospectId !== action.payload
//       );
//     },
//   },
// });

// export const { addEvent, removeEvent } = eventSlice.actions;
// export default eventSlice.reducer; 
import { createSlice } from "@reduxjs/toolkit";

const loadEvents = () => {
  try {
    const storedEvents = localStorage.getItem("events");
    return storedEvents
      ? JSON.parse(storedEvents).map(event => ({
          ...event,
          date: new Date(event.date), // Convert back to Date object
        }))
      : [];
  } catch (error) {
    console.error("Failed to load events from localStorage", error);
    return [];
  }
};


const saveEvents = (events) => {
  try {
    localStorage.setItem("events", JSON.stringify(events));
  } catch (error) {
    console.error("Failed to save events to localStorage", error);
  }
};

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: loadEvents(), // Load events from localStorage when Redux initializes
    refreshTrigger: 0, // Used to force UI updates
  },
  reducers: {
    addEvent: (state, action) => {
      const isDuplicate = state.events.some(
        (event) => event.prospectId === action.payload.prospectId
      );
      if (!isDuplicate) {
        state.events.push(action.payload);
        saveEvents(state.events);
        state.refreshTrigger += 1; // Force Calendar UI refresh
      }
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(event => event.prospectId !== action.payload);
      saveEvents(state.events);
      state.refreshTrigger += 1; // Force Calendar UI refresh
    },
    updateEventDate: (state, action) => {  
      const { eventId, newDate } = action.payload;
      const event = state.events.find(event => event.prospectId === eventId);
      if (event) {
        event.date = newDate;
        saveEvents(state.events);
        state.refreshTrigger += 1; // Force Calendar UI refresh
      }
    },
  },
});

export const { addEvent, removeEvent, updateEventDate } = eventSlice.actions;
export default eventSlice.reducer;
