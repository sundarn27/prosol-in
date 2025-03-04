import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLogin = createAsyncThunk(
  "auth/login",
  async (paramData, { rejectWithValue }) => {
    try {
      console.log("Login Request:", paramData); // Debugging

      const response = await axios.post(
        "http://localhost:50129/api/GetToken",
        paramData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data); // Debugging

      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error.message);
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
