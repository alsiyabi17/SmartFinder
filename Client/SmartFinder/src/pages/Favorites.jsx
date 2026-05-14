import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import RestaurantCard from "../components/RestaurantCard";
import { fetchRestaurants } from "../features/restaurantSlice";

function Favorites() {
  const dispatch = useDispatch();
  const { restaurants, favorites, loading } = useSelector(
    (state) => state.restaurants
  );

  // Make sure restaurants are loaded (in case user navigates here directly)
  useEffect(() => {
    if (restaurants.length === 0) {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, restaurants.length]);

  // Filter restaurants to only show favorited ones
  const favoriteRestaurants = restaurants.filter((r) =>
    favorites.includes(r._id)
  );

  if (loading) {
    return (
      <div className="loading-container" style={{ paddingTop: "6rem" }}>
        <div className="spinner" />
        <p className="loading-text">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="restaurants-bg" style={{ paddingTop: "5rem", minHeight: "100vh" }}>
      <Container>
        <div style={{ paddingTop: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            ❤️ My Favorites
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {favoriteRestaurants.length} saved restaurant
            {favoriteRestaurants.length !== 1 ? "s" : ""}
          </p>
        </div>

        {favoriteRestaurants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h4>No favorites yet</h4>
            <p>Click the heart icon on any restaurant card to save it here.</p>
          </div>
        ) : (
          <Row>
            {favoriteRestaurants.map((restaurant) => (
              <Col md={6} lg={4} key={restaurant._id} className="mb-4">
                <RestaurantCard restaurant={restaurant} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Favorites;
