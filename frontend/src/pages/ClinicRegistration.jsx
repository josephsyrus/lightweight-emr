import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../services/apiClient";

const ClinicRegistration = () => {
  const [formData, setFormData] = useState({
    clinicName: "",
    address: "",
    contactNumber: "",
    adminName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ FIX: handleChange INSIDE component
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const {
      clinicName,
      address,
      contactNumber,
      adminName,
      email,
      password,
    } = formData;

    if (
      !clinicName ||
      !address ||
      !contactNumber ||
      !adminName ||
      !email ||
      !password
    ) {
      return setMessage("All fields are required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setMessage("Enter a valid email.");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      return setMessage("Contact number must be 10 digits.");
    }

    if (password.length < 6) {
      return setMessage("Password must be at least 6 characters.");
    }

    if (adminName.length < 3) {
      return setMessage("Admin name must be at least 3 characters.");
    }

    try {
      await apiClient.post("/auth/register", formData);
      setMessage("Clinic registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-app)",
        padding: "40px",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 style={{ color: "var(--primary-blue)", marginBottom: "24px" }}>
          Register New Clinic
        </h2>

        {message && (
          <div
            style={{
              marginBottom: "16px",
              fontWeight: "bold",
              color: "var(--status-success)",
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* Clinic Name */}
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Clinic Name</label>
            <input
              className="form-input"
              type="text"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address FIXED */}
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Physical Address</label>
            <input
              className="form-input"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Number FIXED */}
          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              className="form-input"
              type="text"
              name="contactNumber"
              maxLength="10"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactNumber: e.target.value.replace(/\D/g, ""),
                })
              }
              required
            />
          </div>

          {/* Admin Name */}
          <div className="form-group">
            <label className="form-label">Admin Full Name</label>
            <input
              className="form-input"
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <div style={{ gridColumn: "1 / -1", marginTop: "16px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Complete Registration
            </button>

            <div
              style={{
                marginTop: "16px",
                textAlign: "center",
                fontSize: "0.85rem",
              }}
            >
              Already registered?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--secondary-blue)",
                  fontWeight: "600",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.target.style.textDecoration = "none")
                }
              >
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicRegistration;