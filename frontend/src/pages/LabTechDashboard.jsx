import React, { useState, useEffect, useContext } from "react";
import apiClient from "../services/apiClient";
import { AuthContext } from "../context/AuthContext";

const LabTechDashboard = () => {
  const [pendingLabs, setPendingLabs] = useState([]);
  const [results, setResults] = useState({});
  const { user } = useContext(AuthContext);

  const isDoctorView = user.role === "Doctor";

  useEffect(() => {
    fetchPendingLabs();
  }, []);

  const fetchPendingLabs = async () => {
    try {
      const res = await apiClient.get("/visits/labs/pending");
      setPendingLabs(res.data);
    } catch (err) {
      console.error("Failed to fetch labs");
    }
  };

  const handleResultChange = (reportId, text) => {
    setResults((prev) => ({ ...prev, [reportId]: text }));
  };

  const submitResult = async (reportId, visitId) => {
  const resultText = results[reportId];

  // ✅ Validation
  if (!resultText || resultText.trim().length < 3) {
    return alert("Result must be at least 3 characters.");
  }

  try {
    await apiClient.put(`/visits/labs/${reportId}/results`, {
      resultText,
      visitId,
    });
    alert("Results submitted to Doctor.");
    fetchPendingLabs();
    setResults((prev) => ({ ...prev, [reportId]: "" }));
  } catch (err) {
    alert("Failed to update result");
  }
};

  return (
    <div>
      <h3 style={{ marginBottom: "24px", color: "var(--primary-blue)" }}>
        Laboratory Informatics System
      </h3>

      {pendingLabs.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", color: "var(--text-muted)" }}
        >
          No pending lab requests.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {pendingLabs.map((lab) => (
            <div
              key={lab.report_id}
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "12px",
                }}
              >
                <div>
                  <h4 style={{ color: "var(--text-main)" }}>
                    Test Ordered: {lab.test_name}
                  </h4>
                  <p
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                  >
                    Patient: {lab.patient_name} | Date:{" "}
                    {new Date(lab.visit_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      backgroundColor: "var(--status-warning)",
                      color: "#000",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    PENDING
                  </span>
                </div>
              </div>

              {/* ✅ Doctor = VIEW ONLY */}
              {isDoctorView ? (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Waiting for lab technician to submit results...
                </div>
              ) : (
                <div style={{ display: "flex", gap: "16px" }}>
                  <input
                    type="text"
                    className="form-input"
                      placeholder="Enter clinical observations / metric values..."
                      maxLength="200"
                      value={results[lab.report_id] || ""}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/[^a-zA-Z0-9 .,]/g, "");
                          handleResultChange(lab.report_id, cleanValue);
                      }}
                  style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => submitResult(lab.report_id, lab.visit_id)}
                    className="btn btn-primary"
                    style={{ backgroundColor: "var(--status-success)" }}
                  >
                    Finalize & Submit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabTechDashboard;