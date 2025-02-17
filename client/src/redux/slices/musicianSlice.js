import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching all musicians
export const fetchMusicians = createAsyncThunk(
  "musicians/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/api/musicians/all");
      if (!response.ok) throw new Error("Failed to fetch musicians");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  musicians: [],
  loading: false,
  error: null,
  filters: {
    genre: null,
    priceRange: null,
    location: null,
  },
};

const musicianSlice = createSlice({
  name: "musicians",
  initialState,
  reducers: {
    setGenreFilter: (state, action) => {
      state.filters.genre = action.payload;
    },
    setPriceFilter: (state, action) => {
      state.filters.priceRange = action.payload;
    },
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusicians.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMusicians.fulfilled, (state, action) => {
        state.loading = false;
        state.musicians = action.payload;
      })
      .addCase(fetchMusicians.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setGenreFilter,
  setPriceFilter,
  setLocationFilter,
  clearFilters,
} = musicianSlice.actions;

// Selectors
export const selectAllMusicians = (state) => state.musicians.musicians;
export const selectMusicianFilters = (state) => state.musicians.filters;
export const selectMusicianLoading = (state) => state.musicians.loading;
export const selectMusicianError = (state) => state.musicians.error;

// Export reducer
export default musicianSlice.reducer;