import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const importFile = createAsyncThunk(
  "file/importFile",
  async ({ formData, setProgress }, { rejectWithValue }) => {
    try {
      let fakeProgress = 10;
      setProgress(fakeProgress); // Start at 10%

      // Simulate gradual progress
      const interval = setInterval(() => {
        fakeProgress += 5;
        if (fakeProgress >= 95) {
          clearInterval(interval);
        } else {
          setProgress(fakeProgress);
        }
      }, 500);

      // Upload file
      const response = await axios.post("http://localhost:15505/api/Import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const calculatedProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (calculatedProgress > fakeProgress) {
            setProgress(calculatedProgress);
          }
        },
      });

      clearInterval(interval); // Stop fake progress updates
      setProgress(100); // Set progress to 100% on success

      return response.data;
    } catch (error) {
      setProgress(0); // Reset progress on failure
      return rejectWithValue(error.response?.data?.message || "File upload failed");
    }
  }
);

const importSlice = createSlice({
  name: "import",
  initialState: { file: null, status: "idle", error: null, progress: 0, message: null },
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importFile.pending, (state) => {
        state.status = "loading";
        state.progress = 10; // Start progress at 10%
        state.message = null;
        state.error = null;
      })
      .addCase(importFile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.file = action.payload;
        state.progress = 100; // Ensure progress reaches 100%
        state.message = action.payload.message || "File uploaded successfully!";
      })
      .addCase(importFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.progress = 0; // Reset progress on failure
      });
  },
});

export const { setProgress } = importSlice.actions;
export default importSlice.reducer;
