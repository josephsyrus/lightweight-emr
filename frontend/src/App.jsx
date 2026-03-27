import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Import all 7 pages
import Login from "./pages/Login";
import ClinicRegistration from "./pages/ClinicRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ConsultationRoom from "./pages/ConsultationRoom";
import LabTechDashboard from "./pages/LabTechDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-clinic" element={<ClinicRegistration />} />

        {/* Protected Routes inside the Layout Shell */}

        <Route element={<MainLayout allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route
          element={
            <MainLayout allowedRoles={["Receptionist", "Admin", "Doctor"]} />
          }
        >
          <Route path="/reception" element={<ReceptionistDashboard />} />
        </Route>

        <Route
          element={
            <MainLayout allowedRoles={["Doctor", "Admin", "Receptionist"]} />
          }
        >
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route
            path="/doctor/consult/:visitId"
            element={<ConsultationRoom />}
          />
        </Route>

        <Route element={<MainLayout allowedRoles={["LabTech", "Admin"]} />}>
          <Route path="/labs" element={<LabTechDashboard />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
