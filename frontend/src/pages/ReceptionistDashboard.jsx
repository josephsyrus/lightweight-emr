import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../services/apiClient";

const ReceptionistDashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "search";

  const [searchPhone, setSearchPhone] = useState("");
  const [foundPatient, setFoundPatient] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [activeVisitId, setActiveVisitId] = useState("");

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
  });

  // ✅ SEARCH VALIDATION
  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchPhone.length !== 10) {
      return alert("Enter a valid 10-digit phone number");
    }

    try {
      const res = await apiClient.get(`/patients/search?phone=${searchPhone}`);
      setFoundPatient(res.data);
    } catch (err) {
      alert("Patient not found");
      setFoundPatient(null);
    }
  };

  // ✅ OPEN VISIT VALIDATION
  const handleOpenVisit = async () => {
    if (!doctorId || doctorId.length < 5) {
      return alert("Enter valid Doctor ID");
    }

    try {
      await apiClient.post("/visits", {
        patientId: foundPatient.patient_id,
        doctorId,
      });
      alert("Visit Opened Successfully!");
      setFoundPatient(null);
      setSearchPhone("");
    } catch (err) {
      alert("Failed to open visit");
    }
  };

  // ✅ DISCHARGE VALIDATION
  const handleCloseVisit = async () => {
    if (!activeVisitId || activeVisitId.length < 5) {
      return alert("Enter valid Visit ID");
    }

    try {
      await apiClient.put(`/visits/${activeVisitId}/close`);
      alert("Visit Closed/Discharged Successfully!");
      setActiveVisitId("");
    } catch (err) {
      alert("Failed to close visit");
    }
  };

  // ✅ REGISTER VALIDATION
  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, age, phone, address } = newPatient;

    if (!name || name.length < 3) {
      return alert("Enter valid name");
    }

    if (!age || age < 0 || age > 120) {
      return alert("Enter valid age");
    }

    if (phone.length !== 10) {
      return alert("Enter valid 10-digit phone number");
    }

    if (!address || address.length < 5) {
      return alert("Enter valid address");
    }

    try {
      await apiClient.post("/patients", newPatient);
      alert("Patient Registered");
      setNewPatient({
        name: "",
        age: "",
        gender: "Male",
        phone: "",
        address: "",
      });
    } catch (err) {
      alert("Failed to register");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "24px", color: "var(--text-main)" }}>
        {activeTab === "search" && "Patient Triage & Search"}
        {activeTab === "register" && "Register New Patient"}
        {activeTab === "discharge" && "Discharge Patient"}
      </h2>

      {/* 🔍 SEARCH */}
      {activeTab === "search" && (
        <div className="card" style={{ maxWidth: "600px" }}>
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "10px", marginBottom: "8px" }}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Search by Phone Number"
              value={searchPhone}
              onChange={(e) =>
                setSearchPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              required
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* ✅ Inline validation message */}
          {searchPhone.length > 0 && searchPhone.length < 10 && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>
              Enter 10-digit phone number
            </p>
          )}

          {foundPatient && (
            <div
              style={{
                padding: "24px",
                backgroundColor: "var(--bg-app)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            >
              <h3 style={{ color: "var(--text-main)", marginBottom: "8px" }}>
                {foundPatient.name}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                  fontWeight: "500",
                }}
              >
                Age: {foundPatient.age} | Gender: {foundPatient.gender}
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Attending Doctor ID (UUID)"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value.trim())}
                />
                <button
                  onClick={handleOpenVisit}
                  className="btn btn-primary"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Open Visit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📝 REGISTER */}
      {activeTab === "register" && (
        <div className="card" style={{ maxWidth: "600px" }}>
          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    name: e.target.value.replace(/[^a-zA-Z ]/g, ""),
                  })
                }
                required
              />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Age</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="120"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, age: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, gender: e.target.value })
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                type="text"
                value={newPatient.phone}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Home Address</label>
              <textarea
                className="form-input"
                value={newPatient.address}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, address: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Register Patient
            </button>
          </form>
        </div>
      )}

      {/* 🏥 DISCHARGE */}
      {activeTab === "discharge" && (
        <div className="card" style={{ maxWidth: "600px" }}>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            Enter the Visit ID to finalize the visit and mark it as completed.
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Visit ID (UUID)"
              value={activeVisitId}
              onChange={(e) => setActiveVisitId(e.target.value.trim())}
            />
            <button
              onClick={handleCloseVisit}
              className="btn btn-primary"
              style={{
                whiteSpace: "nowrap",
                backgroundColor: "var(--status-danger)",
              }}
            >
              Discharge Visit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;