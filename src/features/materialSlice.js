import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//All data
export const fetchDataList = createAsyncThunk(
  "data/fetchDataList",
  async (paramData, { rejectWithValue }) => {
    try {
      console.log(paramData);
      const response = await axios.post(
        "http://localhost:50129/api/GetDataList",
        paramData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);

const materialDataSlice = createSlice({
  name: "materialData",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {

    // Fetch material data
    builder
      .addCase(fetchDataList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDataList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  },
});

export default materialDataSlice.reducer;
