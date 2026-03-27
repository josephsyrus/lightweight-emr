import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";

const MainLayout = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Unauthorized Access
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-title">
            <h2>{user.role} Dashboard</h2>
          </div>
          <div className="header-user">
            <span>
              Logged in as: <strong>{user.name || "Staff User"}</strong>
            </span>
          </div>
        </header>
        <main className="content-area">
          <Outlet /> {/* This is where the page components render */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
