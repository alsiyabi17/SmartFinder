import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import RestaurantCard from "../components/RestaurantCard";
import { setSearchTerm, applyFilters, fetchRestaurants } from "../features/restaurantSlice";

function Restaurants() {
  const dispatch = useDispatch();
  const { filteredRestaurants, searchTerm, loading, restaurants } = useSelector(
    (state) => state.restaurants
  );

  // Fetch restaurants from API on mount
  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Apply filters whenever search term changes or new restaurant data is loaded
  useEffect(() => {
    dispatch(applyFilters());
  }, [searchTerm, restaurants, dispatch]);

  const handleSearch = (value) => {
    dispatch(setSearchTerm(value));
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ paddingTop: "6rem" }}>
        <div className="spinner" />
        <p className="loading-text">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="restaurants-bg" style={{ paddingTop: "5rem", minHeight: "100vh" }}>
      <Container>
        {/* Search Bar at top */}
        <Row className="mb-4 justify-content-center" style={{ paddingTop: "2rem" }}>
          <Col md={8}>
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Restaurants"
            />
          </Col>
        </Row>

        <Row>
          {/* Left Sidebar - Filters */}
          <Col md={3}>
            <FilterSidebar />
          </Col>

          {/* Right Side - Restaurant Cards */}
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ fontWeight: 700, margin: 0 }}>
                {filteredRestaurants.length} Restaurant
                {filteredRestaurants.length !== 1 ? "s" : ""} Found
              </h5>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h4>No restaurants found</h4>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <Row>
                {filteredRestaurants.map((restaurant) => (
                  <Col md={6} lg={4} key={restaurant._id} className="mb-4">
                    <RestaurantCard restaurant={restaurant} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Restaurants;
