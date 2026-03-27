import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Activity,
  ShieldAlert,
  UserPlus,
  Search,
  LogOut,
  Stethoscope,
  TestTube,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  if (!user) return null;

  const checkActive = (path, tabStr) => {
    if (location.pathname !== path) return false;
    if (tabStr && location.search === `?tab=${tabStr}`) return true;
    return (
      (tabStr === null || tabStr === "audit" || tabStr === "search") &&
      !location.search
    );
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: isCollapsed
          ? "var(--sidebar-collapsed)"
          : "var(--sidebar-expanded)",
      }}
    >
      <div
        className="sidebar-header"
        style={{ justifyContent: "center", padding: "0 24px" }}
      >
        <Activity color="var(--accent-primary)" size={24} />
        {!isCollapsed && (
          <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
            EMR Core
          </span>
        )}
      </div>

      {/* ✅ FIXED: Equal spacing using flex + gap */}
      <nav
        className="sidebar-nav"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {user.role === "Admin" && (
          <>
            <Link
              to="/admin?tab=audit"
              className={`nav-link ${checkActive("/admin", "audit") ? "active" : ""}`}
            >
              <ShieldAlert size={20} /> {!isCollapsed && "Logs"}
            </Link>

            <Link
              to="/admin?tab=staff"
              className={`nav-link ${checkActive("/admin", "staff") ? "active" : ""}`}
            >
              <UserPlus size={20} /> {!isCollapsed && "Manage Staff"}
            </Link>
          </>
        )}

        {["Admin", "Receptionist", "Doctor"].includes(user.role) && (
          <>
            <Link
              to="/reception?tab=search"
              className={`nav-link ${checkActive("/reception", "search") ? "active" : ""}`}
            >
              <Search size={20} /> {!isCollapsed && "Search"}
            </Link>

            {user.role !== "Doctor" && (
              <Link
                to="/reception?tab=register"
                className={`nav-link ${checkActive("/reception", "register") ? "active" : ""}`}
              >
                <UserPlus size={20} /> {!isCollapsed && "Register Patient"}
              </Link>
            )}
          </>
        )}

        {/* ✅ FIXED: LabTech cannot see Active Queue */}
        {user.role !== "LabTech" && (
          <Link
            to="/doctor"
            className={`nav-link ${checkActive("/doctor", null) ? "active" : ""}`}
          >
            <Stethoscope size={20} /> {!isCollapsed && "Active Queue"}
          </Link>
        )}

        {/* Pending Labs */}
        {["Admin", "Doctor", "LabTech"].includes(user.role) && (
          <Link
            to="/labs"
            className={`nav-link ${checkActive("/labs", null) ? "active" : ""}`}
          >
            <TestTube size={20} /> {!isCollapsed && "Pending Labs"}
          </Link>
        )}
      </nav>

      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="nav-link nav-link-collapse"
          style={{
            width: "100%",
            border: "none",
            cursor: "pointer",
            background: "none",
          }}
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span style={{ marginLeft: "16px" }}>Collapse</span>
            </>
          )}
        </button>

        <button
          onClick={logout}
          className="nav-link nav-link-logout"
          style={{
            width: "100%",
            border: "none",
            cursor: "pointer",
            background: "none",
          }}
        >
          <LogOut size={20} />
          {!isCollapsed && <span style={{ marginLeft: "16px" }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;