import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch user list
export const fetchUserDetails = createAsyncThunk(
  "data/fetchUserDetails",
  async (paramData, { rejectWithValue }) => {
    try {
      console.log(paramData);
      const response = await axios.post(
        "http://localhost:50129/api/GetUserInfo",
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

// Fetch user details (new async thunk)
export const fetchUserList = createAsyncThunk(
  "data/fetchUserList",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:50129/api/GetUsers/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);

const userDataSlice = createSlice({
  name: "userData",
  initialState: { data: [], userDetails: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch user list
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Fetch user details
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userDataSlice.reducer;
