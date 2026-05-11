import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import restaurantReducer from "./features/restaurantSlice";
import userReducer from "./features/userSlice";

// Create the Redux store with all slices
const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    user: userReducer,
  },
});

export default store;
