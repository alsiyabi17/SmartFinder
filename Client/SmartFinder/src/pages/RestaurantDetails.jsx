import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";
import { fetchRestaurantById, toggleFavorite } from "../features/restaurantSlice";
import API from "../services/api";

function RestaurantDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedRestaurant, favorites, loading } = useSelector(
    (state) => state.restaurants
  );

  // Reservation form state
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Read current user from auth state to prefill customer name/email
  const { user } = useSelector((state) => state.auth);

  // Load the restaurant when the page opens
  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [id, dispatch]);

  const isFavorite = favorites.includes(id);

  // POST to backend — Reservation collection (server validates + calculates total)
  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError("");

    if (!date || !people || people < 1) {
      setBookingError("Please choose a valid date and party size.");
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await API.post("/reservations", {
        restaurantId: id,
        customerName: user?.name || "Guest",
        customerEmail: user?.email || "guest@example.com",
        reservationDate: date,
        numberOfPeople: Number(people),
      });
      setBookingResult(data);
      setBooked(true);
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Failed to create reservation"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Show loading if restaurant not found yet
  if (loading || !selectedRestaurant) {
    return (
      <div className="loading-container" style={{ paddingTop: "6rem" }}>
        <div className="spinner" />
        <p className="loading-text">Loading restaurant...</p>
      </div>
    );
  }

  const restaurant = selectedRestaurant;

  // Star rendering helper
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? "#faa307" : "#6c6c80", fontSize: "1.2rem" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="detail-page">
      {/* Top Navigation — offset below the global Navbar to avoid overlap */}
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10, 10, 15, 0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-color)",
          padding: "0.75rem 0",
        }}
      >
        <Container className="d-flex justify-content-between align-items-center">
          <Link
            to="/"
            style={{
              fontWeight: 800,
              fontSize: "1.5rem",
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
            }}
          >
            SmartFinder
          </Link>
          <div className="d-flex gap-2">
            <Link to="/restaurants">
              <Button className="btn-nav-auth" size="sm">
                🏠 Home
              </Button>
            </Link>
            <Button
              className="btn-nav-auth"
              size="sm"
              onClick={() => dispatch(toggleFavorite(restaurant._id))}
              style={{
                background: isFavorite
                  ? "rgba(255, 71, 87, 0.2)"
                  : "var(--gradient-primary)",
                color: isFavorite ? "#ff4757" : "white",
              }}
            >
              {isFavorite ? "❤️ Saved" : "🤍 Favorite"}
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        {/* Hero Banner */}
        <div className="detail-hero fade-in-up">
          <img src={restaurant.image} alt={restaurant.name} />
          <div className="detail-hero-overlay">
            <h1>{restaurant.name}</h1>
            <div className="d-flex align-items-center gap-3">
              <span>{renderStars(restaurant.rating)}</span>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                {restaurant.rating}
              </span>
              <span style={{ color: "var(--text-secondary)" }}>
                📍 {restaurant.location}
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="detail-info-grid fade-in-up fade-in-up-delay-1">
          <div className="detail-info-item">
            <div className="info-label">Cuisine</div>
            <div className="info-value accent">{restaurant.category}</div>
          </div>
          <div className="detail-info-item">
            <div className="info-label">Rating</div>
            <div className="info-value">{restaurant.rating} / 5</div>
          </div>
          <div className="detail-info-item">
            <div className="info-label">Location</div>
            <div className="info-value">{restaurant.location}</div>
          </div>
          <div className="detail-info-item">
            <div className="info-label">Services</div>
            <div className="info-value" style={{ fontSize: "0.95rem" }}>
              {restaurant.services.join(", ")}
            </div>
          </div>
          <div className="detail-info-item">
            <div className="info-label">Status</div>
            <div
              className="info-value"
              style={{
                color: restaurant.isOpen ? "#10b981" : "#ef4444",
                fontWeight: 600,
              }}
            >
              {restaurant.isOpen ? "🟢 Open" : "🔴 Closed"}
            </div>
          </div>
        </div>

        {/* Top 3 Meals */}
        {restaurant.meals && restaurant.meals.length > 0 && (
          <>
            <h3
              className="fade-in-up fade-in-up-delay-2"
              style={{ fontWeight: 700, marginBottom: "1.5rem" }}
            >
              🍽️ Top Meals
            </h3>
            <Row className="mb-4 fade-in-up fade-in-up-delay-2">
              {restaurant.meals.slice(0, 3).map((meal) => (
                <Col md={4} key={meal._id} className="mb-3">
                  <div className="restaurant-card">
                    <div className="card-img-container">
                      <img src={meal.image} alt={meal.name} />
                      <span className="card-img-overlay-badge">
                        ${meal.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{meal.name}</h5>
                      <span className="cuisine-badge">{meal.category}</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        <Row className="mb-4">
          {/* Reservation Card */}
          <Col md={6} className="mb-3">
            <div className="reservation-card fade-in-up fade-in-up-delay-3">
              <h3>📅 Book a Table</h3>

              {booked ? (
                <div className="alert-custom alert-success-custom">
                  ✅ Reservation confirmed for{" "}
                  <strong>{bookingResult?.numberOfPeople}</strong> people on{" "}
                  <strong>
                    {bookingResult?.reservationDate
                      ? new Date(bookingResult.reservationDate).toLocaleDateString()
                      : ""}
                  </strong>
                  . Estimated total:{" "}
                  <strong>${bookingResult?.estimatedTotal}</strong>.
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  {bookingError && (
                    <div className="alert-custom alert-danger-custom">
                      {bookingError}
                    </div>
                  )}
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Number of People</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    className="btn-reserve"
                    type="submit"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Booking..." : "Book Now"}
                  </Button>
                </form>
              )}
            </div>
          </Col>

          {/* Location Card */}
          <Col md={6} className="mb-3">
            <div className="reservation-card fade-in-up fade-in-up-delay-3">
              <h3>📍 Location</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                {restaurant.name} is located in {restaurant.location || "N/A"}.
              </p>

              {/* Google Maps Embed */}
              {restaurant.lat && restaurant.lng ? (
                <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", marginBottom: "1rem", border: "1px solid var(--border-color)" }}>
                  <iframe
                    title={`${restaurant.name} location`}
                    width="100%"
                    height="220"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${restaurant.lat},${restaurant.lng}&output=embed`}
                  />
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "1rem" }}>
                  Map not available — coordinates not set.
                </p>
              )}


              <div className="detail-info-item" style={{ marginTop: "1rem" }}>
                <div className="info-label">Hours</div>
                <div className="info-value" style={{ fontSize: "0.95rem" }}>
                  Mon – Sun: 10:00 AM – 11:00 PM
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantDetails;
