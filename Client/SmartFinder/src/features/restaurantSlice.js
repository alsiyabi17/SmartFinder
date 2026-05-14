import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// Fetch all restaurants from API
export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/restaurants");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch restaurants");
    }
  }
);

// Fetch single restaurant
export const fetchRestaurantById = createAsyncThunk(
  "restaurants/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/restaurants/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Restaurant not found");
    }
  }
);

// Create a restaurant
export const createRestaurant = createAsyncThunk(
  "restaurants/create",
  async (restaurantData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/restaurants", restaurantData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create restaurant");
    }
  }
);

// Delete a restaurant
export const removeRestaurant = createAsyncThunk(
  "restaurants/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/restaurants/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete restaurant");
    }
  }
);

// Update a restaurant
export const updateRestaurant = createAsyncThunk(
  "restaurants/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/restaurants/${id}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update restaurant");
    }
  }
);

// Add a meal to a restaurant
export const createMeal = createAsyncThunk(
  "restaurants/addMeal",
  async ({ restaurantId, meal }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/restaurants/${restaurantId}/meals`, meal);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add meal");
    }
  }
);

// Edit a meal
export const updateMeal = createAsyncThunk(
  "restaurants/editMeal",
  async ({ restaurantId, mealId, updatedMeal }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/restaurants/${restaurantId}/meals/${mealId}`,
        updatedMeal
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to edit meal");
    }
  }
);

// Delete a meal
export const removeMeal = createAsyncThunk(
  "restaurants/deleteMeal",
  async ({ restaurantId, mealId }, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(
        `/restaurants/${restaurantId}/meals/${mealId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete meal");
    }
  }
);

// Initial state for restaurants
const initialState = {
  restaurants: [],
  filteredRestaurants: [],
  selectedRestaurant: null,
  searchTerm: "",
  filters: {
    foodType: "All Types",
    services: [],
    rating: 0,
    location: "All Locations",
  },
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    // Set the search term
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },

    // Set filters
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Apply all filters + search together
    applyFilters(state) {
      let results = state.restaurants;

      // Filter by search term
      if (state.searchTerm.trim() !== "") {
        const term = state.searchTerm.toLowerCase();
        results = results.filter(
          (r) =>
            r.name.toLowerCase().includes(term) ||
            (r.description && r.description.toLowerCase().includes(term)) ||
            (r.category && r.category.toLowerCase().includes(term)) ||
            (r.meals && r.meals.some(
              (m) =>
                m.name.toLowerCase().includes(term) ||
                (m.category && m.category.toLowerCase().includes(term))
            ))
        );
      }

      // Filter by location
      if (state.filters.location !== "All Locations") {
        results = results.filter((r) => r.location === state.filters.location);
      }

      // Filter by food type
      if (state.filters.foodType !== "All Types") {
        results = results.filter((r) => r.category === state.filters.foodType);
      }

      // Filter by services
      if (state.filters.services.length > 0) {
        results = results.filter((r) =>
          state.filters.services.every((s) => r.services.includes(s))
        );
      }

      // Filter by minimum rating
      if (state.filters.rating > 0) {
        results = results.filter((r) => r.rating >= state.filters.rating);
      }

      state.filteredRestaurants = results;
    },

    // Clear all filters
    clearFilters(state) {
      state.filters = initialState.filters;
      state.searchTerm = "";
      state.filteredRestaurants = state.restaurants;
    },

    // Toggle favorite (persisted to localStorage)
    toggleFavorite(state, action) {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((fId) => fId !== id);
      } else {
        state.favorites.push(id);
      }
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
        state.filteredRestaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch by ID
    builder
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create restaurant
    builder.addCase(createRestaurant.fulfilled, (state, action) => {
      state.restaurants.push(action.payload);
      state.filteredRestaurants = state.restaurants;
    });

    // Delete restaurant
    builder.addCase(removeRestaurant.fulfilled, (state, action) => {
      state.restaurants = state.restaurants.filter(
        (r) => r._id !== action.payload
      );
      state.filteredRestaurants = state.restaurants;
      if (state.selectedRestaurant?._id === action.payload) {
        state.selectedRestaurant = null;
      }
    });

    // Update restaurant
    builder.addCase(updateRestaurant.fulfilled, (state, action) => {
      const idx = state.restaurants.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) {
        state.restaurants[idx] = action.payload;
        state.filteredRestaurants = state.restaurants;
      }
      if (state.selectedRestaurant?._id === action.payload._id) {
        state.selectedRestaurant = action.payload;
      }
    });

    // Add meal — returns updated restaurant
    builder.addCase(createMeal.fulfilled, (state, action) => {
      const idx = state.restaurants.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) state.restaurants[idx] = action.payload;
      if (state.selectedRestaurant?._id === action.payload._id) {
        state.selectedRestaurant = action.payload;
      }
    });

    // Edit meal
    builder.addCase(updateMeal.fulfilled, (state, action) => {
      const idx = state.restaurants.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) state.restaurants[idx] = action.payload;
      if (state.selectedRestaurant?._id === action.payload._id) {
        state.selectedRestaurant = action.payload;
      }
    });

    // Delete meal
    builder.addCase(removeMeal.fulfilled, (state, action) => {
      const idx = state.restaurants.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) state.restaurants[idx] = action.payload;
      if (state.selectedRestaurant?._id === action.payload._id) {
        state.selectedRestaurant = action.payload;
      }
    });
  },
});

export const {
  setSearchTerm,
  setFilters,
  applyFilters,
  clearFilters,
  toggleFavorite,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
