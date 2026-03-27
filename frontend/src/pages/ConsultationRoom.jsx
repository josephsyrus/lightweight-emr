import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

const ConsultationRoom = () => {
  const { visitId } = useParams();
  const navigate = useNavigate();

  // Component States
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  // Forms
  const [medication, setMedication] = useState({
    name: "",
    dosage: "",
    duration: "",
  });
  const [testName, setTestName] = useState("");

  const handleUpdateConsultation = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/visits/${visitId}/consultation`, {
        symptoms,
        diagnosis,
        status: "Diagnosed",
      });
      alert("Clinical notes updated successfully.");
    } catch (err) {
      alert("Error updating notes.");
    }
  };

  const handlePrescribe = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/visits/${visitId}/prescriptions`, {
        medication: medication.name,
        dosage: medication.dosage,
        duration: medication.duration,
      });
      alert("Prescription added.");
      setMedication({ name: "", dosage: "", duration: "" });
    } catch (err) {
      alert("Error prescribing.");
    }
  };

  const handleOrderLab = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/visits/${visitId}/labs`, { testName });
      alert("Lab Test Ordered. Status updated to Awaiting Lab Results.");
      setTestName("");
    } catch (err) {
      alert("Error ordering lab.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ color: "var(--primary-blue)" }}>Consultation Room</h2>
        <button
          onClick={() => navigate("/doctor")}
          className="btn"
          style={{ border: "1px solid var(--border-color)" }}
        >
          ← Back to Queue
        </button>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        {/* Left Column: Clinical Notes */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>Clinical Notes</h3>
          <form
            onSubmit={handleUpdateConsultation}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="form-group">
              <label className="form-label">Symptoms & Vitals</label>
              <textarea
                className="form-input"
                style={{ minHeight: "100px" }}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Diagnosis</label>
              <textarea
                className="form-input"
                style={{ minHeight: "100px" }}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Notes
            </button>
          </form>
        </div>

        {/* Right Column: Actions (Meds & Labs) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card">
            <h3 style={{ marginBottom: "16px" }}>e-Prescribe</h3>
            <form
              onSubmit={handlePrescribe}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Medication Name (e.g. Amoxicillin)"
                value={medication.name}
                onChange={(e) =>
                  setMedication({ ...medication, name: e.target.value })
                }
                required
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dosage (e.g. 500mg)"
                  value={medication.dosage}
                  onChange={(e) =>
                    setMedication({ ...medication, dosage: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Duration (e.g. 7 days)"
                  value={medication.duration}
                  onChange={(e) =>
                    setMedication({ ...medication, duration: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: "var(--status-info)" }}
              >
                Add Prescription
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "16px" }}>Order Lab Test</h3>
            <form
              onSubmit={handleOrderLab}
              style={{ display: "flex", gap: "12px" }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Test Name (e.g. Complete Blood Count)"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  backgroundColor: "var(--status-warning)",
                  color: "#000",
                }}
              >
                Order Test
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;
