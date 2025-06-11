import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";
import logo from "../../logo.jpeg";
import Footer from "../../components/Footer/Footer";
import { api } from "../../services/api";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await onLogin(formData);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      console.log("Google credential response:", credentialResponse);
      const result = await api.googleSignup(credentialResponse.credential);
      console.log("Google signup result:", result);

      if (result.success) {
        // Check if user needs to complete profile
        if (result.needsProfileCompletion) {
          // Store the user data and navigate to SignUpStep2
          const userData = result.user || { email: result.email };
          localStorage.setItem("currentUser", JSON.stringify(userData));
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("isSignUp2", "false");
          navigate("/signup-page2");
        } else {
          // User already has complete profile, log them in
          const loginResult = await onLogin({
            email: result.user?.email || result.email,
            isGoogleLogin: true,
            userData: result.user,
          });

          if (loginResult.success) {
            navigate("/");
          } else {
            setError("Login failed after Google authentication.");
          }
        }
      } else {
        setError(result.message || "Google signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setError(`Google signup failed: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google signup was cancelled or failed.");
  };

  return (
    <div className="body">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src={logo} alt="SabApplier AI" />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to SabApplier AI</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ display: "flex" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="show-hide-button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Link to="/forgot-password" style={{ right: 10 }}>
                Forgot Password?
              </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="submit-button-login"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="google-login-container">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            <div className="privacy-policy">
              <Link to="/privacy_policy"> Our Privacy Policy </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
