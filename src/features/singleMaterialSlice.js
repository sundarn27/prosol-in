import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { materialTransform } from "../utils/materialTranform";

//by id
export const fetchDataDetail = createAsyncThunk(
  'data/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:50129/api/GetDataDetail/${id.toString()}`);
      //const transformedData = materialTransform(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Server Error');
    }
  }
);

const singleMaterialSlice = createSlice({
  name: "singleData",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {

    // Fetch data by Itemcode
    builder
      .addCase(fetchDataDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDataDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default singleMaterialSlice.reducer;
