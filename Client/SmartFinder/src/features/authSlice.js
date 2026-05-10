import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// Hardcoded admin credentials (frontend-only, no backend)
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Register user (still uses backend for normal users)
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login user via backend (for normal users)
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Get user from localStorage on startup
const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  isLoggedIn: !!userInfo,
  user: userInfo,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Frontend-only login (handles admin hardcoded check)
    loginLocal(state, action) {
      const { email, password } = action.payload;

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        state.isLoggedIn = true;
        state.user = { name: "Admin", email: ADMIN_EMAIL };
        state.error = null;
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ name: "Admin", email: ADMIN_EMAIL })
        );
      } else {
        state.error = "Invalid email or password.";
      }
    },

    // Called when user logs out
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem("userInfo");
    },

    // Clear error messages
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login (normal user via backend)
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions so components can dispatch them
export const { loginLocal, logout, clearError } = authSlice.actions;

// Export reducer so the store can use it
export default authSlice.reducer;
