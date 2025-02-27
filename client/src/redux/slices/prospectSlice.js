// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   prospects: [],
//   filters: {
//     status: "All",
//     decision: "All",
//   },
// };

// const prospectSlice = createSlice({
//   name: "prospects",
//   initialState,
//   reducers: {
//     addProspect: (state, action) => {
//       state.prospects.push({
//         ...action.payload,
//         status: "New",
//         decision: "None",
//       });
//     },
//     removeProspect: (state, action) => {
//       state.prospects = state.prospects.filter(
//         (prospect) => prospect.id !== action.payload
//       );
//     },
//     updateProspectStatus: (state, action) => {
//       const { id, status } = action.payload;
//       const prospect = state.prospects.find((p) => p.id === id);
//       if (prospect) {
//         prospect.status = status;
//       }
//     },
//     updateProspectDecision: (state, action) => {
//       const { id, decision } = action.payload;
//       const prospect = state.prospects.find((p) => p.id === id);
//       if (prospect) {
//         prospect.decision = decision;
//       }
//     },
//     setFilters: (state, action) => {
//       state.filters = action.payload;
//     },
//   },
// });

// export const {
//   addProspect,
//   removeProspect,
//   updateProspectStatus,
//   updateProspectDecision,
//   setFilters,
// } = prospectSlice.actions;

// export default prospectSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

// Load saved prospects
const loadProspects = () => {
  try {
    const storedProspects = localStorage.getItem("prospects");
    return storedProspects ? JSON.parse(storedProspects) : [];
  } catch (error) {
    console.error("Failed to load prospects from localStorage", error);
    return [];
  }
};

// Save prospects to localStorage
const saveProspects = (prospects) => {
  try {
    localStorage.setItem("prospects", JSON.stringify(prospects));
  } catch (error) {
    console.error("Failed to save prospects to localStorage", error);
  }
};

// Load saved calendar prospects
const loadCalendarProspects = () => {
  try {
    const storedData = localStorage.getItem("calendarProspects");
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Error loading calendar prospects:", error);
    return [];
  }
};

// Save calendar prospects to localStorage
const saveCalendarProspects = (calendarProspects) => {
  try {
    localStorage.setItem("calendarProspects", JSON.stringify(calendarProspects));
  } catch (error) {
    console.error("Error saving calendar prospects:", error);
  }
};

const prospectSlice = createSlice({
  name: "prospects",
  initialState: {
    prospects: loadProspects(),
    filters: {
      status: "All",
      decision: "All",
    },
    calendarProspects: loadCalendarProspects(), // ✅ Load stored calendarProspects
  },
  reducers: {
    addProspect: (state, action) => {
      state.prospects.push(action.payload);
      saveProspects(state.prospects);
    },
    removeProspect: (state, action) => {
      state.prospects = state.prospects.filter(prospect => prospect.id !== action.payload);
      saveProspects(state.prospects);
    },
    updateProspectStatus: (state, action) => {
      const { id, status } = action.payload;
      const prospect = state.prospects.find(p => p.id === id);
      if (prospect) {
        prospect.status = status;
        saveProspects(state.prospects);
      }
    },
    updateProspectDecision: (state, action) => {
      const { id, decision } = action.payload;
      const prospect = state.prospects.find(p => p.id === id);
      if (prospect) {
        prospect.decision = decision;
        saveProspects(state.prospects);
      }
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    addToCalendar: (state, action) => {
      const existingProspect = state.calendarProspects.find(p => p.prospectId === action.payload.prospectId);
      if (!existingProspect) {
        state.calendarProspects.push(action.payload);
        saveCalendarProspects(state.calendarProspects); // ✅ Save to localStorage
      }
    },
    updateCalendarDate: (state, action) => {
      const { prospectId, newDate } = action.payload;
      const event = state.calendarProspects.find(p => p.prospectId === prospectId);
      if (event) {
        event.date = newDate;
        saveCalendarProspects(state.calendarProspects);
      }
    },
    removeFromCalendar: (state, action) => {
      state.calendarProspects = state.calendarProspects.filter(prospect => prospect.prospectId !== action.payload);
      saveCalendarProspects(state.calendarProspects);
    },
  },
});

export const { 
  addProspect, 
  removeProspect, 
  updateProspectStatus, 
  updateProspectDecision, 
  setFilters,  
  addToCalendar, 
  updateCalendarDate, 
  removeFromCalendar 
} = prospectSlice.actions;

export default prospectSlice.reducer;
