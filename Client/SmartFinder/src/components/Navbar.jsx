import { useState } from "react";
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
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
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
                <>
                  <NavItem>
                    <Link className="nav-link nav-link-custom" to="/restaurants">
                      Restaurants
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link className="nav-link nav-link-custom" to="/profile">
                      Profile
                    </Link>
                  </NavItem>
                  <NavItem>
                    <span className="nav-link nav-link-custom">
                      Hi, {user?.name || "User"}
                    </span>
                  </NavItem>
                  <NavItem>
                    <Button className="btn-nav-auth" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </NavItem>
                </>
              )
            ) : (
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
