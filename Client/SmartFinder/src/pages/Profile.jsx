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

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
    }
  }, [profile]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
    dispatch(logout());
    navigate("/");
  };

  if (loading && !profile) {
    return (
      <div className="loading-container" style={{ paddingTop: "6rem" }}>
        <div className="spinner" />
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  if (!profile && !user) {
    navigate("/login");
    return null;
  }

  const displayName = user?.name || profile?.name || "User";
  const displayEmail = user?.email || profile?.email || "";

  return (
    <div className="profile-page" style={{ paddingTop: "6rem", paddingBottom: "4rem", minHeight: "100vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>

            {message && (
              <div className="alert-custom alert-success-custom fade-in-up">
                ✅ {message}
              </div>
            )}

            {/* Profile Header */}
            <div className="reservation-card mb-4 fade-in-up profile-header-card">
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div
                  className="profile-avatar"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    color: "white",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: "0.15rem", borderBottom: "none", paddingBottom: 0 }}>
                    {displayName}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>
                    {displayEmail}
                  </p>
                </div>
              </div>
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
                  <Col md={6}>
                    <div className="form-group">
                      <label>Email address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <label>Phone number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="form-group">
                      <label>City / location</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Muscat, Oman"
                      />
                    </div>
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <Button className="btn-clear-filter" type="button" style={{ width: "auto", padding: "0.6rem 1.5rem" }}>
                    Cancel
                  </Button>
                  <Button className="btn-reserve" type="submit" style={{ width: "auto", padding: "0.6rem 1.5rem" }}>
                    Save changes
                  </Button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="reservation-card mb-4 fade-in-up fade-in-up-delay-2">
              <h3>🔒 Change password</h3>

              {passwordError && (
                <div className="alert-custom alert-danger-custom">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <Row>
                  <Col md={4}>
                    <div className="form-group">
                      <label>Current password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="form-group">
                      <label>New password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="form-group">
                      <label>Confirm new password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <Button className="btn-clear-filter" type="button" style={{ width: "auto", padding: "0.6rem 1.5rem" }}>
                    Cancel
                  </Button>
                  <Button className="btn-reserve" type="submit" style={{ width: "auto", padding: "0.6rem 1.5rem" }}>
                    Update password
                  </Button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div
              className="reservation-card mb-4 fade-in-up fade-in-up-delay-3 danger-zone-card"
              style={{ borderColor: "rgba(255, 71, 87, 0.3)", background: "rgba(220, 53, 69, 0.04)" }}
            >
              <h3 style={{ color: "#ff4757", borderBottomColor: "rgba(255, 71, 87, 0.15)" }}>
                ⚠️ Danger zone
              </h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Deleting your account is permanent. All your data, reviews and favourites will be removed and cannot be recovered.
              </p>

              {showDeleteWarning ? (
                <div>
                  <div className="alert-custom alert-danger-custom" style={{ marginBottom: "1rem" }}>
                    ⚠️ This will permanently delete your account and all your data. This action cannot be undone!
                  </div>
                  <div className="d-flex gap-2">
                    <Button className="btn-danger" onClick={handleDeleteAccount}>
                      Yes, Delete My Account
                    </Button>
                    <Button className="btn-clear-filter" onClick={() => setShowDeleteWarning(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="btn-cancel"
                  onClick={() => setShowDeleteWarning(true)}
                  style={{ width: "auto", background: "rgba(220, 53, 69, 0.1)", color: "#ff4757", borderColor: "rgba(255, 71, 87, 0.3)" }}
                >
                  Delete my account
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