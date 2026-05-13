import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "reactstrap";
import { setFilters, applyFilters, clearFilters } from "../features/restaurantSlice";

function FilterSidebar() {
  const dispatch = useDispatch();
  const { filters, restaurants } = useSelector((state) => state.restaurants);

  // Build food types dynamically from database categories
  const foodTypes = ["All Types", ...new Set(restaurants.map((r) => r.category).filter(Boolean))];
  // Build locations dynamically from database
  const dbLocations = [...new Set(restaurants.map((r) => r.location).filter(Boolean))];

  // Local state for checkboxes
  const [delivery, setDelivery] = useState(filters.services.includes("delivery"));
  const [dineIn, setDineIn] = useState(filters.services.includes("dine-in"));
  const [selectedRating, setSelectedRating] = useState(filters.rating);
  const [selectedFoodType, setSelectedFoodType] = useState(filters.foodType);
  const [selectedLocation, setSelectedLocation] = useState(filters.location);

  const handleApply = () => {
    // Build services array from checkboxes
    const services = [];
    if (delivery) services.push("delivery");
    if (dineIn) services.push("dine-in");

    dispatch(
      setFilters({
        foodType: selectedFoodType,
        services: services,
        rating: selectedRating,
        location: selectedLocation,
      })
    );
    dispatch(applyFilters());
  };

  const handleClear = () => {
    setDelivery(false);
    setDineIn(false);
    setSelectedRating(0);
    setSelectedFoodType("All Types");
    setSelectedLocation("All Locations");
    dispatch(clearFilters());
  };

  return (
    <div className="filter-section">
      <h5 className="filter-title">🎛️ Filters</h5>

      {/* Location */}
      <div className="filter-group">
        <label>Location</label>
        <Input
          type="select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="All Locations">📍 All Locations</option>
          {dbLocations.map((loc) => (
            <option key={loc} value={loc}>
              📍 {loc}
            </option>
          ))}
        </Input>
      </div>

      {/* Food Type */}
      <div className="filter-group">
        <label>Food Type</label>
        <Input
          type="select"
          value={selectedFoodType}
          onChange={(e) => setSelectedFoodType(e.target.value)}
        >
          {foodTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Input>
      </div>

      {/* Services */}
      <div className="filter-group">
        <label>Services</label>
        <div className="filter-checkbox">
          <input
            type="checkbox"
            id="delivery"
            checked={delivery}
            onChange={(e) => setDelivery(e.target.checked)}
          />
          <span>Delivery</span>
        </div>
        <div className="filter-checkbox">
          <input
            type="checkbox"
            id="dineIn"
            checked={dineIn}
            onChange={(e) => setDineIn(e.target.checked)}
          />
          <span>Dine-in</span>
        </div>
      </div>

      {/* Rating */}
      <div className="filter-group">
        <label>Minimum Rating</label>
        <div className="filter-radio">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <label
              key={r}
              className={selectedRating === r ? "active" : ""}
              onClick={() => setSelectedRating(r)}
            >
              {r === 0 ? "Any" : `${r}+⭐`}
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <Button className="btn-apply-filter" onClick={handleApply}>
        Apply Filter
      </Button>
      <Button className="btn-clear-filter" onClick={handleClear}>
        Clear All
      </Button>
    </div>
  );
}

export default FilterSidebar;
