import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../services/apiClient";

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "audit";

  const [logs, setLogs] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "Doctor",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (activeTab === "audit") fetchLogs();
    if (activeTab === "staff") fetchStaff();
  }, [activeTab]);

  const fetchLogs = async () => {
    try {
      const res = await apiClient.get("/auditlogs?page=1&limit=50");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await apiClient.get("/users");
      setStaffList(res.data);
    } catch (err) {
      console.error("Failed to fetch staff");
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/users", staffForm);
      alert("Staff added successfully");
      setStaffForm({ name: "", role: "Doctor", email: "", password: "" });
      fetchStaff(); // Refresh the list
    } catch (err) {
      alert("Failed to add staff");
    }
  };

  const handleRemoveStaff = async (userId) => {
    if (!window.confirm("Are you sure you want to revoke this user's access?"))
      return;
    try {
      await apiClient.delete(`/users/${userId}`);
      fetchStaff(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove staff");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "24px", color: "var(--text-main)" }}>
        {activeTab === "audit" ? "System Audit Logs" : "Manage Clinic Staff"}
      </h2>

      {activeTab === "audit" && (
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
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
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                  }}
                >
                  Timestamp
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                  }}
                >
                  Action
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                  }}
                >
                  Staff Name
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                  }}
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.log_id}
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <td
                    style={{
                      padding: "16px 24px",
                      color: "var(--text-muted)",
                      fontWeight: "500",
                    }}
                  >
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "16px 24px",
                      fontWeight: "600",
                      color: "var(--text-main)",
                    }}
                  >
                    {log.action}
                  </td>
                  <td
                    style={{ padding: "16px 24px", color: "var(--text-main)" }}
                  >
                    {log.staff_name}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "#f1f5f9",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        color: "#475569",
                      }}
                    >
                      {log.staff_role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "staff" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Side - Current Staff List */}
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-app)",
              }}
            >
              <h3 style={{ fontSize: "1rem", color: "var(--text-main)" }}>
                Active Personnel
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {staffList.map((staff) => (
                <div
                  key={staff.user_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "var(--text-main)",
                        marginBottom: "4px",
                      }}
                    >
                      {staff.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {staff.email}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 10px",
                        backgroundColor: "#f1f5f9",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#475569",
                      }}
                    >
                      {staff.role}
                    </span>
                    <button
                      onClick={() => handleRemoveStaff(staff.user_id)}
                      className="btn-revoke"
                    >
                      Revoke Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Add Staff Form */}
          <div className="card">
            <h3
              style={{
                fontSize: "1rem",
                color: "var(--text-main)",
                marginBottom: "20px",
              }}
            >
              Provision New Account
            </h3>
            <form onSubmit={handleAddStaff}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">System Role</label>
                <select
                  className="form-input"
                  value={staffForm.role}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, role: e.target.value })
                  }
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="LabTech">Lab Technician</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input
                  className="form-input"
                  type="password"
                  value={staffForm.password}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, password: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
