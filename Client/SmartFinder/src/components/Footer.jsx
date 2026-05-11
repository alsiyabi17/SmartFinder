import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <div className="footer-brand">SmartFinder</div>
            <p className="footer-text">
              Discover the best restaurants near you. Book tables, read reviews,
              and explore new cuisines.
            </p>
          </Col>
          <Col md={4}>
            <h6 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              Quick Links
            </h6>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/restaurants">Restaurants</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              Contact
            </h6>
            <ul className="footer-links">
              <li><span style={{ color: "var(--text-secondary)" }}>📧 info@smartfinder.com</span></li>
              <li><span style={{ color: "var(--text-secondary)" }}>📞 +968 1234 5678</span></li>
              <li><span style={{ color: "var(--text-secondary)" }}>📍 Muscat, Oman</span></li>
            </ul>
          </Col>
        </Row>
        <div className="footer-bottom">
          © 2025 SmartFinder. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
