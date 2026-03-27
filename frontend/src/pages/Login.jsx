import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, ArrowRight } from "lucide-react";
import apiClient from "../services/apiClient";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  // ✅ Validation
  if (!email || !password) {
    return setError("All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return setError("Enter a valid email address.");
  }

  if (password.length < 6) {
    return setError("Password must be at least 6 characters.");
  }

  try {
    const response = await apiClient.post("/auth/login", { email, password });
    login(response.data.token);

    const role = response.data.role;
    if (role === "Doctor") navigate("/doctor");
    else if (role === "Receptionist") navigate("/reception");
    else if (role === "Admin") navigate("/admin");
    else if (role === "LabTech") navigate("/labs");
  } catch (err) {
    setError(
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Login failed."
    );
  }
};

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "var(--bg-app)",
      }}
    >
      {/* Left Side - Sleek Emerald-to-Forest Gradient */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg, var(--hero-bg) 0%, var(--accent-primary) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          color: "white",
        }}
      >
        <div style={{ position: "relative", zIndex: 10 }}>
          <Activity
            size={64}
            style={{ marginBottom: "24px", color: "#ffffff" }}
          />
          <h1
            style={{
              fontSize: "3.5rem",
              lineHeight: "1.1",
              marginBottom: "24px",
              fontWeight: "700",
            }}
          >
            The Future of <br />
            Clinic Operations.
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.9, maxWidth: "400px" }}>
            Secure, lightning-fast electronic medical records designed for
            modern healthcare teams.
          </p>
        </div>
      </div>

      {/* Right Side - Crisp White Form with a soft shadow overlap */}
      <div
        style={{
          width: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          backgroundColor: "var(--bg-card)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.05)",
          zIndex: 2,
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "8px",
              color: "var(--text-main)",
            }}
          >
            Welcome Back
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
            Enter your credentials to access your dashboard.
          </p>

          {error && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid var(--status-danger)",
                color: "var(--status-danger)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "24px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "16px" }}
            >
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div
            style={{
              marginTop: "32px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            Deploying a new clinic?{" "}
            <Link
              to="/register-clinic"
              style={{ color: "var(--accent-hover)", fontWeight: "700" }}
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
