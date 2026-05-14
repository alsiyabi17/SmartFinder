import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { toggleFavorite } from "../features/restaurantSlice";

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.restaurants.favorites);
  const isFavorited = favorites.includes(restaurant._id);

  // Create star display from rating number
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? "#faa307" : "#6c6c80" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    dispatch(toggleFavorite(restaurant._id));
  };

  return (
    <div className="restaurant-card">
      {/* Image */}
      <div className="card-img-container">
        <img src={restaurant.image} alt={restaurant.name} />
        <span className="card-img-overlay-badge">⭐ {restaurant.rating}</span>
        {/* Favorite heart button */}
        <button
          className={`fav-heart-btn ${isFavorited ? "fav-active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? "♥" : "♡"}
        </button>
      </div>

      {/* Body */}
      <div className="card-body">
        <h5 className="card-title">{restaurant.name}</h5>
        <span className="cuisine-badge">{restaurant.category}</span>

        <div className="card-rating">
          <span className="stars">{renderStars(restaurant.rating)}</span>
          <span className="rating-text">({restaurant.rating})</span>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          {restaurant.description.length > 80
            ? restaurant.description.substring(0, 80) + "..."
            : restaurant.description}
        </p>

        <div className="card-services">
          {restaurant.services.map((service) => (
            <span key={service} className="service-tag">
              {service}
            </span>
          ))}
        </div>

        <Button
          className="btn-view-details"
          onClick={() => navigate(`/restaurant/${restaurant._id}`)}
        >
          View
        </Button>
      </div>
    </div>
  );
}

export default RestaurantCard;
