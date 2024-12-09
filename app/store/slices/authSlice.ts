import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Create slice
const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setData, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
