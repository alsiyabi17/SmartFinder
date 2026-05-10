import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";
import { updateProfileAsync, changePasswordAsync, clearMessage, fetchProfile } from "../features/userSlice";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, message, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  // Fetch profile from API on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Personal info form state — seeded from profile once loaded
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // Sync form state when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
    }
  }, [profile]);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Show delete confirmation
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfileAsync({ firstName, lastName, email, phone, city }));
    setTimeout(() => dispatch(clearMessage()), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    dispatch(changePasswordAsync({ currentPassword, newPassword }));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => dispatch(clearMessage()), 3000);
  };

  const handleDeleteAccount = () => {
    // Mock delete — just log out
    dispatch(logout());
    navigate("/");
  };

  // Show spinner while profile is loading
  if (loading && !profile) {
    return (
      <div className="loading-container" style={{ paddingTop: "6rem" }}>
        <div className="spinner" />
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  // Not logged in / no profile yet
  if (!profile && !user) {
    navigate("/login");
    return null;
  }

  const displayName = user?.name || profile?.name || "User";
  const displayEmail = user?.email || profile?.email || "";

  return (
    <div style={{ paddingTop: "6rem", minHeight: "100vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            {/* Success message */}
            {message && (
              <div className="alert-custom alert-success-custom fade-in-up">
                ✅ {message}
              </div>
            )}

            {/* Profile Header */}
            <div
              className="reservation-card mb-4 fade-in-up"
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "2rem",
                  color: "white",
                  fontWeight: 800,
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontWeight: 700 }}>{displayName}</h3>
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                {displayEmail}
              </p>

            </div>

            {/* Personal Info Form */}
            <div className="reservation-card mb-4 fade-in-up fade-in-up-delay-1">
              <h3>👤 Personal Information</h3>
              <form onSubmit={handleUpdateProfile}>
                <Row>
                  <Col md={6}>
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </div>
                  </Col>
                </Row>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                  />
                </div>
                <Row>
                  <Col md={6}>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                      />
                    </div>
                  </Col>
                </Row>
                <Button className="btn-reserve" type="submit">
                  Save Changes
                </Button>
              </form>
            </div>

            {/* Change Password */}
            <div className="reservation-card mb-4 fade-in-up fade-in-up-delay-2">
              <h3>🔒 Change Password</h3>

              {passwordError && (
                <div className="alert-custom alert-danger-custom">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button className="btn-reserve" type="submit">
                  Change Password
                </Button>
              </form>
            </div>

            {/* Delete Account */}
            <div
              className="reservation-card mb-4 fade-in-up fade-in-up-delay-3"
              style={{ borderColor: "rgba(255, 71, 87, 0.3)" }}
            >
              <h3 style={{ color: "#ff4757" }}>⚠️ Delete Account</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              {showDeleteWarning ? (
                <div>
                  <div
                    className="alert-custom alert-danger-custom"
                    style={{ marginBottom: "1rem" }}
                  >
                    ⚠️ This will permanently delete your account and all your
                    data. This action cannot be undone!
                  </div>
                  <div className="d-flex gap-2">
                    <Button className="btn-cancel" onClick={handleDeleteAccount}>
                      Yes, Delete My Account
                    </Button>
                    <Button
                      className="btn-clear-filter"
                      onClick={() => setShowDeleteWarning(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="btn-cancel"
                  onClick={() => setShowDeleteWarning(true)}
                >
                  Delete Account
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
