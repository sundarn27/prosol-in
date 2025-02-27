import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDictionaryList = createAsyncThunk(
  "data/fetchDictionaryList",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Thunk is being executed...");
      const response = await axios.get(
        "http://localhost:50129/api/getDictionary"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);

const dictionarySlice = createSlice({
  name: "dictionaryData",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDictionaryList.pending, (state) => {
        console.log("Fetching data...");
        state.loading = true;
      })
      .addCase(fetchDictionaryList.fulfilled, (state, action) => {
        console.log("Data fetched successfully:", action.payload);
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDictionaryList.rejected, (state, action) => {
        console.error("Error fetching data:", action.error);
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default dictionarySlice.reducer;