import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBotData = createAsyncThunk(
    'data/fetchDataList', 
    async (paramData, { rejectWithValue }) => {
      try {
        console.log(paramData)
        const response = await axios.post('http://localhost:50129/api/GetBotData', paramData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'Server Error');
      }
    }
  );


const botDataSlice = createSlice({
    name: 'botDataRes',
    initialState: { data: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBotData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBotData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchBotData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default botDataSlice.reducer;
