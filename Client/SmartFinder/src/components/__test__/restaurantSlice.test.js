import { describe, it, expect } from 'vitest';
import reducer from '../../features/restaurantSlice';

const test_state = {
  restaurants: [],
  filteredRestaurants: [],
  selectedRestaurant: null,
  searchTerm: "",
  filters: {
    foodType: "All Types",
    services: [],
    rating: 0,
    location: "All Locations",
    status: "All",
  },
  favorites: [],
  loading: false,
  error: null,
};

describe('restaurantSlice', () => {
  it('testing initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(test_state);
  });
});
