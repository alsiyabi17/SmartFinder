import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { setFilters, applyFilters, setSearchTerm } from "../features/restaurantSlice";
import { mockLocations } from "../services/mockData";

function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    // Set search and location in Redux, then navigate to restaurants page
    dispatch(setSearchTerm(search));
    dispatch(setFilters({ location }));
    dispatch(applyFilters());
    navigate("/restaurants");
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />

        <Container style={{ position: "relative", zIndex: 1 }}>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="hero-title fade-in-up">
                Discover Your Next <span className="highlight">Favorite Restaurant</span>
              </h1>

              <p className="hero-subtitle fade-in-up fade-in-up-delay-1" style={{ margin: "0 auto 2rem" }}>
                SmartFinder helps you explore the best restaurants near you.
                Browse menus, read reviews, and book your table — all in one place.
              </p>

              {/* Location Dropdown */}
              <div className="fade-in-up fade-in-up-delay-2" style={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
                <Input
                  type="select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.75rem 1rem",
                  }}
                >
                  {mockLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      📍 {loc}
                    </option>
                  ))}
                </Input>
              </div>

              {/* Search Bar */}
              <div
                className="fade-in-up fade-in-up-delay-3"
                style={{
                  maxWidth: "500px",
                  margin: "0 auto",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search restaurants, cuisines..."
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  style={{
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.75rem 1rem",
                    flex: 1,
                  }}
                />
                <Button
                  className="btn-nav-auth"
                  onClick={handleSearch}
                  style={{ borderRadius: "var(--radius-md)", whiteSpace: "nowrap" }}
                >
                  🔍 Search
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;
