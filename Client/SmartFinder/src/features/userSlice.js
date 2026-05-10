import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// Fetch user profile
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/users/profile");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// Update profile
export const updateProfileAsync = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/users/profile", profileData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

// Change password
export const changePasswordAsync = createAsyncThunk(
  "user/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/users/password", { currentPassword, newPassword });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to change password");
    }
  }
);

// Initial state for user profile
const initialState = {
  profile: null,
  loading: false,
  message: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Clear message
    clearMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update profile
    builder
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.message = "Profile updated successfully!";
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Change password
    builder
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = userSlice.actions;

export default userSlice.reducer;
