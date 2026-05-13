import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { loginLocal, loginUser, clearError } from "../features/authSlice";

// Hardcoded admin credentials (frontend-only)
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Check if admin credentials match
    if (email === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        dispatch(loginLocal({ email, password }));
        navigate("/admin");
      } else {
        alert("Invalid email or password.");
      }
      return;
    }

    // Normal user login via backend
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    } else {
      alert(result.payload || "Invalid email or password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your SmartFinder account</p>

        {/* Error message from Redux */}
        {error && (
          <div className="alert-custom alert-danger-custom">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                dispatch(clearError());
              }}
            />
          </div>

          <Button className="btn-auth" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="auth-link">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
