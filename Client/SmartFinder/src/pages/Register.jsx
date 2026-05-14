import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { registerUser, clearError, logout } from "../features/authSlice";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      setLocalError("All fields are required.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    const result = await dispatch(registerUser({ name, email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      dispatch(logout());
      // Show in-page success message, then redirect after 2 seconds
      setShowSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  const displayError = localError || error;

  // ---------- Success overlay (replaces the form) ----------
  if (showSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in-up" style={{ textAlign: "center" }}>
          {/* Checkmark circle */}
          <div className="register-success-icon">✓</div>
          <h2 style={{ marginBottom: "0.5rem" }}>Account Created!</h2>
          <p className="auth-subtitle" style={{ marginBottom: "1.5rem" }}>
            Registration successful. Redirecting you to login…
          </p>
          {/* Small spinner to show "redirecting" */}
          <div className="spinner" style={{ margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  // ---------- Normal registration form ----------
  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join SmartFinder today</p>

        {/* Error message */}
        {displayError && (
          <div className="alert-custom alert-danger-custom">{displayError}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setLocalError("");
                dispatch(clearError());
              }}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLocalError("");
                dispatch(clearError());
              }}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLocalError("");
                dispatch(clearError());
              }}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setLocalError("");
                dispatch(clearError());
              }}
            />
          </div>

          <Button className="btn-auth" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

