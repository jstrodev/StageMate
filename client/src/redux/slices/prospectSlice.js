import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prospects: [],
  filters: {
    status: "All",
    decision: "All",
  },
};

const prospectSlice = createSlice({
  name: "prospects",
  initialState,
  reducers: {
    addProspect: (state, action) => {
      state.prospects.push({
        ...action.payload,
        status: "New",
        decision: "None",
      });
    },
    removeProspect: (state, action) => {
      state.prospects = state.prospects.filter(
        (prospect) => prospect.id !== action.payload
      );
    },
    updateProspectStatus: (state, action) => {
      const { id, status } = action.payload;
      const prospect = state.prospects.find((p) => p.id === id);
      if (prospect) {
        prospect.status = status;
      }
    },
    updateProspectDecision: (state, action) => {
      const { id, decision } = action.payload;
      const prospect = state.prospects.find((p) => p.id === id);
      if (prospect) {
        prospect.decision = decision;
      }
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const {
  addProspect,
  removeProspect,
  updateProspectStatus,
  updateProspectDecision,
  setFilters,
} = prospectSlice.actions;

export default prospectSlice.reducer;
