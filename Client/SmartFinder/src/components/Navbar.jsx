import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Collapse,
  NavbarToggler,
} from "reactstrap";
import { logout } from "../features/authSlice";

function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggle = () => setIsOpen(!isOpen);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/");
  };

  // Get user initials for avatar (e.g. "John Doe" → "JD")
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Navbar className="navbar-custom" dark expand="md" fixed="top">
      <div className="container">
        <NavbarBrand tag={Link} to="/">
          Smart<span>Finder</span>
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto d-flex align-items-center gap-2" navbar>
            {isLoggedIn ? (
              user?.email === "admin@gmail.com" ? (
                /* ---- Admin: keep as-is ---- */
                <>
                  <NavItem>
                    <Link className="nav-link nav-link-custom" to="/admin">
                      Admin Dashboard
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Button className="btn-nav-auth" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </NavItem>
                </>
              ) : (
                /* ---- Normal user: avatar + dropdown ---- */
                <>
                  <NavItem>
                    <Link className="nav-link nav-link-custom" to="/restaurants">
                      Restaurants
                    </Link>
                  </NavItem>

                  {/* Welcome text (not clickable) + Avatar button + dropdown */}
                  <div className="user-menu-wrapper" ref={menuRef}>
                    <span className="navbar-welcome-text">
                      Hi, {user?.name?.split(" ")[0] || "User"} 👋
                    </span>
                    <button
                      className="user-avatar-btn"
                      onClick={toggleMenu}
                      aria-label="User menu"
                    >
                      {getInitials(user?.name)}
                    </button>

                    {/* Dropdown panel */}
                    {menuOpen && (
                      <div className="user-dropdown fade-in-up">
                        {/* Header */}
                        <div className="user-dropdown-header">
                          <div className="user-dropdown-avatar">
                            {getInitials(user?.name)}
                          </div>
                          <div>
                            <div className="user-dropdown-name">
                              {user?.name || "User"}
                            </div>
                            <div className="user-dropdown-email">
                              {user?.email || ""}
                            </div>
                          </div>
                        </div>

                        <div className="user-dropdown-divider" />

                        {/* Links */}
                        <Link
                          className="user-dropdown-item"
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>👤</span> Profile
                        </Link>
                        <Link
                          className="user-dropdown-item"
                          to="/favorites"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>❤️</span> Favorites
                        </Link>

                        <div className="user-dropdown-divider" />

                        {/* Logout */}
                        <button
                          className="user-dropdown-item user-dropdown-logout"
                          onClick={handleLogout}
                        >
                          <span className="logout-icon">⏻</span> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )
            ) : (
              /* ---- Logged out: Login / Register buttons ---- */
              <>
                <NavItem>
                  <Link to="/login">
                    <Button className="btn-nav-auth" size="sm" outline>
                      Login
                    </Button>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/register">
                    <Button className="btn-nav-auth" size="sm">
                      Register
                    </Button>
                  </Link>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </div>
    </Navbar>
  );
}

export default NavigationBar;

