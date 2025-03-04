import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunk to Fetch File List
export const fetchFileList = createAsyncThunk(
  "file/fetchFileList",
  async (paramData, { rejectWithValue }) => {
    try {
      console.log("Fetching File List with Params:", paramData); // Debug log
      const response = await axios.post(
        "http://localhost:15505/api/GetFileList", // ✅ Ensure API URL is correct
        paramData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response ? error.response.data : "Server Error");
    }
  }
);

// ✅ Redux Slice Definition
const fileSlice = createSlice({
  name: "file",
  initialState: { data: [], loading: false, error: null }, // ✅ Ensure initial state is an array
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileList.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error
      })
      .addCase(fetchFileList.fulfilled, (state, action) => {
        console.log("Updating Redux State with:", action.payload); // Debug log
        state.loading = false;
        state.data = action.payload; // ✅ Ensure correct state update
      })
      .addCase(fetchFileList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Fetch File List Failed:", action.payload); // Debug log
      });
  },
});

export default fileSlice.reducer;
