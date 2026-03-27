import React, { useState, useEffect, useContext } from "react"; // Add useContext
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const DoctorDashboard = () => {
  const [visits, setVisits] = useState([]);
  const { user } = useContext(AuthContext); // Get the current user
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveVisits();
  }, []);

  const fetchActiveVisits = async () => {
    try {
      const response = await apiClient.get("/visits/active");
      setVisits(response.data);
    } catch (error) {
      console.error("Failed to fetch visits", error);
    }
  };

  const handleEnterConsultation = (visitId) => {
    navigate(`/doctor/consult/${visitId}`);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "24px", color: "var(--text-main)" }}>
        Active Waiting Queue
      </h2>

      {visits.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", color: "var(--text-muted)" }}
        >
          No patients currently waiting.
        </div>
      ) : (
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{
                backgroundColor: "var(--bg-app)",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <tr>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  Patient Name
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  Wait Time
                </th>
                {user.role !== "Receptionist" && (
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr
                  key={visit.visit_id}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    textAlign: "center",
                  }}
                >
                  <td style={{ padding: "16px 24px", fontWeight: "600" }}>
                    {visit.patient_name}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: "#f1f5f9",
                        display: "inline-block",
                        minWidth: "140px",
                      }}
                    >
                      {visit.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    {new Date(visit.visit_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  {user.role !== "Receptionist" && (
                    <td style={{ padding: "16px 24px" }}>
                      <button
                        className="btn btn-primary"
                        style={{ margin: "0 auto" }}
                        onClick={() => handleEnterConsultation(visit.visit_id)}
                      >
                        {visit.status === "Visit Opened"
                          ? "Start Consult"
                          : "Resume Consult"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
